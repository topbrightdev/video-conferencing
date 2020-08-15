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
} from './types';

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

export const join = () => (dispatch: Dispatch<JoinAction>) => {
    dispatch({
        type: JOIN,
        payload: {},
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
