export class BaseEntity {
  constructor(
    readonly id: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
