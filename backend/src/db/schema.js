const { pgTable, uuid, text, boolean, timestamp, numeric } = require('drizzle-orm/pg-core');

const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  role: text('role').notNull(),
  isPhoneVerified: boolean('is_phone_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const lawyerProfiles = pgTable('lawyer_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique().references(() => profiles.id, { onDelete: 'cascade' }),
  enrollmentNumber: text('enrollment_number').notNull().unique(),
  certificateUrl: text('certificate_url'),
  status: text('status').notNull().default('PENDING_VERIFICATION'),
  authorizedRate: numeric('authorized_rate').default('0'),
  bio: text('bio'),
  expertise: text('expertise').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = {
  profiles,
  lawyerProfiles,
  categories,
};
