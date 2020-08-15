import { Connection } from '../../lib/meeting';

export interface MeetingState {
    stream?: MediaStream | null;
    connections: Connection[];
    userId?: string;
    started: boolean;
    meetingId: string;
    name: string;
}
export const START = '@meeting/start';
export const JOIN = '@meeting/join';
export const JOINED = '@meeting/joined';
export const LEAVE = '@meeting/leave';
export const END = '@meeting/end';

export interface StartAction {
    type: typeof START;
    payload: {
        name: string;
        meetingId: string;
    };
}
export interface JoinAction {
    type: typeof JOIN;
    payload: {};
}
export interface JoinedAction {
    type: typeof JOINED;
    payload: {};
}
export interface LeaveAction {
    type: typeof LEAVE;
    payload: {};
}
export interface EndAction {
    type: typeof END;
    payload: {};
}
export type MeetingAction =
    | StartAction
    | JoinAction
    | JoinedAction
    | LeaveAction
    | EndAction;
