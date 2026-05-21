<?php // I:\PTW\lab-f\yaml.php

$data = [
    'name' => 'Jakub Jankowicz',
    'index' => '57898',
	'date' => date(DATE_ATOM),
];

$yaml = yaml_emit($data);

echo $yaml;