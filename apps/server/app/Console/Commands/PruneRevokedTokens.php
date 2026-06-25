<?php

namespace App\Console\Commands;

use App\Console\TransactionalCommand;
use App\Models\RevokedToken;

class PruneRevokedTokens extends TransactionalCommand
{
    protected $signature = 'tokens:prune-revoked';
    protected $description = 'Delete expired revoked tokens';

    public function handle(): void
    {
        $deleted = RevokedToken::where('expires_at', '<', now())->delete();

        $this->info("Pruned {$deleted} expired revoked token(s).");
    }
}
