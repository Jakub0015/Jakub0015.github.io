<?php

namespace App\Encoder;

use App\EncoderInterface;

class CsvEncoder implements EncoderInterface
{
    protected string $separator = ',';

    public function supports(string $format): bool
    {
        return $format === 'csv';
    }

    public function decode(string $input): array
    {
        $rows = [];
        $lines = explode("\n", trim($input));
        $headers = str_getcsv(array_shift($lines), $this->separator, '"', '');

        foreach ($lines as $line) {
            if (trim($line) === '') continue;
            $values = str_getcsv($line, $this->separator, '"', '');
            $rows[] = array_combine($headers, $values);
        }

        return $rows;
    }

    public function encode(array $data): string
    {
        if (empty($data)) return '';
        $output = '';
        $headers = array_keys($data[0]);
        $output .= implode($this->separator, $headers) . "\n";
        foreach ($data as $row) {
            $output .= implode($this->separator, array_values($row)) . "\n";
        }
        return trim($output);
    }
}