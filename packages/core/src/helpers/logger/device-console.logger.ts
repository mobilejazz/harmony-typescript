import {AbstractLogger, LogLevel, UnknownLogLevelError} from "./logger";

export class DeviceConsoleLogger extends AbstractLogger {
    protected logger: Console;

    constructor(logger?: Console) {
        super();
        this.logger = logger || console;
    }

    logKeyValue(key: string, value: unknown): void {
        this.info(`${key}=${value}`);
    }

    log(level: LogLevel, message: string): void;
    log(level: LogLevel, tag: string, message: string): void;
    log(level: LogLevel, tagOrMessage: string, message?: string): void {
        if (message) {
            message = `[${tagOrMessage}] ${message}`;
        } else {
            message = tagOrMessage;
        }

        switch (level) {
            case LogLevel.Fatal:
            case LogLevel.Error:
                return this.logger.error(message);

            case LogLevel.Warning:
                return this.logger.warn(message);

            case LogLevel.Info:
                return this.logger.log(message);

            case LogLevel.Debug:
                return this.logger.debug(message);

            case LogLevel.Trace:
                return this.logger.trace(message);

            default:
                throw new UnknownLogLevelError();
        }
    }
}
