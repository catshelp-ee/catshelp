import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private readonly dataSource: DataSource) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return from(
            this.dataSource.manager.transaction(async (transactionalEntityManager) => {
                const request = context.switchToHttp().getRequest();
                request.transactionalEntityManager = transactionalEntityManager;

                return next.handle().toPromise();
            }),
        ).pipe(
            catchError((error) => {
                throw error;
            }),
        );
    }
}
