import {
    MeetingState,
    MeetingAction,
    START,
    JOIN,
    JOINED,
    LEAVE,
    END,
    NEW_CONNECTION,
    USER_LEFT,
    MEETING_ENDED,
    VIDEO_TOGGLE,
    AUDIO_TOGGLE,
    CONNECTION_SETTING_CHANGE,
    SEND_MESSAGE,
    RECIEVE_MESSAGE,
} from './types';

const initialState: MeetingState = {
    stream: null,
    connections: [],
    userId: '',
    started: false,
    meetingId: '',
    name: '',
    meeting: null,
    meetingDetail: null,
    videoEnabled: true,
    audioEnabled: true,
    messages: [],
};

export default function meetingReducer(state = initialState, action: MeetingAction): MeetingState {
    switch (action.type) {
        case START:
            return {
                ...state,
                started: true,
                meetingId: action.payload.meetingId,
                name: action.payload.name,
            };
        case JOIN:
            return {
                ...state,
                meeting: action.payload.meeting,
                meetingDetail: action.payload.meetingDetail,
                stream: action.payload.stream,
                userId: action.payload.userId,
                name: action.payload.name,
            };
        case JOINED:
            return { ...state };
        case NEW_CONNECTION:
            return {
                ...state,
                connections: [...state.connections, action.payload.connection],
            };
        case USER_LEFT:
            return { ...state, connections: [...action.payload.connections] };
        case LEAVE:
        case END:
        case MEETING_ENDED:
            return { ...state, ...initialState, connections: [] };
        case VIDEO_TOGGLE:
            return { ...state, videoEnabled: action.payload.videoEnabled };
        case AUDIO_TOGGLE:
            return { ...state, audioEnabled: action.payload.audioEnabled };
        case CONNECTION_SETTING_CHANGE:
            return { ...state, connections: [...state.connections] };
        case SEND_MESSAGE:
        case RECIEVE_MESSAGE:
            return { ...state, messages: [...state.messages, action.payload.message] };
        default:
            return { ...state };
    }
}
