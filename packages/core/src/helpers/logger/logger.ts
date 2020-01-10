export enum LogLevel {
    Trace,
    Debug,
    Info,
    Warning,
    Error,
    Fatal,
}

export class UnknownLogLevelError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "Unknown Log Level";
    }
}

export interface Logger {
    logKeyValue(key: string, value: any): void;

    log(level: LogLevel, message: string): void;
    log(level: LogLevel, tag: string, message: string): void;

    trace(message: string): void;
    trace(tag: string, message: string): void;

    debug(message: string): void;
    debug(tag: string, message: string): void;

    info(message: string): void;
    info(tag: string, message: string): void;

    warning(message: string): void;
    warning(tag: string, message: string): void;

    error(message: string): void;
    error(tag: string, message: string): void;

    fatal(message: string): void;
    fatal(tag: string, message: string): void;
}

export abstract class AbstractLogger implements Logger {
    abstract logKeyValue(key: string, value: any): void;

    abstract log(level: LogLevel, message: string): void;
    abstract log(level: LogLevel, tag: string, message: string): void;

    protected _log(level: LogLevel, tagOrMessage: string, message?: string): void {
        if (message) {
            this.log(level, tagOrMessage, message);
        } else {
            this.log(level, tagOrMessage);
        }
    }

    trace(message: string): void;
    trace(tag: string, message: string): void;
    trace(tagOrMessage: string, message?: string): void {
        this._log(LogLevel.Trace, tagOrMessage, message);
    }

    debug(message: string): void;
    debug(tag: string, message: string): void;
    debug(tagOrMessage: string, message?: string): void {
        this._log(LogLevel.Debug, tagOrMessage, message);
    }

    info(message: string): void;
    info(tag: string, message: string): void;
    info(tagOrMessage: string, message?: string): void {
        this._log(LogLevel.Info, tagOrMessage, message);
    }

    warning(message: string): void;
    warning(tag: string, message: string): void;
    warning(tagOrMessage: string, message?: string): void {
        this._log(LogLevel.Warning, tagOrMessage, message);
    }

    error(message: string): void;
    error(tag: string, message: string): void;
    error(tagOrMessage: string, message?: string): void {
        this._log(LogLevel.Error, tagOrMessage, message);
    }

    fatal(message: string): void;
    fatal(tag: string, message: string): void;
    fatal(tagOrMessage: string, message?: string): void {
        this._log(LogLevel.Fatal, tagOrMessage, message);
    }
}
