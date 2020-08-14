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

export const start = () => (dispatch: Dispatch<StartAction>) => {
    dispatch({
        type: START,
        payload: {},
    });
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
