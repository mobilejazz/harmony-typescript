import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDTO {
    @ApiProperty({
        enum: ['password', 'refresh_token', 'client_credentials'],
        required: true,
    })
    grant_type: 'password' | 'refresh_token' | 'client_credentials';

    @ApiProperty({ example: 'admin@example.com', required: false })
    username: string;

    @ApiProperty({ example: 'aaa123', required: false })
    password: string;
}
