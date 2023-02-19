import React, { useState, useEffect, useRef} from "react";
import { useLocation } from "react-router-dom";
import Scoreboard from "./Scoreboard";
import { Button, ButtonContainer, FinalScore, Form } from "./Styles";

export default function Final(){

    const[name, setName] = useState("User");
    const[score, setScore] = useState(0);
    const[mode, setMode] = useState('Easy');
    const location = useLocation();

    const scoreFetchedRef = useRef(false);

    //Make sure we only fetch score once
    useEffect(() => {
        if(scoreFetchedRef.current) return;
        scoreFetchedRef.current = true;
        const urlParams = new URLSearchParams(location.search);
        fetchScore(urlParams.get('gid'))
    }, [location]);

    const handleRetry = (e) => {
        retryGame()
        e.preventDefault();
    }

    const handleNew = (e) => {
        newGame()
        e.preventDefault();
    }

    //Retry passes same username as current game
    const retryGame = async () => {
        const res = await fetch("/api/start", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: name, mode: mode})
        });
        if(!res.ok){
            const messg = '500 Error: failed to retry game.';
            throw new Error(messg);
        }
        const data = await res.json();
        window.location = '/game?gid=' + data['gid'] + '&mode=' + mode;
    }

    //New game just bounces back to homepage
    const newGame = () => {
        window.location.replace('/');
    }

    const fetchScore = (gid) => {
        fetch('/api/score?' + new URLSearchParams({
            gid: gid,
        }),
        {
            method: 'GET',
        })
        .then((res) => res.json())
        .then((data) => {
            setScore(data.score)
            setName(data.name)
            setMode(data.mode)
        })
        .catch((err) => console.log(err))
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