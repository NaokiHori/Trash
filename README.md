# [Trash](https://naokihori.github.io/Trash/)

[![License](https://img.shields.io/github/license/NaokiHori/Trash)](https://opensource.org/license/MIT)
[![Deploy](https://github.com/NaokiHori/Trash/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/NaokiHori/Trash/actions/workflows/deploy.yml)

Series of shitty web applications I developed for fun.

## Set up

```bash
docker compose build app
```

## Launch development server

```bash
docker compose up
```

Access `http://localhost:5173/` or

```bash
open http://localhost:5173/
```

Check available dev tools:

```bash
make help
```

## (Dev) Dependencies included in the container

- @types/node
- typescript
- oxfmt
- oxlint
- vite
