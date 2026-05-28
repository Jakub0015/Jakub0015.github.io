<?php
/** @var \App\Model\Book $book */
/** @var \App\Service\Router $router */
$title = 'Create Book';
$bodyClass = 'create';
ob_start(); ?>
    <h1>Create Book</h1>
    <form method="post" action="<?= $router->generatePath('book-create') ?>">
        <?php include __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <button type="submit">Save</button>
    </form>
    <a href="<?= $router->generatePath('book-index') ?>">Back to list</a>
<?php $main = ob_get_clean();
include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';