<?php
/** @var \App\Model\Book $book */
/** @var \App\Service\Router $router */
$title = 'Book Details';
$bodyClass = 'show';
ob_start(); ?>
    <h1>Book Details</h1>
    <p><strong>Title:</strong> <?= $book->getTitle() ?></p>
    <p><strong>Author:</strong> <?= $book->getAuthor() ?></p>
    <p><strong>Year:</strong> <?= $book->getYear() ?></p>
    <ul class="action-list">
        <li><a href="<?= $router->generatePath('book-edit', ['id' => $book->getId()]) ?>">Edit</a></li>
        <li><a href="<?= $router->generatePath('book-delete', ['id' => $book->getId()]) ?>">Delete</a></li>
        <li><a href="<?= $router->generatePath('book-index') ?>">Back to list</a></li>
    </ul>
<?php $main = ob_get_clean();
include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';