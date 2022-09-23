import { Controller, Post, Req, Res } from '@nestjs/common';
import {
    ApiBody,
    ApiConsumes,
    ApiHeader,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { AuthControllerInteractor } from '@mobilejazz/harmony-nest';
import { UserLoginDTO } from './dto/user-login.dto';

@ApiTags('OAuth2')
@Controller('auth')
export class AuthController {
    constructor(private readonly authInteractor: AuthControllerInteractor) {}

    @Post('/token')
    @ApiConsumes('application/json')
    @ApiOperation({
        summary: 'OAuth Authentication',
        description: 'Performs OAuth authentication',
    })
    @ApiHeader({
        name: 'Authorization',
        required: true,
        description:
            '`Basic web-app:secret` but base64 encoded --> `Basic d2ViLWFwcDpzZWNyZXQ=`',
    })
    @ApiBody({ type: UserLoginDTO })
    public async login(@Req() request: any, @Res() response: any) {
        await this.authInteractor.execute(request, response);
    }
}
