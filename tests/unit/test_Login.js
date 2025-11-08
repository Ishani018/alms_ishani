import { render } from '@testing-library/react';
import Login from '../../client/src/components/Login'; // Adjust path if needed

test('Login component renders without crashing', () => {
  render(<Login />);
});