const storageKey = 'adminLoggedIn';
const validCredentials = {
    email: 'mardocheeephraimjerielpole@gmail.com',
    password: 'NeriyaME@1'
};

// Détection du nom de fichier plus robuste (compatible avec serveur en ligne)
const pageName = window.location.pathname.split('/').pop() || 'index.html';
const pageNameLower = pageName.toLowerCase();
// Vérifie la présence du token dans localStorage OU sessionStorage
const isLoggedIn = (localStorage.getItem(storageKey) === 'true') || (sessionStorage.getItem(storageKey) === 'true');

// Vérification immédiate pour Admin.html
if (pageNameLower === 'admin.html' && !isLoggedIn) {
    window.location.replace('login.html');
}

// Redirection si déjà connecté sur login.html
if (pageNameLower === 'login.html' && isLoggedIn) {
    window.location.replace('Admin.html');
}

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const logoutLink = document.getElementById('logoutLink');
    const loginError = document.getElementById('loginError');
    const loginSuccess = document.getElementById('loginSuccess');

    if (pageNameLower === 'login.html' && sessionStorage.getItem('loggedOut') === 'true') {
        if (loginSuccess) {
            loginSuccess.classList.remove('hidden');
        }
        sessionStorage.removeItem('loggedOut');
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (email === validCredentials.email && password === validCredentials.password) {
                const remember = document.getElementById('rememberMe');
                const useRemember = remember && remember.checked;
                performLogin(useRemember);
                return;
            }

            if (loginError) {
                loginError.textContent = 'Email ou mot de passe invalide.';
                loginError.classList.remove('hidden');
            }
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', function (event) {
            event.preventDefault();
            // supprimer l'état de connexion des deux stockages
            localStorage.removeItem(storageKey);
            sessionStorage.removeItem(storageKey);
            sessionStorage.setItem('loggedOut', 'true');
            window.location.href = 'login.html';
        });
    }

    // helper to set login state and optionally show success message before redirect
    function performLogin(remember) {
        // clear any previous error
        if (loginError) loginError.classList.add('hidden');
        if (remember) {
            localStorage.setItem(storageKey, 'true');
        } else {
            sessionStorage.setItem(storageKey, 'true');
        }

        // show success message if present
        if (loginSuccess) {
            loginSuccess.classList.remove('hidden');
            loginSuccess.classList.add('show');
        }

        // short delay to let user see success feedback
        setTimeout(() => {
            if (pageNameLower === 'index.html' || pageNameLower === '') {
                // if on index modal, redirect to admin
                window.location.href = 'Admin.html';
            } else {
                window.location.href = 'Admin.html';
            }
        }, 700);
    }

    // test helper accessible depuis la console : runLoginTest()
    window.runLoginTest = function () {
        // ensure clean state
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem(storageKey);

        // simulate remember=true
        performLogin(true);
        const afterRemember = { local: localStorage.getItem(storageKey), session: sessionStorage.getItem(storageKey) };

        // cleanup and simulate remember=false
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem(storageKey);
        performLogin(false);
        const afterSession = { local: localStorage.getItem(storageKey), session: sessionStorage.getItem(storageKey) };

        // cleanup after test
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem(storageKey);

        console.log('runLoginTest results:', { remember_true: afterRemember, remember_false: afterSession });
        return { remember_true: afterRemember, remember_false: afterSession };
    };
});
