const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function registerLegacy() {
    const users = [
        { email: 'oscar.gomez@ikusi.com', password: 'password123' },
        { email: 'william.galindo@compensar.com', password: 'password123' }
    ];

    for (const u of users) {
        console.log(`Registering ${u.email} in Supabase Auth...`);
        const { error } = await supabase.auth.signUp({
            email: u.email,
            password: u.password,
        });
        if (error) console.log(`Result for ${u.email}: ${error.message}`);
        else console.log(`Success for ${u.email}`);
    }
}

registerLegacy();
