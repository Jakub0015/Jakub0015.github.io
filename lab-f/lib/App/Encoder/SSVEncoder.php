<?php

namespace App\Encoder;

class SsvEncoder extends CsvEncoder
{
    protected string $separator = ';';

    public function supports(string $format): bool
    {
        return $format === 'ssv';
    }
}