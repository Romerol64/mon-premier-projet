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

const SUPABASE_URL = "COLLEZ_ICI_VOTRE_PROJECT_URL";
const SUPABASE_ANON_KEY = "COLLEZ_ICI_VOTRE_ANON_KEY";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
