const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "data.json";

// read file
const readData = () => {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ notes: [], videos: [] }));
  }
  return JSON.parse(fs.readFileSync(FILE));
};

// write file
const writeData = (data) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};

// GET
app.get("/content", (req, res) => {
  res.json(readData());
});

// ADD NOTE
app.post("/add-note", (req, res) => {
  const data = readData();
  data.notes.push({ link: req.body.link });
  writeData(data);
  res.send("Note added");
});

// ADD VIDEO
app.post("/add-video", (req, res) => {
  const data = readData();
  data.videos.push({ url: req.body.url });
  writeData(data);
  res.send("Video added");
});

// DELETE NOTE
app.post("/delete-note", (req, res) => {
  const data = readData();
  data.notes.splice(req.body.index, 1);
  writeData(data);
  res.send("Deleted");
});

// DELETE VIDEO
app.post("/delete-video", (req, res) => {
  const data = readData();
  data.videos.splice(req.body.index, 1);
  writeData(data);
  res.send("Deleted");
});

app.listen(5000, () => console.log("Server running 🚀"));