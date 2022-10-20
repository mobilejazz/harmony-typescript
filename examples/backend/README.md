<p align="center">
  <a href="https://harmony.mobilejazz.com">
    <img src="https://raw.githubusercontent.com/mobilejazz/metadata/master/images/icons/harmony.svg" alt="MJ Harmony logo" width="80" height="80">
  </a>

  <h3 align="center">Harmony + Nest Example</h3>

  <p align="center">
    Harmony is a <em>framework</em> developed by <a href="https://mobilejazz.com">Mobile Jazz</a> that specifies best practices, software architectural patterns and other software development related guidelines. <strong>This is an example project integrating Harmony with <a href="https://nestjs.com">Nest</a></strong>.
    <br />
    <br />
    <a href="https://harmony.mobilejazz.com">Documentation</a>
    ·
    <a href="https://github.com/mobilejazz/harmony-typescript">TypeScript</a>
    ·
    <a href="https://github.com/mobilejazz/harmony-kotlin">Kotlin</a>
    ·
    <a href="https://github.com/mobilejazz/harmony-swift">Swift</a>
    ·
    <a href="https://github.com/mobilejazz/harmony-php">PHP</a>
  </p>
</p>

---

## Initial setup

- See [`README-DEV.md`](../../README-DEV.md) for the initial setup.

## Development server

- `docker-compose -d up`: Start backend services (database, fake mail server…)
- `npm run start:dev`: to start a dev server.
- `npm run start:debug`: **or**, for a dev server with debugger capabilities.
- Once the server is running:
  - Navigate to `http://localhost:3000/doc` to check Swagger documentation
  - **Or**, check `API.http` file documentation

> ⚠️ Swagger UI `/auth/token` is kind of broken (basic auth header is not added). Instead use the `Authorize` button to authorize and get a token.
