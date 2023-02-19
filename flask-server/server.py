import random
from urllib import request
# import urllib.request as request
import ssl
import json
from flask import Flask, jsonify, abort
from flask import request as fl_req
from flask_pymongo import ObjectId
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)

client = MongoClient('localhost', 27017)

db = client.doorwaytechnical
scores = db.scoreboard


#TMDB URLs and API KEY
api_key_3 = "e7563e8a3f845a7df7b8e492c489c0c2"
#Base query URL limits by English lang, sorts by popularity, has over 50 ratings, and a 7 or better for average rating.
#In testing this can produce reliably recognizable movies.
base_query_url = "https://api.themoviedb.org/3/discover/movie?api_key=" + api_key_3 + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&vote_count.gte=50&vote_average.gte=7"
#Used for finding actors and films they're known for.
base_person_url = "https://api.themoviedb.org/3/person/popular?api_key=" +api_key_3 + "&language=en-US"
#Used for actor film credits.
base_credits_url = "https://api.themoviedb.org/3/person/"
#Used for finding movie credits.
base_movie_url = "https://api.themoviedb.org/3/movie/"

#Hard mode decides whether the movies and actors must be from the same era
hard = False

#Beginning new Game
@app.route("/api/start", methods = ['GET', 'POST'])
def newGame():
    if fl_req.method == 'POST':
        result = scores.insert_one({
            'name': fl_req.json['name'],
            'mode': fl_req.json['mode'],
            'score': 0,
            'start_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
        return jsonify({'gid' : str(result.inserted_id), 'score': 0})
    elif fl_req.method == 'GET':
        top_scores = list(scores.find({'mode': fl_req.args.get('mode')}).sort("score", -1).limit(10))
        ret = [{'name': score['name'], 'score': score['score']} for score in top_scores]
        return(jsonify(ret))


#Getting a random movie based off of difficulty mode, then return score.
@app.route("/api/movies", methods = ['GET'])
def randomMovie():
    #We get a list of popular actors. We get a movie they're known for. We can then choose to present this, or pick other random film.
    #Decide if we should present true movie or not, extremely small chance that a random movie has the actor in it.
    mode = fl_req.args.get('mode')
    if mode == 'Easy':
        hard = False
    else:
        hard = True
    true_movie = bool(random.getrandbits(1))
    ssl._create_default_https_context = ssl._create_unverified_context
    #Pick a random page from the top 10 pages of popular actors.
    conn = request.urlopen(base_person_url + "&page=" + str(random.randrange(1, 10)))
    json_ppl = json.loads(conn.read())
    #Pick random person from the page.
    people = json_ppl['results']
    person = people[random.randrange(0, len(people))]
    #Stash known-for list only gets 3 films, so a somewhat small list.
    if(not hard):
        known_for = list(person['known_for'])
        #Appropriate will contain list of exclusively non-'adult' MOVIES as tagged by TMDB.
        appropriate = []
        for item in known_for:
            result = dict(item)
            if ((result.get('media_type') == 'movie') and (not result.get('adult')) or (result.get('adult') is None)):
                appropriate.append(result)
    #Hard mode so we shall pick from the top 10 actor credits.
    else:
        pid = person['id']
        conn = request.urlopen(base_credits_url + str(pid) + "/movie_credits?api_key=" + api_key_3 + "&language=en-US")
        json_credits = json.loads(conn.read())
        credits = list(json_credits['cast'])
        #Slice top 10 credits, or top n credits if less than 10.
        if(len(credits) < 10):
            known_for = credits[0:len(credits)]
        else:
            known_for = credits[0:10]
        #Appropriate will contain a list of movies that haven't been tagged as 'adult' by TMDB.
        #Not checking for media_type since query automatically elminates this.
        appropriate = []
        for item in known_for:
            result = dict(item)
            if ((not result.get('adult')) or (result.get('adult') is None)):
                appropriate.append(result)
    #If we previously chose an adult actor or only tv actor
    if(len(appropriate) == 0):
        randomMovie()
    #If we have chosen to present a correct pairing
    if(true_movie):
        print(True)
        title = result.get('title')
        poster = result.get('poster_path')
        release = result.get('release_date')
    
    #If we have chosen to present a false pairing, find a random popular movie.
    if(not true_movie):
        print(False)
        #Hard mode decides whether the movies and actors must be from the same era.
        #May be thrown off if re-releases of films being more popular on db.
        if hard:
            #Handle if not known for anything
            if len(appropriate) == 0:
                minimum = 1970
                maximum = datetime.now().year
            else:
                #Hard mode we will select a film released or re-released between the year range of actor credits.
                rel_range = []
                for i in range(0, len(appropriate)):
                    movie = dict(appropriate[i])
                    release = movie.get('release_date')
                    #Some films do not have a release date parameter.
                    if release:
                        #Slicing just the year from date.
                        rel_int = int(release[0:4])
                        rel_range.append(rel_int)
                #Provided we have some release dates.
                if len(rel_range) != 0:
                    minimum = min(rel_range)
                    maximum = max(rel_range)
                    # Handle for up and coming actors
                    if minimum == maximum:
                        minimum -= 5
                        maximum += 5
                #If every date on the appropriate films are screwed up. 
                else:
                    minimum = 1970
                    maximum = datetime.now().year
            
            #Randomize year between range of release dates for best known films of the actor.
            year = "&year=" + str(random.randrange(minimum, maximum, 1))
        #Easy mode
        else:
            #Randomize year between 1970 and 2023.
            year = "&year=" + str(random.randrange(1970, datetime.now().year, 1))
        #Find film from random page in first 5 pages of results released or re-released at the determined year.
        conn = request.urlopen(base_query_url + '&page=' + str(random.randrange(1, 5)) + year)
        json_data = dict(json.loads(conn.read()))
        #Gather all results
        results = json_data['results']
        #Pick a random result from page if we have more than one.
        if (len(results) > 0):
            result = results[random.randrange(0, len(results))]
        else:
            result = results[0]
        #Gather the needed data.
        title = result.get('title')
        poster = result.get('poster_path')
        release = result.get('release_date')
    # if(title == None or poster == None or release == None):
    #     print('UNDEF ELEMENT')
    #     randomMovie()
    #     #Must return something to not raise error.
    #     abort(899, 'Empty fetch trying again.')
    # else:
    #     print('NORMAL')
    return jsonify({"pid": person['id'], "name": person['name'], "profile": person['profile_path'], "mid": result['id'], "title": title, "poster": poster, "release": release})


@app.route("/api/answer", methods = ['POST', 'OPTIONS'])
def answer():
    #For finding current game
    gid = fl_req.json['gid']
    #Check if we can submit an answer to this game ID.
    last_update = datetime.strptime(scores.find_one({'_id': ObjectId(gid)})['start_time'], '%Y-%m-%d %H:%M:%S')
    time_diff = (datetime.now() - last_update).total_seconds()
    if(time_diff < 60):
        #To keep track if point has been awarded and if actor is found in cast
        found = False
        point = False
        #Judging data.
        ans = fl_req.json['ans']
        pid = fl_req.json['pid']
        mid = fl_req.json['mid']
        #Find credits for the given film.
        ssl._create_default_https_context = ssl._create_unverified_context
        conn = request.urlopen(base_movie_url + str(mid) + "/credits?api_key=" + api_key_3 + "&language=en-US")
        json_credits = dict(json.loads(conn.read()))
        #Filter to get current game ID.
        filter = {'_id': ObjectId(gid)}
        #Increment argument for mongodb.
        new_score = {"$inc": {'score': 1}}
        #Go through credited films and check for match.
        credits = list(json_credits['cast'])
        for actor in credits:
            actor_id = actor['id']
            #If we find the film in credits.
            if pid == actor_id:
                found = True
                break
        #Assign point if match between answer and found. Returning point_given so we can redirect on false answer.
        if ((ans == 'no' and not found) or (ans == 'yes' and found)):
            scores.update_one(filter, new_score)
            game = scores.find_one({'_id': ObjectId(gid)})
            point = True
            return jsonify({'gid': gid, 'name': game['name'], 'score': game['score'], 'point_given': point})
        #Default return no point. Returning point_given so we can redirect on false answer.
        game = scores.find_one({'_id': ObjectId(gid)})
        return jsonify({'gid': gid, 'name': game['name'], 'score': game['score'], 'point_given': point})
    #Abort since time has expired and answer can't be submitted.
    else:
        abort(501, "Attempted answer after allowed time")

#Get score for given gid
@app.route("/api/score", methods = ['GET'])
def giveScore():
    gid = fl_req.args.get('gid')
    game = scores.find_one({'_id': ObjectId(gid)})
    return jsonify({'gid': gid, 'name': game['name'], 'score': game['score'], 'mode': game['mode']})




if __name__=="__main__":
    app.run(debug=True)