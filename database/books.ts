import { Book } from "@/types";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("kotoby.db");

db.execAsync(`
  -- DROP TABLE IF EXISTS books;
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uri TEXT NOT NULL,
    name TEXT NOT NULL,
    cover TEXT NOT NULL,
    pageCount INTEGER,
    currentPage INTEGER
  );
`);

export async function getAllBooks() {
  const result = await db.getAllAsync("SELECT * FROM books ORDER BY id DESC");
  return result as Book[];
}

export async function addBooks(books: Book | Book[]) {
  if (!Array.isArray(books)) {
    books = [books];
  }

  for (const book of books) {
    await db.runAsync(
      "INSERT INTO books (uri, name, cover, pageCount, currentPage) VALUES (?, ?, ?, ?, ?)",
      [book.uri, book.name, book.cover, book.pageCount, book.currentPage]
    );
  }
}

export async function deleteBook(uri: string) {
  await db.runAsync("DELETE FROM books WHERE uri = ?", [uri]);
}

export async function deleteAllBooks() {
  await db.runAsync("DELETE FROM books");
}

export async function updateCurrentPage(uri: string, currentPage: number) {
  await db.runAsync("UPDATE books SET currentPage = ? WHERE uri = ?", [currentPage, uri]);
}
