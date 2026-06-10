const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pool = require("./connection");

const app = express();
const uploads = multer();

app.use(
  express.static("."),
  cors({
    origin: ["https://form.rdevelabs.com", "https://rekap.rdevelabs.com"],
    methods: ["GET", "POST"],
  }),
);

app.get("/", (req, res) => {
  res.send("index.html");
});

app.get("/data", async (req, res) => {
  try {
    const [ikut, tidakIkut] = await Promise.all([
      pool.query("SELECT * FROM list where status = 'ikut' ORDER BY nama"),
      pool.query("SELECT * FROM list where status = 'tidak' ORDER BY nama"),
    ]);
    res.json({
      ikut: ikut[0],
      tidakIkut: tidakIkut[0],
    });
  } catch (e) {
    console.log(e);
  }
});

app.post("/post", uploads.single(), async (req, res) => {
  const nama = req.body.nama;
  const nim = req.body.nim;
  const status = req.body.status;
  const alasan = req.body.alasan;

  try {
    const [results] = await pool.query(
      "INSERT INTO list(nama, nim, status, alasan) VALUES (?, ?, ?, ?)",
      [`${nama}`, `${nim}`, `${status}`, `${alasan}`],
    );

    console.log(results);
    list - pendaftaran - villa - production.up.railway.app;
    res.status(200).send("ok");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(500).send("duplikat");
    return res.status(500).send("error");
    console.log(err);
  }
  // database();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
