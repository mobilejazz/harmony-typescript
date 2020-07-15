import {AbstractLogger, LogLevel, UnknownLogLevelError} from './logger';
import {Bugfender as BugfenderSDK} from '@bugfender/sdk/lib/bugfender';

export class BugfenderLogger extends AbstractLogger {
    constructor(
        protected bugfender: BugfenderSDK,
    ) {
        super();
    }

    logKeyValue(key: string, value: any): void {
        if (value === null) {
            this.bugfender.removeDeviceKey(key);
        } else {
            this.bugfender.setDeviceKey(key, value);
        }
    }

    log(level: LogLevel, message: string): void;
    log(level: LogLevel, tag: string, message: string): void;
    log(level: LogLevel, tagOrMessage: string, message?: string): void {
        const hasTag = typeof message !== 'undefined';

        if (hasTag) {
            const tag = tagOrMessage;

            this.bugfender.sendLog({
                tag: tag,
                text: message,
            });
        } else {
            message = tagOrMessage;

            switch (level) {
                case LogLevel.Fatal:
                    return this.bugfender.fatal(message);

                case LogLevel.Error:
                    return this.bugfender.error(message);

                case LogLevel.Warning:
                    return this.bugfender.warn(message);

                case LogLevel.Info:
                    return this.bugfender.info(message);

                case LogLevel.Debug:
                    return this.bugfender.log(message);

                case LogLevel.Trace:
                    return this.bugfender.trace(message);

                default:
                    throw new UnknownLogLevelError();
            }
        }
    }
}
