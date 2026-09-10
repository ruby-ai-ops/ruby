import { RubyError } from "@app/lib/error";

export function errorToString(error: unknown): string {
  if (error instanceof Error) {
    const cause = "cause" in error ? errorToString(error.cause) : null;
    return `${error.message}${cause ? `\n- Cause: ${cause}` : ""}`;
  } else if (typeof error === "string") {
    return error;
  }
  return JSON.stringify(error);
}

export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(errorToString(error));
}

export function normalizeAsInternalRubyError(
  error: unknown
): RubyError<"internal_error"> {
  if (error instanceof RubyError && error.code === "internal_error") {
    return error;
  }

  return new RubyError("internal_error", errorToString(error));
}
