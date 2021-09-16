export interface SQLDialect {
    getParameterSymbol(idx?: number): string;
    getInsertionId(result: any): number;
    getInsertionIdQueryStatement(idColumn: string): string;
    getTableName(tableName: string): string;
    getCountName(): string;
    mapError(error: Error): Error;
}
