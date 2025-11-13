import { ModuleRef } from '@nestjs/core';
import { DataSource } from 'typeorm';
export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';

export abstract class BaseCronJob {
    protected contextId;

    constructor(
        protected dataSource: DataSource,
        protected moduleRef: ModuleRef,
    ) {
        
    }

    public async run(): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        console.log("Running job");
        const mockRequest = {
            [ENTITY_MANAGER_KEY]: queryRunner.manager
        };

        this.contextId = { id: Math.random() };
        // Register the mock request in the context
        this.moduleRef.registerRequestByContextId(mockRequest, this.contextId);

        try {
            await this.resolveScopeDependencies();
            // Do all your work with queryRunner.manager
            await this.doWork(queryRunner);
            console.log("Job done");

            // Commit when everything succeeds
            await queryRunner.commitTransaction();
        } catch (error) {
            // Rollback on any error
            await queryRunner.rollbackTransaction();
            console.error("Error during cron job: " + error);
        } finally {
            // Always release the query runner
            await queryRunner.release();
        }
    }

    //Override this function
    protected async doWork(queryRunner) {

    };

    protected async resolveScopeDependencies() {

    };
}
