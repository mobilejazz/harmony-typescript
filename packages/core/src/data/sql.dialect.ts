export abstract class SQLDialect {
    abstract getParameterSymbol: (idx?: number) => string;
    abstract getInsertionId: (result: unknown, idColumn: string) => number;
    abstract getInsertionIdQueryStatement: (idColumn: string) => string;
    abstract getTableName: (tableName: string) => string;
    abstract getCountName: () => string;
    abstract mapError: (error: Error) => Error;
}
