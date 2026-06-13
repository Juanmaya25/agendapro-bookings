import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App.jsx';

afterEach(cleanup);

describe('AgendaPro App', () => {
  it('renders the dashboard hero greeting', () => {
    render(<App />);
    expect(screen.getByText(/Hola, hermosa/)).toBeInTheDocument();
  });

  it('navigates to Reservas and lists seeded bookings', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Reservas' }));
    expect(screen.getByText('María López')).toBeInTheDocument();
    expect(screen.getByText('Sofía García')).toBeInTheDocument();
  });

  it('filters bookings by search query', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Reservas' }));
    fireEvent.change(screen.getByPlaceholderText('Buscar cliente o servicio...'), { target: { value: 'Sofía' } });
    expect(screen.getByText('Sofía García')).toBeInTheDocument();
    expect(screen.queryByText('María López')).not.toBeInTheDocument();
  });

  it('shows the Servicios catalogue', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Servicios' }));
    expect(screen.getByText('Tinte completo')).toBeInTheDocument();
  });

  it('toggles light/dark theme', () => {
    const { container } = render(<App />);
    const root = container.firstChild;
    const before = root.style.color; // dark text color
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar tema' }));
    expect(root.style.color).not.toBe(before); // switches to light text color
  });
});
