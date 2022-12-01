import { Logger, LogLevel, UnknownLogLevelError } from './logger';

export class DeviceConsoleLogger extends Logger {
    private logger: Console;
    private tag?: string;

    constructor(logger?: Console, tag?: string) {
        super();
        this.logger = logger ?? console;
        this.tag = tag;
    }

    public logKeyValue(key: string, value: unknown): void {
        this.info(`${key}=${value}`);
    }

    protected createLoggerWithTag(tag: string): Logger {
        return new DeviceConsoleLogger(this.logger, tag);
    }

    protected handleLog(level: LogLevel, parameters: unknown[]): void {
        parameters = parameters ?? [];

        if (this.tag) {
            const tagStr = `[${this.tag}]`;

            if (parameters.length === 0 || typeof parameters[0] !== 'string') {
                // Set tag as first parameters array element
                parameters.unshift(tagStr);
            } else {
                // Mix tag with parameter as it might have formatting placeholders
                parameters[0] = `${tagStr} ${parameters[0]}`;
            }
        }

        switch (level) {
            case LogLevel.Fatal:
            case LogLevel.Error:
                return this.logger.error(...parameters);

            case LogLevel.Warning:
                return this.logger.warn(...parameters);

            case LogLevel.Info:
                return this.logger.log(...parameters);

            case LogLevel.Debug:
                return this.logger.debug(...parameters);

            case LogLevel.Trace:
                return this.logger.trace(...parameters);

            default:
                throw new UnknownLogLevelError();
        }
    }
}
