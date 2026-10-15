<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LoginLinkMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(private readonly string $token)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: '🐈 Cats Help Sisselogimine');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.login-link',
            with: [
                'link' => rtrim(config('services.frontend_url'), '/').'/api/verify?token='.urlencode($this->token),
            ],
        );
    }
}
