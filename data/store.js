// In-memory data store for BorrowBox items.
// Swappable later for a real database (e.g. SQLite/Postgres) without
// changing the routes, since all access goes through these functions.

let items = [
  {
    id: 1,
    name: "Scientific Calculator (Casio fx-991)",
    owner: "Aditi",
    category: "Electronics",
    available: true,
  },
  {
    id: 2,
    name: "Data Structures Textbook",
    owner: "Rohan",
    category: "Books",
    available: true,
  },
  {
    id: 3,
    name: "USB-C Charger",
    owner: "Meera",
    category: "Electronics",
    available: false,
  },
];

let nextId = 4;

function getAllItems() {
  return items;
}

function getItemById(id) {
  return items.find((item) => item.id === Number(id));
}

function addItem({ name, owner, category }) {
  const newItem = {
    id: nextId++,
    name,
    owner,
    category,
    available: true,
  };
  items.push(newItem);
  return newItem;
}

function requestItem(id) {
  const item = getItemById(id);
  if (!item) return null;
  if (!item.available) return item;
  item.available = false;
  return item;
}

function returnItem(id) {
  const item = getItemById(id);
  if (!item) return null;
  item.available = true;
  return item;
}

// Test-only helper to reset state between test runs.
function _resetForTests(freshItems) {
  items = freshItems;
  nextId = freshItems.length + 1;
}

module.exports = {
  getAllItems,
  getItemById,
  addItem,
  requestItem,
  returnItem,
  _resetForTests,
};
