
export interface SQLInterface {
    query(query: string, parameters?: any[]): Promise<any>;
    transaction<T>(runInTransaction: (sqlInterface: SQLInterface) => Promise<T>): Promise<T>;
}
