import { RevokedToken } from '@auth/revoked-token.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BaseCronJob } from './base-cron-job';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class DeleteExpiredTokensJob extends BaseCronJob {
  constructor(
    protected dataSource: DataSource,
    protected moduleRef: ModuleRef,
  ) {
    super(dataSource, moduleRef);
  }

  /** Delete all expired revoked tokens */
  protected async doWork(): Promise<void> {
    const repo: Repository<RevokedToken> = this.dataSource.getRepository(RevokedToken);

    await repo.createQueryBuilder()
      .delete()
      .from(RevokedToken)
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }
}
