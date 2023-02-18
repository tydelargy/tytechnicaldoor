import React, { useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Scoreboard from "./Scoreboard";
import Start from "./Start";
import { Button, ButtonContainer, FinalScore, Form } from "./Styles";
// import {redirect, useNavigate} from "react-router-dom";

export default function Final(){

    const[name, setName] = useState("User");
    const[score, setScore] = useState(0)
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        fetchScore(params.get('gid'))
    }, [location]);

    const handleRetry = (e) => {
        retryGame()
        e.preventDefault();
    }

    const handleNew = (e) => {
        newGame()
        e.preventDefault();
    }

    const fetchScore = (gid) => {
        fetch('http://localhost:5000/score?' + new URLSearchParams({
            gid: gid,
        }),
        {
            method: 'GET',
            // body: JSON.stringify({'gid': gid})
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            setScore(data.score)
            setName(data.name)
        })
        .catch((err) => console.log(err))
    }

    const retryGame = async () => {
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

    const newGame = () => {
        navigate('/')
    }

    return (
        <>
        <Scoreboard/>
        <FinalScore>{name} Final Score: {score}</FinalScore>
        <ButtonContainer>
            <Form onSubmit={e => { handleRetry(e); } }>
                
                    <Button color = 'yes' type = 'submit'>Retry</Button>
                
            </Form>
            <Form onSubmit={(e) => {handleNew(e);}}>
                <Button color = 'yes' type = 'submit'>New Game</Button>
            </Form>
        </ButtonContainer>
        </>

    );
}