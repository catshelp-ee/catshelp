<?php

namespace App\Console\Commands;

class SendNotificationEmails extends TransactionalCommand
{
    protected $signature = 'email:send-notifications';
    protected $description = 'Send notification emails to users';

    public function handle(): void
    {
        //TODO NOT IMPLEMENTED
    }
}
