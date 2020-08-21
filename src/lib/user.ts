import { v4 as uuidV4 } from 'uuid';

export function loadUserId(): string {
    const userId = localStorage.getItem('userId') || uuidV4();
    localStorage.setItem('userId', userId);
    return userId;
}

export function loadUserName(): string {
    return localStorage.getItem('name') || '';
}
