import { v4 as uuidV4 } from 'uuid';

export function loadUser(): string {
    const userId = localStorage.getItem('userId') || uuidV4();
    localStorage.setItem('userId', userId);
    return userId;
}
