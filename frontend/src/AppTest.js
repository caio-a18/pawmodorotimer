import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
  });

  test('starts timer when start button is clicked', () => {
    const { getByText, getByRole } = render(<App />);
    const startButton = getByText('Start');
    fireEvent.click(startButton);
    const timerElement = getByRole('timer');
    expect(timerElement.textContent).not.toBe('0:00');
  });

  test('pauses timer when pause button is clicked', async () => {
    const { getByText, getByRole } = render(<App />);
    const startButton = getByText('Start');
    fireEvent.click(startButton);
    const pauseButton = getByText('Pause');
    fireEvent.click(pauseButton);
    const timerElement = getByRole('timer');
    const initialTime = timerElement.textContent;
    await waitFor(() => {
      expect(timerElement.textContent).toBe(initialTime);
    });
  });

  test('resets timer when reset button is clicked', async () => {
    const { getByText, getByRole } = render(<App />);
    const startButton = getByText('Start');
    fireEvent.click(startButton);
    const resetButton = getByText('Reset');
    fireEvent.click(resetButton);
    const timerElement = getByRole('timer');
    await waitFor(() => {
      expect(timerElement.textContent).toBe('0:00');
    });
  });

  test('adds item to todo list when "Add Item" button is clicked', () => {
    const { getByText, getByLabelText } = render(<App />);
    const addItemInput = getByLabelText('Add Item');
    fireEvent.change(addItemInput, { target: { value: 'Test Item' } });
    const addItemButton = getByText('Add Item');
    fireEvent.click(addItemButton);
    const todoList = getByText('Test Item');
    expect(todoList).toBeInTheDocument();
  });

  test('removes item from todo list when "Remove" button is clicked', () => {
    const { getByText, getByLabelText, queryByText } = render(<App />);
    const addItemInput = getByLabelText('Add Item');
    fireEvent.change(addItemInput, { target: { value: 'Test Item' } });
    const addItemButton = getByText('Add Item');
    fireEvent.click(addItemButton);
    const removeItemButton = getByText('Remove');
    fireEvent.click(removeItemButton);
    const removedItem = queryByText('Test Item');
    expect(removedItem).toBeNull();
  });

  // Add more test cases for other functionalities as needed
});
