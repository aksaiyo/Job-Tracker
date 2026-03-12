import { validateProspect } from "../prospect-helpers";
import { insertProspectSchema } from "@shared/schema";

const BASE = {
  companyName: "Acme",
  roleTitle: "Engineer",
};

describe("follow-up date validation (prospect-helpers)", () => {
  test("accepts a valid YYYY-MM-DD date", () => {
    const result = validateProspect({ ...BASE, followUpDate: "2025-06-15" });
    expect(result.valid).toBe(true);
  });

  test("accepts null (date is optional)", () => {
    const result = validateProspect({ ...BASE, followUpDate: null });
    expect(result.valid).toBe(true);
  });

  test("accepts when followUpDate is omitted", () => {
    const result = validateProspect({ ...BASE });
    expect(result.valid).toBe(true);
  });

  test("rejects a date in wrong format (MM/DD/YYYY)", () => {
    const result = validateProspect({ ...BASE, followUpDate: "06/15/2025" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Follow-up date must be in YYYY-MM-DD format");
  });

  test("rejects a plain string", () => {
    const result = validateProspect({ ...BASE, followUpDate: "next tuesday" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Follow-up date must be in YYYY-MM-DD format");
  });

  test("rejects an empty string", () => {
    const result = validateProspect({ ...BASE, followUpDate: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Follow-up date must be in YYYY-MM-DD format");
  });
});

describe("follow-up date validation (Zod schema)", () => {
  const base = {
    companyName: "Acme",
    roleTitle: "Engineer",
    status: "Bookmarked" as const,
    interestLevel: "Medium" as const,
  };

  test("accepts a valid date string", () => {
    const result = insertProspectSchema.safeParse({ ...base, followUpDate: "2025-12-01" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.followUpDate).toBe("2025-12-01");
  });

  test("coerces empty string to null", () => {
    const result = insertProspectSchema.safeParse({ ...base, followUpDate: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.followUpDate).toBeNull();
  });

  test("coerces undefined to null", () => {
    const result = insertProspectSchema.safeParse({ ...base, followUpDate: undefined });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.followUpDate).toBeNull();
  });

  test("coerces explicit null to null", () => {
    const result = insertProspectSchema.safeParse({ ...base, followUpDate: null });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.followUpDate).toBeNull();
  });

  test("rejects wrong format MM/DD/YYYY", () => {
    const result = insertProspectSchema.safeParse({ ...base, followUpDate: "12/01/2025" });
    expect(result.success).toBe(false);
  });

  test("rejects free-text date", () => {
    const result = insertProspectSchema.safeParse({ ...base, followUpDate: "next week" });
    expect(result.success).toBe(false);
  });
});

describe("overdue detection logic", () => {
  function isOverdue(followUpDate: string, today: string): boolean {
    return followUpDate < today;
  }

  test("a past date is overdue", () => {
    expect(isOverdue("2020-01-01", "2025-06-01")).toBe(true);
  });

  test("today is not overdue", () => {
    expect(isOverdue("2025-06-01", "2025-06-01")).toBe(false);
  });

  test("a future date is not overdue", () => {
    expect(isOverdue("2099-01-01", "2025-06-01")).toBe(false);
  });

  test("yesterday is overdue", () => {
    expect(isOverdue("2025-05-31", "2025-06-01")).toBe(true);
  });

  test("tomorrow is not overdue", () => {
    expect(isOverdue("2025-06-02", "2025-06-01")).toBe(false);
  });
});
