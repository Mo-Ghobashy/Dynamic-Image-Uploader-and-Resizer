export class appError extends Error {
  public statusCode: number;
  public statusText: string;

  constructor(message: string, statusCode: number, statusText: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.statusText = statusText;

    Error.captureStackTrace(this, this.constructor);
  }
}
