const request = require("supertest");
const app = require("../server");
const store = require("../data/store");

beforeEach(() => {
  store._resetForTests([
    { id: 1, name: "Test Calculator", owner: "Alice", category: "Electronics", available: true },
    { id: 2, name: "Test Book", owner: "Bob", category: "Books", available: false },
  ]);
});

describe("GET /health", () => {
  it("returns status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("GET /", () => {
  it("renders the homepage with a 200 status", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("BorrowBox");
  });

  it("lists existing items on the page", async () => {
    const res = await request(app).get("/");
    expect(res.text).toContain("Test Calculator");
  });
});

describe("POST /items", () => {
  it("creates a new item and redirects home", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "New Item", owner: "Charlie", category: "Tools" });
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/");
  });

  it("rejects a submission missing required fields", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "Incomplete Item" });
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /items/:id/request", () => {
  it("marks an available item as unavailable", async () => {
    const res = await request(app).post("/items/1/request");
    expect(res.statusCode).toBe(302);
    const item = store.getItemById(1);
    expect(item.available).toBe(false);
  });

  it("returns 404 for a non-existent item", async () => {
    const res = await request(app).post("/items/999/request");
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items/:id/return", () => {
  it("marks a borrowed item as available again", async () => {
    const res = await request(app).post("/items/2/return");
    expect(res.statusCode).toBe(302);
    const item = store.getItemById(2);
    expect(item.available).toBe(true);
  });
});
