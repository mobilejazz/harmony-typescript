import { SQLDialect } from './sql.dialect';
import { MysqlError } from 'mysql';
import { FailedError, ForbiddenError } from '../repository';

export class MySQLDialect implements SQLDialect {
    getParameterSymbol(_idx?: number): string {
        return '?';
    }
    getInsertionId(result: any): number {
        return result.insertId;
    }
    getInsertionIdQueryStatement(_idColumn: string): string {
        return '';
    }
    getTableName(tableName: string): string {
        return `\`${tableName}\``;
    }
    getCountName(): string {
        return 'count(*)';
    }
    mapError(error: Error): Error {
        if ('sqlMessage' in error && 'code' in error) {
            const sqlError = error as MysqlError;
            const message = `${sqlError.sqlMessage}`;
            if (sqlError.code === 'ER_DUP_ENTRY') {
                return new ForbiddenError(message);
            } else {
                return new FailedError(message);
            }
        }
        return new FailedError(error.message);
    }
}
