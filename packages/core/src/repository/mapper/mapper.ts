import { plainToClass } from 'class-transformer';
import {FailedError} from "../errors";

export interface Mapper<From, To> {
    map(from: From, toType?: new () => To): To;
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
    constructor( closure: (from: From) => To) {
        this.closure = closure;
    }
    public map(from: From): To {
        return this.closure(from);
    }
}

/**
 * CastMapper tries to casts the input value to the mapped type. Otherwise, throws an error.
 */
export class CastMapper<From, To> implements Mapper <From, To> {
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
export class ObjectMapper<From, To> implements Mapper <From, To> {
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
export class ClassTransformerMapper<From, To> implements Mapper <From, To> {
    constructor(private toType: new() => To) {}
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
export class JsonDeserializerMapper<From, To> implements Mapper <From, To> {
    constructor(private toType: new() => To) {}
    public map(from: From): To {
        try {
            if (typeof from === 'string') {
                from = JSON.parse(from);
            }
            return this.deserialize(from as From);
        } catch (e) {
            throw new FailedError('JsonDeserializerMapper failed to map an object)');
        }
    }
    private deserialize(from: From): To {
        const output = new this.toType();
        let properties: string[] = Object.keys(from);
        properties.forEach((property: string) => {
            output[property] = from[property];
        });
        return output;
    }
}
