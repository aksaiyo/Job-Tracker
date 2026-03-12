import { validateProspect } from "../prospect-helpers";
import { insertProspectSchema } from "@shared/schema";

describe("target salary validation (prospect-helpers)", () => {
  test("accepts a valid positive integer salary", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      targetSalary: 120000,
    });
    expect(result.valid).toBe(true);
  });

  test("accepts null salary (salary is optional)", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      targetSalary: null,
    });
    expect(result.valid).toBe(true);
  });

  test("accepts when salary is omitted entirely", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
    });
    expect(result.valid).toBe(true);
  });

  test("rejects zero salary", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      targetSalary: 0,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must be a positive whole number");
  });

  test("rejects negative salary", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      targetSalary: -50000,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must be a positive whole number");
  });

  test("rejects a decimal salary", () => {
    const result = validateProspect({
      companyName: "Acme",
      roleTitle: "Engineer",
      targetSalary: 99.99,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must be a positive whole number");
  });
});

describe("target salary validation (Zod schema)", () => {
  const base = {
    companyName: "Acme",
    roleTitle: "Engineer",
    status: "Bookmarked" as const,
    interestLevel: "Medium" as const,
  };

  test("coerces a numeric string to a number", () => {
    const result = insertProspectSchema.safeParse({ ...base, targetSalary: "120000" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.targetSalary).toBe(120000);
  });

  test("coerces empty string to null", () => {
    const result = insertProspectSchema.safeParse({ ...base, targetSalary: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.targetSalary).toBeNull();
  });

  test("coerces undefined to null", () => {
    const result = insertProspectSchema.safeParse({ ...base, targetSalary: undefined });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.targetSalary).toBeNull();
  });

  test("fails when salary is 0", () => {
    const result = insertProspectSchema.safeParse({ ...base, targetSalary: 0 });
    expect(result.success).toBe(false);
  });

  test("fails when salary is negative", () => {
    const result = insertProspectSchema.safeParse({ ...base, targetSalary: -1 });
    expect(result.success).toBe(false);
  });

  test("passes when salary is a positive integer", () => {
    const result = insertProspectSchema.safeParse({ ...base, targetSalary: 95000 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.targetSalary).toBe(95000);
  });

  test("passes when salary is null explicitly", () => {
    const result = insertProspectSchema.safeParse({ ...base, targetSalary: null });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.targetSalary).toBeNull();
  });
});
