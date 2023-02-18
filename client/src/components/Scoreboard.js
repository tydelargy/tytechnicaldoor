import React, { useState, useEffect } from "react";
import { Container, Table, TableCell, TableHead, TableHeader, TableRow } from "./Styles";
// import {redirect, useNavigate} from "react-router-dom";

export default function Scoreboard(){

    const[scores, setScores] = useState([]);
    // const[gid, setGID] = useState(0)
    // let navigate = useNavigate();

    // const GidContext = createContext();

    useEffect(() => {
        scoreBoard();
    }, []);

    const scoreBoard = () => {
        fetch('http://localhost:5000/start')
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            setScores(data)
        })
        .catch((err) => console.log(err))

        
    }

    return (

        <>
        <Container>
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