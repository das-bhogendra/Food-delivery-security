# TODO - Test fixes (tests only)

## Completed
- Updated `src/services/_tests_/user.service.test.ts` to match current `UserService.loginUser()` behavior:
  - Added `updateLastLogin` mock returning an object with `toObject()`.
  - Fixed `loginUser` missing `getAuthUser` expectations.
- Updated `src/services/_tests_/user.service.test.ts` "user not found" test to mock `getAuthUser` (not `getUserByEmail`).

## Remaining
- Fix integration auth + cookie-based authorization across failing integration tests:
  - `/_tests_/integration/auth/login.test.ts`
  - `/_tests_/integration/auth/whoami.test.ts`
  - `/_tests_/integration/auth/updateProfile.test.ts`
  - `/_tests_/integration/food/*` tests that expect authorized access
  - `/_tests_/integration/order/*` tests that expect authorized access

Expected approach:
- Update integration tests to authenticate by using the `auth_token` cookie set by `/api/auth/login` (authorizedMiddleware reads `req.cookies.auth_token`).
- Avoid using `Authorization: Bearer ...` header where middleware no longer reads it.
- Prefer `request.agent(app)` for cookie persistence.
- Update integration tests to avoid race/rate-limit failures (429) by resetting state and using unique emails.

