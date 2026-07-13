// Paste the values from your Supabase project here.
// Find them in Supabase: Project Settings -> API.
//
// The anon key is meant to be public (it ships in client-side JS).
// Security comes from the Row Level Security policies in supabase-schema.sql.
//
// If you leave the placeholders, the site still works offline -
// progress is just saved in the student's browser instead of the database.

window.SUPABASE_URL      = "https://wjajffetmzylqghmezez.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_Esqv1g5FhX8wYbfb17XdKA_bAoasYdt";

// Passphrase for the teacher export page (/teacher/). This is only a speed
// bump so students don't casually open it - the anon key above can already
// read all scores, so it is NOT real security. Change it to whatever you like.
window.TEACHER_PASSCODE = "hallam-staff";

// Student codes that count as staff. Anyone signed in with one of these
// skips the passphrase gate on /teacher/ entirely. Same caveat as above:
// a speed bump, not real security, since codes have no passwords.
window.TEACHER_CODES = ["MRH0001"];
