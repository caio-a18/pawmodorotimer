import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from './components/Login/Login';
import { loginUser } from './components/api';
import App from './App';

test('App renders without crashing', () => {
  render(<App />);
});

test('Login renders without crashing', () => {
  render(<Login />);
});

jest.mock('./components/api'); // Mock the API module

describe('Login Component', () => {
  it('should log in successfully', async () => {
    // Define mock token
    const mockToken = 'mockToken';
    const username = 'Noah';

    // Mock loginUser function to return mock token
    loginUser.mockResolvedValueOnce(mockToken);

    // Define mock function for handleLoginSuccess
    const handleLoginSuccess = jest.fn();

    // Render the Login component
    const { getByLabelText, getByText } = render(
      <Login setToken={handleLoginSuccess} handleLoginSuccess={handleLoginSuccess} />
    );

    // Simulate user input and form submission
    fireEvent.change(getByLabelText(/Username/i), { target: { value: 'Noah' } });
    fireEvent.change(getByLabelText(/Password/i), { target: { value: 'noahisawesome' } });
    fireEvent.click(getByText('Submit'));

    // Wait for the login process to complete
    await waitFor(() => {
      // Verify that loginUser and handleLoginSuccess were called with the expected arguments
      expect(loginUser).toHaveBeenCalledWith({ username: 'Noah', password: 'noahisawesome' });
      expect(handleLoginSuccess).toHaveBeenCalledWith('Noah', 'mockToken');
    });
  });
});


