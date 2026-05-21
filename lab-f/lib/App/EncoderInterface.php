<?php

namespace App;

interface EncoderInterface
{
    public function supports(string $format): bool;
    public function decode(string $input): array;
    public function encode(array $data): string;
}