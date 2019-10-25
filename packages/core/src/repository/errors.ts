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

export class DeleteError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "Delete Error";
    }
}

export class NotValidError extends  Error {
    constructor(message?: string) {
        super(message);
        this.name = "Not Valid Error";
    }
}

export class NotFoundError extends  Error {
    constructor(message?: string) {
        super(message);
        this.name = "Not Found Error";
    }
}
