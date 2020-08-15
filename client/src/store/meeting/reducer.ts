import {
    MeetingState,
    MeetingAction,
    START,
    JOIN,
    JOINED,
    LEAVE,
    END,
} from './types';

const initialState: MeetingState = {
    stream: null,
    connections: [],
    userId: '',
    started: false,
    meetingId: '',
    name: '',
};

export default function meetingReducer(state = initialState, action: MeetingAction) {
    switch (action.type) {
        case START:
            return {
                ...state,
                started: true,
                meetingId: action.payload.meetingId,
                name: action.payload.name,
            };
        case JOIN:
            return { ...state };
        case JOINED:
            return { ...state };
        case LEAVE:
            return { ...state };
        case END:
            return { ...state };
        default:
            return { ...state };
    }
}
