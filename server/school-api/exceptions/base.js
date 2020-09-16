import HttpStatus from 'http-status';

class BaseException extends Error {
  constructor (name, status, code, message) {
    super(message);

    this.name = name;
    this.status = status || HttpStatus.INTERNAL_SERVER_ERROR;
    this.code = code;
    this.error = message;
  }
}

export default BaseException;
