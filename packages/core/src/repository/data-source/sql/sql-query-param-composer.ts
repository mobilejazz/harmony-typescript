import { SQLDialect } from '../../../data';

export type SQLQueryParamFn = (param: unknown) => string;

/**
 * Class that stores the list of parameters for a query and returns
 * the parameter symbol to be used in an SQL statement when adding a new one.
 */
export class SQLQueryParamComposer {
    private params: unknown[] = [];

    /**
     * Constructor
     * @param dialect The associated SQL dialect
     */
    constructor(private readonly dialect: SQLDialect) {}

    /**
     * Add a new parameter. Returns the parameter symbol associated to the dialect to be used
     * in an SQL statement (ex: ?, $1, ..).
     * @param param The parameter to be added
     */
    public readonly push: SQLQueryParamFn = (param: unknown) => {
        this.params.push(param);
        return this.dialect.getParameterSymbol(this.params.length);
    };

    /**
     * Returns the amount of params currently stored
     */
    public getCount(): number {
        return this.params.length;
    }

    /**
     * Returns the list of params
     */
    public getParams(): unknown[] {
        return this.params;
    }
}
