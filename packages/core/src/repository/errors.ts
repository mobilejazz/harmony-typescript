
export const UnknownErrorCode = -1;

export const MethodNotImplementedErrorName =  'ethod Not Implemented';
export class MethodNotImplementedError extends Error {
    constructor(message?: string, public readonly code: number = UnknownErrorCode) {
        super(message);
        Object.setPrototypeOf(this, MethodNotImplementedError.prototype);
        this.name = MethodNotImplementedErrorName;
    }
}

export const OperationNotSupportedErrorName =  'Operation Not Supported';
export class OperationNotSupportedError extends Error {
    constructor(message?: string, public readonly code: number = UnknownErrorCode) {
        super(message);
        Object.setPrototypeOf(this, OperationNotSupportedError.prototype);
        this.name = OperationNotSupportedErrorName;
    }
}

export const QueryNotSupportedErrorName =  'Query Not Supported';
export class QueryNotSupportedError extends Error {
    constructor(message?: string, public readonly code: number = UnknownErrorCode) {
        super(message);
        Object.setPrototypeOf(this, QueryNotSupportedError.prototype);
        this.name = QueryNotSupportedErrorName;
    }
}

export const DeleteErrorName = 'Delete Error';
export class DeleteError extends Error {
    constructor(message?: string, public readonly code: number = UnknownErrorCode) {
        super(message);
        Object.setPrototypeOf(this, DeleteError.prototype);
        this.name = DeleteErrorName;
    }
}

export const NotValidErrorName = 'Not Valid Error';
export class NotValidError extends  Error {
    constructor(message?: string, public readonly code: number = UnknownErrorCode) {
        super(message);
        Object.setPrototypeOf(this, NotValidError.prototype);
        this.name = NotValidErrorName;
    }
}

export const NotFoundErrorName = 'Not Found Error';
export class NotFoundError extends  Error {
    constructor(message?: string, public readonly code: number = UnknownErrorCode) {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
        this.name = NotFoundErrorName;
    }
}

export const InvalidArgumentErrorName = 'Invalid Argument';
export class InvalidArgumentError extends Error {
    constructor(message?: string, public readonly code: number = UnknownErrorCode) {
        super(message);
        Object.setPrototypeOf(this, InvalidArgumentError.prototype);
        this.name = InvalidArgumentErrorName;
    }
}

export const FailedErrorName = 'Failed Error';
export class FailedError extends Error {
    constructor(message?: string, public readonly code: number = UnknownErrorCode) {
        super(message);
        Object.setPrototypeOf(this, FailedError.prototype);
        this.name = FailedErrorName;
    }
}

export const ForbiddenErrorName = 'Forbidden Error';
export class ForbiddenError extends Error {
    constructor(message?: string, public readonly code: number = UnknownErrorCode) {
        super(message);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
        this.name = ForbiddenErrorName;
    }
}
