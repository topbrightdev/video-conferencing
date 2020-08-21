import { EventEmitter } from 'events';

interface TransportOptions {
    url: string;
    reconnect: boolean;
    maxRetry: number;
}

export default class Transport extends EventEmitter {
    socket: WebSocket | null = null;
    url: string;
    reconnect: boolean = false;
    retryCount: number = 0;
    maxRetry: number = 1;
    readyState: number = WebSocket.CLOSED;

    constructor(options: TransportOptions) {
        super();
        this.url = options.url;
        this.reconnect = options.reconnect;
        this.maxRetry = options.maxRetry;
        this.connect();
    }
    connect() {
        if (this.retryCount <= this.maxRetry) {
            this.socket = new WebSocket(this.url);
            this.readyState = WebSocket.CONNECTING;
            this.retryCount++;
            this.listenEvents();
        }
    }
    listenEvents() {
        this.socket?.addEventListener('open', () => this.handleOpen());
        this.socket?.addEventListener('message', (event: MessageEvent) =>
            this.handleMessage(event),
        );
        this.socket?.addEventListener('close', () => this.handleClose());
        this.socket?.addEventListener('error', () => this.handleError());
    }
    removeEvents() {
        this.socket?.removeEventListener('open', () => this.handleOpen());
        this.socket?.removeEventListener('message', (event: MessageEvent) =>
            this.handleMessage(event),
        );
        this.socket?.removeEventListener('close', () => this.handleClose());
        this.socket?.removeEventListener('error', () => this.handleError());
    }
    handleOpen() {
        this.readyState = WebSocket.OPEN;
        this.emit('open');
    }
    handleMessage(event: MessageEvent) {
        const { data } = event;
        this.emit('message', data);
    }
    handleClose() {
        this.readyState = WebSocket.CLOSED;
        this.emit('closed');
    }
    handleError() {
        this.readyState = WebSocket.CLOSED;
        this.removeEvents();
        this.connect();
    }

    send(message: string) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        }
    }

    destroy() {
        this.socket?.close();
        this.removeEvents();
    }
}
