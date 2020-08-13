import Rtp from './Rtp';

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
    constructor(options: ConnectionOptions) {
        super({ stream: options.stream });
        this.userId = options.userId;
        this.connectionType = options.connectionType;
        this.name = options.name;
    }
}
