import HttpStatus from 'http-status';
import BaseException from './base';

class ExceptionHandler {
  static notFoundException (error) {
    return new BaseException(
      'NotFoundException',
      HttpStatus.NOT_FOUND,
      error.code,
      error.message
    );
  }

  static unauthorizedException (error) {
    return new BaseException(
      'UnauthorizedException',
      HttpStatus.UNAUTHORIZED,
      error.code,
      error.message
    );
  }

  static serviceUnavailableException (error) {
    return new BaseException(
      'ServiceUnavailableException',
      HttpStatus.SERVICE_UNAVAILABLE,
      error.code,
      error.message
    );
  }

  static badRequestException (error) {
    return new BaseException(
      'BadRequestException',
      HttpStatus.BAD_REQUEST,
      error.code,
      error.message
    );
  }

  static forbiddenException (error) {
    return new BaseException(
      'Forbidden',
      HttpStatus.FORBIDDEN,
      error.code,
      error.message
    );
  }
}

export default ExceptionHandler;
