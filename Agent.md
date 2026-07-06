# Agent Deployment Information

This file informs further agents about deployment best practices and tricks for the UserSyncFrontend on Hugging Face Spaces.

## 1. Deployment Configuration

### Target Space
- **Profile:** Leon4gr45
- **Space:** UserSyncFrontend
- **Full Identifier:** Leon4gr45/UserSyncFrontend
- **Frontend Port:** 7860

### Deployment Method
- **Docker SDK**

### Mandatory Endpoints
- `/health`: Returns HTTP 200 when the app is ready.
- `/api-docs`: Documents all available API endpoints. Reachable at `https://leon4gr45-usersyncfrontend.hf.space/api-docs`.

## 2. API Endpoints

### /api/craft
- **Method:** POST
- **Purpose:** Run model inference via Blablador API to craft content.
- **Request:** `{"content": "string", "variation": "string"}`
- **Response:** `{"result": "string"}`

### /api/config
- **Method:** GET
- **Purpose:** Retrieve OAuth configuration.

### /login
- **Method:** GET
- **Purpose:** Initiate Hugging Face OAuth login flow.

### /oauth/callback
- **Method:** GET
- **Purpose:** OAuth callback handler.

### /api/user
- **Method:** GET
- **Purpose:** Get authenticated user information.

### /api/logout
- **Method:** GET
- **Purpose:** Logout user and clear session.

### /api/save-data
- **Method:** POST
- **Purpose:** Save simulation data.
- **Request:** `{"type": "string", "data": "any", "user": "string"}`

### /api/list-data
- **Method:** GET
- **Purpose:** List saved simulation data.

### /health
- **Method:** GET
- **Purpose:** Health check endpoint.

## 3. Deployment Workflow

### Clean Remote Space
```bash
hf repos ls --repo-type space Leon4gr45/UserSyncFrontend
hf repos delete-files Leon4gr45/UserSyncFrontend <file> --repo-type space
```

### Standard Deployment Command
```bash
hf upload Leon4gr45/UserSyncFrontend --repo-type=space
```

### Monitoring Logs
```bash
# Build logs
curl -N -H "Authorization: Bearer <HF_TOKEN>" "https://huggingface.co/api/spaces/Leon4gr45/UserSyncFrontend/logs/build"

# Run logs
curl -N -H "Authorization: Bearer <HF_TOKEN>" "https://huggingface.co/api/spaces/Leon4gr45/UserSyncFrontend/logs/run"
```
