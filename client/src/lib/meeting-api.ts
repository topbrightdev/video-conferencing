import axios from 'axios';
import { loadUser } from './user';

const MeetingApi = axios.create({ baseURL: 'http://localhost:8081/meeting' });

interface StartResponse {
    meetingId: string;
}
export const start = async (name: string): Promise<StartResponse> => {
    const response = await MeetingApi.post<StartResponse>('/start', { name, userId: loadUser() });

    return response.data;
};
