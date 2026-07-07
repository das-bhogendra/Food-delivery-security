# TODO - Fix EADDRINUSE (Port already in use)

- [x] Identify the port and confirm it is already listening on 5005.
- [ ] Add a safe startup behavior in `src/index.ts` to handle `EADDRINUSE`.
- [ ] Provide a quick operational fix: stop the existing process using port 5005, or change `PORT`.
- [ ] Re-run backend start and confirm server boot.

