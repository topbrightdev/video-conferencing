import React from 'react';
import { endMeeting, leaveMeeting } from './sample-websocket';

const Sample: React.FC = () => {
    return (
        <div>
            <button onClick={() => endMeeting()}>End</button>
            <button onClick={() => leaveMeeting()}>Leave</button>
        </div>
    );
};

export default Sample;
