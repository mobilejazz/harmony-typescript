import { Logger, LogLevel, UnknownLogLevelError } from './logger';

export class DeviceConsoleLogger extends Logger {
    private logger: Console;
    private tag?: string;
    private tagColor: string;

    constructor(logger?: Console, tag?: string) {
        super();
        this.logger = logger ?? console;
        this.tag = tag;
        this.tagColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 85%)`; // Thanks: https://codepen.io/neilorangepeel/pen/GopwNr
    }

    public logKeyValue(key: string, value: unknown): void {
        this.info(`${key}=${value}`);
    }

    protected createLoggerWithTag(tag: string): Logger {
        return new DeviceConsoleLogger(this.logger, tag);
    }

    private getTagStyles(): string[] {
        const radius = '3px';

        return [
            `background-color:${this.tagColor};color:${this.tagColor};border-radius:${radius} 0 0 ${radius}`,
            `background-color:${this.tagColor};color:#000`,
            `background-color:${this.tagColor};color:${this.tagColor};border-radius:0 ${radius} ${radius} 0`,
            ``,
        ];
    }

    protected handleLog(level: LogLevel, parameters: unknown[]): void {
        if (this.tag) {
            // Our API is compatible with `console.*` methods this means that there are two ways of using this API:
            //
            // - With an array of mixed values
            // - With a template as first parameter: `[string, ...unknown[]]`. See: https://developer.mozilla.org/en-US/docs/Web/API/console#using_string_substitutions
            //
            // This affects how we handle the "tag". If it's an array of mixed values, we can simply prepend
            // the tag to the `parameters` array. But, if we're using the template signature we don't want to mess
            // with the template, that's why we prepend the tag to the template string. This way the first parameter
            // is still (potentially) a template.
            const isFirstString = parameters.length > 0 && typeof parameters[0] === 'string';

            // `%c` is console CSS style placeholder
            const tagStr = `%c[%c${this.tag}%c]%c`;
            let firstEl = '';

            if (isFirstString) {
                // SAFETY `as T`: we know this is a string via `isFirstString`
                firstEl = parameters.shift() as string;
            }

            // Add tag CSS styles at the beginning
            parameters.unshift(...this.getTagStyles());

            if (!isFirstString) {
                // CASE: array of mixed values
                // Add tag in the first position of the parameters array
                parameters.unshift(tagStr);
            } else {
                // CASE: Template with string substitutions
                // Add tag to the first parameter as it might have formatting placeholders
                parameters.unshift(`${tagStr} ${firstEl}`);
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
