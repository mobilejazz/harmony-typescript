import { GetInteractor } from '@mobilejazz/harmony-core';
import { GetOAuthUserInteractor } from '@mobilejazz/harmony-nest';

import { UserModel } from '../../models/user.model';
import { BasicUserInfoQuery } from '../../../data/queries/user.query';

export class GetBasicUserInteractor implements GetOAuthUserInteractor {
    constructor(private readonly getUser: GetInteractor<UserModel>) {}

    public async execute(userId: string): Promise<UserModel> {
        const id = Number(userId);
        return this.getUser.execute(new BasicUserInfoQuery(id));
    }
}
