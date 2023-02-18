import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Button, ButtonContainer, Container, Image, ImageContainer, ImageWithText, Title } from "./Styles";
import Timer from "./Timer";
// import Movie from "./Movie";
// import axios from 'axios';

export default function Game(){

    //For posting player turns {ans: yes/no, gid: game_id, pid: person_id, mid: movie_id}
    // const[ans, setAns] = useState();
    const[gid, setGID] = useState(0);
    // const {gid} = useParams()
    const[pid, setPID] = useState();
    const[name, setName] = useState();
    const[profile, setProfile] = useState();
    const[mid, setMID] = useState();
    const[title, setTitle] = useState();
    const[poster, setPoster] = useState();
    // //For displaying score
    const[score, setScore] = useState(0);
    
    const img_base_ref = "https://www.themoviedb.org/t/p/w600_and_h900_bestv2";
    // const prof_base_ref = 


    // //For getting and displaying movie info
    // const[data, setData] = useState([]) //did have {} for fetch

    const movieFetchedRef = useRef(false);

    useEffect(() => {
        //Placed this loop to check if ref is current, workaround for double call with useeffect
        //Could also disable strictmode tag in index, not sure of tradeoff yet
        if (movieFetchedRef.current) return;
        // const gid = location.state.gid
        movieFetchedRef.current = true;
        fetchMovie();

        //REMOVE THIS YUCK
        // fetchScore(gid);
    }, [])
    

    const fetchMovie = () => {
        const urlParams = new URLSearchParams(window.location.search);
        // // setGID(urlParams.get(gid));

        // // const gid = urlParams.get('gid')
        setGID(urlParams.get('gid'))
        // setScore(urlParams.get('score'))
        
        // console.log(gid)
        fetch('http://localhost:5000/movies')
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            setPID(data.pid)
            setName(data.name)
            setProfile(data.profile)
            setMID(data.mid)
            setTitle(data.title)
            setPoster(data.poster)
        })
        // .then(fetchScore(urlParams.get('gid')))
        .catch((err) => console.log(err))
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
        })
        .catch((err) => console.log(err))
    }

    

    const handleSubmit = (e) => {
        // fetchScore(gid)
        scoreAnswer(e.target.value);
        e.preventDefault();
    }

    const scoreAnswer = async (ans) => {
        console.log(ans)
        const res = await fetch("http://localhost:5000/answer", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'gid': gid, 'pid': pid, 'mid': mid, 'ans': ans})
            // body: '{ans: ans, gid: gid, pid: pid, mid: mid}'
        }).catch((err) => console.log(err));
        // if(!res.ok){
        //     const msg = '${res.status}';
        //     throw new Error(msg);
        // }
        const data = await res.json();
        console.log(data)
        // fetchScore();
        setScore(data.score);
        fetchMovie();
        // setScore(data['score'])
        // window.location = '/game?gid=' + data['gid'];
    }


    return (
        <>
        <Timer/>
        {/* <p>{name}</p> */}
        <ImageContainer>
            <ImageWithText loading ="lazy" width={300} height = {450} src = {img_base_ref + profile} name = {name}/>
            {/* <p>{title}</p> */}
            <ImageWithText loading ="lazy" width={300} height = {450} src = {img_base_ref + poster} name = {title}/>
            {/* <p>{gid}</p> */}
        </ImageContainer>
        <Title>Score: {score}</Title>
        <ButtonContainer>
            <Button color = 'yes' value = 'yes' onClick={(e) => {handleSubmit(e);}}> Yes </Button>
            <Button value = 'no' onClick={(e) => {handleSubmit(e);}}> No </Button>
        </ButtonContainer>
        </>
        // onSubmit={e => { handleSubmit(e); } } WAS INSIDE first form wrapper

    );
}