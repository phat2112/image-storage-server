export default class CommonError extends Error {
  public code: number;

  constructor(message: string, code?: number) {
    super(message);
    this.code = code;
  }
}

export class ServerError extends Error {
  public status: string;
  public statusCode: number;

  constructor(message: string, status?: string, code?: number) {
    super(message);
    this.name = 'ServerError';
    this.status = status || 'Internal Server Error';
    this.statusCode = code;
  }
}
