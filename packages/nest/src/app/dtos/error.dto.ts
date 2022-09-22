import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
    @ApiProperty()
    code: number;

    @ApiProperty()
    error: string;

    @ApiProperty()
    message: string;

    constructor(code: number, error: string, message: string) {
        this.code = code;
        this.error = error;
        this.message = message;
    }
}
