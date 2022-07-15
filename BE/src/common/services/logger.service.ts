import { LoggerService } from '@nestjs/common';
import * as chalk from 'chalk';
import * as winston from 'winston';

function toString(data: any): string {
  if (data === undefined) {
    return '<undefined>';
  }
  if (data === null) {
    return '<null>';
  }
  if (data.stack) {
    return data.stack;
  }
  return JSON.stringify(data);
}

const nestLikeConsoleFormat = () =>
  winston.format.printf(({ context, level, timestamp, message, ...meta }) => {
    let metaString = '';

    if (meta) {
      metaString = Object.values(meta)
        .map((item) => `${toString(item)}`)
        .join(' ');
    }

    let levelString = chalk.yellow(level.toUpperCase());
    let messageString = chalk.green(message);
    if (level === 'error') {
      levelString = chalk.red(level.toUpperCase());
      messageString = chalk.red(message);
    }
    const dateString = new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    return (
      `[${levelString}] ` +
      ('undefined' !== typeof timestamp ? `${dateString}\t` : '') +
      ('undefined' !== typeof context
        ? `${chalk.yellow('[' + context + ']')} `
        : '') +
      `${messageString}` +
      (metaString ? ` - ${metaString}` : '')
    );
  });

export interface AppLoggerService extends LoggerService {
  log(message: string, ...meta: any[]): void;
  debug(message: string, ...meta: any[]): void;
  error(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  verbose(message: string, ...meta: any[]): void;
}

class AppLogger implements AppLoggerService {
  private readonly logger: winston.Logger;
  constructor(private context: string, logLevel: string) {
    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          level: 'silly',
          format: nestLikeConsoleFormat(),
        }),
      ],
    });
  }
  log(message: string, ...meta: any[]): void {
    this.winstonLog('info', message, ...meta);
  }
  debug(message: string, ...meta: any[]): void {
    this.winstonLog('debug', message, ...meta);
  }
  error(message: string, ...meta: any[]): void {
    this.winstonLog('error', message, ...meta);
  }
  warn(message: string, ...meta: any[]): void {
    this.winstonLog('warn', message, ...meta);
  }
  verbose(message: string, ...meta: any[]): void {
    this.winstonLog('verbose', message, ...meta);
  }

  private winstonLog(level: string, message: string, ...meta: any[]) {
    const currentDate = new Date();
    this.logger.log(level, message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
      ...meta,
    });
  }
}

export class LoggerFactory {
  static LogLevel = 'silly';
  static create(context: string): AppLoggerService {
    return new AppLogger(context, LoggerFactory.LogLevel);
  }
}

export const logger = LoggerFactory.create('App');
