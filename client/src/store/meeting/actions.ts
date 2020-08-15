import { Dispatch } from 'redux';
import {
    START,
    StartAction,
    JOIN,
    JoinAction,
    LeaveAction,
    LEAVE,
    EndAction,
    END,
    JOINED,
    JoinedAction,
    NewConnectionAction,
    NEW_CONNECTION,
} from './types';
import { MeetingDetail } from '../../types';
import Meeting, { Connection } from '../../lib/meeting';

interface StartParam {
    name: string;
    meetingId: string;
}
export const start = ({ name, meetingId }: StartParam) => async (
    dispatch: Dispatch<StartAction>,
) => {
    dispatch({
        type: START,
        payload: { name, meetingId },
    });
    localStorage.setItem('name', name);
    localStorage.setItem('meetingId', meetingId);
};

export const join = (meetingDetail: MeetingDetail) => async (
    dispatch: Dispatch<JoinAction | any>,
) => {
    try {
        const name = localStorage.getItem('name') || '';
        const userId = localStorage.getItem('userId') || '';
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const meeting = new Meeting({ meetingId: meetingDetail.id, stream, name, userId });
        meeting.on('connection', (connection: Connection) => {
            dispatch(newConnection(connection));
        });
        dispatch({
            type: JOIN,
            payload: { meetingDetail, meeting, stream },
        });
    } catch (error) {
        console.log(error);
    }
};
export const newConnection = (connection: Connection) => async (
    dispatch: Dispatch<NewConnectionAction>,
) => {
    dispatch({
        type: NEW_CONNECTION,
        payload: {
            connection,
        },
    });
};

export const joined = () => (dispatch: Dispatch<JoinedAction>) => {
    dispatch({
        type: JOINED,
        payload: {},
    });
};
export const leave = () => (dispatch: Dispatch<LeaveAction>) => {
    dispatch({
        type: LEAVE,
        payload: {},
    });
};
export const end = () => (dispatch: Dispatch<EndAction>) => {
    dispatch({
        type: END,
        payload: {},
    });
};
