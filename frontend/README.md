# IShowSpeed Template

## Techstack

- FastAPI
- Vite + React
- Shadcn
- Electron
- React router

## To get most out of the dev experience

1. Set up

```bash
brew install mise
brew install mprocs
mise trust
mise install
mise run i
cd front && npm install
cd electron && pnpm install
```

2. To start both backend and frontend run `mprocs` (run electron with `cd electron && pnpm dev`)

3. Check frontend at http://localhost:5173 and backend at http://localhost:8000/docs

# TODOs

- [ ] how to port Vite to Electron
- [ ] bundle backend with Electron
- [x] deploy vite frontend to github pages
