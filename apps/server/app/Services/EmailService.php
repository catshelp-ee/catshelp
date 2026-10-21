<?php

namespace App\Services;

use App\Mail\LoginLinkMail;
use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;

class EmailService
{

    public static function sendMagicLink(User $user, string $token): void
    {
        self::sendEmail($user->email, new LoginLinkMail($token));
    }

    public static function sendRequest() {

    }

    private static function sendEmail(string $to, Mailable $mailable): void
    {
        Mail::to($to)->send($mailable);
    }

    public static function sendNotificationToUser() {

    }

    public static function sendNotificationToVolunteers() {

    }
    
}
