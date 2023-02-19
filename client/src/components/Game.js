import React, { useState, useEffect, useRef} from "react";
import { Button, ButtonContainer, ImageContainer, ImageWithText, Title } from "./Styles";

export default function Game(){

    //Game Variables
    const[gid, setGID] = useState(0);
    const[pid, setPID] = useState();
    const[name, setName] = useState();
    const[profile, setProfile] = useState();
    const[mid, setMID] = useState();
    const[title, setTitle] = useState();
    const[poster, setPoster] = useState();
    //Local Score
    const[score, setScore] = useState(0);
    const[mode, setMode] = useState('Easy');
    
    //For displaying images of poster or profile
    //Some 404 errors will appear if the file does not exist, movie api will redirect to next best.
    const img_base_ref = "https://www.themoviedb.org/t/p/w600_and_h900_bestv2";

    const movieFetchedRef = useRef(false);

    //Only used for initial fetch future fetches triggered by
    //scoreAnswer() in order to update score before fetching next film
    useEffect(() => {
        if (movieFetchedRef.current) return;
        movieFetchedRef.current = true;
        const urlParams = new URLSearchParams(window.location.search);
        setGID(urlParams.get('gid'));
        if(urlParams.get('mode') !== null){
            setMode(urlParams.get('mode'));
        }
        fetchMovie(urlParams.get('gid'));
    }, [])
    

    //Getting a movie
    const fetchMovie = (gid) => {
        fetch('/api/movies?' + new URLSearchParams({
            gid: gid,
        }),)
        .then((res) => res.json())
        .then((data) => {
            //DEBUG response
            // console.log(data)
            setPID(data.pid)
            setName(data.name)
            setProfile(data.profile)
            setMID(data.mid)
            setTitle(data.title)
            setPoster(data.poster)
        })
        .catch((err) => console.log(err))
    }

    //Pass answer from button event.
    const handleSubmit = (e) => {
        scoreAnswer(e.target.value);
        e.preventDefault();
    }

    //Score the result from current answer and fetch new movie.
    const scoreAnswer = async (ans) => {
        const res = await fetch("/api/answer", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'gid': gid, 'pid': pid, 'mid': mid, 'ans': ans})
        }).catch((err) => console.log(err));
        const data = await res.json();
        //If we answered incorrectly redirect to final page.
        if(!data.point_given){
            window.location.replace('/final?gid=' + gid + '&mode=' + mode)
        }
        //Otherwise set new score and fetch next film.
        else{
            setScore(data.score);
            fetchMovie(gid);
        }
    }


    return (
        <>
        <ImageContainer>
            <ImageWithText loading ="lazy" width={300} height = {450} src = {img_base_ref + profile} name = {name}/>
            <ImageWithText loading ="lazy" width={300} height = {450} src = {img_base_ref + poster} name = {title}/>
        </ImageContainer>
        <Title>Score: {score}</Title>
        <ButtonContainer>
            <Button color = 'yes' value = 'yes' onClick={(e) => {handleSubmit(e);}}> Yes </Button>
            <Button value = 'no' onClick={(e) => {handleSubmit(e);}}> No </Button>
        </ButtonContainer>
        </>
    );
}