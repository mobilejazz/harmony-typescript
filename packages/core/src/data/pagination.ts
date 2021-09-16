export abstract class Pagination<T> {
    constructor(readonly values: T[]) {}
}

export class PaginationOffsetLimit<T> extends Pagination<T> {
    constructor(values: T[], readonly offset: number, readonly limit: number, readonly size: number) {
        super(values);
    }
}

export class PaginationPage<T> extends Pagination<T> {
    constructor(values: T[], readonly page: number, readonly size: number) {
        super(values);
    }
}
