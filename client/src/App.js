//USe state for functions not classes Hooks can't be used in conditionals, loops, or functions 
import React, {useState, useEffect, ReactDOM} from "react";
// import axios from 'axios';
// import {createBrowserRouter, RouterProvider, RouterProps} from 'react-router-dom';
import {Routes, Route} from "react-router-dom";
import Start from "./components/Start";
import Game from "./components/Game";
import Final from "./components/Final";
import Timer from "./components/Timer";


function App(){
  //State demos
  // const[count, setCount] = useState(0);
  // // const possibles String[] = ["Hello World", "Goodbye World"];
  // const[str, setString] = useState('Hello World');
  // const [bool, setBool] = useState(true);

  // const[data, setData] = useState([]) //did have {} for fetch

  // useEffect(() => {
  //   axios.get('http://localhost:5000/members')
  //   .then(res => {
  //     setData(res.data)
  //     console.log(res.data)
  //   }).catch(err => {
  //     console.log(err)
  //   })
  //   }, [])


  //State Vars
  //Start Vars
  // const[name, setName] = useState();
  // //*NEED TIMER?
  // //Need GID?

  // //Game Vars
  // const[ans, setAns] = useState();
  // const[score, setScore] = useState(0);

  return (
    <div>
      <h1>Guess the Cast!</h1>
      {/* <Start/>
      <Timer/>
      <Game/> */}
      {/* <p>{count}</p>
      <button onClick={() => setCount(count + 1)}> Increase </button>
      <p>{str}</p>
      <button onClick={() => setString('Goodbye World')}> Goodbye </button>
      {bool ? <p>True</p> : <p>False</p>}
      <button onClick={() => bool? setBool(false) : setBool(true)}> Toggle Me!</button>
      <div>
        {(typeof data.members === 'undefined') ? (
          <p>Loading...</p>
        ): (
          data.members.map((member, i) => (
            <p key = {i}>{member}</p>
          ))
        )}
      </div> */}
      <Routes>
        <Route path = "/" element = {<Start/>}/>
        <Route path = "/game" element = {<Game/>}/>
        {/* <Route path = "/final/:gid" element = {<Final/>}/> */}
      </Routes>
    </div>
  )
}


//Notes:

//Build Final Screen, and play again, which will keep name? Plus display score and ranking number, redir to Start Screen after timeout or clicking new player?


//TO DO STILL
//FRONT
//UI
//FINAL SCREEN
//SCOREBOARD

//BACKEND
//Send back point
//If incorrect stop clock --> redir to final
//MongoDB 1: Game IDs and Scores 2: Active Games? Or rope in?


//FIXES
//Clean up comments
//Use proxy? 
//remove strictmode?
//Change some logic to eliminate null props on movies
//Vulnerabilities!!!
//For speed, only choosing between top 10 pages for actors and movies, could optimize for top percentage instead


//Add-ons
//Sorting for scoreboard efficiency, insertion sort on game finish?\



//THINGS LEFT
//FRONT, Scoreboard, timer funcitonality, final screen, play again button pass GID fetch name, and run start, elim shitty image search

export default App