import { useEffect, useState } from "react";
import BookCard from "./components/BookCard";
import PageTitle from "./components/PageTitle";
import connectDB from "./config/db";
import type { Book } from "./types";

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const loadBooks = async () => {
      const db = await connectDB();
      if (!db) return;

      const res = await db.query("SELECT * FROM books;");
      setBooks(res.values as Book[]);
    };

    loadBooks();
  }, []);

  const addBook = async () => {
    const db = await connectDB();
    if (!db) return;

    await db.run(
      "INSERT INTO books (title, cover, pages, read) VALUES (?, ?, ?, ?)",
      [
        "الرحيق المختوم",
        "https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=128&q=75",
        542,
        320,
      ]
    );

    const res = await db.query("SELECT * FROM books;");
    setBooks(res.values as Book[]);
  };

  return (
    <div className="py-12 px-4">
      <PageTitle>المكتبة</PageTitle>

      <button onClick={addBook} className="border p-2">
        Add Book
      </button>

      <div className="space-y-2">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
