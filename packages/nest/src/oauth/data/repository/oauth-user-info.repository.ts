import {
    Mapper,
    MethodNotImplementedError,
    Operation,
    PutDataSource,
    PutRepository,
    Query,
    QueryNotSupportedError,
    VoidQuery,
} from '@mobilejazz/harmony-core';
import { OAuthUserInfoModel } from '../../domain/oauth-user-info.model';
import { OAuthUserInfoEntity } from '../entity/oauth-user-info.entity';
import { CreateUserInfoQuery } from '../queries/user-info.query';

export class OAuthUserInfoRepository implements PutRepository<OAuthUserInfoModel> {
    constructor(
        private readonly putUserInfoDataSource: PutDataSource<OAuthUserInfoEntity>,
        private readonly toOutMapper: Mapper<OAuthUserInfoEntity, OAuthUserInfoModel>,
    ) {}

    public async put(
        _value: OAuthUserInfoModel | undefined,
        query: Query,
        _operation: Operation,
    ): Promise<OAuthUserInfoModel> {
        if (query instanceof CreateUserInfoQuery) {
            const userInfo = await this.putUserInfoDataSource.put(
                new OAuthUserInfoEntity(undefined, undefined, undefined, query.tokenId, query.userId),
                new VoidQuery(),
            );

            return this.toOutMapper.map(userInfo);
        }

        throw new QueryNotSupportedError();
    }

    public async putAll(
        _values: OAuthUserInfoModel[] | undefined,
        _query: Query,
        _operation: Operation,
    ): Promise<OAuthUserInfoModel[]> {
        throw new MethodNotImplementedError();
    }
}
