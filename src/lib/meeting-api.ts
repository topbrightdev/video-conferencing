import axios from 'axios';
import { loadUserId } from './user';

const MeetingApi = axios.create({ baseURL: `${process.env.REACT_APP_API_URL}/meeting` });

interface StartResponse {
    meetingId: string;
}
export const start = async (name: string): Promise<StartResponse> => {
    const response = await MeetingApi.post<StartResponse>('/start', { name, userId: loadUserId() });

    return response.data;
};

interface JoinResponse {
    id: string;
    hostId: string;
    hostName: string;
}
export const join = async (meetingId: string): Promise<JoinResponse> => {
    const response = await MeetingApi.get(`/join?meetingId=${meetingId}`);
    return response.data;
};
