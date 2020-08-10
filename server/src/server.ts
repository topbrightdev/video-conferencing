import express from 'express';
import http from 'http';
import { initMeetingServer } from './lib/meeting-server';

const PORT = 8081;
const app = express();
const server = http.createServer(app);

initMeetingServer(server);

app.get('/echo', (req, res) => {
    res.send('Echo From server');
});

app.get('/start-meeting', (req, res) => {
    const {
        params: { id },
    } = req;
    res.send({ meetingId: id });
});
server.listen(PORT, () => {
    console.log(`Server started at port : ${PORT}`);
});
