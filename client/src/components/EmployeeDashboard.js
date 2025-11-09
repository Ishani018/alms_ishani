// client/src/components/EmployeeDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeDashboard = () => {
    // State for the form
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
    });
    // State for the employee's own requests
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Not authorized, please login.');
                window.location.href = '/login'; 
                return;
            }
            const config = {
                headers: {
                    'x-auth-token': token,
                },
            };
            // Fetches ONLY the logged-in user's requests
            const res = await axios.get('/api/leave/my-requests', config);
            setRequests(res.data);
        } catch (err) {
            console.error(err.response.data);
            if (err.response.status === 401) {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token');
                localStorage.removeItem('role'); 
                window.location.href = '/login';
            }
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []); 

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // This is the form submission handler
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token,
                },
            };
            // Submits a NEW request
            await axios.post('/api/leave', formData, config);
            alert('Leave request submitted!');
            setFormData({ startDate: '', endDate: '', reason: '' }); 
            fetchRequests(); // Re-fetches to show the new request
        } catch (err) {
            console.error(err.response.data);
            alert('Error submitting request: ' + err.response.data.msg);
        }
    };

    return (
        <div>
            <h2>Employee Dashboard</h2>

            {/* --- THIS FORM IS FOR THE EMPLOYEE --- */}
            <h3>Apply for Leave</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Start Date: </label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>End Date: </label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Reason: </label>
                    <textarea
                        placeholder="Reason for leave"
                        name="reason"
                        value={formData.reason}
                        onChange={onChange}
                        required
                    ></textarea>
                </div>
                <input type="submit" value="Submit Request" />
            </form>

            <hr />
            {/* --- THIS LIST SHOWS ONLY THE EMPLOYEE'S REQUESTS --- */}
            <h3>My Leave Requests</h3>
            {requests.length === 0 ? (
                <p>You have no leave requests.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {requests.map((req) => (
                        <li key={req._id} className="request-item">
                            <strong>Reason:</strong> {req.reason}<br />
                            <strong>From:</strong> {new Date(req.startDate).toLocaleDateString()}<br />
                            <strong>To:</strong> {new Date(req.endDate).toLocaleDateString()}<br />
                            <strong>Status:</strong> 
                            <span className={`status-${req.status.toLowerCase()}`}>
                                {req.status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EmployeeDashboard;