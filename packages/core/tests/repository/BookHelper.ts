export class Book {
    constructor(public readonly id: number, public readonly name: string, public readonly author: string) {}
}

export function getDefaultBook(): Book {
    return new Book(1, 'Book', 'Author');
}

export function getRandomBook(): Book {
    return new Book(2, 'Another Book', 'Another Author');
}
