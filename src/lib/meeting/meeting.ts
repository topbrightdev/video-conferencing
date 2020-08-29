import { EventEmitter } from 'events';
import Transport from './transport';
import Connection from './connection';
import {
    MessagePayload,
    OutgoingMessageType,
    IncomingMessageType,
    UserJoinedData,
    IncomingConnectionRequestData,
    OfferSdpData,
    AnswerSdpData,
    IceCandidateData,
    UserLeftData,
    MeetingEndedData,
    JoinedMeetingData,
    VideoToggleData,
    AudioToggleData,
    MessageFormat,
    MessageData,
} from './types';

const url = `${process.env.REACT_APP_WS_URL}/meeting`;

interface MeetingOptions {
    meetingId: string;
    stream: MediaStream;
    userId: string;
    name: string;
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
    messages: MessageFormat[] = [];
    videoEnabled: boolean = true;
    audioEnabled: boolean = true;

    constructor(options: MeetingOptions) {
        super();
        this.meetingId = options.meetingId;
        this.userId = options.userId;
        this.name = options.name;
        this.transport = new Transport({
            url: this.formatUrl(options.meetingId),
            canReconnect: true,
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
    sendMessage(type: OutgoingMessageType, data: any) {
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
            this.emit('open');
        });
        this.transport?.on('message', (data: any) => {
            const payload = this.parseMessage(data);
            this.handleMessage(payload);
        });
        this.transport?.on('closed', () => {
            this.connected = false;
        });
        this.transport?.on('failed', () => {
            this.reset();
            this.emit('failed');
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
            case 'connection-request':
                this.recievedConnectionRequest(payload.data);
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
            case 'video-toggle':
                this.listenVideoToggle(payload.data);
                break;
            case 'audio-toggle':
                this.listenAudioToggle(payload.data);
                break;
            case 'message':
                this.handleUserMessage(payload.data);
                break;
            case 'not-found':
                this.handleNotFound();
                break;
            default:
                break;
        }
    }
    getConnection(userId: string): Connection | undefined {
        return this.connections.find((con) => con.userId === userId);
    }

    join() {
        this.sendMessage('join-meeting', {
            name: this.name,
            userId: this.userId,
            config: {
                audioEnabled: this.audioEnabled,
                videoEnabled: this.videoEnabled,
            },
        });
    }

    joinedMeeting(data: JoinedMeetingData) {
        this.joined = true;
        this.userId = data.userId;
    }

    createConnection(data: UserJoinedData | IncomingConnectionRequestData): Connection | undefined {
        if (this.stream) {
            const connection = new Connection({
                connectionType: 'incoming',
                userId: data.userId,
                name: data.name,
                stream: this.stream,
                audioEnabled: data.config?.audioEnabled,
                videoEnabled: data.config?.videoEnabled,
            });
            connection.on('connected', () => {
                console.log('rtp connected');
            });
            connection.start();
            connection.on('icecandidate', (candidate) => {
                this.sendIceCandidate(connection.userId, candidate);
            });
            this.connections.push(connection);

            this.emit('connection', connection);
            return connection;
        }
        return undefined;
    }
    userJoined(data: UserJoinedData) {
        const connection = this.createConnection(data);
        if (connection) {
            this.sendConnectionRequest(connection.userId);
        }
    }

    sendIceCandidate(otherUserId: string, candidate: any) {
        this.sendMessage('icecandidate', {
            userId: this.userId,
            otherUserId,
            candidate,
        });
    }

    sendConnectionRequest(userId: string) {
        this.sendMessage('connection-request', {
            userId: this.userId,
            otherUserId: userId,
            name: this.name,
            config: {
                videoEnabled: this.videoEnabled,
                audioEnabled: this.audioEnabled,
            },
        });
    }

    recievedConnectionRequest(data: IncomingConnectionRequestData) {
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

    async recieveOfferSdp(data: OfferSdpData) {
        this.sendAnswerSdp(data.userId, data.sdp);
    }

    async sendAnswerSdp(otherUserId: string, sdp: any) {
        const connection = this.getConnection(otherUserId);
        if (connection) {
            await connection?.setOfferSdp(sdp);
            const answerSdp = await connection?.createAnswer();
            this.sendMessage('answer-sdp', {
                userId: this.userId,
                otherUserId: otherUserId,
                sdp: answerSdp,
            });
        }
    }

    async recieveAnswerSdp(data: AnswerSdpData) {
        const connection = this.getConnection(data.userId);
        await connection?.setAnswerSdp(data.sdp);
    }

    async setIceCandidate(data: IceCandidateData) {
        const connection = this.getConnection(data.userId);
        await connection?.setIceCandidate(data.candidate);
    }

    userLeft(data: UserLeftData) {
        const connection = this.getConnection(data.userId);
        this.emit('user-left', connection);
        connection?.close();
        this.connections = this.connections.filter((conn) => conn.userId !== data.userId);
    }

    meetingEnded(data: MeetingEndedData) {
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

    toggleVideo(): boolean {
        const videoTrack = this.stream?.getVideoTracks()[0];
        if (videoTrack) {
            const videoEnabled = (videoTrack.enabled = !videoTrack.enabled);
            this.videoEnabled = videoEnabled;
            this.sendMessage('video-toggle', {
                userId: this.userId,
                videoEnabled,
            });
            return videoEnabled;
        }
        return false;
    }
    toggleAudio(): boolean {
        const audioTrack = this.stream?.getAudioTracks()[0];
        if (audioTrack) {
            const audioEnabled = (audioTrack.enabled = !audioTrack.enabled);
            this.audioEnabled = audioEnabled;
            this.sendMessage('audio-toggle', {
                userId: this.userId,
                audioEnabled,
            });
            return audioEnabled;
        }

        return false;
    }
    listenVideoToggle(data: VideoToggleData) {
        const connection = this.getConnection(data.userId);
        connection?.toggleVideo(data.videoEnabled);
        this.emit('connection-setting-changed');
    }
    listenAudioToggle(data: AudioToggleData) {
        const connection = this.getConnection(data.userId);
        connection?.toggleAudio(data.audioEnabled);
        this.emit('connection-setting-changed');
    }

    handleUserMessage(data: MessageData) {
        this.messages.push(data.message);
        this.emit('message', data.message);
    }
    handleNotFound(){
        this.emit('not-found');
    }
    sendUserMessage(text: string) {
        this.sendMessage('message', {
            userId: this.userId,
            message: {
                userId: this.userId,
                text,
            },
        });
    }
    stopStream() {
        this.stream?.getTracks().forEach((track) => track.stop());
    }
    destroy() {
        this.transport?.close();
        this.transport = null;
        this.connections.forEach((connection) => {
            connection.close();
        });
        this.stopStream();
        this.connections = [];
        this.connected = false;
        this.stream = null;
        this.joined = false;
    }
    reset() {
        this.connections = [];
        this.joined = false;
        this.connected = false;
    }
    reconnect() {
        this.transport?.reconnect();
    }
}
