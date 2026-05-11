const SUPABASE_URL = "https://mitepoyvwxfrffwqgyxb.supabase.co";
const SUPABASE_KEY = "Sb_publishable_uCSvxjc-yJIULaaAMJcNpg_J2zwiect";

async function supabaseQuery(table, method, data = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    const options = {
        method: method,
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    };
    if (method !== 'GET') options.body = JSON.stringify(data);
    const response = await fetch(url + (method === 'GET' ? '?' + new URLSearchParams(data) : ''), options);
    return await response.json();
}

const Nano = {
    // Récupère l'utilisateur depuis le stockage local
    get user() { return JSON.parse(localStorage.getItem('nano_user')); },
    
    async login(username, ville) {
        if(!username || !ville) return alert("Remplis tout !");
        
        // 1. On s'assure que la ville existe
        await supabaseQuery('villes', 'POST', {nom: ville}).catch(() => {});
        
        // 2. On cherche l'utilisateur dans cette ville
        let users = await supabaseQuery('utilisateurs', 'GET', {
            username: `eq.${username}`, 
            ville_name: `eq.${ville}`
        });

        // 3. Si l'utilisateur n'existe pas, on le crée
        if (!users || users.length === 0) {
            users = await supabaseQuery('utilisateurs', 'POST', {
                username: username, 
                ville_name: ville
            });
        }
        
        // 4. On sauvegarde et on va au Hub
        localStorage.setItem('nano_user', JSON.stringify(users[0]));
        window.location.href = 'hub.html';
    }
};
