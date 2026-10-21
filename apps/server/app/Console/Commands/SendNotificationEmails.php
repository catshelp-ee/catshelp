<?php

namespace App\Console\Commands;

use App\Console\TransactionalCommand;

class SendNotificationEmails extends TransactionalCommand
{
    protected $signature = 'command:email:send-notifications';
    protected $description = 'Send notification emails to users';

    public function handle(): void
    {
        //TODO NOT IMPLEMENTED
    }
}
