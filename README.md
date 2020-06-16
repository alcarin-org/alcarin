# Alcarin [![codebeat badge](https://codebeat.co/badges/e5438889-6a8f-47e7-802a-5985b80fb34e)](https://codebeat.co/projects/github-com-alcarin-org-alcarin-master)

Alcarin game project mono-repo.

The plan is to gather all projects related to Alcarin here.

## Setup
You need `docker` installed in your environment.

1. Setup api: [./api/README.md](./api/README.md)
2. Setup web: [./web/README.md](./web/README.md)
Prepare environment variables `.env` files:
  * Run `cp web/.env.template web/.env`
2. Run `docker-compose up`
3. Visit `http://localhost:8080/`

## External Tools
https://github.com/JohnL4/MogensenPlanet - used to generate random planet map, as base for further work
https://pencil.evolus.vn/ - wireframe tool, use it to open `./shared/pencil-wireframes.epgz` file
https://github.com/alcarin-org/alcarin/projects - issue tracker
https://github.com/alcarin-org/alcarin/wiki - alcarin wiki
https://stoplight.io/studio/ - OpenAPI preferred editor
