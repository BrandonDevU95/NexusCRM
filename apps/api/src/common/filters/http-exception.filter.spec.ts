import { BadRequestException, type ArgumentsHost } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { HttpExceptionFilter } from "./http-exception.filter";

function createHost() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  const host = {
    switchToHttp: () => ({
      getRequest: () => ({ method: "GET", url: "/api/v1/example" }),
      getResponse: () => ({ status }),
    }),
  } as unknown as ArgumentsHost;

  return { host, json, status };
}

describe("HttpExceptionFilter", () => {
  it("normalizes known HTTP exceptions", () => {
    const { host, json, status } = createHost();

    new HttpExceptionFilter().catch(
      new BadRequestException("Invalid input"),
      host,
    );

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        path: "/api/v1/example",
        message: "Invalid input",
      }),
    );
  });

  it("does not expose unexpected errors", () => {
    const { host, json, status } = createHost();

    new HttpExceptionFilter().catch(new Error("database credentials"), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: "Internal server error",
      }),
    );
  });
});
