export class BaseEntity {
    constructor(
        public readonly id: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}
