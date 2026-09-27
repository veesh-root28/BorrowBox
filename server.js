const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const store = require("./data/store");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Health check route - used by the deployment platform and by the CI/CD
// pipeline's smoke test to confirm the app booted correctly.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Home page: lists all items, optionally filtered by category.
app.get("/", (req, res) => {
  const { category } = req.query;
  const allItems = store.getAllItems();
  const items = category
    ? allItems.filter((item) => item.category === category)
    : allItems;
  res.render("index", { filteredItems: items });
});

// Form to add a new item.
app.get("/items/new", (req, res) => {
  res.render("new-item");
});

// Handle new item submission.
app.post("/items", (req, res) => {
  const { name, owner, category } = req.body;
  if (!name || !owner || !category) {
    return res.status(400).send("Missing required fields");
  }
  store.addItem({ name, owner, category });
  res.redirect("/");
});

// Request (borrow) an item.
app.post("/items/:id/request", (req, res) => {
  const item = store.requestItem(req.params.id);
  if (!item) return res.status(404).send("Item not found");
  res.redirect("/");
});

// Return a borrowed item.
app.post("/items/:id/return", (req, res) => {
  const item = store.returnItem(req.params.id);
  if (!item) return res.status(404).send("Item not found");
  res.redirect("/");
});

// Only start listening if this file is run directly (not when required by tests).
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`BorrowBox server running on port ${PORT}`);
  });
}

module.exports = app;
