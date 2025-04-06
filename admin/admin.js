// Script d'administration pour la mosquée Abou Bakr

document.addEventListener('DOMContentLoaded', function() {
    // Données de test (à remplacer par une vraie BDD)
    const adminCredentials = {
        username: 'admin',
        password: 'mosquee2025'
    };
    
    // Gestion de la connexion
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('login-error');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginContainer = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Vérification des identifiants (simplifiée)
            if (username === adminCredentials.username && password === adminCredentials.password) {
                // Sauvegarde de la session (en local seulement pour démo, à remplacer par une vraie authentification)
                localStorage.setItem('isLoggedIn', 'true');
                
                // Affichage du dashboard
                loginContainer.style.display = 'none';
                adminDashboard.style.display = 'block';
            } else {
                loginError.style.display = 'block';
                setTimeout(() => {
                    loginError.style.display = 'none';
                }, 3000);
            }
        });
    }
    
    // Vérification automatique de la connexion
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (isLoggedIn === 'true' && adminDashboard && loginContainer) {
            loginContainer.style.display = 'none';
            adminDashboard.style.display = 'block';
        }
    }
    
    checkLoginStatus();
    
    // Gestion de la déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Suppression de la session
            localStorage.removeItem('isLoggedIn');
            
            // Retour à la page de connexion
            loginContainer.style.display = 'block';
            adminDashboard.style.display = 'none';
        });
    }
    
    // Navigation dans le dashboard
    const navLinks = document.querySelectorAll('.admin-nav a');
    const sections = document.querySelectorAll('.admin-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Mise à jour des classes actives
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Affichage de la section correspondante
            sections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`${targetSection}-section`).classList.add('active');
            
            // Mise à jour du titre dans la barre supérieure
            document.querySelector('.admin-top-title h2').textContent = this.textContent.trim();
            
            // Fermeture du menu mobile si ouvert
            if (window.innerWidth < 768) {
                document.querySelector('.admin-sidebar').classList.remove('active');
            }
        });
    });
    
    // Gestion du menu mobile
    const menuToggle = document.querySelector('.admin-menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Navigation entre les sections sans passer par le menu
    const sectionLinks = document.querySelectorAll('.admin-link');
    
    sectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            if (targetSection) {
                // Mise à jour des classes actives dans le menu
                navLinks.forEach(navLink => {
                    if (navLink.getAttribute('data-section') === targetSection) {
                        navLinks.forEach(link => {
                            link.parentElement.classList.remove('active');
                        });
                        navLink.parentElement.classList.add('active');
                    }
                });
                
                // Affichage de la section
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(`${targetSection}-section`).classList.add('active');
                
                // Mise à jour du titre
                document.querySelector('.admin-top-title h2').textContent = 
                    document.querySelector(`.admin-nav a[data-section="${targetSection}"]`).textContent.trim();
            }
        });
    });
    
    // Gestion de l'ajout d'articles
    const addNewsBtn = document.getElementById('add-news-btn');
    const backToNewsBtn = document.getElementById('back-to-news-btn');
    const cancelNewsBtn = document.getElementById('cancel-news-btn');
    
    if (addNewsBtn) {
        addNewsBtn.addEventListener('click', function() {
            // Masquer la liste des articles et afficher le formulaire
            document.getElementById('news-section').classList.remove('active');
            document.getElementById('add-news-section').classList.add('active');
            
            // Mise à jour du titre
            document.querySelector('.admin-top-title h2').textContent = 'Ajouter un article';
        });
    }
    
    if (backToNewsBtn) {
        backToNewsBtn.addEventListener('click', function() {
            // Masquer le formulaire et afficher la liste des articles
            document.getElementById('add-news-section').classList.remove('active');
            document.getElementById('news-section').classList.add('active');
            
            // Mise à jour du titre
            document.querySelector('.admin-top-title h2').textContent = 'Actualités';
        });
    }
    
    if (cancelNewsBtn) {
        cancelNewsBtn.addEventListener('click', function() {
            // Réinitialiser le formulaire
            document.getElementById('news-form').reset();
            document.getElementById('image-preview').innerHTML = '<i class="fas fa-image"></i><p>Aperçu de l\'image</p>';
            
            // Retour à la liste des articles
            document.getElementById('add-news-section').classList.remove('active');
            document.getElementById('news-section').classList.add('active');
            
            // Mise à jour du titre
            document.querySelector('.admin-top-title h2').textContent = 'Actualités';
        });
    }
    
    // Aperçu de l'image
    const imageInput = document.getElementById('news-image');
    const imagePreview = document.getElementById('image-preview');
    
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.addEventListener('load', function() {
                    imagePreview.innerHTML = `<img src="${this.result}" alt="Aperçu">`;
                });
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Gestion du formulaire d'ajout d'article
    const newsForm = document.getElementById('news-form');
    
    if (newsForm) {
        newsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const title = document.getElementById('news-title').value;
            const category = document.getElementById('news-category').value;
            const date = document.getElementById('news-date').value;
            const content = document.getElementById('news-content').value;
            
            // Vérification des champs requis
            if (!title || !category || !date || !imageInput.files[0] || !content) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            
            // Traitement de l'image (dans une vraie application, on enverrait l'image au serveur)
            const imageFile = imageInput.files[0];
            
            // Affichage d'un message de confirmation (à remplacer par un vrai envoi de données)
            alert(`Article "${title}" créé avec succès ! Dans une vraie application, les données seraient envoyées au serveur.`);
            
            // Réinitialisation du formulaire
            newsForm.reset();
            imagePreview.innerHTML = '<i class="fas fa-image"></i><p>Aperçu de l\'image</p>';
            
            // Retour à la liste des articles
            document.getElementById('add-news-section').classList.remove('active');
            document.getElementById('news-section').classList.add('active');
            
            // Mise à jour du titre
            document.querySelector('.admin-top-title h2').textContent = 'Actualités';
        });
    }
    
    // Gestion du formulaire de paramètres
    const settingsForm = document.getElementById('settings-form');
    
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Dans une vraie application, on enverrait les données au serveur
            alert('Paramètres enregistrés avec succès ! Dans une vraie application, les données seraient envoyées au serveur.');
        });
    }
    
    // Suppression d'articles (simulation)
    const deleteButtons = document.querySelectorAll('.delete-news');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const articleId = this.getAttribute('data-id');
            const articleTitle = this.closest('tr').querySelector('td:first-child').textContent;
            
            if (confirm(`Êtes-vous sûr de vouloir supprimer l'article "${articleTitle}" ?`)) {
                // Dans une vraie application, on enverrait une requête au serveur
                alert(`Article "${articleTitle}" supprimé avec succès ! Dans une vraie application, une requête serait envoyée au serveur.`);
                
                // On pourrait supprimer la ligne du tableau
                this.closest('tr').remove();
            }
        });
    });
    
    // Modification d'articles (simulation)
    const editButtons = document.querySelectorAll('.edit-news');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const articleId = this.getAttribute('data-id');
            const articleTitle = this.closest('tr').querySelector('td:first-child').textContent;
            
            // Dans une vraie application, on chargerait les données de l'article
            alert(`Édition de l'article "${articleTitle}". Dans une vraie application, les données seraient chargées depuis le serveur.`);
            
            // Affichage du formulaire d'édition (on réutilise le même formulaire que pour l'ajout)
            document.getElementById('news-section').classList.remove('active');
            document.getElementById('add-news-section').classList.add('active');
            
            // Mise à jour du titre
            document.querySelector('.admin-top-title h2').textContent = 'Modifier un article';
            
            // On pourrait préremplir le formulaire avec les données de l'article
            document.getElementById('news-title').value = articleTitle;
        });
    });
    
    // Filtrage des articles (simulation)
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Mise à jour des boutons actifs
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                const articles = document.querySelectorAll('.news-item');
                
                // Filtrage des articles
                articles.forEach(article => {
                    if (filter === 'all' || article.getAttribute('data-category') === filter) {
                        article.style.display = 'flex';
                    } else {
                        article.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Gestion des cagnottes
    const addFundraisingBtn = document.getElementById('add-fundraising-btn');
    const backToFundraisingBtn = document.getElementById('back-to-fundraising-btn');
    const cancelFundraisingBtn = document.getElementById('cancel-fundraising-btn');
    
    if (addFundraisingBtn) {
        addFundraisingBtn.addEventListener('click', function() {
            // Masquer la liste des cagnottes et afficher le formulaire
            document.getElementById('fundraising-section').classList.remove('active');
            document.getElementById('add-fundraising-section').classList.add('active');
            
            // Mise à jour du titre
            document.querySelector('.admin-top-title h2').textContent = 'Ajouter une cagnotte';
        });
    }
    
    if (backToFundraisingBtn) {
        backToFundraisingBtn.addEventListener('click', function() {
            // Masquer le formulaire et afficher la liste des cagnottes
            document.getElementById('add-fundraising-section').classList.remove('active');
            document.getElementById('fundraising-section').classList.add('active');
            
            // Mise à jour du titre
            document.querySelector('.admin-top-title h2').textContent = 'Cagnottes';
        });
    }
    
    if (cancelFundraisingBtn) {
        cancelFundraisingBtn.addEventListener('click', function() {
            // Réinitialiser le formulaire
            document.getElementById('fundraising-form').reset();
            document.getElementById('fundraising-image-preview').innerHTML = '<i class="fas fa-image"></i><p>Aperçu de l\'image</p>';
            
            // Retour à la liste des cagnottes
            document.getElementById('add-fundraising-section').classList.remove('active');
            document.getElementById('fundraising-section').classList.add('active');
            
            // Mise à jour du titre
            document.querySelector('.admin-top-title h2').textContent = 'Cagnottes';
        });
    }
    
    // Aperçu de l'image de cagnotte
    const fundraisingImageInput = document.getElementById('fundraising-image');
    const fundraisingImagePreview = document.getElementById('fundraising-image-preview');
    
    if (fundraisingImageInput && fundraisingImagePreview) {
        fundraisingImageInput.addEventListener('change', function() {
            const file = this.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.addEventListener('load', function() {
                    fundraisingImagePreview.innerHTML = `<img src="${this.result}" alt="Aperçu">`;
                });
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Gestion du formulaire d'ajout de cagnotte
    const fundraisingForm = document.getElementById('fundraising-form');
    
    if (fundraisingForm) {
        fundraisingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const title = document.getElementById('fundraising-title').value;
            const goal = document.getElementById('fundraising-goal').value;
            const collected = document.getElementById('fundraising-collected').value;
            const description = document.getElementById('fundraising-description').value;
            
            // Vérification des champs requis
            if (!title || !goal || !collected || !fundraisingImageInput.files[0] || !description) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            
            // Validation des montants
            if (parseFloat(collected) > parseFloat(goal)) {
                alert('Le montant collecté ne peut pas être supérieur à l\'objectif.');
                return;
            }
            
            // Traitement de l'image (dans une vraie application, on enverrait l'image au serveur)
            const imageFile = fundraisingImageInput.files[0];
            
            // Affichage d'un message de confirmation (à remplacer par un vrai envoi de données)
            alert(`Cagnotte "${title}" créée avec succès ! Dans une vraie application, les données seraient envoyées au serveur.`);
            
            // Réinitialisation du formulaire
            fundraisingForm.reset();
            fundraisingImagePreview.innerHTML = '<i class="fas fa-image"></i><p>Aperçu de l\'image</p>';
            
            // Retour à la liste des cagnottes
            document.getElementById('add-fundraising-section').classList.remove('active');
            document.getElementById('fundraising-section').classList.add('active');
            
            // Mise à jour du titre
            document.querySelector('.admin-top-title h2').textContent = 'Cagnottes';
        });
    }
    
    // Suppression de cagnottes (simulation)
    const deleteFundraisingButtons = document.querySelectorAll('.delete-fundraising');
    
    deleteFundraisingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const projectId = this.getAttribute('data-id');
            const projectTitle = this.closest('tr').querySelector('td:first-child').textContent;
            
            if (confirm(`Êtes-vous sûr de vouloir supprimer la cagnotte "${projectTitle}" ?`)) {
                // Dans une vraie application, on enverrait une requête au serveur
                alert(`Cagnotte "${projectTitle}" supprimée avec succès ! Dans une vraie application, une requête serait envoyée au serveur.`);
                
                // On pourrait supprimer la ligne du tableau
                this.closest('tr').remove();
            }
        });
    });
    
    // Modification de cagnottes (simulation)
    const editFundraisingButtons = document.querySelectorAll('.edit-fundraising');
    
    editFundraisingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const projectId = this.getAttribute('data-id');
            const projectTitle = this.closest('tr').querySelector('td:first-child').textContent;
            const projectGoal = this.closest('tr').querySelector('td:nth-child(2)').textContent;
            const projectCollected = this.closest('tr').querySelector('td:nth-child(3)').textContent;
            
            // Dans une vraie application, on chargerait les données de la cagnotte
            alert(`Édition de la cagnotte "${projectTitle}". Dans une vraie application, les données seraient chargées depuis le serveur.`);
            
            // Affichage du formulaire d'édition (on réutilise le même formulaire que pour l'ajout)
            document.getElementById('fundraising-section').classList.remove('active');
            document.getElementById('add-fundraising-section').classList.add('active');
            
            // Mise à jour du titre
            document.querySelector('.admin-top-title h2').textContent = 'Modifier une cagnotte';
            
            // On pourrait préremplir le formulaire avec les données de la cagnotte
            document.getElementById('fundraising-title').value = projectTitle;
            document.getElementById('fundraising-goal').value = projectGoal.replace(/[^0-9]/g, '');
            document.getElementById('fundraising-collected').value = projectCollected.replace(/[^0-9]/g, '');
        });
    });
    
    // Filtrage des articles (simulation)
    const filterFundraisingButtons = document.querySelectorAll('.filter-fundraising-btn');
    
    if (filterFundraisingButtons.length) {
        filterFundraisingButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Mise à jour des boutons actifs
                filterFundraisingButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                const projects = document.querySelectorAll('.fundraising-item');
                
                // Filtrage des cagnottes
                projects.forEach(project => {
                    if (filter === 'all' || project.getAttribute('data-category') === filter) {
                        project.style.display = 'flex';
                    } else {
                        project.style.display = 'none';
                    }
                });
            });
        });
    }
}); 