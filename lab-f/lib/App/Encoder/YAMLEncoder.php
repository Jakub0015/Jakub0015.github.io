<?php

namespace App\Encoder;

use App\EncoderInterface;

class YamlEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return $format === 'yaml';
    }

    public function decode(string $input): array
    {
        return yaml_parse(trim($input)) ?? [];
    }

    public function encode(array $data): string
    {
        return yaml_emit($data, YAML_UTF8_ENCODING);
    }
}