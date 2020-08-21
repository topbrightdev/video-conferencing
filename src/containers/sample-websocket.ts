let userId = '';
interface MessagePayload {
    type:
        | 'join-meeting'
        | 'joined-meeting'
        | 'user-joined'
        | 'connection-request'
        | 'incoming-connection-request'
        | 'offer-sdp'
        | 'answer-sdp'
        | 'leave-meeting'
        | 'end-meeting'
        | 'user-left'
        | 'meeting-ended';
    data?: any;
}
const ws = new WebSocket('ws://localhost:8081/websocket/meeting?id=100');
function sendMessage(message: MessagePayload) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    }
}
ws.addEventListener('open', () => {
    console.log('open');
    sendMessage({ type: 'join-meeting' });
});
ws.addEventListener('message', (event) => {
    try {
        const payload: MessagePayload = JSON.parse(event.data);
        switch (payload.type) {
            case 'joined-meeting':
                alert('joined meeting');
                userId = payload.data?.userId;
                break;
            case 'user-joined':
                alert(`User joined - ${payload.data?.userId}`);
                sendMessage({
                    type: 'connection-request',
                    data: {
                        userId: userId,
                        otherUserId: payload.data?.userId,
                    },
                });
                break;
            case 'incoming-connection-request':
                sendMessage({
                    type: 'offer-sdp',
                    data: {
                        sdp: '',
                        userId: userId,
                        otherUserId: payload.data?.userId,
                    },
                });
                break;
            case 'offer-sdp':
                alert(`Offer SDP ${payload.data?.sdp}`);
                sendMessage({
                    type: 'answer-sdp',
                    data: {
                        sdp: '',
                        userId: userId,
                        otherUserId: payload.data?.userId,
                    },
                });
                break;
            case 'answer-sdp':
                alert(`answer SDP ${payload.data?.sdp}`);
                break;
            case 'meeting-ended':
                alert('meeting ended');
                break;
            case 'user-left':
                alert(`User left - ${payload.data?.userId}`);
                break;
            default:
                break;
        }
    } catch (err) {}
});
ws.addEventListener('close', () => {});
export function endMeeting() {
    sendMessage({
        type: 'end-meeting',
        data: {
            userId,
        },
    });
}
export function leaveMeeting() {
    sendMessage({
        type: 'leave-meeting',
        data: {
            userId,
        },
    });
}
