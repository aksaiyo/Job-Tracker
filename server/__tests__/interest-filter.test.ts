import type { Prospect } from "@shared/schema";

function filterByInterest(
  prospects: Prospect[],
  filter: "All" | "High" | "Medium" | "Low",
): Prospect[] {
  if (filter === "All") return prospects;
  return prospects.filter((p) => p.interestLevel === filter);
}

const makeProspect = (id: number, interestLevel: string): Prospect => ({
  id,
  companyName: `Company ${id}`,
  roleTitle: "Engineer",
  jobUrl: null,
  status: "Applied",
  interestLevel,
  notes: null,
  createdAt: new Date(),
});

const prospects: Prospect[] = [
  makeProspect(1, "High"),
  makeProspect(2, "High"),
  makeProspect(3, "Medium"),
  makeProspect(4, "Low"),
  makeProspect(5, "Low"),
];

describe("interest level column filter", () => {
  test("All returns every prospect", () => {
    expect(filterByInterest(prospects, "All")).toHaveLength(5);
  });

  test("High returns only High-interest prospects", () => {
    const result = filterByInterest(prospects, "High");
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.interestLevel === "High")).toBe(true);
  });

  test("Medium returns only Medium-interest prospects", () => {
    const result = filterByInterest(prospects, "Medium");
    expect(result).toHaveLength(1);
    expect(result[0].interestLevel).toBe("Medium");
  });

  test("Low returns only Low-interest prospects", () => {
    const result = filterByInterest(prospects, "Low");
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.interestLevel === "Low")).toBe(true);
  });

  test("returns empty array when no prospects match the filter", () => {
    const highOnly = [makeProspect(1, "High")];
    expect(filterByInterest(highOnly, "Low")).toHaveLength(0);
  });

  test("All on empty array returns empty array", () => {
    expect(filterByInterest([], "All")).toHaveLength(0);
  });

  test("filter does not mutate the original array", () => {
    const original = [...prospects];
    filterByInterest(prospects, "High");
    expect(prospects).toHaveLength(original.length);
  });
});
