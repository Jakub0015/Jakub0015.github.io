<?php

spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/lib/App/';

    if (strpos($class, $prefix) !== 0) return;

    $relative = substr($class, strlen($prefix));
    $file = $baseDir . str_replace('\\', '/', $relative) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

use App\Converter;
use App\Encoder\CsvEncoder;
use App\Encoder\SsvEncoder;
use App\Encoder\TsvEncoder;
use App\Encoder\JsonEncoder;
use App\Encoder\YamlEncoder;

$converter = new Converter();
$converter->addEncoder(new CsvEncoder());
$converter->addEncoder(new SsvEncoder());
$converter->addEncoder(new TsvEncoder());
$converter->addEncoder(new JsonEncoder());
$converter->addEncoder(new YamlEncoder());

$formats = ['csv', 'ssv', 'tsv', 'json', 'yaml'];

$defaultInput = $_COOKIE['input'] ?? '';
$defaultFromFormat = $_COOKIE['from_format'] ?? 'tsv';
$defaultToFormat = $_COOKIE['to_format'] ?? 'json';

$output = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = $_POST['input'] ?? '';
    $fromFormat = $_POST['from_format'] ?? 'csv';
    $toFormat = $_POST['to_format'] ?? 'json';

    setcookie('input', $input, time() + 7 * 86400, '/');
    setcookie('from_format', $fromFormat, time() + 7 * 86400, '/');
    setcookie('to_format', $toFormat, time() + 7 * 86400, '/');

    $defaultInput = $input;
    $defaultFromFormat = $fromFormat;
    $defaultToFormat = $toFormat;

    try {
        $output = $converter->convert($input, $fromFormat, $toFormat);
    } catch (\Exception $e) {
        $error = 'Błąd konwersji: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Konwerter danych</title>
    <style>

        body { font-family: sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; background: #f5f5f5; }
        h1 { color: #333; }

        .form-row { display: flex; gap: 20px; margin-bottom: 15px; }
        .col { flex: 1; display: flex; flex-direction: column; gap: 10px; }

        label { font-weight: bold; font-size: 15px; color: #555; }
        textarea { width: 100%; height: 200px; font-size: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; resize: vertical; }
        select { padding: 5px; border: 1px solid #ccc; border-radius: 5px; font-size: 15px; }

        button { padding: 10px 30px; background: #c0693a; color: white; border: none; border-radius: 4px; font-size: 15px; cursor: pointer; }
        button:hover { background: #9e5230; }

        pre { background: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 15px; font-size: 15px; white-space: pre-wrap; word-break: break-word; min-height: 60px; }

        .error { color: red; font-weight: bold; }
        .section { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 1px 5px rgba(0,0,0,.1); margin-bottom: 20px; }

    </style>
</head>
<body>

<h1>Konwerter danych</h1>

<div class="section">
    <form method="POST">
        <div class="form-row">
            <div class="col">
                <label for="input">Dane wejściowe</label>
                <textarea id="input" name="input"><?= htmlspecialchars($defaultInput) ?></textarea>

                <div>
                    <label for="from_format">Format wejściowy</label>

                    <select id="from_format" name="from_format">
                        <?php foreach ($formats as $f): ?>

                            <option value="<?= $f ?>" <?= $f === $defaultFromFormat ? 'selected' : '' ?>>
                                <?= strtoupper($f) ?>
                            </option>

                        <?php endforeach; ?>
                    </select>

                </div>

            </div>

            <div class="col">
                <label>Wynik</label>
                <pre id="output"><?= htmlspecialchars($output) ?></pre>

                <div>
                    <label for="to_format">Format wyjściowy</label>
                    <select id="to_format" name="to_format">
                        <?php foreach ($formats as $f): ?>

                            <option value="<?= $f ?>" <?= $f === $defaultToFormat ? 'selected' : '' ?>>
                                <?= strtoupper($f) ?>
                            </option>

                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
        </div>

        <?php if ($error): ?>
            <p class="error"><?= htmlspecialchars($error) ?></p>
        <?php endif; ?>

        <button type="submit">Konwertuj</button>
    </form>
</div>

</body>