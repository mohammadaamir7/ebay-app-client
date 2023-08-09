import React, { useState, useEffect } from 'react';

import format from '../../utils/formatTime';

const RunTime = ({ action }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval = null;
        if (action === 'start') {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (action === 'pause' && seconds !== 0) {
            clearInterval(interval);
        } else if (action === 'stop') {
            clearInterval(interval);
        }
        
        return () => clearInterval(interval);
    }, [action, seconds]);

    useEffect(() => {
        if (action === 'start') {
            setSeconds(0);
        }
    }, [action]);

    return (
        <span>{format(seconds)}</span>
    );
};

export default RunTime;