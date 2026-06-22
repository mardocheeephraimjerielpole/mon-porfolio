const storageKey = 'adminLoggedIn';
const validCredentials = {
    email: 'mardocheeephraimjerielpole@gmail.com',
    password: 'NeriyaME@1'
};

const pageName = window.location.pathname.split('/').pop();
const isLoggedIn = localStorage.getItem(storageKey) === 'true';

// Vérification immédiate pour Admin.html
if (pageName === 'Admin.html' && !isLoggedIn) {
    window.location.replace('login.html');
}

// Redirection si déjà connecté sur login.html
if (pageName === 'login.html' && isLoggedIn) {
    window.location.replace('Admin.html');
}

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const logoutLink = document.getElementById('logoutLink');
    const loginError = document.getElementById('loginError');
    const loginSuccess = document.getElementById('loginSuccess');

    if (pageName === 'login.html' && sessionStorage.getItem('loggedOut') === 'true') {
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
                localStorage.setItem(storageKey, 'true');
                window.location.href = 'Admin.html';
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
            localStorage.removeItem(storageKey);
            sessionStorage.setItem('loggedOut', 'true');
            window.location.href = 'login.html';
        });
    }
});
