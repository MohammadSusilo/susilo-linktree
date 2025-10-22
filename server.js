const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/"),
  filename: (req, file, cb) => cb(null, "profile.jpg"),
});
const upload = multer({ storage });

const linkPath = path.join(__dirname, "data", "links.json");
const profilePath = path.join(__dirname, "data", "profile.json");

function getLinks() {
  if (!fs.existsSync(linkPath)) return [];
  return JSON.parse(fs.readFileSync(linkPath));
}

function saveLinks(links) {
  fs.writeFileSync(linkPath, JSON.stringify(links, null, 2));
}

function getProfile() {
  if (!fs.existsSync(profilePath)) return {};
  return JSON.parse(fs.readFileSync(profilePath));
}

function saveProfile(profile) {
  fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
}

// ROUTES
app.get("/", (req, res) => {
  res.render("index", { profile: getProfile(), links: getLinks() });
});

app.get("/add", (req, res) => res.render("add"));

// ➕ Tambah link
app.post("/add", (req, res) => {
  const { title, url } = req.body;
  const links = getLinks();
  const id = Date.now().toString(); // kasih ID unik
  links.push({ id, title, url });
  saveLinks(links);
  res.redirect("/");
});

// ❌ Hapus link
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  let links = getLinks();
  links = links.filter(link => link.id !== id);
  saveLinks(links);
  console.log(`🗑️ Link ${id} dihapus`);
  res.redirect("/");
});


// ⚙️ Settings (edit profile)
app.get("/settings", (req, res) => {
  res.render("settings", { profile: getProfile() });
});

app.post("/settings", upload.single("profile"), (req, res) => {
  const { name, desc } = req.body;
  const profile = getProfile();
  profile.name = name;
  profile.desc = desc;
  profile.profile = "/profile.jpg";
  saveProfile(profile);
  res.redirect("/");
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

