export abstract class SQLInterface {
    abstract query: <T = unknown>(query: string, parameters?: unknown[]) => Promise<T>;
    abstract transaction: <T>(runInTransaction: (sqlInterface: SQLInterface) => Promise<T>) => Promise<T>;
}
