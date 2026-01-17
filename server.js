// Import package yang dibutuhkan
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint: Ambil semua data
app.get('/list', (req, res) => {
  db.all("SELECT * FROM nomor", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Endpoint: Tambah data
app.post('/add', (req, res) => {
  const { phone, lat, lon, lokasi } = req.body;
  db.run("INSERT INTO nomor (phone, lat, lon, lokasi) VALUES (?, ?, ?, ?)",
    [phone, lat, lon, lokasi],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Nomor berhasil ditambahkan", id: this.lastID });
    });
});

// Endpoint: Edit data
app.put('/edit/:id', (req, res) => {
  const { phone, lat, lon, lokasi } = req.body;
  db.run("UPDATE nomor SET phone = ?, lat = ?, lon = ?, lokasi = ? WHERE id = ?",
    [phone, lat, lon, lokasi, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Nomor berhasil diubah" });
    });
});

// Endpoint: Hapus data
app.delete('/delete/:id', (req, res) => {
  db.run("DELETE FROM nomor WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Nomor berhasil dihapus" });
  });
});

// Endpoint: Lacak lokasi berdasarkan nomor
app.post('/lacak', (req, res) => {
  const { phone } = req.body;
  db.get("SELECT * FROM nomor WHERE phone = ?", [phone], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Nomor tidak ditemukan" });
    res.json(row);
  });
});

// Jalankan server
app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
