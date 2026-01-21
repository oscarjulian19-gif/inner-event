const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Usamos el SERVICE_ROLE_KEY si estuviera disponible para bypass confirmación email, 
// pero usaremos el ANON_KEY y asumiremos que el autoconfirm está habilitado en local/dev.

const supabase = createClient(supabaseUrl, supabaseKey);

async function registerTestUser() {
    const email = 'test@pragma.com';
    const password = 'password123';

    console.log(`Registering ${email}...`);
    
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log("User already exists in Supabase Auth.");
        } else {
            console.error("Error registering user:", error.message);
        }
    } else {
        console.log("User registered successfully!", data.user.id);
    }
}

registerTestUser();
