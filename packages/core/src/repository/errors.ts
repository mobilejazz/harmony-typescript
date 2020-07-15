export class MethodNotImplementedError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, MethodNotImplementedError.prototype);
        this.name = "Method Not Implemented";
    }
}

export class OperationNotSupportedError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, OperationNotSupportedError.prototype);
        this.name = "Operation Not Supported";
    }
}

export class QueryNotSupportedError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, QueryNotSupportedError.prototype);
        this.name = "Query Not Supported";
    }
}

export class DeleteError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, DeleteError.prototype);
        this.name = "Delete Error";
    }
}

export class NotValidError extends  Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, NotValidError.prototype);
        this.name = "Not Valid Error";
    }
}

export class NotFoundError extends  Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
        this.name = "Not Found Error";
    }
}

export class InvalidArgumentError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidArgumentError.prototype);
        this.name = "Invalid Argument";
    }
}

export class FailedError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, FailedError.prototype);
        this.name = 'Failed Error';
    }
}

export class ForbiddenError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
        this.name = 'Forbidden Error';
    }
}
