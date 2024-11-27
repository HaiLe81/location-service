import { ApiResponseProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiResponseProperty()
  data: T;

  @ApiResponseProperty()
  message: string;

  constructor(data?: Partial<ResponseDto<T>>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
