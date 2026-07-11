import type { CallHandler, ExecutionContext } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { firstValueFrom, of, throwError } from "rxjs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RequestLoggerInterceptor } from "./request-logger.interceptor";

const context = {
  switchToHttp: () => ({
    getRequest: () => ({ method: "GET", url: "/api/v1/health" }),
  }),
} as unknown as ExecutionContext;

describe("RequestLoggerInterceptor", () => {
  afterEach(() => vi.restoreAllMocks());

  it("logs successful requests", async () => {
    const log = vi
      .spyOn(Logger.prototype, "log")
      .mockImplementation(() => undefined);
    const next = { handle: () => of("ok") } as CallHandler;

    await firstValueFrom(
      new RequestLoggerInterceptor().intercept(context, next),
    );

    expect(log).toHaveBeenCalledWith(
      expect.stringMatching(/^GET \/api\/v1\/health completed in \d+ms$/),
    );
  });

  it("logs and preserves request failures", async () => {
    const error = vi
      .spyOn(Logger.prototype, "error")
      .mockImplementation(() => undefined);
    const next = {
      handle: () => throwError(() => new Error("failure")),
    } as CallHandler;

    await expect(
      firstValueFrom(new RequestLoggerInterceptor().intercept(context, next)),
    ).rejects.toThrow("failure");
    expect(error).toHaveBeenCalledWith(
      expect.stringMatching(/^GET \/api\/v1\/health failed in \d+ms: failure$/),
    );
  });
});
