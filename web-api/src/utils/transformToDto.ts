import { plainToInstance } from 'class-transformer';


export function transformToDto<T>(cls: new () => T, plain: any | any[]): T | T[] {
    if (Array.isArray(plain)) {
        return plain.map(item => plainToInstance(cls, item, { excludeExtraneousValues: true })) as T[];
    } else {
        return plainToInstance(cls, plain, { excludeExtraneousValues: true }) as T;
    }
}