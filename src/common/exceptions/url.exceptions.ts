import { HttpException, HttpStatus } from '@nestjs/common';

export class UrlNotFoundException extends HttpException {
  constructor(message: string = 'URL not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class UrlAlreadyExistsException extends HttpException {
  constructor(message: string = 'URL already exists') {
    super(message, HttpStatus.CONFLICT);
  }
}

export class UrlOwnershipException extends HttpException {
  constructor(message: string = 'You do not have permission to access this URL') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class InvalidShortCodeException extends HttpException {
  constructor(message: string = 'Invalid short code') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ShortCodeAlreadyExistsException extends HttpException {
  constructor(message: string = 'Short code already exists') {
    super(message, HttpStatus.CONFLICT);
  }
} 