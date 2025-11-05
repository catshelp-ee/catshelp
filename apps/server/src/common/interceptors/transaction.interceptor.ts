import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';

export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';
export const TRANSACTION_ABORT_KEY = 'TRANSACTION_ABORT';

@Injectable({ scope: Scope.REQUEST })
export class TransactionInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Store the EntityManager and abort controller in the request object
    req[ENTITY_MANAGER_KEY] = queryRunner.manager;
    req[TRANSACTION_ABORT_KEY] = false;

    return new Observable((observer) => {
      next.handle().subscribe({
        next: async (data) => {
          try {
            // Wait for commit before sending response
            await queryRunner.commitTransaction();
            req[TRANSACTION_ABORT_KEY] = true; // Signal that transaction is closed
            await queryRunner.release();
            observer.next(data);
            observer.complete();
          } catch (err) {
            req[TRANSACTION_ABORT_KEY] = true; // Signal that transaction is closed
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            observer.error(err);
          }
        },
        error: async (err) => {
          try {
            req[TRANSACTION_ABORT_KEY] = true; // Signal that transaction is closed
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
          } catch (rollbackError) {
            // Log rollback error but throw original
            console.error('Rollback failed:', rollbackError);
          }
          observer.error(err);
        },
      });
    });
  }
}