import { EventEmitter } from 'events';
import adapter from 'webrtc-adapter';

console.log(adapter.browserDetails.browser);

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
export default class PeerConnection extends EventEmitter {
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
        this.listenNegotiationNeeded();
        this.listenRemoteTrack();
        this.listenCandidate();
        this.emit('connected');
    }

    addTrack() {
        this.localStream?.getTracks().forEach((track) => {
            this.rtcPeerConnection?.addTrack(track);
        });
    }
    listenNegotiationNeeded() {
        this.rtcPeerConnection?.addEventListener('negotiationneeded', () => {
            console.log('negotiationneeded');
            this.emit('negotiationneeded');
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
    async setOfferSdp(offerSdp: any) {
        if (offerSdp) {
            await this.rtcPeerConnection?.setRemoteDescription(new RTCSessionDescription(offerSdp));
        }
    }
    async createAnswer(): Promise<RTCSessionDescription | undefined> {
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
    close() {
        this.rtcPeerConnection?.close();
        this.remoteStream = null;
        this.localStream = null;
        this.rtcPeerConnection = null;
    }
}
