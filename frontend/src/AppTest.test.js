import React from 'react';
import { render, fireEvent, waitFor, getByRole } from '@testing-library/react';
import Login from './components/Login/Login';
import { loginUser } from './components/api';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

//check to make sure app renders properly
test('App renders without crashing', () => {
  render(<App />);
});

//check to make sure login renders properly 
test('Login renders without crashing', () => {
  render(<Login />);
});

// Mock the API component to prepare test for simulating login 
jest.mock('./components/api'); 

//test area for login component 
describe('Login Component', () => {
  it('test for successful login', async () => {
    const mockToken = 'mockToken';
    const username = 'Noah';

    loginUser.mockResolvedValueOnce(mockToken);
    const handleLoginSuccess = jest.fn();
    const { getByLabelText, getByText } = render(
      <Login setToken={handleLoginSuccess} handleLoginSuccess={handleLoginSuccess} />
    );

    fireEvent.change(getByLabelText(/Username/i), { target: { value: 'Noah' } });
    fireEvent.change(getByLabelText(/Password/i), { target: { value: 'noahisawesome' } });
    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({ username: 'Noah', password: 'noahisawesome' });
      expect(handleLoginSuccess).toHaveBeenCalledWith('Noah', 'mockToken');
    });
  });
});

//test area for app component
  describe('App Component', () => {

    //check for rendering 60 mins button 
    it('renders the 60 Minutes button', () => {
      const { getByText } = render(<App />);
      const sixtyMinutesButton = getByText(/60 Minutes/i);
      expect(sixtyMinutesButton).toBeDefined();
    });

    it('renders the 20 Minutes button', () => {
      const { getByText } = render(<App />);
      const twentyMinutesButton = getByText(/20 Minutes/i);
      expect(twentyMinutesButton).toBeDefined();
    });

    it('renders the 5 Minutes button', () => {
      const { getByText } = render(<App />);
      const fiveMinutesButton = getByText(/5 Minutes/i);
      expect(fiveMinutesButton).toBeDefined();
    });

    it('should render the timer component with initial time of 0:00', () => {
      const { getByTestId } = render(<App />);
      const timerElement = getByTestId('timer');
      expect(timerElement).toHaveTextContent('0:00');
    });

    it('Timer starts countdown when 60 minutes selected', () => {
      // Render the component
    const { getByText, getByTestId } = render(<App />);
  
    // Find the button for 60 Minutes and click it
    const button60Minutes = getByText('60 Minutes');
    fireEvent.click(button60Minutes);

    jest.advanceTimersByTime(1000);
  
    // Wait for the timer to start counting down
     waitFor(() => {
      expect(getByTestId('timer')).toHaveTextContent('59:59'); // Assuming the timer starts at 60 minutes and counts down
    });
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

  test('Timer starts countdown when 20 Minutes button is clicked', async () => {
    // Render the component
    const { getByText, getByTestId } = render(<App />);
  
    // Find the button for 20 Minutes and click it
    const button20Minutes = getByText('20 Minutes');
    fireEvent.click(button20Minutes);

    jest.advanceTimersByTime(500);
    jest.advanceTimersByTime(500); 
    // Wait for the timer to start counting down
    await waitFor(() => {
      expect(getByTestId('timer')).toHaveTextContent('19:59'); 
    });
  });

  test('Timer starts countdown when 5 Minutes button is clicked', async () => {
    // Render the component
    const { getByText, getByTestId } = render(<App />);
  
    // Find the button for 20 Minutes and click it
    const button5Minutes = getByText('5 Minutes');
    fireEvent.click(button5Minutes);

    jest.advanceTimersByTime(500);
    jest.advanceTimersByTime(500);
    // Wait for the timer to start counting down
    await waitFor(() => {
      expect(getByTestId('timer')).toHaveTextContent('4:59'); 
    });
  });




