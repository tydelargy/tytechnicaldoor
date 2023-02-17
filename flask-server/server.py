import random
from urllib import request
# import urllib.request as request
import logging
import ssl
import json
from flask import Flask, jsonify
from flask import request as fl_req
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo, ObjectId
from pymongo import MongoClient

app = Flask(__name__)


#Enabling MONGO DB
# app.config['MONGO_URI'] = 'mongodb://localhost:27017/doorwaytechnical'
# mongo = PyMongo(app)

client = MongoClient('localhost', 27017)

db = client.doorwaytechnical
scores = db.scoreboard

#Enable CORS
logging.getLogger('flask_cors').level = logging.DEBUG

CORS(app)

#Mount DB
# db = mongo.db.scores

#TMDB URLs and API KEY
api_key_3 = "e7563e8a3f845a7df7b8e492c489c0c2"
#Base query URL limits by English lang, sorts by popularity, has over 50 ratings, and a 7 or better for average rating.
#In testing this can produce reliably recognizable movies
base_query_url = "https://api.themoviedb.org/3/discover/movie?api_key=" + api_key_3 + "&language=en-US&sort_by=popularity.desc&include_video=false&vote_count.gte=50&vote_average.gte=7"
base_person_url = "https://api.themoviedb.org/3/person/popular?api_key=" +api_key_3 + "&language=en-US"
base_credits_url = "https://api.themoviedb.org/3/person/"

#MOVIE CHECK TEST VARS
# mid = 712
# pid = 141354
# fid = 713

#NEW GAME CHECK TEST

#Hard mode decides whether the movies and actors must be from the same era
hard = True

#Beginning new Game
@app.route("/start", methods = ['GET', 'POST'])
def newGame():
    if fl_req.method == 'POST':
        #Get incoming name
        # req = fl_req.get_json()
        result = scores.insert_one({
            'name': fl_req.json['name'],
            'score': 0
        })
        return jsonify({'gid' : str(result.inserted_id), 'score': 0})
    elif fl_req.method == 'GET':
        # filter = scores.aggregate[
        #     {$sort: {score}},
        #     {$limit: 10},
        # ].pretty()
        top_scores = scores.find().sort("score")
        return(jsonify(top_scores)) 



@app.route("/movies", methods = ['GET'])
# @cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def randomMovie():
    #We get a list of popular actors. We get a movie they're known for. We can then choose to present this, or pick other random film.
    #Decide if we should present true movie or not, extremely small chance that a random movie has the actor in it.
    true_movie = bool(random.getrandbits(1))
    #Create ssl context and get list of all actors by popularity
    ssl._create_default_https_context = ssl._create_unverified_context
    # conn = request.urlopen(base_person_url)
    # json_ppl = dict(json.loads(conn.read()))
    # total_ppl_pages = json_ppl['total_pages']
    #Pick random page from top quarter of results
    conn = request.urlopen(base_person_url + "&page=" + str(random.randrange(1, 10)))
    json_ppl = json.loads(conn.read())
    #pick random person from the page
    people = json_ppl['results']
    person = people[random.randrange(0, len(people))]
    #Stash known-for list
    known_for = list(person['known_for'])


    if(true_movie):
        # known_for = list(person['known_for'])
        result = dict(known_for[random.randrange(0, len(known_for))])
        title = result.get('title')
        poster = result.get('poster_path')
        release = result.get('release_date')
        # while not title:
        #     result = dict(known_for[random.randrange(0, len(known_for))])
    

    if(not true_movie):
        if hard:
            min = 10000
            max = 0
            for i in range(0, len(known_for)):
                movie = dict(known_for[i])
                release = movie.get('release_date')
                if release:
                    rel_int = int(release[0:4])
                    if rel_int < min:
                        min = rel_int
                    if rel_int > max:
                        max = rel_int
            # Handle for up and coming actors
            if min == max:
                min -= 5
                max += 5
            #Handle if not known for anything
            if len(known_for) == 0:
                min = 1970
                max = 2023
            
            if min == 10000 and max == 0:
                min = 1970
                max = 2023
            
            #Randomize year between range of release dates for best known films of the actor
            year = "&year=" + str(random.randrange(min, max, 1))
        else:
            #Randomize year between 1970 and 2023 *&year=* tag doesn't quite work due to re-releases, but better than nothing.
            year = "&year=" + str(random.randrange(1970, 2023, 1))

        #Get first request to determine number of pages
        # conn = request.urlopen(base_query_url + year)
        # json_data = dict(json.loads(conn.read()))
        # total_pages = json_data['total_pages']
        #Get new request from a random page in the first quarter of pages, therefore only one fairly popular
        conn = request.urlopen(base_query_url + '&page=' + str(random.randrange(1, 10)) + year)
        json_data = dict(json.loads(conn.read()))
        #Gather all results
        results = json_data['results']
        #Pick a random result
        result = results[random.randrange(0, len(results))]
        title = result.get('title')
        poster = result.get('poster_path')
        release = result.get('release_date')
        
    return jsonify({"answer": true_movie, "pid": person['id'], "name": person['name'], "profile": person['profile_path'], "mid": result['id'], "title": title, "poster": poster, "release": release})



@app.route("/answer", methods = ['POST', 'GET'])
# @cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
# @cross_origin()
def answer():
    # if fl_req.method == 'POST':
        # result = fl_req.get_json()
    point = False
    gid = fl_req.json['gid']
    ans = fl_req.json['ans']
    print(ans)
    if ans == 'yes':
        ans = True
    else:
        ans = False
    pid = fl_req.json['pid']
    mid = fl_req.json['mid']
    # print(pid)
    ssl._create_default_https_context = ssl._create_unverified_context
    conn = request.urlopen(base_credits_url + str(pid) + "/movie_credits?api_key=" + api_key_3 + "&language=en-US")
    json_credits = dict(json.loads(conn.read()))
    filter = {'_id': ObjectId(gid)}
    new_score = {"$inc": {'score': 1}}
    #Go through credited films and check for match.
    credits = list(json_credits['cast'])
    for credit in credits:
        movie_id = credit['id']
        #If we find the film in credits and they answer YES
        if mid == movie_id and ans:
            print('movieFound')
            scores.update_one(filter, new_score)
            point = True
    if not ans and not point:
        print('nomatchhh')
        scores.update_one(filter, new_score)
        # point = 'yes'
    print('SCORE!')
    game = scores.find_one({'_id': ObjectId(gid)})
    print(game['score'] )
    return jsonify({'gid': gid, 'score': game['score']})




@app.route("/score", methods = ['GET'])
def giveScore():
    args = fl_req.args
    gid = args.get('gid')
    game = scores.find_one({'_id': ObjectId(gid)})
    return jsonify({'score': game['score']})

# @app.route("/answer", methods = ['POST', 'GET'])
# def judgeAnswer():
#     ssl._create_default_https_context = ssl._create_unverified_context
#     conn = request.urlopen(base_credits_url + str(pid) + "/movie_credits?api_key=" + api_key_3 + "&language=en-US")
#     json_credits = dict(json.loads(conn.read()))
#     credits = list(json_credits['cast'])
#     for credit in credits:
#         movie_id = credit['id']
#         if mid == movie_id:
#             return('yes')
#         else:
#             return('no')
        
    # crew = json_credits['crew']
    # id = json_credits['id']
    # return(str(movie_id))



if __name__=="__main__":
    app.run(debug=True)