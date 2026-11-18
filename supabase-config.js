// Paste the values from your Supabase project here.
// Find them in Supabase: Project Settings -> API.
//
// The anon key is meant to be public (it ships in client-side JS).
// Security comes from the database: row level security, plus the locked
// functions in supabase-lockdown.sql for anything private.
//
// If you leave the placeholders, the site still works offline -
// progress is just saved in the student's browser instead of the database.

window.SUPABASE_URL      = "https://wjajffetmzylqghmezez.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_Esqv1g5FhX8wYbfb17XdKA_bAoasYdt";

// Student codes that get the staff touches in the UI (a Hide button on
// games, the staff tag on the progress page, and so on). This list is NOT
// security and grants no data: the teacher page's names need a staff key,
// which is checked in the database (see supabase-lockdown.sql).
window.TEACHER_CODES = ["MRH0001", "MAZ0001"];
