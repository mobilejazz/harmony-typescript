import { Logger, LogLevel } from './logger';

export class VoidLogger extends Logger {
    constructor() {
        super();
    }

    public logKeyValue(_key: string, _value: unknown): void {
        return;
    }

    protected createLoggerWithTag(_tag: string): Logger {
        return new VoidLogger();
    }

    protected handleLog(_level: LogLevel, _parameters: unknown[]): void {
        return;
    }
}
