# FindMyLawyer - Project Setup

## Overview
A full-stack application for connecting clients with verified lawyers. Built with React + Vite (frontend) and Express.js (backend) with PostgreSQL database using Drizzle ORM.

## Project Structure
```
├── frontend/          # React + Vite + TypeScript
├── backend/           # Express.js + Node.js + Drizzle ORM
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── db/            # Database schema and connection
│   │   ├── middleware/    # Auth middleware
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   └── drizzle.config.js  # Drizzle configuration
└── README.md
```

## Technology Stack
- **Frontend**: React 19, Vite 7, TypeScript, TailwindCSS
- **Backend**: Express.js, Node.js 20, Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Auth**: JWT tokens with bcrypt password hashing
- **File Upload**: Cloudinary (optional)
- **SMS**: Twilio (optional)

## Development Setup

### Environment Variables
The following are configured automatically via Replit:
- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned)
- `JWT_SECRET` - Secret for JWT token generation (defaults to dev key)

### Running the Application
Two workflows are configured:
1. **Frontend** - `npm run dev` on port 5000
2. **Backend** - `npm start` on port 3000

### Database Schema
The PostgreSQL database includes the following tables:
- `profiles` - User profiles with role (client/lawyer/admin), email, password hash
- `lawyer_profiles` - Extended lawyer information (enrollment, certificate, status)
- `categories` - Practice categories

To push schema changes:
```bash
cd backend && npm run db:push
```

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

## Migration Notes (Dec 30, 2025)
- Migrated from Supabase to local PostgreSQL with Drizzle ORM
- Authentication now uses bcrypt for password hashing and local JWT generation
- All database operations use Drizzle ORM instead of Supabase client
- Database schema is managed via Drizzle Kit (`npm run db:push`)

## Next Steps
1. Test user registration through the frontend
2. Configure optional services (Cloudinary for file uploads, Twilio for SMS)
3. Customize JWT_SECRET for production
4. Deploy to production via Replit's publish feature

## Testing
- Real-time OTP: Enabled via Twilio (requires valid credentials)
- Test OTP for phone verification: 123456 (always active for testing)
- Users can register as clients or lawyers
