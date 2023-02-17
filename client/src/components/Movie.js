    
import React, { useState, useEffect, useRef, useContext } from "react";

export default function Movie(){

    // const[gid, setGID] = useState(0);
    // const[usr, setUSR] = useState();
    const[pid, setPID] = useState();
    const[name, setName] = useState();
    const[mid, setMID] = useState();
    const[title, setTitle] = useState();

    //Make single Call
    // const movieFetchedRef = useRef(false);
    
    useEffect(() => {
        //Placed this loop to check if ref is current, workaround for double call with useeffect
        //Could also disable strictmode tag in index, not sure of tradeoff yet
        // if (movieFetchedRef.current) return;
        // // const gid = location.state.gid
        // movieFetchedRef.current = true;
        // fetchMovie();
        fetch('http://localhost:5000/movies')
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            setPID(data.pid)
            setName(data.name)
            setMID(data.mid)
            setTitle(data.title)
        })
        .catch((err) => console.log(err))
    }, [])


    // const fetchMovie = () => {
    //     fetch('http://localhost:5000/movies')
    //     .then((res) => res.json())
    //     .then((data) => {
    //         console.log(data)
    //         setPID(data.pid)
    //         setName(data.name)
    //         setMID(data.mid)
    //         setTitle(data.title)
    //     })
    //     .catch((err) => console.log(err))
    // }

    return (
    <div>
        <p>{name}</p>
        <p>{title}</p>
        <p>{pid}</p>
        <p>{mid}</p>
    </div>
    )
}