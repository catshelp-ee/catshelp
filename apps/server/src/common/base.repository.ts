import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource, Repository, ObjectLiteral } from 'typeorm';
import type { EntityTarget } from 'typeorm';
import type { Request } from 'express';
import { ENTITY_MANAGER_KEY, TRANSACTION_ABORT_KEY } from "./interceptors/transaction.interceptor";

export abstract class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
    protected constructor(
        target: EntityTarget<Entity>,
        protected dataSource: DataSource,
        @Inject(REQUEST) protected request: Request,
    ) {
        const manager = request[ENTITY_MANAGER_KEY] || dataSource.createEntityManager();
        super(target, manager);
    }

    // Override save to add abort checking
    async save<T extends Entity>(entity: T | null): Promise<T> {
        this.checkAborted();
        const result = await super.save(entity as any);
        this.checkAborted();
        return result;
    }

    // Override remove to add abort checking
    async remove<T extends Entity>(entity: T | T[]): Promise<T | T[]> {
        this.checkAborted();
        const result = await super.remove(entity as any) as T | T[];
        this.checkAborted();
        return result;
    }

    // Override find operations to add abort checking
    async findOne(options: any): Promise<Entity | null> {
        this.checkAborted();
        const result = await super.findOne(options);
        this.checkAborted();
        return result;
    }

    async find(options?: any): Promise<Entity[]> {
        this.checkAborted();
        const result = await super.find(options);
        this.checkAborted();
        return result;
    }

    protected checkAborted(): void {
        const abortFlag = this.request[TRANSACTION_ABORT_KEY];
        if (abortFlag) {
            throw new Error(
                'Database operation aborted: transaction was closed. ' +
                'This usually means a database operation was called without await, ' +
                'and an error occurred before it could complete.'
            );
        }
    }
}