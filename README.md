# Backend API Server

FastAPI + SQLAlchemy + Pydantic + MySQL based backend server for Convergence Project 1.

---

## Project Overview

This project implements a RESTful API server that manages IoT device registration, item tracking via NFC/RFID tags, and scan log recording. The system identifies users through `kakao_user_id` and links them to physical devices and tagged items.

---

## Tech Stack

- Python 3.11
- FastAPI
- SQLAlchemy (ORM)
- Pydantic v2
- MySQL 8.x
- Uvicorn

---

## Project Structure

```
backend/
  routes/
    device_route.py
    item_route.py
    label_route.py
    scan_log_route.py
  services/
    device_service.py
    item_service.py
    label_service.py
    scan_log_service.py
  repositories/
    user_repository.py
    device_repository.py
    user_device_repository.py
    item_repository.py
    master_tag_repository.py
    scan_log_repository.py
  models/
    user.py
    device.py
    user_device.py
    master_tag.py
    item.py
    scan_log.py
  schemas/
    device_schema.py
    item_schema.py
    label_schema.py
    scan_log_schema.py
  common/
    db.py
    response.py
    exceptions.py
    validator.py
    config.py
  app.py
```

### Layer Responsibilities

- **routes**: Request/response handling only. No business logic.
- **services**: Business logic and validation.
- **repositories**: Database access only. No business logic.
- **models**: SQLAlchemy ORM models.
- **schemas**: Pydantic request/response schemas.
- **common**: Shared utilities, DB session, config, exception handlers.

---

## Database Schema

| Table | Description |
|---|---|
| users | Kakao-authenticated user records |
| devices | Registered IoT devices identified by serial number |
| user_devices | Many-to-many join table linking users and devices |
| master_tags | NFC/RFID tag registry with label_id and tag_uid mapping |
| items | User-registered items linked to tags via tag_uid |
| scan_logs | FOUND/LOST scan event records per item |

### Key Design Decisions

- `label_id`: Human-readable tag identifier exposed in API responses.
- `tag_uid`: Internal unique tag identifier used for actual DB storage in items.
- Item deletion is handled as soft delete (`is_active = false`), not hard delete.
- User identification is done via `kakao_user_id` passed directly in requests (no JWT in current phase).

---

## Environment Variables

Create a `.env` file in the project root before running.

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
ALLOWED_ORIGIN=http://localhost:3000
ENV=development
LOG_LEVEL=info
```

---

## Installation and Setup

1. Clone the repository.

```bash
git clone <repository-url>
cd backend
```

2. Create and activate a virtual environment.

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies.

```bash
pip install -r requirements.txt
```

4. Configure environment variables as described above.

5. Run the server.

```bash
uvicorn app:app --reload
```

---

## API Endpoints

### Device

| Method | Endpoint | Description |
|---|---|---|
| POST | /devices/register | Register a device and link to user |
| GET | /devices/me | Get the device linked to the current user |
| DELETE | /devices/me | Unlink the device from the current user |

### Item

| Method | Endpoint | Description |
|---|---|---|
| GET | /items | Get all active items for the current user |
| POST | /items | Register a new item with a label |
| PATCH | /items/{id} | Update item name or label |
| DELETE | /items/{id} | Soft delete an item |

### Label

| Method | Endpoint | Description |
|---|---|---|
| GET | /labels/available | Get available (unused) label list for the current device |

### Scan Log

| Method | Endpoint | Description |
|---|---|---|
| POST | /scan-logs | Record a FOUND or LOST scan event |

---

## Common Response Format

All API responses follow a unified format.

```json
{
  "message": "success",
  "data": { }
}
```

---

## Architecture Rules

1. Routes must not contain business logic.
2. Services must not access the database directly.
3. Repositories must not contain business logic.
4. `label_id` must never be stored directly in the items table.
5. All item deletions must use soft delete (`is_active = false`).
6. Duplicate label assignment within the same user device is not allowed.
7. Ownership is verified at the service layer before any modification.

---

## Development Phases

| Phase | Scope |
|---|---|
| Phase 1 | Common base: config, db, response, exceptions, validator, app |
| Phase 2 | SQLAlchemy models and DB schema |
| Phase 3 | Device registration, lookup, and unlinking |
| Phase 4 | Item CRUD with soft delete and label mapping |
| Phase 5 | Available label listing |
| Phase 6 | Scan log recording |

---

## Notes

- JWT authentication is not implemented in the current phase.
- User identification relies on `kakao_user_id` passed as a query parameter or request body field.
- All timestamps use server-side defaults (`datetime.utcnow`).