import { AbstractLogger, LogLevel } from './logger';

export class VoidLogger extends AbstractLogger {
    constructor() {
        super();
    }

    logKeyValue(_key: string, _value: unknown): void {
        return;
    }

    log(level: LogLevel, message: string): void;
    log(level: LogLevel, tag: string, message: string): void;
    log(_level: LogLevel, _tagOrMessage: string, _message?: string): void {
        return;
    }
}
