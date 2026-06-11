from flask import Flask, render_template, abort, request, redirect, url_for
from models.book import Book

app = Flask(__name__)

@app.route("/")
def index():
    books = Book.find_all()
    return render_template("book/index.html", books=books)

@app.route("/book/<int:book_id>")
def show(book_id):
    book = Book.find(book_id)
    if book is None:
        abort(404)
    return render_template("book/show.html", book=book)

@app.route("/book/<int:book_id>/edit", methods=["GET", "POST"])
def edit(book_id):
    book = Book.find(book_id)
    if book is None:
        abort(404)
    if request.method == "POST":
        title = request.form["title"]
        author = request.form["author"]
        year = request.form["year"]
        Book.update(book_id, title, author, year)
        return redirect(url_for("show", book_id=book_id))
    return render_template("book/edit.html", book=book)

@app.route("/book/<int:book_id>/delete", methods=["POST"])
def delete(book_id):
    Book.delete(book_id)
    return redirect(url_for("index"))

@app.route("/book/create", methods=["GET", "POST"])
def create():
    if request.method == "POST":
        title = request.form["title"]
        author = request.form["author"]
        year = request.form["year"]
        Book.create(title, author, year)
        return redirect(url_for("index"))
    return render_template("book/create.html")

if __name__ == "__main__":
    app.run(debug=True, port=57898)