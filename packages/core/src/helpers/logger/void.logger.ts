import {AbstractLogger, LogLevel} from "./logger";

export class VoidLogger extends AbstractLogger {
    constructor() {
        super();
    }
    logKeyValue(key: string, value: any): void {}
    log(level: LogLevel, message: string): void;
    log(level: LogLevel, tag: string, message: string): void;
    log(level: LogLevel, tagOrMessage: string, message?: string): void { }
}
