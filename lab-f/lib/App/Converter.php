<?php

namespace App;

class Converter
{
    private array $encoders = [];

    public function addEncoder(EncoderInterface $encoder): void
    {
        $this->encoders[] = $encoder;
    }

    private function getEncoder(string $format): EncoderInterface
    {
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder;
            }
        }
        throw new \RuntimeException("Nieobsługiwany format: $format");
    }

    public function convert(string $input, string $fromFormat, string $toFormat): string
    {
        $decoder = $this->getEncoder($fromFormat);
        $encoder = $this->getEncoder($toFormat);

        $data = $decoder->decode($input);
        return $encoder->encode($data);
    }
}