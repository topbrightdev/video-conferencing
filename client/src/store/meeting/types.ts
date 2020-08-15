import Meeting, { Connection } from '../../lib/meeting';
import { MeetingDetail } from '../../types';

export interface MeetingState {
    stream?: MediaStream | null;
    connections: Connection[];
    userId?: string;
    started: boolean;
    meetingId: string;
    name: string;
    meeting: Meeting | null;
    meetingDetail: MeetingDetail | null;
}
export const START = '@meeting/start';
export const JOIN = '@meeting/join';
export const JOINED = '@meeting/joined';
export const NEW_CONNECTION = '@meeting/new-connection';
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
    payload: {
        meetingDetail: MeetingDetail;
        stream: MediaStream;
        meeting: Meeting;
    };
}
export interface JoinedAction {
    type: typeof JOINED;
    payload: {};
}
export interface NewConnectionAction {
    type: typeof NEW_CONNECTION;
    payload: {
        connection: Connection;
    };
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
    | NewConnectionAction
    | LeaveAction
    | EndAction;
