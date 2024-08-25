import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://piazhwrekcgxbvsyqiwi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYXpod3Jla2NneGJ2c3lxaXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM1NzIzMTgsImV4cCI6MjAzOTE0ODMxOH0.7fiNp0cihSJtbuKZXrIOjMQBbgx7Rj0bBTGbas4yHqU';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;


