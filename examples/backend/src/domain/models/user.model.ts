import { ApiProperty } from '@nestjs/swagger';
import { OAuthUser } from '@mobilejazz/harmony-nest';
import { UserRole } from '../../data/entities/user.entity';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserModel implements OAuthUser {
    @ApiProperty({ name: 'id', readOnly: true })
    @IsOptional()
    @IsNumber()
    @Expose({ name: 'id' })
    id: number;

    @ApiProperty({ name: 'email' })
    @IsString()
    @Expose({ name: 'email' })
    email: string;

    @ApiProperty({ name: 'first_name' })
    @IsString()
    @Expose({ name: 'first_name' })
    firstName: string;

    @ApiProperty({ name: 'last_name' })
    @IsString()
    @Expose({ name: 'last_name' })
    lastName: string;

    @ApiProperty({
        name: 'role',
        enum: UserRole.all,
        description: UserRole.description(),
    })
    @IsEnum(UserRole)
    @Expose({ name: 'role' })
    role: UserRole;

    constructor(
        id: number,
        email: string,
        firstName: string,
        lastName: string,
        role: UserRole,
    ) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    static create(user: Partial<UserModel>): UserModel {
        return new UserModel(
            user.id,
            user.email,
            user.firstName,
            user.lastName,
            user.role,
        );
    }

    public oauthId(): string {
        return this.id.toString();
    }
}
