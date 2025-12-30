# FindMyLawyer Backend

Backend API for FindMyLawyer application using Express.js and Supabase.

## Setup

1. Navigate to backend folder

```bash
cd backend
```

2. Install Dependencies

```bash
npm install
```

3. Configure Environment Variables

The `.env` file is already created. You need to add your Supabase Service Role Key:

```env
PORT=5000
JWT_SECRET=supersecretkey_dev_only_change_in_production

SUPABASE_URL=https://cbunsjdyjmjdcntwnauo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get your Supabase Service Role Key from the Supabase Dashboard.

## Run

Start the server:

```bash
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (client/lawyer)
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify OTP (mock: use "123456")
- `GET /api/auth/me` - Get current user (protected)

### Lawyer Management
- `POST /api/lawyers/upload-certificate` - Upload certificate (lawyer, protected)
- `PUT /api/lawyers/profile` - Update lawyer profile (lawyer, protected)
- `GET /api/lawyers/pending` - Get pending lawyers (admin, protected)
- `PUT /api/lawyers/verify/:id` - Verify/reject lawyer (admin, protected)