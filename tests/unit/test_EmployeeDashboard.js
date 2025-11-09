import { render } from '@testing-library/react';
import EmployeeDashboard from '../../client/src/components/EmployeeDashboard'; 

test('EmployeeDashboard component renders without crashing', () => {
  render(<EmployeeDashboard />);
});