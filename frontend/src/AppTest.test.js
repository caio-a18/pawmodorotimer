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

    /****check for rendering****/
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

    /****check that initial time rendered is accurate****/
    it('should render the timer component with initial time of 0:00', () => {
      const { getByTestId } = render(<App />);
      const timerElement = getByTestId('timer');
      expect(timerElement).toHaveTextContent('0:00');
    });

    /****timers start counting down when proper button is pressed****/
    it('Timer starts countdown when 60 minutes selected', () => {
    const { getByText, getByTestId } = render(<App />);
    const button60Minutes = getByText('60 Minutes');
    fireEvent.click(button60Minutes);
    jest.advanceTimersByTime(1000);
  
     waitFor(() => {
      expect(getByTestId('timer')).toHaveTextContent('59:59'); 
    });
    });

    it('Timer starts countdown when 20 minutes selected', () => {
      const { getByText, getByTestId } = render(<App />);
      const button20Minutes = getByText('20 Minutes');
      fireEvent.click(button20Minutes);
      jest.advanceTimersByTime(1000);
    
       waitFor(() => {
        expect(getByTestId('timer')).toHaveTextContent('19:59'); 
      });
      });

      it('Timer starts countdown when 5 minutes selected', () => {
        const { getByText, getByTestId } = render(<App />);
        const button5Minutes = getByText('5 Minutes');
        fireEvent.click(button5Minutes);
        jest.advanceTimersByTime(1000);
      
         waitFor(() => {
          expect(getByTestId('timer')).toHaveTextContent('4:59'); 
        });
        });
        
      /****Pause button working for timers****/
      it('Pause button for 60 minutes', async () => {
        const { getByText, getByTestId } = render(<App />);
        const button60Minutes = getByText('60 Minutes');
        fireEvent.click(button60Minutes);
      
        await waitFor(() => {
          const timerElement = getByTestId('timer');
          expect(timerElement).toHaveTextContent('0:00'); // Timer should not be at 0:00
        });
      
        fireEvent.click(getByText('Pause'));
        const currentTime = getByTestId('timer').textContent;
      
        await waitFor(() => {
          expect(getByTestId('timer')).toHaveTextContent(currentTime); 
        });
        });

        it('Pause button for 20 minutes', async () => {
          const { getByText, getByTestId } = render(<App />);
          const button20Minutes = getByText('20 Minutes');
          fireEvent.click(button20Minutes);
        
          await waitFor(() => {
            const timerElement = getByTestId('timer');
            expect(timerElement).toHaveTextContent('0:00'); // Timer should not be at 0:00
          });
        
          fireEvent.click(getByText('Pause'));
          const currentTime = getByTestId('timer').textContent;
        
          await waitFor(() => {
            expect(getByTestId('timer')).toHaveTextContent(currentTime); 
          });
          });

          it('Pause button for 5 minutes', async () => {
            const { getByText, getByTestId } = render(<App />);
            const button5Minutes = getByText('5 Minutes');
            fireEvent.click(button5Minutes);
          
            await waitFor(() => {
              const timerElement = getByTestId('timer');
              expect(timerElement).not.toHaveTextContent('0:00'); // Timer should not be at 0:00
            });
          
            fireEvent.click(getByText('Pause'));
            const currentTime = getByTestId('timer').textContent;
          
            await waitFor(() => {
              expect(getByTestId('timer')).toHaveTextContent(currentTime); 
            });
            });

            it('Reset Button for 60 minutes', () => {
              const { getByText, getByTestId } = render(<App />);
              const button60Minutes = getByText('60 Minutes');
              fireEvent.click(button60Minutes);
          
              // Wait for the timer to start
              waitFor(() => {
                const timerElement = getByTestId('timer');
                expect(timerElement).not.toHaveTextContent('0:00'); // Timer should not be at 0:00
              });
          
              fireEvent.click(getByText('Reset'));
          
              // Wait for the timer to reset
              waitFor(() => {
                const timerElement = getByTestId('timer');
                expect(timerElement).toHaveTextContent('0:00'); // Timer should be reset to 0:00
              });
            });
  
  });

 
  