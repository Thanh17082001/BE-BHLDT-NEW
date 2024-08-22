import * as path from 'path';

export function cutFilePath(fullPath: string, cutPath): string{
    return path.relative(cutPath, fullPath);
}