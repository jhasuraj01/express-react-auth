## Project Setup

```
npm init
```

```json
{
  "install:client": "npm install --prefix client",
  "install:server": "npm install --prefix server",
  "install": "npm run install:client && npm run install:server",
  "build:client": "npm run build --prefix client",
  "build:server": "npm run build --prefix server",
  "build": "npm run build:client && npm run build:server",
  "dev:client": "npm run dev --prefix client",
  "dev:server": "npm run dev --prefix server",
  "dev": "concurrently 'npm:dev:client' 'npm:dev:server'",
  "start": "npm run start --prefix server"
}
```

```bash
npm i concurrently
```

```bash
npm create vite@latest
```

```bash
npx express-generator-typescript server  --with-auth
```