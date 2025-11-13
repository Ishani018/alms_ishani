// Re-export server model so tests that require('../models/User') from tests/* find a compatible API
module.exports = require('../../server/models/User');
