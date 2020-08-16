import Meeting, { Connection } from '../../lib/meeting';
import { MeetingDetail } from '../../types';
import { MessageFormat } from '../../lib/meeting/types';

export interface MeetingState {
    stream?: MediaStream | null;
    connections: Connection[];
    userId?: string;
    started: boolean;
    meetingId: string;
    name: string;
    meeting: Meeting | null;
    meetingDetail: MeetingDetail | null;
    audioEnabled: boolean;
    videoEnabled: boolean;
    messages: MessageFormat[];
}
export const START = '@meeting/start';
export const JOIN = '@meeting/join';
export const JOINED = '@meeting/joined';
export const NEW_CONNECTION = '@meeting/new-connection';
export const LEAVE = '@meeting/leave';
export const USER_LEFT = '@meeting/user-left';
export const END = '@meeting/end';
export const MEETING_ENDED = '@meeting/meeting-ended';
export const VIDEO_TOGGLE = '@meeting/video-toggle';
export const AUDIO_TOGGLE = '@meeting/audio-toggle';
export const CONNECTION_SETTING_CHANGE = '@meeting/connection-setting-change';
export const SEND_MESSAGE = '@meeting/send-message';
export const RECIEVE_MESSAGE = '@meeting/recieve-message';

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
        userId: string;
        name: string;
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
}
export interface UserLeftAction {
    type: typeof USER_LEFT;
    payload: {
        connections: Connection[];
    };
}
export interface EndAction {
    type: typeof END;
}
export interface MeetingEndedAction {
    type: typeof MEETING_ENDED;
}

export interface VideoToggleAction {
    type: typeof VIDEO_TOGGLE;
    payload: {
        videoEnabled: boolean;
    };
}
export interface AudioToggleAction {
    type: typeof AUDIO_TOGGLE;
    payload: {
        audioEnabled: boolean;
    };
}

export interface ConnectionSettingChangeAction {
    type: typeof CONNECTION_SETTING_CHANGE;
}

export interface SendMessageAction {
    type: typeof SEND_MESSAGE;
    payload: {
        message: MessageFormat;
    };
}
export interface RecieveMessageAction {
    type: typeof RECIEVE_MESSAGE;
    payload: {
        message: MessageFormat;
    };
}
export type MeetingAction =
    | StartAction
    | JoinAction
    | JoinedAction
    | NewConnectionAction
    | LeaveAction
    | UserLeftAction
    | EndAction
    | MeetingEndedAction
    | VideoToggleAction
    | AudioToggleAction
    | ConnectionSettingChangeAction
    | SendMessageAction
    | RecieveMessageAction;
