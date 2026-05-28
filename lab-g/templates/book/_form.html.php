<?php
/** @var \App\Model\Book $book */
?>
<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="book[title]" value="<?= $book->getTitle() ?>">
</div>
<div class="form-group">
    <label for="author">Author</label>
    <input type="text" id="author" name="book[author]" value="<?= $book->getAuthor() ?>">
</div>
<div class="form-group">
    <label for="year">Year</label>
    <input type="number" id="year" name="book[year]" value="<?= $book->getYear() ?>">
</div>