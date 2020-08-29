export type IncomingMessageType =
    | 'joined-meeting'
    | 'user-joined'
    | 'connection-request'
    | 'offer-sdp'
    | 'answer-sdp'
    | 'icecandidate'
    | 'meeting-ended'
    | 'user-left'
    | 'video-toggle'
    | 'audio-toggle'
    | 'message'
    | 'not-found'
    | 'unknown';
export type OutgoingMessageType =
    | 'join-meeting'
    | 'connection-request'
    | 'icecandidate'
    | 'offer-sdp'
    | 'answer-sdp'
    | 'leave-meeting'
    | 'end-meeting'
    | 'video-toggle'
    | 'audio-toggle'
    | 'message'
    | 'heartbeat'
    | 'unknown';
export type MessageType = IncomingMessageType | OutgoingMessageType;

export interface MessagePayload {
    type: MessageType;
    data?: any;
}
export interface JoinedMeetingData {
    userId: string;
    name: string;
}
export interface UserJoinedData {
    userId: string;
    name: string;
    config: {
        videoEnabled: boolean;
        audioEnabled: boolean;
    };
}
export interface IncomingConnectionRequestData {
    userId: string;
    name: string;
    config: {
        videoEnabled: boolean;
        audioEnabled: boolean;
    };
}
export interface OfferSdpData {
    userId: string;
    name: string;
    sdp: any;
}
export interface AnswerSdpData {
    userId: string;
    name: string;
    sdp: any;
}
export interface MeetingEndedData {
    userId: string;
    name: string;
}
export interface UserLeftData {
    userId: string;
    name: string;
}
export interface IceCandidateData {
    userId: string;
    name: string;
    candidate: any;
}

export interface VideoToggleData {
    userId: string;
    videoEnabled: boolean;
}
export interface AudioToggleData {
    userId: string;
    audioEnabled: boolean;
}

export interface MessageFormat {
    userId: string;
    text: string;
}

export interface MessageData {
    userId: string;
    message: MessageFormat;
}
