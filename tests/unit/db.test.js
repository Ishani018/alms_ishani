const db = require("../../config/db");

describe("Database Config – Unit Tests", () => {
  test("should export database connection", () => {
    expect(db).toBeDefined();
    expect(db.query).toBeDefined();
  });

  test("should have query method", () => {
    expect(typeof db.query).toBe("function");
  });
});

