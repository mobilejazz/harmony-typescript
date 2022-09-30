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
    public readonly id: number;

    @ApiProperty({ name: 'email' })
    @IsString()
    @Expose({ name: 'email' })
    public readonly email: string;

    @ApiProperty({ name: 'first_name' })
    @IsString()
    @Expose({ name: 'first_name' })
    public readonly firstName: string;

    @ApiProperty({ name: 'last_name' })
    @IsString()
    @Expose({ name: 'last_name' })
    public readonly lastName: string;

    @ApiProperty({
        name: 'role',
        enum: UserRole.all,
        description: UserRole.description(),
    })
    @IsEnum(UserRole)
    @Expose({ name: 'role' })
    public readonly role: UserRole;

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
