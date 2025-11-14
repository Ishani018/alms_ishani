// Lightweight DB shim used by integration tests cleanup hooks.
// Only implements query(sql, params, cb) and end().
const User = require('../../server/models/User');

module.exports = {
  query(sql, params, cb) {
    // support: DELETE FROM users WHERE email = ?
    try {
      if (/DELETE\s+FROM\s+users/i.test(sql) && params && params.length) {
        const email = params[0];
        // Our User model exposes deleteMany
        Promise.resolve(User.deleteMany({ email })).then(() => cb && cb(null, { affectedRows: 1 }));
        return;
      }
      // default: no-op
      cb && cb(null, []);
    } catch (err) {
      cb && cb(err);
    }
  },
  end() {
    // noop for in-memory shim
  }
};
