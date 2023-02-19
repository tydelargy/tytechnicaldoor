# Ty Delargy - Doorway.io Technical Challenge<br><br>
# Setup:<br>
Replace api_key_3 in server.py with your own, or feel free to use mine. :)<br>
  
### In first terminal<br>
cd client<br>
npm install package.json<br>
npm start<br>

### In seperate terminal:<br>
cd flask-server<br>
.\venv\Scripts\activate<br>
python server.py<br>


<br><br><br>
## Write-up: <br>
All requirements are met.<br>

#### Additional Features: <br>
Hard and Easy mode with independent scoreboards. Hard mode expands obscurity for actor and film matches,<br>
and tightens time range for actor and film disparities.<br>
<br>

#### Errors:<br>
If TMDB has no poster for the found film no poster will be rendered. <br>
