import { render } from '@testing-library/react';
import Register from '../../client/src/components/Register'; // Adjust path if needed

test('Register component renders without crashing', () => {
  render(<Register />);
});