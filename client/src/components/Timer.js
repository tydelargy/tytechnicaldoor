//Timer.js

import {React, useState, useEffect, useRef} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import { TimerContainer } from './Styles';

const STATUS = {
    STARTED: 'Started',
    STOPPED: 'Stopped',
}

const INITIAL_TIME = 60

export default function Timer() {
    const [isVisible, setIsVisible] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_TIME)
    const [status, setStatus] = useState(STATUS.STOPPED)

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
        <div style ={{ display: isVisible ? 'block': 'none'}} className='timer'>
            {/* <div> STATUS: {status}</div> */}
            <TimerContainer>Time Left: {secondsRemaining}</TimerContainer>
            {/* <button onClick={handleStart} type="button">Start</button>
            <button onClick={handleStop} type="button">Stop</button> */}
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