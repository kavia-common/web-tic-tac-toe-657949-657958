import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
});

test('allows players to take turns and detects winner', () => {
  render(<App />);
  const cells = screen.getAllByRole('button', { name: /Cell/i });
  // X moves
  fireEvent.click(cells[0]); // X
  fireEvent.click(cells[3]); // O
  fireEvent.click(cells[1]); // X
  fireEvent.click(cells[4]); // O
  fireEvent.click(cells[2]); // X wins
  expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();
});
