
export const UnknownErrorCode = -1;

export abstract class CodedError extends Error {
    protected constructor(message?: string, public readonly code: number = UnknownErrorCode) {
        super(message);
    }
}

export const MethodNotImplementedErrorName =  'Method Not Implemented';
export class MethodNotImplementedError extends CodedError {
    constructor(message?: string, code: number = UnknownErrorCode) {
        super(message, code);
        Object.setPrototypeOf(this, MethodNotImplementedError.prototype);
        this.name = MethodNotImplementedErrorName;
    }
}

export const OperationNotSupportedErrorName =  'Operation Not Supported';
export class OperationNotSupportedError extends CodedError {
    constructor(message?: string, code: number = UnknownErrorCode) {
        super(message, code);
        Object.setPrototypeOf(this, OperationNotSupportedError.prototype);
        this.name = OperationNotSupportedErrorName;
    }
}

export const QueryNotSupportedErrorName =  'Query Not Supported';
export class QueryNotSupportedError extends CodedError {
    constructor(message?: string, code: number = UnknownErrorCode) {
        super(message, code);
        Object.setPrototypeOf(this, QueryNotSupportedError.prototype);
        this.name = QueryNotSupportedErrorName;
    }
}

export const DeleteErrorName = 'Delete Error';
export class DeleteError extends CodedError {
    constructor(message?: string, code: number = UnknownErrorCode) {
        super(message, code);
        Object.setPrototypeOf(this, DeleteError.prototype);
        this.name = DeleteErrorName;
    }
}

export const NotValidErrorName = 'Not Valid Error';
export class NotValidError extends  CodedError {
    constructor(message?: string, code: number = UnknownErrorCode) {
        super(message, code);
        Object.setPrototypeOf(this, NotValidError.prototype);
        this.name = NotValidErrorName;
    }
}

export const NotFoundErrorName = 'Not Found Error';
export class NotFoundError extends  CodedError {
    constructor(message?: string, code: number = UnknownErrorCode) {
        super(message, code);
        Object.setPrototypeOf(this, NotFoundError.prototype);
        this.name = NotFoundErrorName;
    }
}

export const InvalidArgumentErrorName = 'Invalid Argument';
export class InvalidArgumentError extends CodedError {
    constructor(message?: string, code: number = UnknownErrorCode) {
        super(message, code);
        Object.setPrototypeOf(this, InvalidArgumentError.prototype);
        this.name = InvalidArgumentErrorName;
    }
}

export const FailedErrorName = 'Failed Error';
export class FailedError extends CodedError {
    constructor(message?: string, code: number = UnknownErrorCode) {
        super(message, code);
        Object.setPrototypeOf(this, FailedError.prototype);
        this.name = FailedErrorName;
    }
}

export const ForbiddenErrorName = 'Forbidden Error';
export class ForbiddenError extends CodedError {
    constructor(message?: string, code: number = UnknownErrorCode) {
        super(message, code);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
        this.name = ForbiddenErrorName;
    }
}
