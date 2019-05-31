import { plainToClass } from 'class-transformer';

export interface Mapper<From, To> {
    map(from: From, toType?: new () => To): To;
    map(list: From[], toType?: new () => To): To[];
}

/**
 * BlankMapper returns the same value
 */
export class BlankMapper<T> implements Mapper<T, T> {

    public map(from: T): T;
    public map(list: T[]): T[];
    public map(fromOrList: T | T[]): T | T[] {
        return fromOrList;
    }
}

export class ClosureMapper<From, To> implements Mapper<From, To> {
    private closure: (from: From) => To;
    constructor( closure: (from: From) => To) {
        this.closure = closure;
    }

    public map(from: From): To;
    public map(list: From[]): To[];
    public map(fromOrList: From | From[]): To | To[] {
        if (fromOrList instanceof Array) {
            return fromOrList.map(from => this.closure(from));
        }
        return this.closure(fromOrList);
    }
}

/**
 * CastMapper tries to casts the input value to the mapped type. Otherwise, throws an error.
 */
export class CastMapper<From, To> implements Mapper <From, To> {
    public map(from: From): To;
    public map(list: From[]): To[];
    public map(fromOrList: From | From[]): To | To[] {
        try {
            if (fromOrList instanceof Array) {
                return fromOrList.map(from => from as unknown as To);
            }
            return fromOrList as unknown as To;
        } catch (e) {
            throw new Error('CastMapper failed to map an object)');
        }
    }
}

/**
 * ObjectMapper tries to casts the input value to the mapped type. Otherwise, throws an error.
 */
export class ObjectMapper<From, To> implements Mapper <From, To> {
    public map(from: From): To;
    public map(list: From[]): To[];
    public map(fromOrList: From | From[]): To | To[] | undefined {
        if (fromOrList === null || typeof fromOrList === 'undefined') {
            return;
        }
        try {
            if (fromOrList instanceof Array) {
                return fromOrList.map(from => Object.assign({}, from) as unknown as To);
            }
            return Object.assign({}, fromOrList) as unknown as To;
        } catch (e) {
            throw new Error('ObjectMapper failed to map an object)');
        }
    }
}
/**
 * ClassTransformerMapper use class-transformer library to map objects. Otherwise, throws an error.
 */
export class ClassTransformerMapper<From, To> implements Mapper <From, To> {

    constructor(private toType: new() => To) {}

    public map(from: From): To;
    public map(list: From[]): To[];
    public map(fromOrList: From | From[]): To | To[] {
        try {
            return plainToClass(this.toType, fromOrList);
        } catch (e) {
            throw new Error('ClassTransformerMapper failed to map an object)');
        }
    }
}

/**
 * JsonSerializerMapper map objects to a serialized json string
 */
export class JsonSerializerMapper<From> implements Mapper<From, string> {

    public map(from: From): string;
    public map(list: From[]): string[];
    public map(fromOrList: From | From[]): string | string[] {
        if (fromOrList instanceof Array) {
            return fromOrList.map(from => JSON.stringify(from));
        }
        return JSON.stringify(fromOrList);
    }
}

/**
 * JsonDeserializerMapper
 */
export class JsonDeserializerMapper<From, To> implements Mapper <From, To> {

    constructor(private toType: new() => To) {}

    public map(from: From): To;
    public map(list: From[]): To[];
    public map(fromOrList: From | From[]): To | To[] {
        if (!fromOrList) {
            throw new Error('JsonDeserializerMapper cannot map an empty input)');
        }
        try {
            if (fromOrList instanceof Array) {
                return fromOrList.map((from: From) => this.deserialize(from));
            }
            if (typeof fromOrList === 'string') {
                fromOrList = JSON.parse(fromOrList);
            }
            return this.deserialize(fromOrList as From);
        } catch (e) {
            throw new Error('JsonDeserializerMapper failed to map an object)');
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
