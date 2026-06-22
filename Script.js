document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const messagesList = document.getElementById('messagesList');
    const savedMessagesContainer = document.getElementById('savedMessages');
    const emptyState = document.getElementById('emptyState');
    const messageCount = document.getElementById('messageCount');
    const latestMessage = document.getElementById('latestMessage');
    const clearMessagesBtn = document.getElementById('clearMessagesBtn');
    const storageKey = 'employerMessages';

    const skillsList = document.getElementById('skillsList');
    const skillsAdminList = document.getElementById('skillsAdminList');
    const skillNameInput = document.getElementById('skillName');
    const skillDescriptionInput = document.getElementById('skillDescription');
    const addSkillBtn = document.getElementById('addSkillBtn');
    const skillsKey = 'portfolioSkills';
    let editingSkillIndex = null;

    const educationList = document.getElementById('educationList');
    const educationAdminList = document.getElementById('educationAdminList');
    const educationYearInput = document.getElementById('educationYear');
    const educationTitleInput = document.getElementById('educationTitle');
    const educationDescriptionInput = document.getElementById('educationDescription');
    const addEducationBtn = document.getElementById('addEducationBtn');
    const educationKey = 'portfolioEducation';
    let editingEducationIndex = null;

    const certificateContainer = document.getElementById('certificateContainer');
    const certificatesAdminList = document.getElementById('certificatesAdminList');
    const certificateTagInput = document.getElementById('certificateTag');
    const certificateTitleInput = document.getElementById('certificateTitle');
    const certificateDateInput = document.getElementById('certificateDate');
    const certificateDescriptionInput = document.getElementById('certificateDescription');
    const certificateFileLinkInput = document.getElementById('certificateFileLink');
    const certificateBadgeLinkInput = document.getElementById('certificateBadgeLink');
    const addCertificateBtn = document.getElementById('addCertificateBtn');
    const certificatesKey = 'portfolioCertificates';
    let editingCertificateIndex = null;

    const servicesList = document.getElementById('servicesList');
    const servicesAdminList = document.getElementById('servicesAdminList');
    const serviceIconInput = document.getElementById('serviceIcon');
    const serviceTitleInput = document.getElementById('serviceTitle');
    const serviceDescriptionInput = document.getElementById('serviceDescription');
    const addServiceBtn = document.getElementById('addServiceBtn');
    const servicesKey = 'portfolioServices';
    let editingServiceIndex = null;

    const testimonialsWrapper = document.getElementById('testimonialsWrapper');
    const testimonialsAdminList = document.getElementById('testimonialsAdminList');
    const testimonialImageInput = document.getElementById('testimonialImage');
    const testimonialNameInput = document.getElementById('testimonialName');
    const testimonialRatingInput = document.getElementById('testimonialRating');
    const testimonialTextInput = document.getElementById('testimonialText');
    const addTestimonialBtn = document.getElementById('addTestimonialBtn');
    const testimonialsKey = 'portfolioTestimonials';
    let editingTestimonialIndex = null;

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                fullName: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phoneNumber: document.getElementById('phoneNumber').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim(),
                date: new Date().toLocaleString('fr-FR')
            };

            if (!formData.fullName || !formData.email || !formData.subject || !formData.message) {
                alert('Merci de remplir tous les champs requis.');
                return;
            }

            saveMessageLocally(formData);

            const mailtoLink = `mailto:mardocheeephraimjerielpole@gmail.com?subject=${encodeURIComponent('Demande de contact: ' + formData.subject)}&body=Nom: ${encodeURIComponent(formData.fullName)}%0AEmail: ${encodeURIComponent(formData.email)}%0ATéléphone: ${encodeURIComponent(formData.phoneNumber)}%0A%0AMessage:%0A${encodeURIComponent(formData.message)}%0A%0AEnvoyé le: ${encodeURIComponent(formData.date)}`;
            window.location.href = mailtoLink;

            alert('Votre message a été sauvegardé. L\'application mail va s\'ouvrir.');
            contactForm.reset();
        });
    }

    if (messagesList) {
        loadSavedMessages();
    }

    if (clearMessagesBtn) {
        clearMessagesBtn.addEventListener('click', function() {
            if (!confirm('Supprimer tous les messages enregistrés ?')) {
                return;
            }
            localStorage.removeItem(storageKey);
            loadSavedMessages();
        });
    }

    if (skillsList) {
        loadSkills();
    }

    if (skillsAdminList) {
        renderSkillsAdmin();
    }

    if (educationList) {
        loadEducation();
    }

    if (educationAdminList) {
        renderEducationAdmin();
    }

    if (certificateContainer) {
        loadCertificates();
    }

    if (certificatesAdminList) {
        renderCertificatesAdmin();
    }

    if (servicesList) {
        loadServices();
    }

    if (servicesAdminList) {
        renderServicesAdmin();
    }

    if (testimonialsWrapper) {
        loadTestimonials();
    }

    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function() {
            const name = skillNameInput.value.trim();
            const description = skillDescriptionInput.value.trim();

            if (!name || !description) {
                alert('Merci de remplir le nom et la description de la compétence.');
                return;
            }

            const skills = getSkills();

            if (editingSkillIndex !== null) {
                skills[editingSkillIndex] = { title: name, description };
                editingSkillIndex = null;
                addSkillBtn.textContent = 'Ajouter compétence';
            } else {
                skills.unshift({ title: name, description });
            }

            localStorage.setItem(skillsKey, JSON.stringify(skills));
            skillNameInput.value = '';
            skillDescriptionInput.value = '';
            renderSkillsAdmin();
            loadSkills();
        });
    }

    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', function() {
            const year = educationYearInput.value.trim();
            const title = educationTitleInput.value.trim();
            const description = educationDescriptionInput.value.trim();

            if (!year || !title || !description) {
                alert('Merci de remplir tous les champs de l’éducation.');
                return;
            }

            const education = getEducation();
            if (editingEducationIndex !== null) {
                education[editingEducationIndex] = { year, title, description };
                editingEducationIndex = null;
                addEducationBtn.textContent = 'Ajouter / modifier';
            } else {
                education.unshift({ year, title, description });
            }

            localStorage.setItem(educationKey, JSON.stringify(education));
            educationYearInput.value = '';
            educationTitleInput.value = '';
            educationDescriptionInput.value = '';
            renderEducationAdmin();
            loadEducation();
        });
    }

    if (addCertificateBtn) {
        addCertificateBtn.addEventListener('click', function() {
            const tag = certificateTagInput.value.trim();
            const title = certificateTitleInput.value.trim();
            const date = certificateDateInput.value.trim();
            const description = certificateDescriptionInput.value.trim();
            const fileLink = certificateFileLinkInput.value.trim();
            const badgeLink = certificateBadgeLinkInput.value.trim();

            if (!tag || !title || !date || !description || !fileLink || !badgeLink) {
                alert('Merci de remplir tous les champs du certificat.');
                return;
            }

            const certificates = getCertificates();
            if (editingCertificateIndex !== null) {
                certificates[editingCertificateIndex] = { tag, title, date, description, fileLink, badgeLink };
                editingCertificateIndex = null;
                addCertificateBtn.textContent = 'Ajouter / modifier';
            } else {
                certificates.unshift({ tag, title, date, description, fileLink, badgeLink });
            }

            localStorage.setItem(certificatesKey, JSON.stringify(certificates));
            certificateTagInput.value = '';
            certificateTitleInput.value = '';
            certificateDateInput.value = '';
            certificateDescriptionInput.value = '';
            certificateFileLinkInput.value = '';
            certificateBadgeLinkInput.value = '';
            renderCertificatesAdmin();
            loadCertificates();
        });
    }

    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', function() {
            const icon = serviceIconInput.value.trim() || 'bx bx-briefcase';
            const title = serviceTitleInput.value.trim();
            const description = serviceDescriptionInput.value.trim();

            if (!title || !description) {
                alert('Merci de remplir le titre et la description du service.');
                return;
            }

            const services = getServices();
            if (editingServiceIndex !== null) {
                services[editingServiceIndex] = { icon, title, description };
                editingServiceIndex = null;
                addServiceBtn.textContent = 'Ajouter / modifier';
            } else {
                services.unshift({ icon, title, description });
            }

            localStorage.setItem(servicesKey, JSON.stringify(services));
            serviceIconInput.value = '';
            serviceTitleInput.value = '';
            serviceDescriptionInput.value = '';
            renderServicesAdmin();
            loadServices();
        });
    }

    if (addTestimonialBtn) {
        addTestimonialBtn.addEventListener('click', function() {
            const image = testimonialImageInput.value.trim();
            const name = testimonialNameInput.value.trim();
            const rating = Number(testimonialRatingInput.value.trim());
            const text = testimonialTextInput.value.trim();

            if (!image || !name || !rating || !text || rating < 1 || rating > 5) {
                alert('Merci de remplir tous les champs du témoignage avec une note entre 1 et 5.');
                return;
            }

            const testimonials = getTestimonials();
            if (editingTestimonialIndex !== null) {
                testimonials[editingTestimonialIndex] = { image, name, rating, text };
                editingTestimonialIndex = null;
                addTestimonialBtn.textContent = 'Ajouter / modifier';
            } else {
                testimonials.unshift({ image, name, rating, text });
            }

            localStorage.setItem(testimonialsKey, JSON.stringify(testimonials));
            testimonialImageInput.value = '';
            testimonialNameInput.value = '';
            testimonialRatingInput.value = '';
            testimonialTextInput.value = '';
            renderTestimonialsAdmin();
            loadTestimonials();
        });
    }

    function saveMessageLocally(messageData) {
        const savedMessages = JSON.parse(localStorage.getItem(storageKey)) || [];
        savedMessages.unshift(messageData);
        localStorage.setItem(storageKey, JSON.stringify(savedMessages));
    }

    function loadSavedMessages() {
        const savedMessages = JSON.parse(localStorage.getItem(storageKey)) || [];

        if (!messagesList || !savedMessagesContainer || !emptyState || !messageCount || !latestMessage) {
            return;
        }

        messageCount.textContent = savedMessages.length;

        if (savedMessages.length > 0) {
            savedMessagesContainer.classList.remove('hidden');
            emptyState.classList.add('hidden');
            messagesList.innerHTML = '';

            savedMessages.forEach((message, index) => {
                const messageElement = document.createElement('div');
                messageElement.className = 'message-card';
                messageElement.innerHTML = `
                    <p><strong>De :</strong> ${message.fullName} <span>(${message.email})</span></p>
                    <p><strong>Objet :</strong> ${message.subject}</p>
                    <p><strong>Message :</strong> ${message.message}</p>
                    <p><strong>Date :</strong> ${message.date}</p>
                    <button class="btn btn-small" onclick="deleteMessage(${index})">Supprimer</button>
                `;
                messagesList.appendChild(messageElement);
            });

            latestMessage.textContent = `${savedMessages[0].fullName} — ${savedMessages[0].subject}`;
        } else {
            savedMessagesContainer.classList.add('hidden');
            emptyState.classList.remove('hidden');
            messagesList.innerHTML = '';
            latestMessage.textContent = 'Aucun message';
        }
    }

    function getLocalData(key, defaultValue) {
        const saved = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(saved)) {
            return saved;
        }
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
    }

    function getSkills() {
        return getLocalData(skillsKey, [
            { title: 'HTML & CSS', description: 'Création de pages web responsives et modernes.' },
            { title: 'JavaScript', description: 'Programmation interactive pour le front-end.' },
            { title: 'Tests Logiciels', description: 'Contrôle qualité et débogage des applications.' }
        ]);
    }

    function getEducation() {
        return getLocalData(educationKey, [
            { year: '2023', title: 'Brevet de Technicien', description: 'Diplômé du Collège ISTCJ avec une spécialisation en BT Électronique.' },
            { year: '2025', title: 'Brevet de Technicien Supérieur (LPELIA)', description: 'Brevet de Technicien Supérieur en système Électronique & Informatique.' },
            { year: '2024', title: 'Stage', description: 'Stage en tant que développeur frontend chez ABC Tech.' }
        ]);
    }

    function getCertificates() {
        return getLocalData(certificatesKey, [
            { tag: 'Cisco Networking Academy', title: 'Introduction à la cybersécurité', date: '30 Avril 2026', description: 'Compétences validées : Protection des données en ligne, analyse des menaces et vulnérabilités.', fileLink: 'documents/Introduction_to_Cybersecurity_certificate_mardocheeephraimjerielpole-gmail-com_12466e00-d545-4ce5-9404-125e7eda05fe.pdf', badgeLink: 'documents/I2CSUpdate20260504-31-ma8pao.pdf' }
        ]);
    }

    function getServices() {
        return getLocalData(servicesKey, [
            { icon: 'bx bx-laptop', title: 'Développement Frontend', description: 'Sites web réactifs et interactifs avec HTML, CSS, JavaScript.' },
            { icon: 'bx bx-chalkboard', title: 'Formation', description: 'Formation et mentorat en développement web.' },
            { icon: 'bx bx-test-tube', title: 'Tests Logiciels', description: 'Tests rigoureux et débogage d’applications web.' }
        ]);
    }

    function getTestimonials() {
        return getLocalData(testimonialsKey, [
            { image: 'images/image(14).jpg', name: 'EPHRAIM', rating: 5, text: 'Je m’assure de la qualité et de la fonctionnalité des applications web grâce à des tests rigoureux et du débogage.' },
            { image: 'images/image (3).jpg', name: 'JERIEL', rating: 5, text: 'Dans le développement d’applications web, la qualité et la fonctionnalité sont primordiales.' }
        ]);
    }

    function loadSkills() {
        const skills = getSkills();
        if (!skillsList) {
            return;
        }

        if (skills.length === 0) {
            skillsList.innerHTML = '<p class="empty-state">Aucune compétence définie. Ajoute-en depuis la page admin.</p>';
            return;
        }

        skillsList.innerHTML = skills.map(skill => `
            <div class="skill-card">
                <h3>${skill.title}</h3>
                <p>${skill.description}</p>
            </div>
        `).join('');
    }

    function loadEducation() {
        const education = getEducation();
        if (!educationList) {
            return;
        }

        educationList.innerHTML = education.map(item => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-date">${item.year}</div>
                <div class="timeline-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');
    }

    function loadCertificates() {
        const certificates = getCertificates();
        if (!certificateContainer) {
            return;
        }

        certificateContainer.innerHTML = certificates.map(cert => `
            <div class="certificat-info">
                <span class="cert-tag">${cert.tag}</span>
                <h4>${cert.title}</h4>
                <p class="cert-date">Obtenu le : ${cert.date}</p>
                <p class="cert-desc">${cert.description}</p>
                <span class="cert-id">Lien : ${cert.fileLink ? '<a href="' + cert.fileLink + '" target="_blank">PDF</a>' : 'N/A'}</span>
                <div class="cert-buttons-group">
                    <a href="${cert.fileLink}" target="_blank" class="btn-cert"><i class='bx bx-file'></i> Certificat Officiel</a>
                    <a href="${cert.badgeLink}" target="_blank" class="btn-cert btn-secondary-cert"><i class='bx bx-badge-check'></i> Badge & Détails</a>
                </div>
            </div>
        `).join('');
    }

    function loadServices() {
        const services = getServices();
        if (!servicesList) {
            return;
        }

        servicesList.innerHTML = services.map(service => `
            <div class="Service-box">
                <i class='${service.icon}'></i>
                <div class="Service-info">
                    <h4>${service.title}</h4>
                    <p>${service.description}</p>
                </div>
            </div>
        `).join('');
    }

    function loadTestimonials() {
        const testimonials = getTestimonials();
        if (!testimonialsWrapper) {
            return;
        }

        testimonialsWrapper.innerHTML = testimonials.map(item => `
            <div class="temoignages-item">
                <img src="${item.image}" alt="${item.name}">
                <h2>${item.name}</h2>
                <div class="rating">
                    ${'<i class="bx bxs-star"></i>'.repeat(item.rating)}
                    ${'<i class="bx bx-star"></i>'.repeat(5 - item.rating)}
                </div>
                <p>${item.text}</p>
            </div>
        `).join('');
    }

    function renderSkillsAdmin() {
        const skills = getSkills();
        if (!skillsAdminList) {
            return;
        }

        if (skills.length === 0) {
            skillsAdminList.innerHTML = '<p class="empty-state">Aucune compétence à modifier.</p>';
            return;
        }

        skillsAdminList.innerHTML = skills.map((skill, index) => `
            <div class="skill-admin-card">
                <div>
                    <h3>${skill.title}</h3>
                    <p>${skill.description}</p>
                </div>
                <div class="skill-admin-actions">
                    <button class="btn btn-small" onclick="editSkill(${index})">Modifier</button>
                    <button class="btn btn-small btn-danger" onclick="deleteSkill(${index})">Supprimer</button>
                </div>
            </div>
        `).join('');
    }

    function renderEducationAdmin() {
        const education = getEducation();
        if (!educationAdminList) {
            return;
        }

        if (education.length === 0) {
            educationAdminList.innerHTML = '<p class="empty-state">Aucun élément d’éducation à modifier.</p>';
            return;
        }

        educationAdminList.innerHTML = education.map((item, index) => `
            <div class="skill-admin-card">
                <div>
                    <h3>${item.year} - ${item.title}</h3>
                    <p>${item.description}</p>
                </div>
                <div class="skill-admin-actions">
                    <button class="btn btn-small" onclick="editEducation(${index})">Modifier</button>
                    <button class="btn btn-small btn-danger" onclick="deleteEducation(${index})">Supprimer</button>
                </div>
            </div>
        `).join('');
    }

    function renderCertificatesAdmin() {
        const certificates = getCertificates();
        if (!certificatesAdminList) {
            return;
        }

        if (certificates.length === 0) {
            certificatesAdminList.innerHTML = '<p class="empty-state">Aucun certificat à modifier.</p>';
            return;
        }

        certificatesAdminList.innerHTML = certificates.map((cert, index) => `
            <div class="skill-admin-card">
                <div>
                    <h3>${cert.title}</h3>
                    <p>${cert.tag} — ${cert.date}</p>
                </div>
                <div class="skill-admin-actions">
                    <button class="btn btn-small" onclick="editCertificate(${index})">Modifier</button>
                    <button class="btn btn-small btn-danger" onclick="deleteCertificate(${index})">Supprimer</button>
                </div>
            </div>
        `).join('');
    }

    function renderServicesAdmin() {
        const services = getServices();
        if (!servicesAdminList) {
            return;
        }

        if (services.length === 0) {
            servicesAdminList.innerHTML = '<p class="empty-state">Aucun service à modifier.</p>';
            return;
        }

        servicesAdminList.innerHTML = services.map((service, index) => `
            <div class="skill-admin-card">
                <div>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
                <div class="skill-admin-actions">
                    <button class="btn btn-small" onclick="editService(${index})">Modifier</button>
                    <button class="btn btn-small btn-danger" onclick="deleteService(${index})">Supprimer</button>
                </div>
            </div>
        `).join('');
    }

    function renderTestimonialsAdmin() {
        const testimonials = getTestimonials();
        if (!testimonialsAdminList) {
            return;
        }

        if (testimonials.length === 0) {
            testimonialsAdminList.innerHTML = '<p class="empty-state">Aucun témoignage à modifier.</p>';
            return;
        }

        testimonialsAdminList.innerHTML = testimonials.map((item, index) => `
            <div class="skill-admin-card">
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.text.substring(0, 80)}...</p>
                </div>
                <div class="skill-admin-actions">
                    <button class="btn btn-small" onclick="editTestimonial(${index})">Modifier</button>
                    <button class="btn btn-small btn-danger" onclick="deleteTestimonial(${index})">Supprimer</button>
                </div>
            </div>
        `).join('');
    }

    window.deleteMessage = function(index) {
        const savedMessages = JSON.parse(localStorage.getItem(storageKey)) || [];
        savedMessages.splice(index, 1);
        localStorage.setItem(storageKey, JSON.stringify(savedMessages));
        loadSavedMessages();
    };

    window.editSkill = function(index) {
        const skills = getSkills();
        const skill = skills[index];
        if (!skill) return;
        skillNameInput.value = skill.title;
        skillDescriptionInput.value = skill.description;
        editingSkillIndex = index;
        addSkillBtn.textContent = 'Mettre à jour';
        window.location.hash = '#portfolio';
    };

    window.deleteSkill = function(index) {
        const skills = getSkills();
        if (!confirm('Supprimer cette compétence ?')) return;
        skills.splice(index, 1);
        localStorage.setItem(skillsKey, JSON.stringify(skills));
        renderSkillsAdmin();
        loadSkills();
    };

    window.editEducation = function(index) {
        const education = getEducation();
        const item = education[index];
        if (!item) return;
        educationYearInput.value = item.year;
        educationTitleInput.value = item.title;
        educationDescriptionInput.value = item.description;
        editingEducationIndex = index;
        addEducationBtn.textContent = 'Mettre à jour';
        window.location.hash = '#educationAdmin';
    };

    window.deleteEducation = function(index) {
        const education = getEducation();
        if (!confirm('Supprimer cet élément d’éducation ?')) return;
        education.splice(index, 1);
        localStorage.setItem(educationKey, JSON.stringify(education));
        renderEducationAdmin();
        loadEducation();
    };

    window.editCertificate = function(index) {
        const certificates = getCertificates();
        const cert = certificates[index];
        if (!cert) return;
        certificateTagInput.value = cert.tag;
        certificateTitleInput.value = cert.title;
        certificateDateInput.value = cert.date;
        certificateDescriptionInput.value = cert.description;
        certificateFileLinkInput.value = cert.fileLink;
        certificateBadgeLinkInput.value = cert.badgeLink;
        editingCertificateIndex = index;
        addCertificateBtn.textContent = 'Mettre à jour';
        window.location.hash = '#certificatesAdmin';
    };

    window.deleteCertificate = function(index) {
        const certificates = getCertificates();
        if (!confirm('Supprimer ce certificat ?')) return;
        certificates.splice(index, 1);
        localStorage.setItem(certificatesKey, JSON.stringify(certificates));
        renderCertificatesAdmin();
        loadCertificates();
    };

    window.editService = function(index) {
        const services = getServices();
        const service = services[index];
        if (!service) return;
        serviceIconInput.value = service.icon;
        serviceTitleInput.value = service.title;
        serviceDescriptionInput.value = service.description;
        editingServiceIndex = index;
        addServiceBtn.textContent = 'Mettre à jour';
        window.location.hash = '#servicesAdmin';
    };

    window.deleteService = function(index) {
        const services = getServices();
        if (!confirm('Supprimer ce service ?')) return;
        services.splice(index, 1);
        localStorage.setItem(servicesKey, JSON.stringify(services));
        renderServicesAdmin();
        loadServices();
    };

    window.editTestimonial = function(index) {
        const testimonials = getTestimonials();
        const item = testimonials[index];
        if (!item) return;
        testimonialImageInput.value = item.image;
        testimonialNameInput.value = item.name;
        testimonialRatingInput.value = item.rating;
        testimonialTextInput.value = item.text;
        editingTestimonialIndex = index;
        addTestimonialBtn.textContent = 'Mettre à jour';
        window.location.hash = '#testimonialsAdmin';
    };

    window.deleteTestimonial = function(index) {
        const testimonials = getTestimonials();
        if (!confirm('Supprimer ce témoignage ?')) return;
        testimonials.splice(index, 1);
        localStorage.setItem(testimonialsKey, JSON.stringify(testimonials));
        renderTestimonialsAdmin();
        loadTestimonials();
    };

    // Ouvrir / fermer le modal de connexion via le logo
    const logoLinkEl = document.getElementById('logoLink');
    const loginModal = document.getElementById('loginModal');
    const closeModalBtn = document.getElementById('closeModal');

    if (logoLinkEl && loginModal) {
        // safety: s'assurer que le modal est toujours caché au chargement
        loginModal.classList.add('hidden');
        document.body.style.overflow = '';
        logoLinkEl.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                loginModal.classList.add('hidden');
                document.body.style.overflow = '';
            });
        }

        // fermer quand on clique en dehors du contenu
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }
});