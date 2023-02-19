import React from "react";
import {Routes, Route} from "react-router-dom";
import Start from "./components/Start";
import Game from "./components/Game";
import Final from "./components/Final";
import { Container, Title } from "./components/Styles";
import GameTimer from "./components/GameTimer";


function App(){

  return (
    <div>
      <Container>
      <Title>Guess the Cast!</Title>
      <GameTimer/>
      <Routes>
        <Route path = "/" element = {<Start/>}/>
        <Route path = "/game" element = {<Game/>}/>
        <Route path = "/final" element = {<Final/>}/>
      </Routes>
      </Container>
    </div>
  )
}

export default App