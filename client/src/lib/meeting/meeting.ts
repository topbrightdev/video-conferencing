import { EventEmitter } from 'events';
import Transport from './transport';
import Connection from './connection';

const url = 'ws://localhost:8081/websocket/meeting';

type IncomingMessageType =
    | 'joined-meeting'
    | 'user-joined'
    | 'incoming-connection-request'
    | 'offer-sdp'
    | 'answer-sdp'
    | 'icecandidate'
    | 'meeting-ended'
    | 'user-left'
    | 'unknown';
type OutgoingMessageType =
    | 'join-meeting'
    | 'connection-request'
    | 'icecandidate'
    | 'offer-sdp'
    | 'answer-sdp'
    | 'leave-meeting'
    | 'end-meeting'
    | 'unknown';
type MessageType = IncomingMessageType | OutgoingMessageType;

interface MessagePayload {
    type: MessageType;
    data?: any;
}
type SendMessageType = OutgoingMessageType;
interface UserJoinedData {
    userId: string;
    name: string;
    sdp: any;
}
interface IceCandidateData {
    userId: string;
    name: string;
    candidate: any;
}
interface PayloadDataMap {
    'joined-meeting': UserJoinedData;
    'user-joined': UserJoinedData;
    'incoming-connection-request': UserJoinedData;
    'offer-sdp': UserJoinedData;
    'answer-sdp': UserJoinedData;
    'meeting-ended': UserJoinedData;
    'user-left': UserJoinedData;
    icecandidate: IceCandidateData;
    unknown: UserJoinedData;
}
interface MeetingOptions {
    meetingId: string;
    stream: MediaStream;
}
export default class Meeting extends EventEmitter {
    transport: Transport | null;
    meetingId: string;
    connections: Connection[] = [];
    joined: boolean = false;
    connected: boolean = false;
    stream: MediaStream | null = null;
    userId: string | null = null;
    name: string = '';

    constructor(options: MeetingOptions) {
        super();
        this.meetingId = options.meetingId;
        this.transport = new Transport({
            url: this.formatUrl(options.meetingId),
            reconnect: true,
            maxRetry: 3,
        });
        this.stream = options.stream;
        this.listenMessage();
    }

    formatUrl(id: string) {
        return `${url}?id=${id}`;
    }

    parseMessage(data: any): MessagePayload {
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
        return {
            type: 'unknown',
        };
    }
    sendMessage(type: SendMessageType, data: any) {
        try {
            const payload = JSON.stringify({
                type,
                data,
            });
            this.transport?.send(payload);
        } catch (error) {}
    }
    listenMessage() {
        this.transport?.on('open', () => {
            this.connected = true;
            this.join();
        });
        this.transport?.on('message', (data: any) => {
            const payload = this.parseMessage(data);
            this.handleMessage(payload);
        });
        this.transport?.on('closed', () => {
            this.connected = false;
        });
    }

    handleMessage(payload: MessagePayload) {
        const messagType = payload.type as IncomingMessageType;
        switch (messagType) {
            case 'joined-meeting':
                this.joinedMeeting(payload.data);
                break;
            case 'user-joined':
                this.userJoined(payload.data);
                break;
            case 'incoming-connection-request':
                this.incomingConnectionRequest(payload.data);
                break;
            case 'offer-sdp':
                this.recieveOfferSdp(payload.data);
                break;
            case 'answer-sdp':
                this.recieveAnswerSdp(payload.data);
                break;
            case 'user-left':
                this.userLeft(payload.data);
                break;
            case 'meeting-ended':
                this.meetingEnded(payload.data);
                break;
            case 'icecandidate':
                this.setIceCandidate(payload.data);
                break;
            default:
                break;
        }
    }
    getConnection(userId: string): Connection | undefined {
        return this.connections.find((con) => con.userId === userId);
    }

    join() {
        this.sendMessage('join-meeting', { name: this.name });
    }

    joinedMeeting(data: PayloadDataMap['joined-meeting']) {
        this.joined = true;
        this.userId = data.userId;
    }

    createConnection(
        data: PayloadDataMap['user-joined'] | PayloadDataMap['incoming-connection-request'],
    ): Connection | undefined {
        if (this.stream) {
            const connection = new Connection({
                connectionType: 'incoming',
                userId: data.userId,
                name: data.name,
                stream: this.stream,
            });
            connection.on('connected', () => {
                alert('rtp connected');
            });
            connection.start();
            connection.on('icecandidate', (candidate) => {
                this.sendIceCandidate(connection.userId, candidate);
            });
            this.connections.push(connection);
            return connection;
        }
        return undefined;
    }
    userJoined(data: PayloadDataMap['user-joined']) {
        const connection = this.createConnection(data);
        if (connection) {
            this.requestConnection(connection.userId);
        }
    }

    sendIceCandidate(otherUserId: string, candidate: any) {
        this.sendMessage('icecandidate', {
            userId: this.userId,
            otherUserId,
            candidate,
        });
    }
    requestConnection(userId: string) {
        this.sendMessage('connection-request', {
            userId: this.userId,
            otherUserId: userId,
        });
    }

    incomingConnectionRequest(data: PayloadDataMap['incoming-connection-request']) {
        const connection = this.createConnection(data);
        if (connection) {
            this.sendOfferSdp(data.userId);
        }
    }

    async sendOfferSdp(otherUserId: string) {
        const connection = this.getConnection(otherUserId);
        const sdp = await connection?.createOffer();
        this.sendMessage('offer-sdp', {
            userId: this.userId,
            otherUserId,
            sdp,
        });
    }

    async recieveOfferSdp(data: PayloadDataMap['offer-sdp']) {
        this.sendAnswerSdp(data.userId, data.sdp);
    }

    async sendAnswerSdp(otherUserId: string, sdp: any) {
        const connection = this.getConnection(otherUserId);
        if (connection) {
            const answerSdp = await connection?.createAnswer(sdp);
            this.sendMessage('answer-sdp', {
                userId: this.userId,
                otherUserId: otherUserId,
                sdp: answerSdp,
            });
        }
    }

    async recieveAnswerSdp(data: PayloadDataMap['answer-sdp']) {
        const connection = this.getConnection(data.userId);
        await connection?.setAnswerSdp(data.sdp);
    }

    async setIceCandidate(data:PayloadDataMap['icecandidate']){
        const connection = this.getConnection(data.userId);
        await connection?.setIceCandidate(data.candidate);
    }

    userLeft(data: PayloadDataMap['user-left']) {
        this.connections = this.connections.filter((conn) => conn.userId !== data.userId);
    }

    meetingEnded(data: PayloadDataMap['meeting-ended']) {
        this.emit('ended');
        this.destroy();
    }

    end() {
        this.sendMessage('end-meeting', {
            userId: this.userId,
        });
        this.destroy();
    }

    leave() {
        this.sendMessage('leave-meeting', { userId: this.userId });
        this.destroy();
    }

    destroy() {
        this.transport = null;
        this.connections = [];
        this.connected = false;
        this.stream = null;
        this.joined = false;
    }
}
