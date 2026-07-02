<?php

namespace App\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

abstract class TransactionalCommand extends Command
{
    public function run(InputInterface $input, OutputInterface $output): int
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
