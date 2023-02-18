// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation, Navigate } from 'react-router-dom';


// const STATUS = {
//     STARTED: 'Started',
//     STOPPED: 'Stopped',
// }

// const AltTimer = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const [isVisible, setIsVisible] = useState(false);
//     const [timeLeft, setTimeLeft] = useState(60);
//     const [gid, setGID] = useState(0)


//     const [status, setStatus] = useState(STATUS.STOPPED)

//     const handleStart = () => {
//         setStatus(STATUS.STARTED)
//     }

//     const handleStop = () => {
//         setStatus(STATUS.STOPPED)
//     }

//     useEffect(() => {
//         const urlParams = new URLSearchParams(location.search);
//         setGID(urlParams.get('gid'))
//         if (location.pathname === '/game' && params.toString() !== '') {
//         setIsVisible(true);
//         setStatus(STATUS.STARTED)
//         }
//     }, [location]);

//     useEffect(() => {
//         if (timeLeft === 0) {
//             setStatus(STATUS.STOPPED)
//             setIsVisible(false)
//             setTimeLeft(60)
//             useNavigate('/final?gid=' + new URLSearchParams({
//                 gid: gid,
//             }));
//         } else {
//         const timer = setTimeout(() => {
//             setTimeLeft(timeLeft - 1);
//         }, 1000);
//         return () => clearTimeout(timer);
//         }
//     }, [timeLeft, navigate, isVisible]);
    

//     if(!isVisible) return null;

//     return (
//         <div>
//         <h2>Time left: {timeLeft} seconds</h2>
//         </div>
//     );
// };

// export default AltTimer;
