const STATIC_ALLOWED_ORIGINS = [
  // Front edge.
  "https://front-edge.ruby.ad",
  "https://eu.front-edge.ruby.ad",
  // Marketing edge.
  "https://marketing-edge.ruby.ad",
  // Front extension.
  "https://front-ext.ruby.ad",
  // Chrome extension.
  "chrome-extension://okjldflokifdjecnhbmkdanjjbnmlihg",
  "chrome-extension://fnkfcndbgingjcbdhaofkcnhcjpljhdn",
  // Documentation website.
  "https://docs.ruby.ad",
  // Microsoft Power Automate.
  "https://make.powerautomate.com",
  "https://office-addins.ruby.ad",
  // Poke SPA (backoffice).
  "https://poke.ruby.ad",
  // Main app (front-spa).
  "https://app.ruby.ad",
  // Next.js server (landing page, OAuth, API routes).
  "https://ruby.ad",
  "https://eu.ruby.ad",
  // Marketing edge (standalone marketing Next.js app).
  "https://marketing-edge.ruby.ad",
] as const;

const ALLOWED_ORIGIN_PATTERNS = [
  // Zendesk domains
  new RegExp("^https://.+\\.zendesk\\.com$"),
  // Staging apps - allow all builds from *.preview.ruby.ad .
  new RegExp("^https://.*\\.preview\\.ruby\\.tt$"),
  // Firefox Internal UUID is not stable, allow all moz-extension origins.
  new RegExp("^moz-extension://"),
] as const;

type StaticAllowedOriginType = (typeof STATIC_ALLOWED_ORIGINS)[number];

export function isAllowedOrigin(origin: string): boolean {
  return (
    STATIC_ALLOWED_ORIGINS.includes(origin as StaticAllowedOriginType) ||
    ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin))
  );
}

export const ALLOWED_HEADERS = [
  "authorization",
  "content-type",
  "mcp-protocol-version",
  "mcp-session-id",
  "x-commit-hash",
  "x-ruby-extension-version",
  "x-build-date",
  "x-hackerone-research",
  "x-request-origin",
  // Marketing site (academy quiz/progress endpoints).
  "x-academy-browser-id",
  "x-csrf-token",
  // Datadog RUM tracing headers (injected automatically by the browser SDK).
  "traceparent",
  "tracestate",
  "x-datadog-origin",
  "x-datadog-parent-id",
  "x-datadog-sampling-priority",
  "x-datadog-trace-id",
] as const;
type AllowedHeaderType = (typeof ALLOWED_HEADERS)[number];

export function isAllowedHeader(header: string): header is AllowedHeaderType {
  return ALLOWED_HEADERS.includes(header as AllowedHeaderType);
}
