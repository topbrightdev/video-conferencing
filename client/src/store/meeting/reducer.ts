import {
    MeetingState,
    MeetingAction,
    START,
    JOIN,
    JOINED,
    LEAVE,
    END,
    NEW_CONNECTION,
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
            };
        case JOINED:
            return { ...state };
        case NEW_CONNECTION:
            return {
                ...state,
                connections: [...state.connections, action.payload.connection],
            };
        case LEAVE:
            return { ...state };
        case END:
            return { ...state };
        default:
            return { ...state };
    }
}
