import { EventEmitter } from 'events';

const configuration: RTCConfiguration = {
    iceServers: [
        {
            urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
        },
    ],
};
interface RtpOptions {
    stream: MediaStream;
}
export default class Rtp extends EventEmitter {
    rtcPeerConnection: RTCPeerConnection | null = null;
    remoteStream: MediaStream | null = null;
    localStream: MediaStream | null = null;

    constructor(options: RtpOptions) {
        super();
        this.localStream = options.stream;
    }

    start() {
        this.rtcPeerConnection = new RTCPeerConnection(configuration);
        this.addTrack();
        this.listenRemoteTrack();
        this.listenCandidate();
        this.emit('connected');
    }

    addTrack() {
        this.localStream?.getTracks().forEach((track) => {
            this.rtcPeerConnection?.addTrack(track);
        });
    }

    listenRemoteTrack() {
        this.remoteStream = new MediaStream();
        this.rtcPeerConnection?.addEventListener('track', (event: RTCTrackEvent) => {
            this.remoteStream?.addTrack(event.track);
        });
    }

    listenCandidate() {
        this.rtcPeerConnection?.addEventListener(
            'icecandidate',
            (event: RTCPeerConnectionIceEvent) => {
                if (event.candidate) {
                    this.emit('icecandidate', event.candidate);
                }
            },
        );
    }

    async createOffer(): Promise<RTCSessionDescription | undefined> {
        const offerSessionDescInit = await this.rtcPeerConnection?.createOffer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true,
        });
        if (offerSessionDescInit) {
            const offerSdp = new RTCSessionDescription(offerSessionDescInit);
            if (offerSdp) {
                await this.rtcPeerConnection?.setLocalDescription(offerSdp);
            }
            return offerSdp;
        }
    }

    async createAnswer(offerSdp: any): Promise<RTCSessionDescription | undefined> {
        if (offerSdp) {
            await this.rtcPeerConnection?.setRemoteDescription(new RTCSessionDescription(offerSdp));
        }

        const answerSessionDescInit = await this.rtcPeerConnection?.createAnswer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true,
        });

        if (answerSessionDescInit) {
            const answerSdp = new RTCSessionDescription(answerSessionDescInit);

            if (answerSdp) {
                await this.rtcPeerConnection?.setLocalDescription(answerSdp);
            }

            return answerSdp;
        }
    }

    async setAnswerSdp(answerSdp: any) {
        if (answerSdp) {
            await this.rtcPeerConnection?.setRemoteDescription(
                new RTCSessionDescription(answerSdp),
            );
        }
    }
    
    async setIceCandidate(candidate: any) {
        await this.rtcPeerConnection?.addIceCandidate(candidate);
    }
}
