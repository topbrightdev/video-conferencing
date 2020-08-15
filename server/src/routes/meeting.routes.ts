import { Router } from 'express';
import { startMeeting } from '../lib/meeting-server';

const router = Router();
interface StartMeetingRequestBody {
    [key: string]: string;
}
interface StartMeetingResponseBody {
    [meetingId: string]: string;
}
router.post<null, StartMeetingResponseBody, StartMeetingRequestBody>('/start', async (req, res) => {
    const { name, userId } = req.body;
    const meetingId = await startMeeting({ name, userId });
    res.send({ meetingId });
});

export default router;
