import React, { useState, useEffect } from "react";
// import {redirect, useNavigate} from "react-router-dom";

export default function Scoreboard(){

    const[data, setData] = useState();
    // const[gid, setGID] = useState(0)
    // let navigate = useNavigate();

    // const GidContext = createContext();

    useEffect(() => {
        scoreBoard();
    }, [])

    const scoreBoard = () => {
        fetch('http://localhost:5000/start')
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            setData(data)
        })
        .catch((err) => console.log(err))

        
    }

    return (

        <>
            <table class = "scoreboard">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {data}
                </tbody>
            </table>
        </>
    );
}