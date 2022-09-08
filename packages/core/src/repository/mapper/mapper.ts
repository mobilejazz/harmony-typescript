import { plainToClass } from 'class-transformer';
import { FailedError, MethodNotImplementedError } from '../errors';
import { PaginationOffsetLimit, PaginationPage } from '../../data';

export interface Mapper<From, To> {
    map(from: From, toType?: new () => To): To;
}

/**
 * VoidMapper default implementation.
 */
export class VoidMapper<From, To> implements Mapper<From, To> {
    public map(_from: From): To {
        throw new MethodNotImplementedError('VoidMapper is not implemented');
    }
}

/**
 * BlankMapper returns the same value
 */
export class BlankMapper<T> implements Mapper<T, T> {
    public map(from: T): T {
        return from;
    }
}

export class ClosureMapper<From, To> implements Mapper<From, To> {
    private closure: (from: From) => To;
    constructor(closure: (from: From) => To) {
        this.closure = closure;
    }
    public map(from: From): To {
        return this.closure(from);
    }
}

/**
 * CastMapper tries to casts the input value to the mapped type. Otherwise, throws an error.
 */
export class CastMapper<From, To> implements Mapper<From, To> {
    public map(from: From): To {
        try {
            return from as unknown as To;
        } catch (e) {
            throw new FailedError('CastMapper failed to map an object)');
        }
    }
}

/**
 * ObjectMapper tries to casts the input value to the mapped type. Otherwise, throws an error.
 */
export class ObjectMapper<From, To> implements Mapper<From, To> {
    public map(from: From): To {
        try {
            return Object.assign({}, from) as unknown as To;
        } catch (e) {
            throw new FailedError('ObjectMapper failed to map an object)');
        }
    }
}
/**
 * ClassTransformerMapper use class-transformer library to map objects. Otherwise, throws an error.
 */
export class ClassTransformerMapper<From, To> implements Mapper<From, To> {
    constructor(private toType: new () => To) {}
    public map(from: From): To {
        try {
            return plainToClass(this.toType, from);
        } catch (e) {
            throw new FailedError('ClassTransformerMapper failed to map an object)');
        }
    }
}

/**
 * JsonSerializerMapper map objects to a serialized json string
 */
export class JsonSerializerMapper<From> implements Mapper<From, string> {
    public map(from: From): string {
        return JSON.stringify(from);
    }
}

/**
 * JsonDeserializerMapper
 */
export class JsonDeserializerMapper<From extends (string | Record<string, unknown>), To> implements Mapper<From, To> {
    constructor(private toType: new () => To) {}

    public map(from: From): To {
        try {
            if (typeof from === 'string') {
                return this.deserialize(JSON.parse(from));
            } else {
                return this.deserialize(from);
            }
        } catch (e) {
            throw new FailedError('JsonDeserializerMapper failed to map an object)');
        }
    }

    private deserialize(from: Record<string, unknown>): To {
        const output = new this.toType();

        Object.entries(from).forEach(([key, value]) => {
            output[key] = value;
        });

        return output;
    }
}

/**
 * Maps a pagination by offset limit object.
 */
export class PaginationOffsetLimitMapper<From, To>
    implements Mapper<PaginationOffsetLimit<From>, PaginationOffsetLimit<To>>
{
    constructor(private readonly mapper: Mapper<From, To>) {}
    map(from: PaginationOffsetLimit<From>): PaginationOffsetLimit<To> {
        return new PaginationOffsetLimit(
            from.values.map((el) => this.mapper.map(el)),
            from.offset,
            from.limit,
            from.size,
        );
    }
}

/**
 * Maps a pagination by page object.
 */
export class PaginationPageMapper<From, To> implements Mapper<PaginationPage<From>, PaginationPage<To>> {
    constructor(private readonly mapper: Mapper<From, To>) {}
    map(from: PaginationPage<From>): PaginationPage<To> {
        return new PaginationPage(
            from.values.map((el) => this.mapper.map(el)),
            from.page,
            from.size,
        );
    }
}
