const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL ERROR: Supabase URL or Key is missing from .env file.');
    console.error('Please check backend/.env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
