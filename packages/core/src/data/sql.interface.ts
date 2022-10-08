export interface SQLInterface {
    query: <T = unknown>(query: string, parameters?: unknown[]) => Promise<T>;
    transaction: <T>(runInTransaction: (sqlInterface: SQLInterface) => Promise<T>) => Promise<T>;
}
