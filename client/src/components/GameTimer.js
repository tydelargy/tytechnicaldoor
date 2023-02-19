import { useState, useEffect, useRef} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GameTimer = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [gid, setGID] = useState(0);
    const[mode, setMode] = useState('easy');
    const [isVisible, setIsVisible] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(10);

    const timerCreatedRef = useRef(false);

    //Timer visibility logic
    useEffect(() => {
        //Create timer reference for single render.
        if(timerCreatedRef.current) return;
        timerCreatedRef.current = true;

        //Grab params, and create object isGamePage if we are on game page and have params.
        const urlParams = new URLSearchParams(location.search);
        const isGamePage = location.pathname === '/game' && urlParams.toString() !== '';

        //Set our game id and set visible if we have isGamePage.
        setGID(urlParams.get('gid'))
        if(urlParams.get('mode') !== null){
            setMode(urlParams.get('mode'));
        }
        setIsVisible(isGamePage);
        setSecondsLeft(60);
    }, [location]);

    //Timer Logic
    useEffect(() => {
        //Tick timer if visible and time remains.
        if (isVisible && secondsLeft > 0) {
        const timer = setTimeout(() => {
            setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
        } else if (secondsLeft === 0) {
            // Turn of visibility and reset timer after expiry.
            setIsVisible(false);
            setSecondsLeft(60);
            window.location.replace('/final?gid=' + gid + '&mode=' + mode);
        }
    }, [isVisible, secondsLeft, navigate, gid, mode]);

    // Don't render anything if visibility is false.
    if (!isVisible) return null;

    return (
        <div>
        <h2>{secondsLeft} seconds left</h2>
        </div>
    );
};

export default GameTimer;