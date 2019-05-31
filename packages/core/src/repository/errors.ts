export class MethodNotImplementedError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "Method Not Implemented";
    }
}

export class OperationNotSupportedError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "Operation Not Supported";
    }
}

export class QueryNotSupportedError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "Query Not Supported";
    }
}
