import { RevokedToken } from '@auth/revoked-token.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DeleteExpiredTokensJob {
  constructor(private dataSource: DataSource) { }

  /** Delete all expired revoked tokens */
  async execute(): Promise<void> {
    const repo: Repository<RevokedToken> = this.dataSource.getRepository(RevokedToken);

    await repo.createQueryBuilder()
      .delete()
      .from(RevokedToken)
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }
}
