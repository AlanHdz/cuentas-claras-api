# Cuentas Claras API

API para dividir gastos entre amigos: grupos, quién pagó qué, quién le debe a quién y liquidaciones. Soporta pesos, dólares y otras divisas con el tipo de cambio oficial de Banxico.

> Estado: en desarrollo (Fase 0 — setup y deploy).

## Stack

- NestJS 12 + TypeScript (modo estricto)
- oxlint (lint) y Prettier (formato)
- Vitest (tests)

## Requisitos

- Node.js 22 o superior
- npm 10 o superior

## Instalación

```bash
npm ci
```

## Comandos

| Comando                | Qué hace                                   |
| ---------------------- | ------------------------------------------ |
| `npm run start:dev`    | Levanta la API en modo watch (puerto 3000) |
| `npm run build`        | Compila a `dist/`                          |
| `npm run lint`         | Revisa el código con oxlint (type-aware)   |
| `npm run format`       | Formatea todo el proyecto con Prettier     |
| `npm run format:check` | Falla si algún archivo no está formateado  |
| `npm test`             | Corre los tests unitarios                  |
| `npm run test:e2e`     | Corre los tests end-to-end                 |

## Variables de entorno

El archivo `.env` nunca se sube al repo. Las variables se documentarán aquí a partir de F0-2.
