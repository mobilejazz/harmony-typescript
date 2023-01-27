import { Logger, LogLevel } from '@mobilejazz/harmony-core';
import { BugfenderClass, DeviceKeyValue, LogLevel as BFLogLevel } from '@bugfender/sdk';

export class BugfenderLogger extends Logger {
    private tag?: string;
    private readonly LEVEL_MAP: Record<LogLevel, BFLogLevel> = {
        [LogLevel.Fatal]: BFLogLevel.Fatal,
        [LogLevel.Error]: BFLogLevel.Error,
        [LogLevel.Warning]: BFLogLevel.Warning,
        [LogLevel.Info]: BFLogLevel.Info,
        [LogLevel.Debug]: BFLogLevel.Debug,
        [LogLevel.Trace]: BFLogLevel.Trace,
    };

    constructor(protected bugfender: BugfenderClass, tag?: string) {
        super();
        this.tag = tag;
    }

    public logKeyValue(key: string, value: DeviceKeyValue): void {
        if (value === null) {
            this.bugfender.removeDeviceKey(key);
        } else {
            this.bugfender.setDeviceKey(key, value);
        }
    }

    protected createLoggerWithTag(tag: string): Logger {
        return new BugfenderLogger(this.bugfender, tag);
    }

    protected handleLog(level: LogLevel, parameters: unknown[]): void {
        this.bugfender.sendLog({
            level: this.LEVEL_MAP[level],
            tag: this.tag,
            text: parameters,
        });
    }
}
