# FindMyLawyer - Setup Guide

## Critical: Apply Database Migration

Your Supabase database is connected, but the tables need to be created. Follow these steps:

### Quick Setup (5 minutes)

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Run Migration**
   - Open the file: `supabase/migrations/20251230075355_create_initial_schema.sql`
   - Copy ALL the SQL code
   - Paste it into the Supabase SQL Editor
   - Click "Run"

4. **Verify Tables Created**
   - Go to "Table Editor" in Supabase
   - You should see: `profiles`, `lawyer_profiles`, `categories`

5. **Test Registration**
   - Refresh the web app
   - Click "Register as Client"
   - Fill in the form and submit
   - The registration should now work!

### If You Still Get Errors

**Error: "Invalid API key"**
- Verify `SUPABASE_SERVICE_ROLE_KEY` in Replit Secrets is correct
- It should start with `eyJ` (it's a JWT token)

**Error: "Relation profiles does not exist"**
- The migration SQL wasn't applied yet
- Repeat steps 1-4 above

**Error: "Email already exists"**
- That email was already registered
- Use a different email address

### Database Schema

After migration, you'll have:

- **profiles** - User accounts
  - id (user ID)
  - full_name
  - phone
  - role (client, lawyer, admin)
  - is_phone_verified (boolean)

- **lawyer_profiles** - Lawyer details
  - user_id (reference to profiles)
  - enrollment_number
  - certificate_url
  - status (PENDING_VERIFICATION, VERIFIED, REJECTED)
  - expertise (array of practice areas)

- **categories** - Practice areas

### Test the App

After migration is applied:

1. **Register as Client:**
   - Use any email
   - Set password to "password123"
   - Phone: +1234567890
   - OTP for verification: 123456

2. **Register as Lawyer:**
   - Same as above, but select "Register as Lawyer"
   - Enrollment number: ANY12345 (can be anything)
   - Admin needs to verify before lawyer can use profile features

3. **Test Admin Dashboard:**
   - Create an admin user in Supabase manually:
     - Go to Authentication in Supabase
     - Create a user
     - Add role "admin" to their profile manually

### Next Steps

Once registration works:
1. Test login functionality
2. Configure optional services (Twilio for SMS, Cloudinary for uploads)
3. Deploy to production
