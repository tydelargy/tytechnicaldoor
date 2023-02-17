//Timer.js

import {React, useState, useEffect, useRef} from 'react';

const STATUS = {
    STARTED: 'Started',
    STOPPED: 'Stopped',
}

const INITIAL_TIME = 60

export default function Timer() {
    const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_TIME)
    const [status, setStatus] = useState(STATUS.STARTED)

    const handleStart = () => {
        setStatus(STATUS.STARTED)
    }

    const handleStop = () => {
        setStatus(STATUS.STOPPED)
    }

    useInterval(
        () => {
            if (secondsRemaining > 0) {
                setSecondsRemaining(secondsRemaining - 1)
            }
            else{
                setStatus(STATUS.STOPPED)
                //TRIGGER THE END OF GAME!
            }
        },
        status === STATUS.STARTED ? 1000 : null,
        //Passing null will stop interval
    )

    return(
        <div className='timer'>
            <div> STATUS: {status}</div>
            <div>Time Left: {secondsRemaining}</div>
            <button onClick={handleStart} type="button">Start</button>
            <button onClick={handleStop} type="button">Stop</button>
        </div>
    )
}

// source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
    const savedCallback = useRef()
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback
    }, [callback])
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current()
      }
      if (delay !== null) {
        let id = setInterval(tick, delay)
        return () => clearInterval(id)
      }
    }, [delay])
  }