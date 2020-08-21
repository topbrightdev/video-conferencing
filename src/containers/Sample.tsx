import React from 'react';
// import { endMeeting, leaveMeeting } from './sample-websocket';
import Meeting from '../lib/meeting';
import { v4 as uuidV4 } from 'uuid';

const meetingId = 'e4bd85a0-623b-4096-993b-2997aec423be';
let meeting: Meeting | null = null;
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    meeting = new Meeting({ stream, meetingId, userId: '', name: '' });
});

const Sample: React.FC = () => {
    return (
        <div>
            <button onClick={() => meeting?.end()}>End</button>
            <button onClick={() => meeting?.leave()}>Leave</button>
        </div>
    );
};

export default Sample;
