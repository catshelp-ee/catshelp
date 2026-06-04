<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

abstract class TransactionalCommand extends Command
{
    public function run(\Symfony\Component\Console\Input\InputInterface $input, \Symfony\Component\Console\Output\OutputInterface $output): int
    {
        DB::beginTransaction();

        try {
            $exitCode = parent::run($input, $output);

            if ($exitCode === self::SUCCESS) {
                DB::commit();
            } else {
                DB::rollBack();
            }

            return $exitCode;
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
