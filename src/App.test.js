import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renderiza el titulo de la aplicacion de musica', () => {
  render(<App />);
  const heading = screen.getByText(/Mi Reproductor - Music Box/i);
  expect(heading).toBeInTheDocument();
});

test('muestra la cancion en lista', () => {
  render(<App />);
  const song = screen.getByText(/THE SHADE/i);
  expect(song).toBeInTheDocument();
});