// Minimal in-memory User model to satisfy tests and server routes
// This mimics enough of Mongoose API: new User(), user.save(), User.findOne(), User.create(), User.deleteMany(), User.findById()
const users = new Map();
let idCounter = 1;

class User {
  constructor({ name, email, password, role } = {}) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role || 'employee';
    this.id = (idCounter++).toString();
  }

  async save() {
    users.set(this.email, this);
    return this;
  }

  static async findOne(filter) {
    if (!filter) return null;
    if (filter.email) {
      return users.get(filter.email) || null;
    }
    // fallback: search by any other field
    for (const u of users.values()) {
      let match = true;
      for (const k of Object.keys(filter)) {
        if (u[k] !== filter[k]) { match = false; break; }
      }
      if (match) return u;
    }
    return null;
  }

  static async create(obj) {
    const u = new User(obj);
    await u.save();
    return u;
  }

  // Accepts {} to clear or filters to remove matching users
  static async deleteMany(filter = {}) {
    if (!filter || Object.keys(filter).length === 0) {
      users.clear();
      return;
    }
    if (filter.email) {
      users.delete(filter.email);
      return;
    }
    // generic filter
    for (const [k, v] of Array.from(users.entries())) {
      let match = true;
      for (const key of Object.keys(filter)) {
        if (v[key] !== filter[key]) { match = false; break; }
      }
      if (match) users.delete(k);
    }
  }

  static async findById(id) {
    for (const u of users.values()) {
      if (u.id === id) return u;
    }
    return null;
  }

}

module.exports = User;
