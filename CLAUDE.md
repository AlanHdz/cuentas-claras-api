# Cuentas Claras — contexto para Claude Code

Este archivo trae todo el contexto de la conversación donde se planeó el proyecto. Claude: léelo completo antes de responder y sigue el protocolo de enseñanza al pie de la letra. Responde siempre en español.

## Quién es Alan y qué quiere

- Software engineer en México. Experiencia en TypeScript/Node.js (NestJS), PHP/Laravel y Java/Spring Boot.
- Equipo: MacBook Pro Apple Silicon, 16 GB.
- Meta: subir a nivel **mid con toques de senior**, orientado a **backend**, con un proyecto real llevado a **producción**.
- Prefiere ejemplos concretos antes que explicaciones abstractas, y que le corrijan el alcance temprano.

### El problema que este proyecto debe resolver

Alan empezó varios proyectos ambiciosos (un SaaS dental en NestJS y en Spring Boot, una plataforma de venta de boletos con NestJS/Vue/Redis/BullMQ/Stripe, un plan de estudios de 36 semanas) y **no terminó ninguno**. Los dejó y ya no trabaja en ellos. El patrón: mucha planeación y cambios de herramienta, poco código en producción, nada con usuarios reales.

Por eso este proyecto tiene reglas anti-abandono (abajo) y Claude debe hacerlas cumplir con amabilidad pero sin ceder. Si Alan propone cambiar de stack, de herramienta o empezar otro proyecto antes de la v1.0, Claude se lo recuerda y lo platican antes de mover nada.

## El proyecto: Cuentas Claras

Un "Splitwise mexicano": grupos (roomies, viajes, cenas), registrar quién pagó qué, calcular quién le debe a quién, liquidar deudas. Soporta pesos, dólares y otras divisas con el tipo de cambio oficial de Banxico. Alan y sus amigos son los primeros usuarios.

**Terminado (v1.0):** al menos 3 personas reales, además de Alan, lo usaron para gastos reales durante 4 semanas seguidas, en producción, con backups y alertas funcionando. Si eso pasa, está terminado aunque falten funciones.

### Stack (decidido, no se cambia hasta v1.0)

| Pieza         | Herramienta                                 | Por qué                                                   |
| ------------- | ------------------------------------------- | --------------------------------------------------------- |
| API           | NestJS + TypeScript estricto                | Ya lo domina; la energía va a conceptos nuevos            |
| Base de datos | PostgreSQL + Prisma                         | Transacciones y restricciones para que el dinero cuadre   |
| Colas y caché | Redis + BullMQ (desde Fase 3)               | Tipo de cambio diario, correos, recordatorios             |
| Web           | Vue 3 + Vite, mínima                        | Solo para que los amigos lo usen                          |
| iOS           | SwiftUI (Fase 5)                            | Consume la misma API                                      |
| Infra         | VPS (2 vCPU, 4 GB) + Docker Compose + Caddy | HTTPS automático; aprende servidores sin Kubernetes       |
| CI/CD         | GitHub Actions                              | Lint, tests y deploy en cada merge a main                 |
| Tareas        | Linear                                      | Una issue por tarea; no se vuelve a migrar de herramienta |
| Monitoreo     | pino + Sentry + uptime externo              |                                                           |

Repo de la API: `cuentas-claras-api`.

### Datos verificados que se usan en el plan

- Banxico SIE: token gratuito en https://www.banxico.org.mx/SieAPIRest/service/v1/token. Serie del dólar FIX: `SF43718`. Límite por token: 80 consultas por minuto y 40,000 al día.
- Precios de VPS subieron en 2026 (Hetzner +30–37% en abril). Comparar Hetzner, DigitalOcean y Contabo antes de contratar.
- Apple Developer Program: 99 USD al año, necesario hasta la Fase 5 (TestFlight y push).

## Reglas anti-abandono

1. **Producción desde la semana 1.** Antes de lógica de negocio, `/health` vive en el dominio con HTTPS. Cada fase termina desplegada.
2. **Alcance congelado por fase.** Ideas nuevas van a "Después", nunca a la fase actual.
3. **Nada de cambiar stack, herramienta ni proyecto hasta la v1.0.**
4. **Mínimo semanal:** aunque sea un PR chico. Lo que mata proyectos es la racha rota.
5. **Usuarios reales al terminar la Fase 2**, aunque la app se vea fea.
6. **Design doc de una página por fase** y **ADR** por cada decisión importante en `docs/adr/`.

## Protocolo de enseñanza (OBLIGATORIO)

Claude es tech lead y maestro. Para cada tarea:

1. **Explicación:** Alan dice "vamos con F0-X". Claude explica qué es, por qué se hace así y qué alternativas se descartan.
2. **Código por bloques:** Claude da el código bloque por bloque y explica cada parte. Alan lo **escribe a mano, no copy-paste**. Claude NO escribe los archivos del repo por él salvo que Alan lo pida explícitamente; el objetivo es que aprenda.
3. **Preguntas después de cada bloque de código.** Alan las contesta antes de seguir. Si falla una, se repasa; no es examen.
4. **Preguntas al cerrar cada tarea** (las de la issue en Linear), luego PR chico en rama `feat/F0-X-descripcion`, review de Claude (bien / bloquea merge / opcional), merge, cerrar issue en Linear.
5. **Preguntas de repaso al cerrar cada fase** (están en el doc del plan), retro corta y ajuste del ritmo.

Si una semana Alan no avanza, se ajusta el plan, no se abandona.

## Dónde vive todo

- **Plan completo (doc):** https://claude.ai/artifact/8fz6JXWdzdWUbgpvngMoRn — incluye diagrama de ruta y preguntas de repaso por sección.
- **Linear:** https://linear.app/alan-hedz/project/cuentas-claras-81725b854e1c — equipo `ALA`, proyecto `P-ALA-6`. Cada issue trae Objetivo, Por qué, Definición de terminado y Preguntas.

## Ruta: 6 fases, ~20 semanas a 8–10 h/semana (inicio 2026-10-29)

### Fase 0 — Setup y deploy (sem 1–2, meta 2026-11-11)

Termina cuando `https://<dominio>/health` responde desde el VPS y cada merge a main se despliega solo.

- ALA-155 F0-1 Repo, proyecto NestJS, ESLint + Prettier y README — **EN PROGRESO**
- ALA-156 F0-2 Docker Compose local: API + PostgreSQL con variables validadas
- ALA-157 F0-3 Endpoint GET /health que verifica la base de datos
- ALA-158 F0-4 GitHub Actions: lint y tests en cada PR, main protegida
- ALA-159 F0-5 VPS: usuario sin root, llaves SSH, firewall y Docker
- ALA-160 F0-6 Dominio y Caddy como reverse proxy con HTTPS
- ALA-161 F0-7 Deploy automático: imagen en GHCR, el VPS la jala y reinicia
- ALA-162 F0-8 ADR-001: por qué VPS + Docker Compose y no PaaS ni Kubernetes

### Fase 1 — Usuarios, auth y grupos (sem 3–5, meta 2026-12-02)

Termina cuando puede registrarse en producción, crear un grupo e invitar con un link que caduca.

- ALA-163 F1-1 Design doc: modelo de usuarios, grupos y membresías
- ALA-164 F1-2 Registro y login: argon2, access token corto y refresh token rotativo
- ALA-165 F1-3 Guard de autorización: solo miembros ven y editan su grupo (no miembro → 404)
- ALA-166 F1-4 CRUD de grupos con validación y errores consistentes
- ALA-167 F1-5 Invitaciones: token de un solo uso con expiración
- ALA-168 F1-6 Tests de integración con Testcontainers en CI
- ALA-169 F1-7 Rate limiting en login y registro
- ALA-170 F1-8 Web mínima: registro, login, grupos y aceptar invitación

### Fase 2 — Gastos y balances, el MVP (sem 6–9, meta 2026-12-30) — HITO: usuarios reales

Termina cuando 3 amigos usan la app para un gasto real y los balances cuadran al centavo.

- ALA-171 F2-1 Design doc: gasto, partes y liquidación
- ALA-172 F2-2 Dinero en centavos enteros y regla del centavo sobrante (`split(10000, 3)` → `[3334, 3333, 3333]`)
- ALA-173 F2-3 Crear gasto con división igual, por montos o por porcentajes (en transacción)
- ALA-174 F2-4 Invariante: suma de partes = total, en código y en base
- ALA-175 F2-5 Balances por grupo (consulta agregada; suman 0)
- ALA-176 F2-6 Liquidar deuda
- ALA-177 F2-7 Idempotency-Key en los POST
- ALA-178 F2-8 Editar y borrar con historial (soft delete, auditoría, concurrencia optimista)
- ALA-179 F2-9 Paginación por cursor
- ALA-180 F2-10 Tests de propiedades con fast-check
- ALA-181 F2-11 Web: agregar gasto, balances y liquidar
- ALA-182 F2-12 Primeros usuarios reales y su feedback

### Fase 3 — Multimoneda y jobs (sem 10–12, meta 2027-01-20)

Termina cuando un gasto en dólares se convierte con el FIX del día y los recordatorios semanales llegan solos.

- ALA-183 F3-1 Design doc: Banxico caído y tipo de cambio de gastos pasados
- ALA-184 F3-2 Redis + BullMQ, worker en proceso separado
- ALA-185 F3-3 Job diario del tipo de cambio con reintentos y respaldo
- ALA-186 F3-4 Cada gasto guarda el tipo de cambio que usó (inmutable)
- ALA-187 F3-5 Correos transaccionales en cola
- ALA-188 F3-6 Recordatorio semanal sin duplicados
- ALA-189 F3-7 Bull Board protegido

### Fase 4 — Operación y rendimiento (sem 13–14, meta 2027-02-03)

Termina cuando restauró un backup real en un servidor limpio y una alerta avisó de un error antes que un usuario.

- ALA-190 F4-1 Logs estructurados con request id
- ALA-191 F4-2 Sentry en API y web con alertas
- ALA-192 F4-3 Uptime check externo sobre /health
- ALA-193 F4-4 Backups diarios fuera del VPS y prueba de restauración
- ALA-194 F4-5 Prueba de carga con k6 (p95)
- ALA-195 F4-6 EXPLAIN ANALYZE e índices justificados en ADR
- ALA-196 F4-7 Postmortem de un incidente

### Fase 5 — App iOS, v1.0 (sem 15–20, meta 2027-03-17)

Termina cuando amigos con iPhone instalan por TestFlight, registran un gasto y el grupo recibe una push.

- ALA-197 F5-1 Contrato OpenAPI y /v1 congelada
- ALA-198 F5-2 SwiftUI: login con Keychain y refresh automático
- ALA-199 F5-3 Pantallas: grupos, gastos, agregar gasto, balances
- ALA-200 F5-4 Dispositivos y push por APNs desde una cola
- ALA-201 F5-5 Gasto sin señal con Idempotency-Key
- ALA-202 F5-6 TestFlight con amigos
- ALA-203 F5-7 Retro de la v1.0 como ADR final

## Estado actual: dónde nos quedamos

**Tarea:** F0-1 (ALA-155), en progreso. Se entregó la **parte 1** (bloques 1 y 2). Alan todavía **no ha contestado** las 6 preguntas.

### Bloque 1 · Crear el proyecto (entregado)

```bash
node -v                 # Node 22 o superior
npm i -g @nestjs/cli
nest new cuentas-claras-api --strict --package-manager npm
cd cuentas-claras-api
npm run start:dev
curl http://localhost:3000    # "Hello World!"
```

Se explicó: qué genera `nest new`, por qué fijar npm (`package-lock.json` y `npm ci` en F0-4), modo watch.

Preguntas pendientes:

1. ¿Para qué sirve `package-lock.json` y por qué se sube al repo?
2. ¿Qué hace `NestFactory.create(AppModule)` en `src/main.ts`?
3. ¿Qué papel tienen `AppModule`, `AppController` y `AppService`? ¿Por qué la lógica va en el service?

### Bloque 2 · TypeScript estricto (entregado)

En `tsconfig.json`, quitar `strictNullChecks`/`noImplicitAny` sueltas y dejar:

```jsonc
"strict": true,
"noUncheckedIndexedAccess": true,
"noImplicitOverride": true,
"noFallthroughCasesInSwitch": true
```

Verificar con `npx tsc --noEmit` y `npm run build`. Se explicó cada bandera; `noUncheckedIndexedAccess` es clave porque en la Fase 2 se divide dinero en arreglos (evita sumar `undefined` y obtener `NaN`).

Preguntas pendientes:

1. Con `strictNullChecks`, ¿qué error marca esto y cómo se arregla sin usar `!`?
   ```ts
   const user = await prisma.user.findUnique({ where: { id } });
   return user.email;
   ```
2. ¿Por qué `noUncheckedIndexedAccess` importa en una app que divide dinero?
3. ¿Qué diferencia hay entre `npx tsc --noEmit` y `npm run build`?

### Siguiente paso

1. Revisar las respuestas de Alan a las 6 preguntas (corregir con explicación lo que falle).
2. **Parte 2 de F0-1:** ESLint (reglas útiles, `lint` sin errores), Prettier, `.gitignore` con `.env` desde el primer commit, README (requisitos, instalación, comandos), repo en GitHub, rama `feat/F0-1-repo-setup`, primer PR. Con preguntas después de cada bloque.
3. Preguntas de cierre de ALA-155:
   1. ¿Qué hace ESLint que Prettier no, y viceversa?
   2. ¿Por qué `.env` va en `.gitignore` desde el primer commit y no "después"?
   3. ¿Qué errores atrapa `strict: true` que sin él pasarían a producción?
4. Review del PR, merge, cerrar ALA-155 en Linear y seguir con F0-2 (ALA-156).
