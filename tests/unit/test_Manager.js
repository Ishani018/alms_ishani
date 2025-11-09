// RequestAction.test.js

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import RequestAction from '../../client/src/components/manager/RequestAction'; 
// Assuming the component is located at the path above, adjust as needed

// Mock the API call function (e.g., axios or a custom hook)
// You need to mock the function that the component calls to update the status
const mockUpdateStatus = jest.fn(); 
jest.mock('../../client/src/api/managerApi', () => ({
    updateLeaveRequestStatus: (id, status) => mockUpdateStatus(id, status),
}));

// Mock the parent function that handles successful updates (e.g., to refresh the list)
const mockOnUpdateSuccess = jest.fn();

const mockRequest = {
    _id: '12345',
    user: { name: 'Alice' },
    status: 'Pending',
    reason: 'Sick leave',
    startDate: '2025-01-10',
    endDate: '2025-01-11',
};

describe('RequestAction Component', () => {

    test('RequestAction component renders correctly for a Pending request', () => {
        render(
            <RequestAction 
                request={mockRequest} 
                onUpdateSuccess={mockOnUpdateSuccess}
            />
        );

        // Check if the request details are visible
        expect(screen.getByText(/Alice/i)).toBeInTheDocument();
        expect(screen.getByText(/Pending/i)).toBeInTheDocument();
        
        // Check if the action buttons are present for a pending request
        expect(screen.getByRole('button', { name: /Approve/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument();
    });

    test('Clicking Approve button calls the update API with "Approved"', async () => {
        // Reset the mock before the test
        mockUpdateStatus.mockClear(); 
        
        render(
            <RequestAction 
                request={mockRequest} 
                onUpdateSuccess={mockOnUpdateSuccess}
            />
        );

        const approveButton = screen.getByRole('button', { name: /Approve/i });
        fireEvent.click(approveButton);

        // Ensure the API function was called with the correct status
        // We use waitFor because API calls are asynchronous
        await waitFor(() => {
            expect(mockUpdateStatus).toHaveBeenCalledWith('12345', 'Approved');
        });
        
        // Ensure the success callback is fired
        expect(mockOnUpdateSuccess).toHaveBeenCalledTimes(1);
    });

    test('Clicking Reject button calls the update API with "Rejected"', async () => {
        // Reset the mock before the test
        mockUpdateStatus.mockClear(); 

        render(
            <RequestAction 
                request={mockRequest} 
                onUpdateSuccess={mockOnUpdateSuccess}
            />
        );

        const rejectButton = screen.getByRole('button', { name: /Reject/i });
        fireEvent.click(rejectButton);

        await waitFor(() => {
            expect(mockUpdateStatus).toHaveBeenCalledWith('12345', 'Rejected');
        });
        
        expect(mockOnUpdateSuccess).toHaveBeenCalledTimes(1);
    });
    
    test('Does not show action buttons for an already Approved request', () => {
        const approvedRequest = { ...mockRequest, status: 'Approved' };
        
        render(
            <RequestAction 
                request={approvedRequest} 
                onUpdateSuccess={mockOnUpdateSuccess}
            />
        );
        
        expect(screen.queryByRole('button', { name: /Approve/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Reject/i })).not.toBeInTheDocument();
        expect(screen.getByText(/Approved/i)).toBeInTheDocument();
    });
});