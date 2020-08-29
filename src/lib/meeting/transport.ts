import { EventEmitter } from 'events';

interface TransportOptions {
    url: string;
    canReconnect: boolean;
    maxRetry: number;
}

export default class Transport extends EventEmitter {
    socket: WebSocket | null = null;
    url: string;
    canReconnect: boolean = false;
    retryCount: number = 0;
    maxRetry: number = 1;
    readyState: number = WebSocket.CLOSED;
    timer: any = null;
    closed: boolean = false;

    constructor(options: TransportOptions) {
        super();
        this.url = options.url;
        this.canReconnect = options.canReconnect;
        this.maxRetry = options.maxRetry;
        this.connect();
    }

    connect() {
        if (this.retryCount <= this.maxRetry) {
            this.socket = new WebSocket(this.url);
            this.readyState = WebSocket.CONNECTING;
            this.retryCount++;
            this.listenEvents();
        } else {
            this.emit('failed');
        }
    }

    listenEvents() {
        this.socket?.addEventListener('open', () => this.handleOpen());
        this.socket?.addEventListener('message', (event: MessageEvent) =>
            this.handleMessage(event),
        );
        this.socket?.addEventListener('close', () => this.handleClose());
        this.socket?.addEventListener('error', (error) => this.handleError(error));
    }

    removeEvents() {
        this.socket?.removeEventListener('open', () => this.handleOpen());
        this.socket?.removeEventListener('message', (event: MessageEvent) =>
            this.handleMessage(event),
        );
        this.socket?.removeEventListener('close', () => this.handleClose());
        this.socket?.removeEventListener('error', (error) => this.handleError(error));
    }

    handleOpen() {
        this.readyState = WebSocket.OPEN;
        this.sendHeartBeat();
        this.emit('open');
    }

    handleMessage(event: MessageEvent) {
        const { data } = event;
        this.emit('message', data);
    }

    handleClose() {
        this.reset();
        if (!this.closed) {
            this.connect();
        }
    }

    handleError(error: any) {
        this.reset();
        if (!this.closed) {
            this.connect();
        }
    }

    reset() {
        clearInterval(this.timer);
        this.timer = null;
        this.removeEvents();
        this.readyState = WebSocket.CLOSED;
    }

    send(message: string) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        }
    }
    sendHeartBeat() {
        this.timer = setInterval(() => {
            this.send(JSON.stringify({ type: 'heartbeat' }));
        }, 10 * 1000);
    }
    close() {
        this.closed = true;
        this.destroy();
    }
    destroy() {
        this.reset();
        this.socket?.close();
        this.socket = null;
        this.url = '';
    }
    reconnect() {
        this.retryCount = 0;
        this.connect();
    }
}
