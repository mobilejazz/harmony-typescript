export interface Book {
    id: number;
    name: string;
    author: string;
}

export function getDefaultBook(): Book {
    return {
        id: 1,
        name: 'some book name',
        author: 'some author',
    };
}

export function getRandomBook(): Book {
    return {
        id: 2,
        name: 'some book name Two',
        author: 'some author Two',
    };
}
