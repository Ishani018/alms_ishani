// Minimal manager middleware shim for routes. Permissive for test environment.
module.exports = function(req, res, next) {
  // Allow through for tests; if role checking needed, can extend here.
  return next();
};
