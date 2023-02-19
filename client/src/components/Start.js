import React, { useState } from "react";
import Scoreboard from "./Scoreboard";
import { Button, ButtonContainer, Form, FormInput, FormLabel } from "./Styles";

export default function Start(){

    const[name, setName] = useState("User");
    const[mode, setMode] = useState("Easy");

    //Submit new game on button click.
    const handleSubmit = (e) => {
        newGame()
        e.preventDefault();
    }

    //Instantiate new game with username and return game id.
    const newGame = async () => {
        const res = await fetch("/api/start", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: name, mode: mode})
            }).catch((err) => console.log(err));
            const data = await res.json();
            window.location.replace('/game?gid=' + data['gid'] + '&mode=' + mode);
    }

    return (
        <>
        <Scoreboard/>
        <Form onSubmit={e => { handleSubmit(e); } }>
            <FormLabel>Name</FormLabel>
            <FormInput
                name='userName'
                type='text'
                onChange={e => setName(e.target.value)} />
            <br />
            <ButtonContainer>
                <Button color = 'yes' type = 'submit' onClick={() => setMode("Easy")}>Easy</Button>
                <Button type = 'submit' onClick={() => setMode("Hard")}>Hard</Button>
            </ButtonContainer>
        </Form>
        </>

    );
}