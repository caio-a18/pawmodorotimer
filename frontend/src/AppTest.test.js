
import React from 'react';
import { render, fireEvent } from '@testing-library/react'; // Import only 'render' once
import App from './App';
import Login from './components/Login/Login'; 

test('App renders without crashing', () => {
  render(<App />);
});

test('Login renders without crashing', () => {
  render(<Login />);
});

test('updates tasks when new task is added', () => {
  const { getByText, getByPlaceholderText } = render(
      <App />
  );
  const input = getByPlaceholderText('New Study Item');
  fireEvent.change(input, { target: { value: 'Read a book' } });
  fireEvent.click(getByText('Add Item'));
  const newItem = getByText('Read a book');
  expect(newItem).toBeInTheDocument();
});

  
 