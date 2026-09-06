// ============================================================
// Connexion à la base de données du site (Supabase)
// ============================================================
// Ces deux valeurs sont à remplacer UNE SEULE FOIS, après avoir
// créé le projet sur https://supabase.com :
// Project Settings (icône engrenage) → API → vous trouverez :
//   - "Project URL"       → à coller dans SUPABASE_URL
//   - "anon public" (clé) → à coller dans SUPABASE_ANON_KEY
//
// Important : la clé "anon public" est FAITE pour être visible
// publiquement (elle est utilisée par tous les navigateurs qui
// visitent le site). Ne mettez jamais ici la clé "service_role"
// (celle-là doit rester totalement secrète).
// ============================================================

const SUPABASE_URL = "https://nqseoarmsoedbrwjyika.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xc2VvYXJtc29lZGJyd2p5aWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MDYxNDUsImV4cCI6MjEwNDI4MjE0NX0.NnTnHreDRRnWWmgU_rcyFLDfAgXU-YqW7Zbur-mfJeE";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
