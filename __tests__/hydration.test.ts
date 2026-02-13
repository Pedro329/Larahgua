import { describe, it, expect } from "vitest";

describe("Hydration Logic", () => {
  it("should calculate percentage correctly", () => {
    const consumed = 1500;
    const goal = 2000;
    const percentage = Math.min(Math.round((consumed / goal) * 100), 100);
    expect(percentage).toBe(75);
  });

  it("should not exceed 100% even if consumed > goal", () => {
    const consumed = 2500;
    const goal = 2000;
    const percentage = Math.min(Math.round((consumed / goal) * 100), 100);
    expect(percentage).toBe(100);
  });

  it("should format date correctly", () => {
    const date = new Date("2026-02-13T10:30:00");
    const dateStr = date.toISOString().split("T")[0];
    expect(dateStr).toBe("2026-02-13");
  });

  it("should calculate reminder count correctly", () => {
    const startHour = 8;
    const endHour = 22;
    const intervalMinutes = 60;
    const hoursActive = endHour - startHour;
    const notificationsPerDay = Math.floor((hoursActive * 60) / intervalMinutes);
    expect(notificationsPerDay).toBe(14);
  });
});
