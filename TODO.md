# TODO - Minimal secure fix for auth_token cookie after login

## Plan summary
- Root cause: login happens in Next.js Server Action, so Express `Set-Cookie: auth_token` is not applied to browser.
- Fix: make login request happen from the browser (client-side) so cookie is set by the browser.

## Steps
1. Inspect current client login flow (login hook + form) and confirm it calls `handleLogin` server action.
2. Replace the client-side login call to perform the `/api/auth/login` request directly from the browser using existing axios instance (`withCredentials: true`).
3. Keep CSRF behavior intact by including `x-csrf-token` header (axios interceptor already does for configured in-memory csrf token).
4. After login succeeds in browser, store `user_data` cookie using existing `setUserData` server action or client cookie setter (prefer current server action for consistency).
5. Update redirection logic to use the response’s user payload.
6. Run/build/test (at least lint/typecheck) to ensure no regressions.

