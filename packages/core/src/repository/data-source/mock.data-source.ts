import { IdQuery, Query } from "../query/query";
import { SingleDataSourceRepository } from "../single-data-source.repository";
import { DeleteDataSource, GetDataSource, PutDataSource } from "./data-source";

export class MockDataSource<T>
  implements
    GetDataSource<T>,
    PutDataSource<T>,
    DeleteDataSource {
  constructor(
      protected readonly itemsFactory: MockItemDataSourceFactory<T>,
      protected readonly delay = 0,
  ) {}

  async get(query: Query): Promise<T> {
    await this.sourceDelay();
    return this.itemsFactory.getGetItem(query);
  }

  async getAll(query: Query): Promise<T[]> {
    await this.sourceDelay();
    return this.itemsFactory.getGetAllItems(query);
  }

  async put(
    value: T,
    query: Query,
  ): Promise<T> {
    await this.sourceDelay();
    return this.itemsFactory.getPutItem(value, query);
  }

  async putAll(
    values: T[],
    query: Query,
  ): Promise<T[]> {
    await this.sourceDelay();
    return this.itemsFactory.getPutAllItems(values, query);
  }

  async delete(query: Query): Promise<void> {
    await this.sourceDelay();
    return Promise.resolve();
  }

  private sourceDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }
}

export interface MockItemDataSourceFactory<T> {
    getGetItem(query?: Query): T;
    getGetAllItems(query?: Query): T[];
    getPutItem(value?: T, query?: Query): T;
    getPutAllItems(values?: T[], query?: Query): T[];
}

export abstract class DefaultMockItemDataSourceFactory<T> implements MockItemDataSourceFactory<T> {

    protected get randId() {
        return Math.floor(Math.random() * 10000);
    }

    protected get randUid() {
        return Math.random().toString(36).substr(2, 9);
    }

    public abstract getGetItem(query?: Query): T;

    public abstract getGetAllItems(query?: Query): T[];

    public getPutItem(value?: T, query?: Query): T {
        if (!!value && value.hasOwnProperty('id') && value['id'] === undefined) {
            // Setting an id for object creation simulation
            if (typeof value['id'] === 'string') {
                value['id'] = this.randUid;
            } else if (typeof value['id'] === 'number') {
                value['id'] = this.randId;
            }
        }
        return value;
    }

    public getPutAllItems(values?: T[], query?: Query): T[] {
        return values;
    }
}

// ---> App scope

export class MockUserDataSourceFactory extends DefaultMockItemDataSourceFactory<UserModel> {

    private createUser(query?: Query): UserModel {
        const randId = query instanceof IdQuery ? query.id : Math.floor(Math.random() * 1000);
        return new UserModel (
            randId,
            `User_${randId}`,
        );
    }

    public getGetItem(query?: Query): UserModel {
        return this.createUser(query);
    }

    public getGetAllItems(query?: Query): UserModel[] {
        return [
            this.createUser(query),
            this.createUser(query),
            this.createUser(query),
            this.createUser(query),
            this.createUser(query),
        ];
    }
}

export class UserModel {
    constructor(
        public readonly id: number,
        public readonly name: string,
    ) {
    }
}

export function getLandingPageRepository(
): SingleDataSourceRepository<UserModel> {
  const dataSource = new MockDataSource(
    new MockUserDataSourceFactory(),
    1500,
  );
  return new SingleDataSourceRepository(dataSource, dataSource, dataSource);
}
