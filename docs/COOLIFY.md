# Coolify

Coolify is an open-source, self-hostable platform for deploying and managing applications, databases, and services. It provides an alternative to platforms like Heroku, Netlify, and Vercel, allowing users to maintain full control over their infrastructure while benefiting from modern deployment automation. Built with Laravel and Docker, Coolify connects to servers via SSH and orchestrates containerized deployments with automated proxy configuration, health monitoring, and webhook-driven continuous deployment.

The platform operates through a team-based multi-tenancy model, organizing resources into projects and environments. It supports diverse application types including Git-based deployments (public/private repositories), Dockerfiles, Docker Compose stacks, and Docker images. Coolify manages reverse proxy configuration automatically (Traefik or Caddy), handles SSL certificates, provides real-time deployment logs, and includes comprehensive backup solutions for databases. The system uses Laravel Horizon for queue management and Livewire for reactive server-side rendered interfaces.

## Core APIs

### Team Management

#### List All Teams

Get all teams accessible to the authenticated user with membership information.

```bash
curl -X GET https://coolify.example.com/api/v1/teams \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

```json
{
  "data": [
    {
      "id": 1,
      "name": "Main Team",
      "description": "Primary team",
      "personal_team": true
    }
  ]
}
```

#### Get Current Team

Retrieve details about the currently active team.

```bash
curl -X GET https://coolify.example.com/api/v1/teams/current \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

#### Get Team Members

List all members of the current team or a specific team by ID.

```bash
# Current team members
curl -X GET https://coolify.example.com/api/v1/teams/current/members \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Specific team members
curl -X GET https://coolify.example.com/api/v1/teams/123/members \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### Cloud Provider Token Management

#### List Cloud Provider Tokens

Get all cloud provider tokens (Hetzner, DigitalOcean, etc.) configured for the team.

```bash
curl -X GET https://coolify.example.com/api/v1/cloud-tokens \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

```json
{
  "data": [
    {
      "uuid": "token_abc123",
      "name": "Hetzner Production",
      "description": "Main Hetzner account",
      "provider": "hetzner"
    }
  ]
}
```

#### Create Cloud Provider Token

Add a new cloud provider token for automated server provisioning.

```bash
curl -X POST https://coolify.example.com/api/v1/cloud-tokens \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hetzner Production",
    "description": "Main Hetzner account",
    "provider": "hetzner",
    "token": "your-hetzner-api-token"
  }'
```

#### Validate Cloud Provider Token

Test if a cloud provider token is valid by making an API call to the provider.

```bash
curl -X POST https://coolify.example.com/api/v1/cloud-tokens/token_abc123/validate \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

```json
{
  "valid": true,
  "provider": "hetzner"
}
```

#### Update and Delete Cloud Provider Tokens

```bash
# Update token
curl -X PATCH https://coolify.example.com/api/v1/cloud-tokens/token_abc123 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Token Name",
    "description": "Updated description"
  }'

# Delete token
curl -X DELETE https://coolify.example.com/api/v1/cloud-tokens/token_abc123 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### Hetzner Cloud Integration

#### List Hetzner Locations

Get all available Hetzner datacenter locations.

```bash
curl -X GET "https://coolify.example.com/api/v1/hetzner/locations?cloud_provider_token_uuid=token_abc123" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

```json
{
  "locations": [
    {
      "id": 1,
      "name": "fsn1",
      "description": "Falkenstein DC Park 1",
      "country": "DE",
      "city": "Falkenstein"
    }
  ]
}
```

#### List Hetzner Server Types

Get available Hetzner server types with pricing and specifications.

```bash
curl -X GET "https://coolify.example.com/api/v1/hetzner/server-types?cloud_provider_token_uuid=token_abc123" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

```json
{
  "server_types": [
    {
      "id": 1,
      "name": "cx11",
      "description": "CX11",
      "cores": 1,
      "memory": 2.0,
      "disk": 20,
      "prices": {
        "monthly": "4.15"
      }
    }
  ]
}
```

#### List Hetzner Images

Get available operating system images for Hetzner servers.

```bash
curl -X GET "https://coolify.example.com/api/v1/hetzner/images?cloud_provider_token_uuid=token_abc123" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

#### Create Hetzner Server

Provision a new server on Hetzner Cloud with automatic Coolify setup.

```bash
curl -X POST https://coolify.example.com/api/v1/servers/hetzner \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cloud_provider_token_uuid": "token_abc123",
    "name": "Production Server 1",
    "type": "cpx21",
    "location": "fsn1",
    "image": "ubuntu-22.04",
    "ssh_key_uuid": "key_xyz789",
    "cloud_init": "#cloud-config\npackages:\n  - curl"
  }'
```

```json
{
  "uuid": "srv_new123abc",
  "name": "Production Server 1",
  "ip": "95.217.123.45",
  "hetzner_server_id": "12345678"
}
```

### List All Applications

Get all applications accessible to the authenticated team, including deployment status and configuration details.

```bash
curl -X GET https://coolify.example.com/api/v1/applications \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

```json
{
  "data": [
    {
      "uuid": "abc123xyz",
      "name": "my-web-app",
      "fqdn": "app.example.com,www.example.com",
      "git_repository": "https://github.com/user/repo",
      "git_branch": "main",
      "build_pack": "nixpacks",
      "status": "running",
      "destination_type": "App\\Models\\StandaloneDocker",
      "destination_id": 1,
      "environment_id": 5
    }
  ]
}
```

### Deploy Application

Trigger deployment for an application using UUID or tags, optionally forcing rebuild or specifying commit/branch.

```bash
curl -X POST https://coolify.example.com/api/v1/deploy \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "abc123xyz",
    "force_rebuild": false,
    "commit": "a1b2c3d",
    "deployment_note": "Hotfix for issue #123"
  }'
```

```json
{
  "message": "Deployment queued.",
  "deployment_uuid": "dep_xyz789abc",
  "deployment_api_url": "https://coolify.example.com/api/v1/deployments/dep_xyz789abc"
}
```

### Create Public Git Application

Deploy a public Git repository with automatic build detection (Nixpacks, Dockerfile, or Docker Compose).

```bash
curl -X POST https://coolify.example.com/api/v1/applications/public \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "server_uuid": "srv_xyz789",
    "environment_name": "production",
    "git_repository": "https://github.com/user/awesome-app",
    "git_branch": "main",
    "ports_exposes": "3000",
    "destination_uuid": "dest_123abc",
    "build_pack": "nixpacks",
    "name": "Awesome App",
    "description": "Production deployment of awesome app",
    "is_static": false,
    "publish_directory": "/dist",
    "install_command": "npm install",
    "build_command": "npm run build",
    "start_command": "npm start",
    "base_directory": "/",
    "domains": "awesome-app.com,www.awesome-app.com",
    "instant_deploy": true,
    "watch_paths": "/src/**"
  }'
```

```json
{
  "uuid": "app_new789xyz",
  "domains": ["awesome-app.com", "www.awesome-app.com"]
}
```

### Create Private GitHub App Application

Deploy from a private GitHub repository using an installed GitHub App for authentication.

```bash
curl -X POST https://coolify.example.com/api/v1/applications/private-github-app \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "server_uuid": "srv_xyz789",
    "environment_name": "staging",
    "github_app_uuid": "gh_app_456def",
    "git_repository": "user/private-repo",
    "git_branch": "develop",
    "ports_exposes": "8080",
    "destination_uuid": "dest_123abc",
    "build_pack": "dockerfile",
    "dockerfile_location": "./docker/Dockerfile",
    "instant_deploy": false
  }'
```

### Create Private Deploy Key Application

Deploy from a private Git repository using SSH deploy key authentication.

```bash
curl -X POST https://coolify.example.com/api/v1/applications/private-deploy-key \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "server_uuid": "srv_xyz789",
    "environment_name": "production",
    "private_key_uuid": "key_abc123",
    "git_repository": "git@github.com:user/private-repo.git",
    "git_branch": "main",
    "ports_exposes": "3000",
    "destination_uuid": "dest_123abc",
    "build_pack": "nixpacks",
    "instant_deploy": true
  }'
```

### Create Dockerfile Application

Deploy an application using a custom Dockerfile from a Git repository.

```bash
curl -X POST https://coolify.example.com/api/v1/applications/dockerfile \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "server_uuid": "srv_xyz789",
    "environment_name": "production",
    "git_repository": "https://github.com/user/app",
    "git_branch": "main",
    "dockerfile_location": "./Dockerfile",
    "destination_uuid": "dest_123abc",
    "ports_exposes": "8000",
    "name": "Custom Dockerfile App",
    "instant_deploy": true
  }'
```

### Create Docker Image Application

Deploy an application directly from a Docker registry image (Docker Hub, GHCR, etc.).

```bash
curl -X POST https://coolify.example.com/api/v1/applications/dockerimage \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "server_uuid": "srv_xyz789",
    "environment_name": "production",
    "docker_registry_image_name": "nginx:latest",
    "destination_uuid": "dest_123abc",
    "ports_exposes": "80",
    "name": "Nginx Server",
    "instant_deploy": true
  }'
```

### Create Docker Compose Application

Deploy a multi-container application from a Docker Compose file in a Git repository.

```bash
curl -X POST https://coolify.example.com/api/v1/applications/dockercompose \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "server_uuid": "srv_xyz789",
    "environment_name": "production",
    "git_repository": "https://github.com/user/microservices",
    "git_branch": "main",
    "destination_uuid": "dest_123abc",
    "docker_compose_location": "docker-compose.prod.yml",
    "name": "Microservices Stack",
    "instant_deploy": true
  }'
```

### Update Application Configuration

Modify application settings including environment variables, build commands, domains, and resource limits.

```bash
curl -X PATCH https://coolify.example.com/api/v1/applications/abc123xyz \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated App Name",
    "description": "New description",
    "fqdn": "new-domain.com,www.new-domain.com",
    "install_command": "pnpm install",
    "build_command": "pnpm build",
    "start_command": "pnpm start",
    "ports_exposes": "3000",
    "health_check_enabled": true,
    "health_check_path": "/health",
    "health_check_port": "3000",
    "health_check_interval": 30,
    "limits_memory": "512M",
    "limits_cpus": "0.5"
  }'
```

### Manage Application Environment Variables

Create, update, or delete environment variables for applications with support for build-time and runtime variables.

```bash
# Create environment variable
curl -X POST https://coolify.example.com/api/v1/applications/abc123xyz/envs \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "DATABASE_URL",
    "value": "postgresql://user:pass@db:5432/mydb",
    "is_build_time": false,
    "is_preview": false
  }'

# Bulk create/update environment variables
curl -X PATCH https://coolify.example.com/api/v1/applications/abc123xyz/envs/bulk \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variables": [
      {"key": "NODE_ENV", "value": "production"},
      {"key": "API_KEY", "value": "secret123", "is_build_time": true},
      {"key": "REDIS_URL", "value": "redis://cache:6379"}
    ]
  }'

# Delete environment variable
curl -X DELETE https://coolify.example.com/api/v1/applications/abc123xyz/envs/env_uuid_456 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### Application Lifecycle Control

Start, stop, or restart applications with single endpoint actions.

```bash
# Start/Deploy application
curl -X POST https://coolify.example.com/api/v1/applications/abc123xyz/start \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Restart application
curl -X POST https://coolify.example.com/api/v1/applications/abc123xyz/restart \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Stop application
curl -X POST https://coolify.example.com/api/v1/applications/abc123xyz/stop \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

```json
{
  "message": "Application restart queued."
}
```

### List All Servers

Retrieve all servers managed by Coolify for the authenticated team, including reachability status.

```bash
curl -X GET https://coolify.example.com/api/v1/servers \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

```json
{
  "data": [
    {
      "uuid": "srv_xyz789",
      "name": "Production Server",
      "description": "Main production environment",
      "ip": "192.168.1.100",
      "user": "root",
      "port": 22,
      "is_reachable": true,
      "is_usable": true
    }
  ]
}
```

### Create Server

Add a new server to Coolify with SSH connection details and private key authentication.

```bash
curl -X POST https://coolify.example.com/api/v1/servers \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Staging Server",
    "description": "Server for staging deployments",
    "ip": "staging.example.com",
    "user": "coolify",
    "port": 22,
    "private_key_uuid": "key_abc123",
    "instant_validate": true
  }'
```

```json
{
  "uuid": "srv_new456def",
  "name": "Staging Server",
  "ip": "staging.example.com"
}
```

### Validate Server

Check server connectivity, Docker installation, and validate Coolify can manage resources on the server.

```bash
curl -X GET https://coolify.example.com/api/v1/servers/srv_xyz789/validate \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

```json
{
  "success": true,
  "message": "Server is reachable and validated.",
  "server": {
    "is_reachable": true,
    "is_usable": true
  }
}
```

### List Server Resources

Get all resources (applications, databases, services) deployed on a specific server.

```bash
curl -X GET https://coolify.example.com/api/v1/servers/srv_xyz789/resources \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json"
```

```json
{
  "applications": [
    {"uuid": "app_123", "name": "Web App", "status": "running"}
  ],
  "databases": [
    {"uuid": "db_456", "name": "PostgreSQL", "type": "postgresql", "status": "running"}
  ],
  "services": [
    {"uuid": "svc_789", "name": "Redis Stack", "status": "running"}
  ]
}
```

### Create PostgreSQL Database

Provision a standalone PostgreSQL database instance with automatic configuration and backups.

```bash
curl -X POST https://coolify.example.com/api/v1/databases/postgresql \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "environment_name": "production",
    "server_uuid": "srv_xyz789",
    "destination_uuid": "dest_123abc",
    "name": "Production PostgreSQL",
    "description": "Main application database",
    "postgres_user": "appuser",
    "postgres_password": "securepassword",
    "postgres_db": "myapp_production",
    "postgres_initdb_args": "--encoding=UTF8 --locale=en_US.UTF-8",
    "postgres_host_auth_method": "scram-sha-256",
    "postgres_conf": "max_connections=200\nshared_buffers=256MB",
    "image": "postgres:16-alpine",
    "public_port": 5432,
    "is_public": false,
    "instant_deploy": true
  }'
```

```json
{
  "uuid": "db_new789xyz",
  "internal_db_url": "postgresql://appuser:securepassword@coolify-db-production-postgresql:5432/myapp_production"
}
```

### Create MySQL Database

Deploy a MySQL database with customizable configuration and version selection.

```bash
curl -X POST https://coolify.example.com/api/v1/databases/mysql \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "environment_name": "production",
    "server_uuid": "srv_xyz789",
    "destination_uuid": "dest_123abc",
    "name": "MySQL Database",
    "mysql_root_password": "rootpass123",
    "mysql_database": "appdb",
    "mysql_user": "appuser",
    "mysql_password": "apppass456",
    "mysql_conf": "max_connections=150",
    "image": "mysql:8.0",
    "instant_deploy": true
  }'
```

### Create MariaDB Database

Deploy a MariaDB database with custom configuration.

```bash
curl -X POST https://coolify.example.com/api/v1/databases/mariadb \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "environment_name": "production",
    "server_uuid": "srv_xyz789",
    "destination_uuid": "dest_123abc",
    "name": "MariaDB Database",
    "mariadb_root_password": "rootpass123",
    "mariadb_database": "appdb",
    "mariadb_user": "appuser",
    "mariadb_password": "apppass456",
    "image": "mariadb:11",
    "instant_deploy": true
  }'
```

### Create MongoDB Database

Deploy a MongoDB database for document storage.

```bash
curl -X POST https://coolify.example.com/api/v1/databases/mongodb \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "environment_name": "production",
    "server_uuid": "srv_xyz789",
    "destination_uuid": "dest_123abc",
    "name": "MongoDB Database",
    "mongo_initdb_root_username": "admin",
    "mongo_initdb_root_password": "securepass",
    "mongo_initdb_database": "appdb",
    "image": "mongo:7",
    "instant_deploy": true
  }'
```

### Create Redis Database

Deploy a Redis instance for caching and session storage.

```bash
curl -X POST https://coolify.example.com/api/v1/databases/redis \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "environment_name": "production",
    "server_uuid": "srv_xyz789",
    "destination_uuid": "dest_123abc",
    "name": "Redis Cache",
    "redis_password": "redispass123",
    "image": "redis:7-alpine",
    "instant_deploy": true
  }'
```

### Create ClickHouse Database

Deploy a ClickHouse database for analytics and big data workloads.

```bash
curl -X POST https://coolify.example.com/api/v1/databases/clickhouse \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "environment_name": "production",
    "server_uuid": "srv_xyz789",
    "destination_uuid": "dest_123abc",
    "name": "ClickHouse Analytics",
    "clickhouse_admin_user": "admin",
    "clickhouse_admin_password": "securepass",
    "image": "clickhouse/clickhouse-server:latest",
    "instant_deploy": true
  }'
```

### Create Dragonfly Database

Deploy a Dragonfly database (Redis-compatible, high-performance).

```bash
curl -X POST https://coolify.example.com/api/v1/databases/dragonfly \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "environment_name": "production",
    "server_uuid": "srv_xyz789",
    "destination_uuid": "dest_123abc",
    "name": "Dragonfly Cache",
    "dragonfly_password": "dragonflypass",
    "image": "docker.dragonflydb.io/dragonflydb/dragonfly:latest",
    "instant_deploy": true
  }'
```

### Create KeyDB Database

Deploy a KeyDB database (Redis-compatible with multi-threading).

```bash
curl -X POST https://coolify.example.com/api/v1/databases/keydb \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "environment_name": "production",
    "server_uuid": "srv_xyz789",
    "destination_uuid": "dest_123abc",
    "name": "KeyDB Cache",
    "keydb_password": "keydbpass",
    "image": "eqalpha/keydb:latest",
    "instant_deploy": true
  }'
```

### Database Backup Management

Configure scheduled backups, list backup executions, and manage backup retention.

```bash
# Get database with backup configurations
curl -X GET https://coolify.example.com/api/v1/databases/db_xyz789/backups \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# List backup executions for a scheduled backup
curl -X GET https://coolify.example.com/api/v1/databases/db_xyz789/backups/backup_abc123/executions \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Create new backup configuration
curl -X POST https://coolify.example.com/api/v1/databases/db_xyz789/backups \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "frequency": "0 2 * * *",
    "number_of_backups_locally": 7,
    "s3_storage_id": "s3_storage_456"
  }'

# Update backup configuration
curl -X PATCH https://coolify.example.com/api/v1/databases/db_xyz789/backups/backup_abc123 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "frequency": "0 2 * * *",
    "number_of_backups_locally": 7,
    "s3_storage_id": "s3_storage_456"
  }'

# Delete backup execution
curl -X DELETE https://coolify.example.com/api/v1/databases/db_xyz789/backups/backup_abc123/executions/exec_xyz \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### Database Lifecycle Control

Start, stop, or restart database instances.

```bash
# Start database
curl -X POST https://coolify.example.com/api/v1/databases/db_xyz789/start \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Restart database
curl -X POST https://coolify.example.com/api/v1/databases/db_xyz789/restart \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Stop database
curl -X POST https://coolify.example.com/api/v1/databases/db_xyz789/stop \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### Create Service from Docker Compose

Deploy pre-configured services (Redis, MinIO, Plausible, etc.) using built-in templates.

```bash
curl -X POST https://coolify.example.com/api/v1/services \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_uuid": "proj_abc123",
    "environment_name": "production",
    "server_uuid": "srv_xyz789",
    "destination_uuid": "dest_123abc",
    "type": "minio",
    "name": "Object Storage",
    "description": "MinIO for file storage",
    "instant_deploy": true
  }'
```

```json
{
  "uuid": "svc_new123abc",
  "name": "Object Storage",
  "compose": "...",
  "fqdns": ["minio.example.com", "minio-console.example.com"]
}
```

### Manage Service Environment Variables

Configure environment variables for services with application-specific variables.

```bash
# List service environment variables
curl -X GET https://coolify.example.com/api/v1/services/svc_xyz789/envs \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Create service environment variable
curl -X POST https://coolify.example.com/api/v1/services/svc_xyz789/envs \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "MINIO_ROOT_USER",
    "value": "admin"
  }'

# Bulk update service environment variables
curl -X PATCH https://coolify.example.com/api/v1/services/svc_xyz789/envs/bulk \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variables": [
      {"key": "MINIO_ROOT_USER", "value": "admin"},
      {"key": "MINIO_ROOT_PASSWORD", "value": "securepassword"}
    ]
  }'
```

### Service Lifecycle Control

Start, stop, or restart services.

```bash
# Start service
curl -X POST https://coolify.example.com/api/v1/services/svc_xyz789/start \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Restart service
curl -X POST https://coolify.example.com/api/v1/services/svc_xyz789/restart \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Stop service
curl -X POST https://coolify.example.com/api/v1/services/svc_xyz789/stop \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### List Projects and Environments

Retrieve project structure with environments and create new environments for resource organization.

```bash
# List all projects
curl -X GET https://coolify.example.com/api/v1/projects \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Get specific project with environments
curl -X GET https://coolify.example.com/api/v1/projects/proj_abc123/environments \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Create new project
curl -X POST https://coolify.example.com/api/v1/projects \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Project",
    "description": "Main production environment"
  }'

# Update project
curl -X PATCH https://coolify.example.com/api/v1/projects/proj_abc123 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project Name",
    "description": "Updated description"
  }'

# Delete project
curl -X DELETE https://coolify.example.com/api/v1/projects/proj_abc123 \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Create new environment in project
curl -X POST https://coolify.example.com/api/v1/projects/proj_abc123/environments \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "staging",
    "description": "Staging environment for testing"
  }'

# Delete environment
curl -X DELETE https://coolify.example.com/api/v1/projects/proj_abc123/environments/staging \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### Manage SSH Keys

Create and manage SSH private keys used for server authentication and Git repository access.

```bash
# List all SSH keys
curl -X GET https://coolify.example.com/api/v1/security/keys \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Create new SSH key
curl -X POST https://coolify.example.com/api/v1/security/keys \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Deploy Key",
    "description": "Key for production server access",
    "private_key": "-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----"
  }'

# Update SSH key
curl -X PATCH https://coolify.example.com/api/v1/security/keys/key_abc123 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Key Name",
    "description": "Updated description"
  }'

# Delete SSH key
curl -X DELETE https://coolify.example.com/api/v1/security/keys/key_abc123 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### GitHub App Integration

Manage GitHub App installations for private repository access and automatic webhook configuration.

```bash
# List GitHub Apps
curl -X GET https://coolify.example.com/api/v1/github-apps \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Create GitHub App
curl -X POST https://coolify.example.com/api/v1/github-apps \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production GitHub App",
    "organization": "myorg",
    "api_url": "https://api.github.com",
    "html_url": "https://github.com",
    "custom_user": "git",
    "custom_port": 22,
    "app_id": "123456",
    "installation_id": "789012",
    "client_id": "Iv1.abc123def456",
    "client_secret": "secret789xyz",
    "webhook_secret": "webhook_secret_456",
    "private_key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
  }'

# Update GitHub App
curl -X PATCH https://coolify.example.com/api/v1/github-apps/gh_app_123 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated GitHub App Name"
  }'

# Delete GitHub App
curl -X DELETE https://coolify.example.com/api/v1/github-apps/gh_app_123 \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Load repositories from GitHub App
curl -X GET https://coolify.example.com/api/v1/github-apps/gh_app_123/repositories \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Load branches for a repository
curl -X GET https://coolify.example.com/api/v1/github-apps/gh_app_123/repositories/owner/repo/branches \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

```json
{
  "branches": ["main", "develop", "feature/new-feature"]
}
```

### Webhook Deployment Triggers

Configure manual webhooks for Git providers to trigger automated deployments on push events.

```bash
# GitHub webhook endpoint
POST https://coolify.example.com/webhooks/source/github/events/manual

# GitLab webhook endpoint
POST https://coolify.example.com/webhooks/source/gitlab/events/manual

# Bitbucket webhook endpoint
POST https://coolify.example.com/webhooks/source/bitbucket/events/manual

# Gitea webhook endpoint
POST https://coolify.example.com/webhooks/source/gitea/events/manual
```

Each webhook requires the application's manual webhook secret configured in the application settings and expects standard Git provider webhook payloads with push event data.

### API Token Management

Enable and disable API access for the current team with ability-based token scopes.

```bash
# Enable API access
curl -X GET https://coolify.example.com/api/v1/enable \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Disable API access
curl -X GET https://coolify.example.com/api/v1/disable \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

API tokens support three ability scopes: `read` (view resources), `write` (modify resources), and `deploy` (trigger deployments). Tokens can be restricted to specific IP addresses and include sensitive data access flags.

## Key Functions and Patterns

### Application Deployment Process

The deployment workflow is managed by `ApplicationDeploymentJob` which handles the complete lifecycle from source code to running container.

```php
use App\Jobs\ApplicationDeploymentJob;
use App\Models\Application;

$application = Application::where('uuid', 'abc123xyz')->firstOrFail();

// Queue deployment with options
ApplicationDeploymentJob::dispatch(
    deployment_uuid: $deploymentQueue->deployment_uuid,
    application_deployment_queue_id: $deploymentQueue->id,
    force_rebuild: false,
    commit: 'a1b2c3d4e5f',
    is_api: true
);

// The job orchestrates:
// 1. Clone repository or pull Docker image
// 2. Build application (Nixpacks/Dockerfile/Compose)
// 3. Generate Docker labels and proxy configuration
// 4. Start containers with health checks
// 5. Update proxy routes (Traefik/Caddy)
// 6. Send deployment notifications
```

### Remote Command Execution

The `ExecuteRemoteCommand` trait provides SSH-based command execution on servers with activity logging.

```php
use App\Models\Server;

$server = Server::where('uuid', 'srv_xyz789')->firstOrFail();

// Execute command and get output
$output = instant_remote_process([
    "docker ps -a --format '{{json .}}'"
], $server, throwError: false);

// Execute with custom activity logging
$activity = remote_process([
    'cd /app',
    'docker-compose down',
    'docker-compose up -d'
], $server, $activity = null, ignore_errors: false);

// Commands run with proper SSH connection handling,
// timeout management, and error recovery
```

### Server Validation and Setup

The `ValidateServer` action ensures servers meet requirements and installs necessary components.

```php
use App\Actions\Server\ValidateServer;
use App\Models\Server;

$server = Server::find($serverId);

// Validates server connectivity, OS compatibility,
// Docker installation, and network configuration
$validation = ValidateServer::run($server);

// If Docker missing, automatically triggers InstallDocker action
// Sets server settings (is_reachable, is_usable, is_build_server)
```

### Proxy Configuration Generation

Coolify automatically generates reverse proxy configurations for applications with SSL support.

```php
use App\Actions\Proxy\SaveProxyConfiguration;
use App\Models\Application;

$application = Application::find($applicationId);

// Generates Traefik/Caddy configuration from application settings:
// - Domain routing rules
// - SSL certificate management (Let's Encrypt)
// - HTTP to HTTPS redirects
// - Basic authentication
// - Custom headers and middleware
SaveProxyConfiguration::run($server, $application);

// Configuration saved to server and proxy reloaded automatically
```

### Database Backup Automation

Scheduled backups with S3 storage integration and retention policies.

```php
use App\Jobs\DatabaseBackupJob;
use App\Models\ScheduledDatabaseBackup;

$backup = ScheduledDatabaseBackup::create([
    'database_id' => $database->id,
    'database_type' => $database->getMorphClass(),
    'enabled' => true,
    'frequency' => '0 2 * * *', // Daily at 2 AM
    'number_of_backups_locally' => 7,
    's3_storage_id' => $s3Storage->id,
]);

// Backup job handles:
// - Database-specific dump commands (pg_dump, mysqldump, mongodump)
// - Compression and encryption
// - Local and S3 storage
// - Rotation based on retention policy
DatabaseBackupJob::dispatch($backup);
```

### Environment Variable Management

Secure handling of environment variables with build-time and runtime separation.

```php
use App\Models\Application;
use App\Models\EnvironmentVariable;

$application = Application::where('uuid', 'abc123xyz')->first();

// Create environment variable
$env = EnvironmentVariable::create([
    'key' => 'DATABASE_URL',
    'value' => 'postgresql://user:pass@db:5432/mydb',
    'is_build_time' => false,
    'is_preview' => false,
    'application_id' => $application->id,
]);

// Variables automatically injected during deployment:
// - Build-time vars available during image build
// - Runtime vars passed to container on startup
// - Preview vars isolated to preview deployments
// - Sensitive values encrypted at rest
```

### Resource Status Monitoring

Real-time container status checking with automatic health verification.

```php
use App\Actions\Docker\GetContainersStatus;
use App\Models\Server;

$server = Server::find($serverId);

// Retrieves status for all containers on server
// Returns running/stopped/restarting states
GetContainersStatus::run($server);

// Health checks run periodically via scheduled jobs:
// - HTTP/TCP endpoint checks
// - Container process monitoring
// - Resource usage tracking
// - Automatic restart on failure
```

### Cloud Provider Integration

Automated server provisioning through cloud provider APIs.

```php
use App\Services\HetznerService;
use App\Models\CloudProviderToken;

$token = CloudProviderToken::where('uuid', 'token_abc123')->first();
$service = new HetznerService($token);

// Create server on Hetzner Cloud
$server = $service->createServer([
    'name' => 'production-1',
    'type' => 'cpx21',
    'location' => 'fsn1',
    'image' => 'ubuntu-22.04',
    'ssh_key' => $sshKey->id,
    'user_data' => $cloudInitScript,
]);

// Service handles:
// - API authentication and rate limiting
// - Server creation and polling until ready
// - SSH key injection
// - Cloud-init script execution
// - IP address and server ID retrieval
```

## Integration and Usage

Coolify's architecture centers on event-driven deployment automation and resource orchestration. Applications integrate through Git webhooks for continuous deployment, with each push triggering the `ApplicationDeploymentJob` queue. The system uses Laravel's queue system with Horizon for reliable background processing, ensuring deployments can handle interruptions and resume from checkpoints. Server communication happens exclusively over SSH using the `ExecuteRemoteCommand` trait, which maintains connection pools and handles network failures gracefully.

The platform scales horizontally through team-based resource isolation and supports high-availability deployments with Docker Swarm mode. API consumers authenticate via Sanctum tokens with ability-based access control (read/write/deploy scopes) and optional IP allowlisting. Real-time updates flow through Soketi WebSocket connections to Livewire components, providing instant deployment feedback without polling. Cloud integration enables automated server provisioning through providers like Hetzner and DigitalOcean, with tokens validated against provider APIs and servers automatically configured with Docker and Coolify agents. For custom integrations, the webhook system supports manual triggers from any Git provider, while the REST API enables programmatic management of the complete deployment lifecycle from infrastructure provisioning to application scaling.
