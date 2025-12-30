# FindMyLawyer - Project Setup

## Overview
A full-stack application for connecting clients with verified lawyers. Built with React + Vite (frontend) and Express.js (backend) with Supabase as the database.

## Project Structure
```
├── frontend/          # React + Vite + TypeScript
├── backend/           # Express.js + Node.js
├── supabase/          # Database migrations
└── README.md
```

## Technology Stack
- **Frontend**: React 19, Vite 7, TypeScript, TailwindCSS
- **Backend**: Express.js, Node.js 20
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with JWT tokens
- **File Upload**: Cloudinary (optional)
- **SMS**: Twilio (optional)

## Development Setup

### Environment Variables
The following secrets are configured in Replit:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for backend operations
- `JWT_SECRET` - Secret for JWT token generation

### Running the Application
Two workflows are configured:
1. **Frontend** - `npm run dev` on port 5000
2. **Backend** - `npm start` on port 3000

### Database Schema
The Supabase database requires the following tables:
- `profiles` - User profiles with role (client/lawyer/admin)
- `lawyer_profiles` - Extended lawyer information
- `categories` - Practice categories

**IMPORTANT**: The database migration must be applied manually:
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Create a new query and copy the contents from `supabase/migrations/20251230075355_create_initial_schema.sql`
4. Execute the query

This will create all necessary tables, indexes, and Row Level Security policies.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (client or lawyer)
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/verify-otp` - Verify phone OTP (mock OTP: 123456)
- `GET /api/auth/me` - Get current user profile (protected)

### Lawyer Management (Admin)
- `GET /api/lawyers/pending` - Get pending lawyer verifications (admin only)
- `PUT /api/lawyers/verify/:id` - Approve/reject lawyer verification (admin only)
- `POST /api/lawyers/upload-certificate` - Upload lawyer certificate
- `PUT /api/lawyers/profile` - Update lawyer profile (bio/expertise)

## Frontend API Configuration
The frontend API client is configured in `frontend/src/api/axios.ts`:
- Development: Automatically connects to backend on port 3000
- Environment variable: `VITE_API_URL` (if set)

## Deployment
Deployment configuration is set up using Replit's autoscale deployment:
- **Build**: `npm run build`
- **Run**: Backend on port 3000 + Frontend preview on port 5000
- **Public Dir**: `frontend/dist`

## Next Steps
1. Apply the Supabase database migration (see above)
2. Test user registration through the frontend
3. Configure optional services (Cloudinary for file uploads, Twilio for SMS)
4. Customize JWT_SECRET for production
5. Deploy to production via Replit's publish feature

## Registration Fixed
- Supabase credentials are now properly configured
- Backend can create users and profiles
- Test OTP for verification: 123456
- Users can register as clients or lawyers
