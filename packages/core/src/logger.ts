export enum LogLevel {
    Info,
    Warning,
    Error,
}

export interface Logger {
    log(level: LogLevel, message: string): void;
    log(level: LogLevel, tag: string, message: string): void;

    print(message: string): void;
    print(tag: string, message: string): void;

    warning(message: string): void;
    warning(tag: string, message: string): void;

    error(message: string): void;
    error(tag: string, message: string): void;
}

export abstract class AbstractLogger implements Logger {
    abstract log(level: LogLevel, message: string): void;
    abstract log(level: LogLevel, tag: string, message: string): void;

    print(message: string): void;
    print(tag: string, message: string): void;
    print(tagOrMessage: string, message?: string): void {
        if (message) {
            this.log(LogLevel.Info, tagOrMessage, message);
        } else {
            this.log(LogLevel.Info, tagOrMessage);
        }
    }

    warning(message: string): void;
    warning(tag: string, message: string): void;
    warning(tagOrMessage: string, message?: string): void {
        if (message) {
            this.log(LogLevel.Warning, tagOrMessage, message);
        } else {
            this.log(LogLevel.Warning, tagOrMessage);
        }
    }

    error(message: string): void;
    error(tag: string, message: string): void;
    error(tagOrMessage: string, message?: string): void {
        if (message) {
            this.log(LogLevel.Error, tagOrMessage, message);
        } else {
            this.log(LogLevel.Error, tagOrMessage);
        }
    }
}

export class DeviceConsoleLogger extends AbstractLogger {
    log(level: LogLevel, message: string): void;
    log(level: LogLevel, tag: string, message: string): void;
    log(level: LogLevel, tagOrMessage: string, message?: string): void {
        if (message) {
            message = `[${tagOrMessage}] ${message}`;
        } else {
            message = tagOrMessage;
        }

        switch (level) {
            case LogLevel.Error:
                return console.error(message);

            case LogLevel.Warning:
                return console.warn(message);

            default:
                return console.log(message);
        }
    }
}
