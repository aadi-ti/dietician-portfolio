// config.js
// config.js

window.SUPABASE_URL = "https://qtexofpezqtaaxfynzyc.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZXhvZnBlenF0YWF4ZnluenljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTM3MjgsImV4cCI6MjA2NjA4OTcyOH0.J3ugZtwhuxulGYejII-C-pOOtO2LgykR0KaE3NmMKc0";
window.SUPABASE_BUCKET = "clientreports";

// Initialize Supabase client and attach to window
window.supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  db: {
    schema: 'public'
  }
});
