import {FailedError, ForbiddenError, InvalidArgumentError} from "../repository";
import {SQLDialect} from "./sql.dialect";

export class PostgresSQLDialect implements SQLDialect {
    getParameterSymbol(idx?: number): string {
        if (idx === undefined || idx === null) {
            throw new InvalidArgumentError('idx != null');
        } else {
            return `$${idx}`;
        }
    }
    getInsertionId(result: any): number {
        if (result instanceof Array && result.length > 0) {
            return result[0].id;
        }
        return undefined;
    }
    getInsertionIdQueryStatement(idColumn: string): string {
        return `returning ${idColumn}`;
    }
    getTableName(tableName: string): string {
        return `"${tableName}"`;
    }
    getCountName(): string {
        return 'count';
    }
    mapError(error: Error): Error {
        const message = error.message;
        if (error['code'] === '23505') {
            return new ForbiddenError(message);
        }
        return new FailedError(message);
    }
}
