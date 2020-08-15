import { Router } from 'express';
import { v4 as uuidV4 } from 'uuid';

const router = Router();
interface StartMeetingRequestBody {
    [name: string]: string;
}
interface StartMeetingResponseBody {
    [meetingId: string]: string;
}
router.post<null, StartMeetingResponseBody, StartMeetingRequestBody>('/start', (req, res) => {
    const { name } = req.body;
    console.log(`starting meeting with name - ${name}`);
    res.send({ meetingId: uuidV4() });
});

export default router;
