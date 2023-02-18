//USe state for functions not classes Hooks can't be used in conditionals, loops, or functions 
import React, {useState, useEffect, ReactDOM} from "react";
// import axios from 'axios';
// import {createBrowserRouter, RouterProvider, RouterProps} from 'react-router-dom';
import {Routes, Route} from "react-router-dom";
import Start from "./components/Start";
import Game from "./components/Game";
import Final from "./components/Final";
import Timer from "./components/Timer";
import NewTimer from './components/NewTimer';
import { Container, Title } from "./components/Styles";


function App(){

  return (
    <div>
      <Container>
      <Title>Guess the Cast!</Title>
      <NewTimer/>
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
        <Route path = "/final" element = {<Final/>}/>
      </Routes>
      </Container>
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
//elim shitty image search, elim image disjointed error, elim button fail error, 
//add immutable gid entry, server timer, concurrent timer, new game not just rety
//animation on final screen if new highscore for name, possibly add same to score numebr in render
//Add my api fetch times to comments

export default App