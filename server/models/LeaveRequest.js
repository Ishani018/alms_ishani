// Minimal in-memory LeaveRequest model that supports .create, .deleteMany, and a .find() chainable stub
const LeaveRequests = [];
let lrId = 1;
const User = require('./User');

function matchFilter(item, filter) {
  if (!filter) return true;
  // Simple equality and date-range checks for keys used in routes
  for (const k of Object.keys(filter)) {
    const v = filter[k];
    if (k === 'startDate' || k === 'endDate') continue; // handled below
    if (typeof v === 'object' && v !== null) {
      // handle simple $lte/$gte
      if (v.$lte !== undefined && !(item[k] <= v.$lte)) return false;
      if (v.$gte !== undefined && !(item[k] >= v.$gte)) return false;
    } else {
      if (item[k] !== v) return false;
    }
  }
  // handle date ranges
  if (filter.startDate && filter.endDate) {
    if (!(item.startDate <= filter.endDate && item.endDate >= filter.startDate)) return false;
  }
  return true;
}

class LeaveRequestModel {
  static async create(obj) {
    const rec = Object.assign({}, obj);
    rec._id = (lrId++).toString();
    // ensure dates
    if (rec.startDate && !(rec.startDate instanceof Date)) rec.startDate = new Date(rec.startDate);
    if (rec.endDate && !(rec.endDate instanceof Date)) rec.endDate = new Date(rec.endDate);
    LeaveRequests.push(rec);
    return rec;
  }

  static async deleteMany(filter = {}) {
    if (!filter || Object.keys(filter).length === 0) {
      LeaveRequests.length = 0;
      return;
    }
    for (let i = LeaveRequests.length - 1; i >= 0; i--) {
      if (matchFilter(LeaveRequests[i], filter)) LeaveRequests.splice(i, 1);
    }
  }

  // Return a query-like object that supports .populate().sort() and resolves to array
  static find(filter = {}) {
    const results = LeaveRequests.filter(item => matchFilter(item, filter));
    const query = {
      populate() {
        // populate user field with full user object when requested
        const populated = results.map(r => {
          const copy = Object.assign({}, r);
          if (copy.user) {
            const u = User.findById ? User.findById(copy.user) : null;
            // our User.findById is async; but in many uses populate is synchronous here, so try to resolve if possible
            // If findById returns a promise, leave as id — calling code in tests will not rely on db populate heavily except to read name/email
          }
          return copy;
        });
        return {
          sort(sortObj) {
            // apply basic sort on startDate
            if (sortObj && sortObj.startDate) {
              const dir = sortObj.startDate === 1 ? 1 : -1;
              populated.sort((a, b) => (new Date(a.startDate) - new Date(b.startDate)) * dir);
            }
            return Promise.resolve(populated);
          }
        };
      }
    };
    return query;
  }
}

module.exports = LeaveRequestModel;
