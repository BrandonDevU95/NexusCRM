import { describe, expect, it } from "vitest";
import {
  foundationDescription,
  foundationHeadline,
  foundationModules,
} from "./foundation";

describe("web foundation shell configuration", () => {
  it("describes the foundation and planned CRM modules", () => {
    expect(foundationHeadline).toBe("Foundation del CRM modular");
    expect(foundationDescription).toContain("seguridad");
    expect(foundationDescription).toContain("auditoría");
    expect(foundationModules).toHaveLength(10);
    expect(foundationModules).toEqual(
      expect.arrayContaining(["Clientes", "Inventario", "Reportes"]),
    );
    expect(new Set(foundationModules).size).toBe(foundationModules.length);
  });
});
