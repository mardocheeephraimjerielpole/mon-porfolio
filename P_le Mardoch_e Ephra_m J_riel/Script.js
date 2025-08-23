// Gestion du formulaire de contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        nom: document.getElementById('nom').value,
        email: document.getElementById('email').value,
        sujet: document.getElementById('sujet').value,
        telephone: document.getElementById('telephone').value,
        message: document.getElementById('message').value
    };

    // Envoyer les données à votre backend (traitement.php)
    fetch('traitement.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            Swal.fire({
                title: 'Message envoyé!',
                text: 'Votre message a bien été envoyé. Une confirmation a été envoyée à votre adresse email.',
                icon: 'success'
            });
            document.getElementById('contactForm').reset();
        } else {
            Swal.fire({
                title: 'Erreur!',
                text: data.message,
                icon: 'error'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Erreur!',
            text: 'Une erreur s\'est produite lors de l\'envoi du message',
            icon: 'error'
        });
    });
});
// Script pour sauvegarder les demandes des employeurs
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    // Charger les messages sauvegardés
    loadSavedMessages();
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les données du formulaire
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            date: new Date().toLocaleString('fr-FR')
        };
        
        // Envoyer par email (via mailto)
        const mailtoLink = `mailto:mardocheeephraimjerielpole@gmail.com?subject=Demande de contact: ${encodeURIComponent(formData.subject)}&body=Nom: ${encodeURIComponent(formData.fullName)}%0AEmail: ${encodeURIComponent(formData.email)}%0ATéléphone: ${encodeURIComponent(formData.phoneNumber)}%0A%0AMessage:%0A${encodeURIComponent(formData.message)}%0A%0AEnvoyé le: ${encodeURIComponent(formData.date)}`;
        window.location.href = mailtoLink;
        
        // Sauvegarder localement
        saveMessageLocally(formData);
        
        // Afficher un message de confirmation
        alert('Votre message a été envoyé et sauvegardé !');
        
        // Réinitialiser le formulaire
        contactForm.reset();
    });
    
    function saveMessageLocally(messageData) {
        // Récupérer les messages existants ou initialiser un tableau vide
        let savedMessages = JSON.parse(localStorage.getItem('employerMessages')) || [];
        
        // Ajouter le nouveau message
        savedMessages.push(messageData);
        
        // Sauvegarder dans le localStorage
        localStorage.setItem('employerMessages', JSON.stringify(savedMessages));
        
        // Mettre à jour l'affichage
        loadSavedMessages();
    }
    
    function loadSavedMessages() {
        const savedMessages = JSON.parse(localStorage.getItem('employerMessages')) || [];
        const messagesList = document.getElementById('messagesList');
        const savedMessagesContainer = document.getElementById('savedMessages');
        
        if (savedMessages.length > 0) {
            savedMessagesContainer.style.display = 'block';
            messagesList.innerHTML = '';
            
            savedMessages.forEach((message, index) => {
                const messageElement = document.createElement('div');
                messageElement.style.borderBottom = '1px solid #444';
                messageElement.style.padding = '10px 0';
                messageElement.innerHTML = `
                    <p><strong>De:</strong> ${message.fullName} (${message.email})</p>
                    <p><strong>Sujet:</strong> ${message.subject}</p>
                    <p><strong>Message:</strong> ${message.message}</p>
                    <p><strong>Date:</strong> ${message.date}</p>
                    <button onclick="deleteMessage(${index})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Supprimer</button>
                `;
                messagesList.appendChild(messageElement);
            });
        } else {
            savedMessagesContainer.style.display = 'none';
        }
    }
    
    // Fonction pour supprimer un message (accessible globalement)
    window.deleteMessage = function(index) {
        let savedMessages = JSON.parse(localStorage.getItem('employerMessages')) || [];
        savedMessages.splice(index, 1);
        localStorage.setItem('employerMessages', JSON.stringify(savedMessages));
        loadSavedMessages();
    };
});