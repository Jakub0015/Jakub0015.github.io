from db import get_db

class Book:
    @staticmethod
    def find_all():
        conn = get_db()
        rows = conn.execute("SELECT * FROM book ORDER BY id").fetchall()
        conn.close()
        return rows

    @staticmethod
    def find(book_id):
        conn = get_db()
        row = conn.execute("SELECT * FROM book WHERE id = ?", (book_id,)).fetchone()
        conn.close()
        return row

    @staticmethod
    def create(title, author, year):
        conn = get_db()
        conn.execute(
            "INSERT INTO book (title, author, year) VALUES (?, ?, ?)",
            (title, author, year),
        )
        conn.commit()
        conn.close()

    @staticmethod
    def update(book_id, title, author, year):
        conn = get_db()
        conn.execute(
            "UPDATE book SET title = ?, author = ?, year = ? WHERE id = ?",
            (title, author, year, book_id),
        )
        conn.commit()
        conn.close()

    @staticmethod
    def delete(book_id):
        conn = get_db()
        conn.execute("DELETE FROM book WHERE id = ?", (book_id,))
        conn.commit()
        conn.close()