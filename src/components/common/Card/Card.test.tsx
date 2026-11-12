import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Card Title');
  });

  it('renders footer when provided', () => {
    render(<Card footer={<button>Action</button>}>Content</Card>);
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('renders with title and footer together', () => {
    render(
      <Card title="Title" footer={<p>Footer content</p>}>
        Body content
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies border by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toMatch(/border/);
  });

  it('removes border when bordered={false}', () => {
    const { container } = render(<Card bordered={false}>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toMatch(/border/);
  });

  it('applies shadow variants', () => {
    const { container: container1 } = render(<Card shadow="sm">Content</Card>);
    expect((container1.firstChild as HTMLElement).className).toMatch(/shadow-sm/);

    const { container: container2 } = render(<Card shadow="md">Content</Card>);
    expect((container2.firstChild as HTMLElement).className).toMatch(/shadow-md/);
  });

  it('applies padding variants', () => {
    const { container: container1 } = render(<Card padding="sm">Content</Card>);
    expect((container1.firstChild as HTMLElement).className).toMatch(/p-2/);

    const { container: container2 } = render(<Card padding="lg">Content</Card>);
    expect((container2.firstChild as HTMLElement).className).toMatch(/p-6/);
  });

  it('forwards extra className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild as HTMLElement).toHaveClass('custom-class');
  });

  it('defaults to base shadow and md padding', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toMatch(/shadow(?!-)/); // Match "shadow" but not "shadow-"
    expect(card.className).toMatch(/p-4/); // md padding is p-4
  });

  it('renders nothing when no title and no footer', () => {
    const { container } = render(<Card>Content</Card>);
    const headers = container.querySelectorAll('.header');
    const footers = container.querySelectorAll('.footer');
    expect(headers).toHaveLength(0);
    expect(footers).toHaveLength(0);
  });
});
