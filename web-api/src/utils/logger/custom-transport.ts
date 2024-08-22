import * as fs from 'fs';
import * as split from 'split2';
import * as path from 'path';

const levelMap: Record<number, string> = {
  60: 'fatal',
  50: 'error',
  40: 'warn',
  30: 'info',
  20: 'debug',
  10: 'trace',
};

interface TransportOptions {
  targets: Record<number, string>;
}

export default (options: TransportOptions) => {
  const streams = Object.entries(options.targets).reduce((acc, [level, filepath]) => {
    const fullPath = path.resolve(filepath);
    acc[levelMap[parseInt(level, 10)]] = fs.createWriteStream(fullPath, { flags: 'a' });
    return acc;
  }, {} as Record<string, fs.WriteStream>);

  return split((line: string) => {
    try {
      const log = JSON.parse(line);
      const stream = streams[levelMap[log.level]];
      if (stream) {
        stream.write(line + '\n');
      }
    } catch (err) {
      console.error('Error parsing log line:', err);
    }
  });
};
