import { ResponseDto } from '../dtos/response.dto';

export class ResponseUtil {
  static getResponse<T>(data, message): ResponseDto<T> {
    return {
      data: data,
      message: message,
    };
  }
}
