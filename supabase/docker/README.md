# Supabase Docker Setup

## Services
- **db**: PostgreSQL database
- **kong**: API Gateway
- **gotrue**: Auth service
- **postgrest**: RESTful API for PostgreSQL
- **realtime**: Realtime subscriptions
- **storage**: Object storage
- **meta**: Database management
- **studio**: Web interface (Dashboard)

## Ports
- **8000**: Kong (API Gateway) -> Access point for everything
- **8001**: Kong (Admin API)
- **5432**: PostgreSQL
- **8080**: GoTrue (Auth)
- **3000**: PostgREST
- **4000**: Realtime
- **7000**: Storage
- **8002**: Studio (Dashboard)

## Usage
1. Copy `.env.example` to `.env`
2. Run `docker compose up -d`
3. Access Studio at `http://localhost:8000` (via Kong) or directly at `http://localhost:8002`
