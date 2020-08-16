import Rtp from './rtp';

type ConnectionType = 'incoming' | 'outgoing';

interface ConnectionOptions {
    userId: string;
    connectionType: ConnectionType;
    name: string;
    stream: MediaStream;
}

export default class Connection extends Rtp {
    userId: string;
    connectionType: ConnectionType;
    name: string;
    videoEnabled: boolean = true;
    audioEnabled: boolean = true;
    constructor(options: ConnectionOptions) {
        super({ stream: options.stream });
        this.userId = options.userId;
        this.connectionType = options.connectionType;
        this.name = options.name;
    }
    
    toggleVideo(videoEnabled: boolean) {
        this.videoEnabled = videoEnabled;
    }

    toggleAudio(audioEnabled: boolean) {
        this.audioEnabled = audioEnabled;
    }
}
