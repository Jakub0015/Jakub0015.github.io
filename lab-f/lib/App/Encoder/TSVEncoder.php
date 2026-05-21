<?php

namespace App\Encoder;

class TsvEncoder extends CsvEncoder
{
    protected string $separator = "\t";

    public function supports(string $format): bool
    {
        return $format === 'tsv';
    }
}