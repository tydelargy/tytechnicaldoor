import { useState, useEffect, useRef} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NewTimer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [gid, setGID] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(10);

    const timerCreatedRef = useRef(false);

    //Timer creation and visibility logic
    useEffect(() => {
        if(timerCreatedRef.current) return;
        timerCreatedRef.current = true;
        const params = new URLSearchParams(location.search);
        const isGamePage = location.pathname === '/game' && params.toString() !== '';

        setGID(params.get('gid'))
        setIsVisible(isGamePage);
        setSecondsLeft(60);
    }, [location]);

    //Timer Logic and Redirect to /final at 0 seconds
    useEffect(() => {
        if (isVisible && secondsLeft > 0) {
        const timer = setTimeout(() => {
            setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
        } else if (secondsLeft === 0) {
            // const params = new URLSearchParams(location.search);
            // setGID(params.get('gid'))
            
            setIsVisible(false)
            setSecondsLeft(60)
            // setIsVisible(false)
            // navigate('/final' + params)
            navigate('/final?' + new URLSearchParams({
                gid: gid,
            }));
        }
    }, [isVisible, secondsLeft, navigate, gid]);

    if (!isVisible) return null;

    return (
        <div>
        <h2>{secondsLeft} seconds left</h2>
        </div>
    );
};

export default NewTimer;
