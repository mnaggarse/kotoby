import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db: SQLiteDBConnection | null = null;

export default async function connectDB() {
  try {
    const isConn = (await sqlite.isConnection("kotoby", false)).result;

    if (isConn) {
      db = await sqlite.retrieveConnection("kotoby", false);
    } else {
      db = await sqlite.createConnection(
        "kotoby",
        false,
        "no-encryption",
        1,
        false
      );
    }

    await db.open();

    // await db.execute("DROP TABLE IF EXISTS books;");
    await db.execute(
      `CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        cover TEXT NOT NULL,
        pages INTEGER NOT NULL DEFAULT 1,
        read INTEGER NOT NULL DEFAULT 1,
        rating INTEGER NOT NULL DEFAULT 0
      );`
    );

    return db;
  } catch (err) {
    console.error("DB connection error:", err);
    return null;
  }
}
