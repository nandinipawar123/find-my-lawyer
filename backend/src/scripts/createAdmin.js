require('dotenv').config();
const supabase = require('../config/supabase');

const createAdmin = async () => {
    try {
        const adminEmail = 'admin@findmylawyer.com';
        const adminPassword = 'admin123';

        const { data: existingUser } = await supabase.auth.admin.listUsers();
        const adminExists = existingUser.users.find(u => u.email === adminEmail);

        if (adminExists) {
            console.log('Admin user already exists:', adminEmail);
            process.exit(0);
        }

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true,
            user_metadata: {
                name: 'Super Admin',
                phone: '0000000000',
                role: 'admin'
            }
        });

        if (authError) {
            throw authError;
        }

        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                full_name: 'Super Admin',
                phone: '0000000000',
                role: 'admin',
                is_phone_verified: true
            });

        if (profileError) {
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw profileError;
        }

        console.log('Admin user created successfully!');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        console.log('Please change the password after first login.');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
        process.exit(1);
    }
};

createAdmin();
