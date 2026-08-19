const SUPABASE_URL = "https://jrxpkoxbvtgjlhkcmrti.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyeHBrb3hidnRnamxoa2NtcnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTE0NjMsImV4cCI6MjEwMjcyNzQ2M30.rj37V4mKSfu2o6BvBaYJueBVYCJSm7FlcANZCIcevyo";

export const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
