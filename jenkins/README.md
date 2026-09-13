# Jenkins (local)

Spins up a local Jenkins with Docker-in-Docker support, so pipeline stages can build and run the project's own Docker images.

```bash
cd jenkins
docker compose up --build
```

Jenkins will be available at **http://localhost:9000**. On first run, get the initial admin password with:

```bash
docker exec bugtracker-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Then create a Pipeline job pointing at this repository, using the `Jenkinsfile` at the repo root.
