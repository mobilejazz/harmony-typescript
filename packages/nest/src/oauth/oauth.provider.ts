import {GetOAuthUserInteractor} from "./domain/interactors/get-oauth-user.interactor";
import {LoginOAuthUserInteractor} from "./domain/interactors/login-oauth-user.interactor";
import {ValidateScopeInteractor} from "./domain/interactors/validate-scope.interactor";
import {OAuth2UserModel} from "./application/oauth2.user.model";
import {OAuth2BaseModel} from "./application/oauth2.base.model";

export interface OAuthProvider {
    clientModel(): OAuth2BaseModel;
    userModel(
        getUser: GetOAuthUserInteractor,
        loginUser: LoginOAuthUserInteractor,
        scopeValidation: ValidateScopeInteractor,
        ): OAuth2UserModel;
}
