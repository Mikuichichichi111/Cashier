const SUPABASE_URL = "https://mitepoyvwxfrffwqgyxb.supabase.co";
const SUPABASE_KEY = "Sb_publishable_uCSvxjc-yJIULaaAMJcNpg_J2zwiect";

const Nano = {
    get user() { return JSON.parse(localStorage.getItem('nano_user')); },
    
    async login(username, ville) {
        if(!username || !ville) return alert("Pseudo et Ville requis !");
        
        // 1. Tente de créer la ville
        await fetch(`${SUPABASE_URL}/rest/v1/villes`, {
            method: 'POST',
            headers: { "apikey": SUPABASE_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ nom: ville })
        }).catch(() => {});

        // 2. Cherche ou crée l'utilisateur
        let res = await fetch(`${SUPABASE_URL}/rest/v1/utilisateurs?username=eq.${username}&ville_name=eq.${ville}`, {
            headers: { "apikey": SUPABASE_KEY }
        });
        let users = await res.json();

        if (users.length === 0) {
            res = await fetch(`${SUPABASE_URL}/rest/v1/utilisateurs`, {
                method: 'POST',
                headers: { "apikey": SUPABASE_KEY, "Content-Type": "application/json", "Prefer": "return=representation" },
                body: JSON.stringify({ username, ville_name: ville })
            });
            users = [await res.json()];
        }
        localStorage.setItem('nano_user', JSON.stringify(users[0]));
        window.location.href = 'hub.html';
    }
};
