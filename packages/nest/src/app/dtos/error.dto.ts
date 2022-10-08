import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
    @ApiProperty()
    public readonly code: number;

    @ApiProperty()
    public readonly error: string;

    @ApiProperty()
    public readonly message: string;

    constructor(code: number, error: string, message: string) {
        this.code = code;
        this.error = error;
        this.message = message;
    }
}
