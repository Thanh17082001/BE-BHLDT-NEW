 import { v4 as uuidv4 } from 'uuid';

export function privateFileName(name: string) {
    return `${ uuidv4() }_${ name }`;
}