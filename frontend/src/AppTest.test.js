import React from 'react';
import { render, fireEvent, waitFor, getByRole } from '@testing-library/react';
import Login from './components/Login/Login';
import { loginUser } from './components/api';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

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

  describe('App Component', () => {
    it('renders the 60 Minutes button', () => {
      // Render the App component
      const { getByText } = render(<App />);
      
      // Check if the "60 Minutes" button is rendered
      const sixtyMinutesButton = getByText(/60 Minutes/i);
      
      // Assert that the button is in the document
      expect(sixtyMinutesButton).toBeDefined();
    });
  });

  describe('App Component', () => {
    it('renders the 20 Minutes button', () => {
      // Render the App component
      const { getByText } = render(<App />);
      
      // Check if the "60 Minutes" button is rendered
      const twentyMinutesButton = getByText(/20 Minutes/i);
      
      // Assert that the button is in the document
      expect(twentyMinutesButton).toBeDefined();
    });
  });

  describe('App Component', () => {
    it('renders the 5 Minutes button', () => {
      // Render the App component
      const { getByText } = render(<App />);
      
      // Check if the "60 Minutes" button is rendered
      const fiveMinutesButton = getByText(/5 Minutes/i);
      
      // Assert that the button is in the document
      expect(fiveMinutesButton).toBeDefined();
    });
  });

  test('Timer starts countdown when 60 Minutes button is clicked', async () => {
    // Render the component
    const { getByText, getByTestId } = render(<App />);
  
    // Find the button for 60 Minutes and click it
    const button60Minutes = getByText('60 Minutes');
    fireEvent.click(button60Minutes);

    jest.advanceTimersByTime(1000);
  
    // Wait for the timer to start counting down
    await waitFor(() => {
      expect(getByTestId('timer')).toHaveTextContent('59:59'); // Assuming the timer starts at 60 minutes and counts down
    });
  });

  /*
  test('updates tasks when new task is added', () => {
    const { getByText, getByPlaceholderText } = render(
        <App />
    );
    const input = getByText(/Add Item/i);
    fireEvent.change(input, { target: { value: 'Read a book' } });
    fireEvent.click(getByText('Add Item'));
    const newItem = getByText('Read a book');
    expect(newItem).toBeInTheDocument();
  });
  */


});



