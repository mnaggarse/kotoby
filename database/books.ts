import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("books.db");

db.execAsync(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    uri TEXT UNIQUE NOT NULL,
    pages INTEGER,
    currentPage INTEGER
  );
`);

export async function getAllBooks() {
  const result = await db.getAllAsync("SELECT * FROM books ORDER BY id DESC");
  return result as {
    id: number;
    name: string;
    uri: string;
    pages?: number;
    currentPage?: number;
  }[];
}

export async function addBooks(books: { name: string; uri: string }[]) {
  for (const book of books) {
    await db.runAsync("INSERT OR IGNORE INTO books (name, uri) VALUES (?, ?)", [
      book.name,
      book.uri,
    ]);
  }
}

export async function deleteBook(uri: string) {
  await db.runAsync("DELETE FROM books WHERE uri = ?", [uri]);
}

export async function updatePages(uri: string, pages: number) {
  await db.runAsync("UPDATE books SET pages = ? WHERE uri = ?", [pages, uri]);
}

export async function updateCurrentPage(uri: string, page: number) {
  await db.runAsync("UPDATE books SET currentPage = ? WHERE uri = ?", [page, uri]);
}
