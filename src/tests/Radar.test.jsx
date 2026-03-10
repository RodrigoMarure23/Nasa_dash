import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Radar from "../components/Radar";

describe("Radar Component", () => {
  const mockAsteroids = [
    {
      id: "1",
      name: "Ast1",
      missDistance: 500000,
      velocity: 12,
      isHazardous: false,
    },
    {
      id: "2",
      name: "Ast2",
      missDistance: 200000,
      velocity: 25,
      isHazardous: true,
    },
  ];

  const onSelectAsteroidMock = vi.fn();

  beforeEach(() => {
    onSelectAsteroidMock.mockClear();
  });

  it("renders the Earth with correct ARIA attributes", () => {
    render(
      <Radar
        asteroids={mockAsteroids}
        onSelectAsteroid={onSelectAsteroidMock}
      />,
    );
    const earth = screen.getByRole("img", { name: /Earth at the center/i });
    expect(earth).toBeInTheDocument();
    expect(earth).toHaveAttribute("tabindex", "0");
    expect(earth).toHaveAttribute("title", "Earth");
  });

  it("renders asteroid buttons with correct ARIA labels", () => {
    render(
      <Radar
        asteroids={mockAsteroids}
        onSelectAsteroid={onSelectAsteroidMock}
      />,
    );
    const asteroidButtons = screen.getAllByRole("button");
    expect(asteroidButtons.length).toBe(mockAsteroids.length);

    // Verificar label del primer asteroide
    expect(asteroidButtons[0]).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Asteroid Ast1"),
    );
  });

  it("calls onSelectAsteroid when an asteroid is clicked", () => {
    render(
      <Radar
        asteroids={mockAsteroids}
        onSelectAsteroid={onSelectAsteroidMock}
      />,
    );
    const asteroidButtons = screen.getAllByRole("button");

    fireEvent.click(asteroidButtons[1]);
    expect(onSelectAsteroidMock).toHaveBeenCalledTimes(1);
  });
});
