import React, { useState, useEffect, useRef } from "react";
import { Container, FinalScore, Table, TableCell, TableHead, TableHeader, TableRow } from "./Styles";

export default function Scoreboard(){

    const[scores, setScores] = useState([]);
    const[mode, setMode] = useState('Easy');
    const[stable, setStable] = useState(false);
    const scoreFetchedRef = useRef(false);

    //Use to fetch scoreboard once
    useEffect(() => {
        if (scoreFetchedRef.current) return;
        scoreFetchedRef.current = true;
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('mode') !== null){
            setMode(urlParams.get('mode'));
        }
        setStable(true);
    }, [])
    

    //Secondary useffect needed to set state dependency for mode
    useEffect(() => {
        if(stable){
            fetch('/api/start?' + new URLSearchParams({
                mode: mode,
            }),)
            .then((res) => res.json())
            .then((data) => {
                setScores(data)
            })
            .catch((err) => console.log(err))
        }
    }, [stable, mode])

    return (

        <>
        <Container>
            <FinalScore>{mode} Mode:</FinalScore>
            <br/>
            <Table className = "scoreboard">
                <TableHead>
                    <TableRow>
                        <TableHeader>Rank</TableHeader>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Score</TableHeader>
                    </TableRow>
                </TableHead>
                <tbody>
                    {scores.map((score, index) =>(
                        <TableRow key = {index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{score.name}</TableCell>
                            <TableCell>{score.score}</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </Container>
        </>
    );
}