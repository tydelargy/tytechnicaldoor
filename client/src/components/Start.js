import React, { useState, createContext } from "react";
// import Scoreboard from "./components/Scoreboard";
// import {redirect, useNavigate} from "react-router-dom";

export default function Start(){

    const[name, setName] = useState("User");
    // const[gid, setGID] = useState(0)
    // let navigate = useNavigate();

    // const GidContext = createContext();

    const handleSubmit = (e) => {
        newGame(name)
        e.preventDefault();
    }

    const newGame = async () => {
        const res = await fetch("http://localhost:5000/start", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: name})
            });
            if(!res.ok){
                const messg = 'Erroorrrr: ${res.status}';
                throw new Error(messg);
            }
            const data = await res.json();
            console.log(data)
            // setGID(data['gid'])

            window.location = '/game?gid=' + data['gid'];
            // navigate.({
            //     to: '/game',
            //     state: {gid}
            // })
            // return redirect("/game/:gid")
            // <redirect

        
    }

    return (
        // <GidContext.Provider value = {gid}>
        <>
        {/* <Scoreboard/> */}
        <form onSubmit={e => { handleSubmit(e); } }>
            <label>Name</label>
            <input
                name='userName'
                type='text'
                onChange={e => setName(e.target.value)} />
            <br />
            
            <input
                type='submit'
                value='Start Game'/>
        </form>
        </>
        // <Game gid = {gid}/>
        // </GidContext.Provider>

    );
}