const nodemailer = require('nodemailer');
const Leave = require('../models/leaveModel');
const db = require('../config/db');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'jahnvir04@gmail.com',     // Your Gmail
    pass: 'vqvaldpupmpypfmc'         // App password
  }
});

function sendLeaveStatusEmail(to, leave, status) {
  const mailOptions = {
    from: '"Leave System" <jahnvir04@gmail.com>',
    to: to,
    subject: `Leave Request ${status}`,
    text: `Hi ${leave.employee_name},\n\nYour leave request from ${leave.start_date} to ${leave.end_date} (${leave.type}) has been ${status}.\n\nRegards,\nHR/Manager`
  };
  return transporter.sendMail(mailOptions);
}

exports.createLeave = (req, res) => {
  Leave.create(req.body, (err) => {
    if (err) throw err;
    res.send('Leave request created');
  });
};

exports.getLeaves = (req, res) => {
  Leave.getAll((err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.getEmployeeLeaves = (req, res) => {
  Leave.getByEmployee(req.params.id, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// Leave approval with leave balance check + email notification
exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== "Approved") {
    // For Declined/other
    Leave.updateStatus(id, status, (err) => {
      if (err) throw err;
      // Fetch leave and employee info to send email
      db.query('SELECT * FROM leaves WHERE id = ?', [id], (err2, leaveResults) => {
        if (err2 || !leaveResults.length) return res.send('Leave status updated');
        const leave = leaveResults[0];
        db.query('SELECT email, name FROM users WHERE id = ?', [leave.employee_id], (err3, userResults) => {
          if (err3 || !userResults.length) return res.send('Leave status updated');
          const employee = userResults[0];
          sendLeaveStatusEmail(employee.email, {
            employee_name: employee.name,
            start_date: leave.start_date,
            end_date: leave.end_date,
            type: leave.type
          }, status).then(() => {
            res.send('Leave status updated');
          }).catch(() => {
            res.send('Leave status updated, but email not sent');
          });
        });
      });
    });
    return;
  }

  // For Approved
  db.query('SELECT * FROM leaves WHERE id = ?', [id], (err, leaveResults) => {
    if (err || !leaveResults.length) return res.status(404).send('Leave request not found');
    const leave = leaveResults[0];
    const daysRequested = Math.ceil((new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24)) + 1;
    db.query('SELECT leave_balance, email, name FROM users WHERE id = ?', [leave.employee_id], (err2, userResults) => {
      if (err2 || !userResults.length) return res.status(404).send('User not found');
      const { leave_balance, email, name } = userResults[0];
      if (leave_balance < daysRequested) {
        return res.status(400).send('Insufficient leave balance');
      }
      // Approve leave and deduct balance
      Leave.updateStatus(id, status, (err3) => {
        if (err3) throw err3;
        db.query('UPDATE users SET leave_balance = leave_balance - ? WHERE id = ?', [daysRequested, leave.employee_id], (err4) => {
          if (err4) return res.status(500).send('Error updating balance');
          // Send email
          sendLeaveStatusEmail(email, {
            employee_name: name,
            start_date: leave.start_date,
            end_date: leave.end_date,
            type: leave.type
          }, status).then(() => {
            res.send('Leave status updated');
          }).catch(() => {
            res.send('Leave status updated, but email not sent');
          });
        });
      });
    });
  });
};
