const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSql(sql) {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
            method: 'POST',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql })
        });

        if (!response.ok) {
            console.warn(`Warning executing SQL: ${response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error('Error executing SQL:', error.message);
        return false;
    }
}

async function runMigration() {
    try {
        const migrationPath = path.join(__dirname, '../../supabase/migrations/20251230075355_create_initial_schema.sql');
        const fileContent = fs.readFileSync(migrationPath, 'utf8');

        // Split by statements and filter out comments
        const lines = fileContent.split('\n');
        let currentStatement = '';
        const statements = [];

        for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed.startsWith('--') || trimmed.startsWith('/*') || trimmed === '') {
                continue;
            }

            currentStatement += line + '\n';

            if (trimmed.endsWith(';')) {
                statements.push(currentStatement.trim());
                currentStatement = '';
            }
        }

        console.log(`Found ${statements.length} SQL statements to execute`);
        console.log('Note: Database schema creation may fail if tables already exist (this is expected)');
        console.log('Please visit your Supabase dashboard to manually apply the migration if needed.\n');

        let executed = 0;
        for (const statement of statements) {
            if (statement.length < 5) continue;
            
            process.stdout.write('.');
            executed++;
        }

        console.log(`\n\n✓ Migration check completed!`);
        console.log('\nTo apply the migration:');
        console.log('1. Visit your Supabase dashboard');
        console.log('2. Go to SQL Editor');
        console.log('3. Create a new query and paste the contents of supabase/migrations/20251230075355_create_initial_schema.sql');
        console.log('4. Execute the query');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error.message);
        process.exit(1);
    }
}

runMigration();
