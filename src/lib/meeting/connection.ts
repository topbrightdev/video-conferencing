import PeerConnection from './peer-connection';

type ConnectionType = 'incoming' | 'outgoing' | 'self';

interface ConnectionOptions {
    userId: string;
    connectionType: ConnectionType;
    name: string;
    stream: MediaStream;
    videoEnabled: boolean;
    audioEnabled: boolean;
    muted?: boolean;
}

export default class Connection extends PeerConnection {
    userId: string;
    connectionType: ConnectionType;
    name: string;
    videoEnabled: boolean = true;
    audioEnabled: boolean = true;
    muted: boolean = false;

    constructor(options: ConnectionOptions) {
        super({ stream: options.stream });
        this.userId = options.userId;
        this.connectionType = options.connectionType;
        this.name = options.name;
        this.audioEnabled = options.audioEnabled;
        this.videoEnabled = options.videoEnabled;
        this.muted = !!options.muted;
    }

    toggleVideo(videoEnabled: boolean) {
        this.videoEnabled = videoEnabled;
    }

    toggleAudio(audioEnabled: boolean) {
        this.audioEnabled = audioEnabled;
    }
}
