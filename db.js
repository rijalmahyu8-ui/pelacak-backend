const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pelacak.db');

// Buat tabel jika belum ada
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS nomor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    lokasi TEXT NOT NULL
  )`);

  // Tambahkan data contoh jika tabel masih kosong
  db.get("SELECT COUNT(*) as count FROM nomor", (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO nomor (phone, lat, lon, lokasi) VALUES
        ('081234567890', -6.200, 106.816, 'Jakarta'),
        ('082345678901', -7.250, 112.750, 'Surabaya'),
        ('083456789012', -6.917, 107.619, 'Bandung'),
        ('084567890123', -5.147, 119.432, 'Makassar')`);
    }
  });
});

module.exports = db;
