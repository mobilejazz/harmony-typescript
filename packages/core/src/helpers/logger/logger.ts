import { Type } from '../types';

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
        this.name = 'Unknown Log Level';
    }
}

export abstract class Logger {
    /**
     * Log key/value pair.
     *
     * @param key
     * @param value
     */
    public abstract logKeyValue(key: string, value: unknown): void;

    /**
     * Given a tag, return a new `Logger` with that tag applied
     *
     * @param tag Tag that identifies this `Logger`
     */
    protected abstract createLoggerWithTag(tag: string): Logger;

    /**
     * Handles incoming log
     *
     * @param level Log level
     * @param parameters List of parameters to log
     */
    protected abstract handleLog(level: LogLevel, parameters: unknown[]): void;

    /**
     * Returns a new `Logger` instance but with a tag/namespace applied.
     *
     * @param tag Tag that will be applied to logs
     */
    public withTag(tag: string | Type<unknown>): Logger {
        return this.createLoggerWithTag(typeof tag === 'string' ? tag : tag.name);
    }

    public log(obj: unknown, ...objs: unknown[]): void;
    public log(msg: string, ...subst: unknown[]): void;
    public log(...parameters: unknown[]): void {
        this.handleLog(LogLevel.Debug, parameters);
    }

    public warn(obj: unknown, ...objs: unknown[]): void;
    public warn(msg: string, ...subst: unknown[]): void;
    public warn(...parameters: unknown[]): void {
        this.handleLog(LogLevel.Warning, parameters);
    }

    public error(obj: unknown, ...objs: unknown[]): void;
    public error(msg: string, ...subst: unknown[]): void;
    public error(...parameters: unknown[]): void {
        this.handleLog(LogLevel.Error, parameters);
    }

    public trace(obj: unknown, ...objs: unknown[]): void;
    public trace(msg: string, ...subst: unknown[]): void;
    public trace(...parameters: unknown[]): void {
        this.handleLog(LogLevel.Trace, parameters);
    }

    public info(obj: unknown, ...objs: unknown[]): void;
    public info(msg: string, ...subst: unknown[]): void;
    public info(...parameters: unknown[]): void {
        this.handleLog(LogLevel.Info, parameters);
    }

    public fatal(obj: unknown, ...objs: unknown[]): void;
    public fatal(msg: string, ...subst: unknown[]): void;
    public fatal(...parameters: unknown[]): void {
        this.handleLog(LogLevel.Fatal, parameters);
    }
}
