export class ConflictDataException extends Error {
  constructor(massge:string) {
    super(massge, { cause: 409 });
  }
}
export class BadRequestException extends Error {
  
  constructor(massge:string,public details?:Record<string,string> ) {
    super(massge, { cause: 400 });
    this.details = details;
  }
}
export class NotFoundException extends Error {
  constructor(massge:string) {
    super(massge, { cause: 404 });
  }
}
export class UnAuthorizedException extends Error {
  constructor(massge:string) {
    super(massge, { cause: 401 });
  }
}
