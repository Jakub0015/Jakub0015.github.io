<?php

namespace App\Encoder;

use App\EncoderInterface;

class JsonEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return $format === 'json';
    }

    public function decode(string $input): array
    {
        return json_decode(trim($input), true) ?? [];
    }

    public function encode(array $data): string
    {
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}