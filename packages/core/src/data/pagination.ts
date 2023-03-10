import { MethodNotImplementedError } from '../repository/errors';

type GetPageFn<T> = () => Promise<Pagination<T>>;

export abstract class Pagination<T> {
    constructor(
        public readonly values: T[],
        private readonly getNextFn: GetPageFn<T> | undefined,
        private readonly getPrevFn: GetPageFn<T> | undefined,
    ) {}

    abstract hasNext(): boolean;
    abstract hasPrev(): boolean;

    public getNext(): Promise<Pagination<T>> {
        if (!this.getNextFn) {
            throw new MethodNotImplementedError();
        }

        return this.getNextFn();
    }

    public getPrev(): Promise<Pagination<T>> {
        if (!this.getPrevFn) {
            throw new MethodNotImplementedError();
        }

        return this.getPrevFn();
    }
}

export class PaginationOffsetLimit<T> extends Pagination<T> {
    constructor(
        values: T[],
        readonly offset: number,
        readonly limit: number,
        readonly size: number,
        getNextFn?: GetPageFn<T>,
        getPrevFn?: GetPageFn<T>,
    ) {
        super(values, getNextFn, getPrevFn);
    }

    public hasNext(): boolean {
        return this.offset + this.limit < this.size;
    }

    public hasPrev(): boolean {
        return this.offset !== 0;
    }
}

export class PaginationPage<T> extends Pagination<T> {
    constructor(
        values: T[],
        readonly page: number,
        readonly size: number,
        getNextFn?: GetPageFn<T>,
        getPrevFn?: GetPageFn<T>,
    ) {
        super(values, getNextFn, getPrevFn);
    }

    public hasNext(): boolean {
        return this.page < this.size;
    }

    public hasPrev(): boolean {
        return this.page > 0;
    }
}
