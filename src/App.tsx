import { useEffect, useState } from "react";
import connectDB from "./config/db";
import type { Book } from "./types";

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const loadBooks = async () => {
      const db = await connectDB();
      if (!db) return;

      const res = await db.query("SELECT * FROM books;");
      setBooks(res.values ?? []);
    };

    loadBooks();
  }, []);

  const addBook = async () => {
    const db = await connectDB();
    if (!db) return;

    await db.run(
      "INSERT INTO books (title, cover, pages, read, rating) VALUES (?, ?, ?, ?, ?);",
      ["My first book", "testcover", 234, 54, 3]
    );

    const res = await db.query("SELECT * FROM books;");
    setBooks(res.values ?? []);
  };

  return (
    <div className="p-8">
      <button onClick={addBook} className="p-2 border">
        Add
      </button>
      <ul>
        {books.map((book, i) => (
          <li key={i}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}
