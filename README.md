# FindMyLawyer

A platform connecting clients with verified legal professionals. Built with React, Express.js, and Supabase.

## Project Structure

```
findmylawyer/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── config/        # Supabase configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth middleware
│   │   ├── routes/        # API routes
│   │   ├── scripts/       # Utility scripts
│   │   └── utils/         # Helper functions
│   └── .env              # Backend environment variables
├── frontend/         # React + Vite application
│   ├── src/
│   │   ├── api/          # API client configuration
│   │   ├── context/      # React contexts
│   │   ├── pages/        # Page components
│   │   └── main.tsx      # Application entry
│   └── .env              # Frontend environment variables
└── FIXES.md          # Detailed list of all fixes applied
```

## Features

- User authentication with OTP verification
- Role-based access control (Client, Lawyer, Admin)
- Lawyer profile verification system
- Certificate upload for lawyers
- Admin dashboard for lawyer approval/rejection
- Secure data storage with Supabase
- Row-level security policies

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Supabase Service Role Key

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Add your Supabase Service Role Key to `backend/.env`:

```env
PORT=5000
JWT_SECRET=supersecretkey_dev_only_change_in_production

SUPABASE_URL=https://cbunsjdyjmjdcntwnauo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Create an admin user:

```bash
node src/scripts/createAdmin.js
```

Start the backend server:

```bash
npm start
```

The API will be available at `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Database Setup

The Supabase database schema has already been created via migrations. The schema includes:

- `profiles` - User profiles linked to Supabase Auth
- `lawyer_profiles` - Extended profiles for lawyers
- `categories` - Legal specialization categories

All tables have Row Level Security (RLS) enabled.

## Default Credentials

### Admin Login
- Email: `admin@findmylawyer.com`
- Password: `admin123`

### Test OTP
For all OTP verifications, use: `123456`

## User Roles

### Client
- Search and browse verified lawyers
- View lawyer profiles and rates

### Lawyer
- Register with Bar Council enrollment number
- Upload verification documents
- Manage profile and expertise
- Set availability and rates

### Admin
- Review pending lawyer applications
- Verify or reject lawyer profiles
- Set authorized consultation rates
- Manage platform content

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-otp` - Verify phone with OTP
- `GET /api/auth/me` - Get current user (protected)

### Lawyer Management
- `POST /api/lawyers/upload-certificate` - Upload certificate (lawyer)
- `PUT /api/lawyers/profile` - Update profile (lawyer)
- `GET /api/lawyers/pending` - Get pending lawyers (admin)
- `PUT /api/lawyers/verify/:id` - Approve/reject lawyer (admin)

## Technologies

### Backend
- Express.js - Web framework
- Supabase - Database and authentication
- JWT - Token-based authentication
- CORS - Cross-origin resource sharing

### Frontend
- React 19 - UI framework
- TypeScript - Type safety
- Vite - Build tool
- Tailwind CSS - Styling
- React Router - Navigation
- Axios - HTTP client

### Database
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Real-time capabilities

## Security Features

- JWT-based authentication
- Row Level Security on all tables
- Role-based access control
- Secure password hashing (Supabase Auth)
- Environment variable protection
- CORS configuration

## Development

### Backend Development

```bash
cd backend
npm start
```

The server will restart automatically with nodemon (if configured).

### Frontend Development

```bash
cd frontend
npm run dev
```

Hot module replacement is enabled for fast development.

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

## Known Limitations

- OTP verification is mocked (always accepts "123456")
- File upload is simulated (use URL input instead)
- No email notifications configured
- Twilio and Cloudinary integrations are stubbed

## Future Enhancements

- Real OTP integration with Twilio
- File upload with Cloudinary
- Email notifications
- Lawyer search and filtering
- Booking system
- Payment integration
- Chat functionality
- Review and rating system

## Documentation

- See `FIXES.md` for detailed information about all issues fixed
- See `backend/README.md` for backend-specific documentation
- API documentation available at backend endpoints

## Support

For issues and questions, please refer to the project documentation or contact the development team.

## License

UNLICENSED - Private project
