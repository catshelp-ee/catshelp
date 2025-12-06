import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        // Default values
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Rakenduse töös tekkis viga';
        let errors = null;

        // If the exception is an HttpException, override defaults
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'object') {
                message = (res as any).message || message;
                errors = (res as any).error || null;
            } else if (typeof res === 'string') {
                message = res;
            }
        }

        console.error(exception);

        response.status(status).json({
            status,
            message,
            error: errors,
        });
    }
}
