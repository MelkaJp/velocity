import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jamocvufsaxuiweyelgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbW9jdnVmc2F4dWl3ZXllbGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjA5MTYsImV4cCI6MjA5MTU5NjkxNn0.M0q4qPd7CGZ6o0Wtw5dGmQZkBKw_jWf5zMq8Cqc9koE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;