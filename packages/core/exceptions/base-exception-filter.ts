import { isObject } from '@nestjs/common/utils/shared.utils';
import { AbstractHttpAdapter } from '../adapters';
import { MESSAGES } from '../constants';
import { combineStackTrace } from '../helpers/combine-stack-trace';
import { HttpAdapterHost } from '../helpers/http-adapter-host';

export class BaseExceptionFilter<T = any> implements ExceptionFilter<T> {
  private static readonly logger = new Logger('ExceptionsHandler');
  @Optional()
  @Inject()
  protected readonly httpAdapterHost?: HttpAdapterHost;
  constructor(protected readonly applicationRef?: HttpServer) { }
  catch(exception: T, host: ArgumentsHost) {
    const applicationRef =
      this.applicationRef ||
      (this.httpAdapterHost && this.httpAdapterHost.httpAdapter);
    if (!(exception instanceof HttpException)) {
      return this.handleUnknownError(exception, host, applicationRef);
    }
    const res = exception.getResponse();
    const message = isObject(res)
      ? res
      : {
	@@ -71, 7 + 72, 7 @@
    if (this.isExceptionObject(exception)) {
      return BaseExceptionFilter.logger.error(
        exception.message,
        combineStackTrace(exception),
      );
    }
    return BaseExceptionFilter.logger.error(exception);
  }
  public isExceptionObject(err: any): err is Error {
    return isObject(err) && !!(err as Error).message;
  }
  /**
   * Checks if the thrown error comes from the "http-errors" library.
   * @param err error object
   */
  public isHttpError(err: any): err is { statusCode: number; message: string } {
    return err?.statusCode && err?.message;
  }
}