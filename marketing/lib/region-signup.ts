export type SignupRegion = "us" | "eu";

const SIGNUP_URLS: Record<SignupRegion, string> = {
  us: "/api/workos/login?screenHint=sign-up",
  eu: "https://eu.ruby.ad/api/workos/login?screenHint=sign-up",
};

export function getSignupUrlForRegion(region: SignupRegion): string {
  return SIGNUP_URLS[region];
}
