document.addEventListener('DOMContentLoaded', function() {
    // Navigation mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Ajouter une classe au body pour empêcher le défilement
        document.body.classList.toggle('menu-open');
    });

    // Fermer le menu mobile lorsqu'un lien est cliqué
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Animation d'écriture pour le titre de la page d'accueil en boucle
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle) {
        const originalText = "Bienvenue à la Mosquée Abou Bakr";
        heroTitle.textContent = '';
        heroTitle.classList.add('typing-animation');
        
        // Fonction pour écrire le texte
        function typeText(text, index, callback) {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                setTimeout(() => typeText(text, index + 1, callback), 100);
            } else {
                setTimeout(callback, 2000); // Pause avant de commencer à effacer
            }
        }
        
        // Fonction pour effacer le texte
        function eraseText(callback) {
            const text = heroTitle.textContent;
            if (text.length > 0) {
                heroTitle.textContent = text.substring(0, text.length - 1);
                setTimeout(() => eraseText(callback), 50);
            } else {
                setTimeout(callback, 500); // Pause avant de recommencer à écrire
            }
        }
        
        // Fonction pour démarrer l'animation en boucle
        function startTypingAnimation() {
            typeText(originalText, 0, () => {
                eraseText(() => startTypingAnimation());
            });
        }
        
        // Démarrer l'animation
        startTypingAnimation();
    }

    // Ajouter bandeau de don
    const donationBanner = document.createElement('div');
    donationBanner.classList.add('donation-banner');
    donationBanner.innerHTML = `
        <div class="donation-banner-content">
            <p>Soutenez notre mosquée par vos dons. Chaque contribution compte !</p>
            <a href="https://www.cotizup.com/mosqueeaboubakr" target="_blank" class="btn donation-btn">
                <i class="fas fa-hand-holding-heart"></i> Faire un don
            </a>
        </div>
        <button class="close-banner"><i class="fas fa-times"></i></button>
    `;
    
    // Insérer le bandeau après l'en-tête
    const header = document.querySelector('header');
    if (header && header.nextElementSibling) {
        document.body.insertBefore(donationBanner, header.nextElementSibling);
    }
    
    // Fermeture du bandeau
    const closeBanner = document.querySelector('.close-banner');
    if (closeBanner) {
        closeBanner.addEventListener('click', function() {
            donationBanner.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                donationBanner.remove();
            }, 500);
            
            // Enregistrer que le bandeau a été fermé (pour 1 jour)
            localStorage.setItem('bannerClosed', new Date().getTime());
        });
    }
    
    // Vérifier si le bandeau a été fermé récemment
    const bannerClosed = localStorage.getItem('bannerClosed');
    if (bannerClosed) {
        const now = new Date().getTime();
        const oneDayInMs = 24 * 60 * 60 * 1000;
        if (now - parseInt(bannerClosed) < oneDayInMs) {
            donationBanner.remove();
        }
    }

    // Animation de défilement fluide pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Si c'est un lien vers le haut de la page (#), défilement vers le haut
            if (targetId === "#") {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Afficher/masquer bouton de retour en haut de page
    const backToTopBtn = document.createElement('button');
    backToTopBtn.classList.add('back-to-top-btn');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Afficher/masquer le bouton en fonction du défilement
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Animation des cartes au défilement
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.card, .news-card, .volunteering-card, .project-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight;
            
            if (elementPosition < screenPosition * 0.9) {
                element.classList.add('animate-in');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Lancer une fois au chargement

    // Fonctionnalité de calendrier d'événements
    initializeEventCalendar();
});

function initializeEventCalendar() {
    // Récupérer les éléments du calendrier
    const calendarContainer = document.querySelector('.event-calendar-container');
    if (!calendarContainer) return;
    
    const prevMonthBtn = calendarContainer.querySelector('.prev-month');
    const nextMonthBtn = calendarContainer.querySelector('.next-month');
    const currentMonthElement = calendarContainer.querySelector('.current-month');
    const calendarGrid = calendarContainer.querySelector('.calendar-grid');
    const addEventBtn = calendarContainer.querySelector('.add-event-btn');
    const eventModal = document.getElementById('event-modal');
    const closeModalBtn = eventModal.querySelector('.close-modal');
    const cancelBtn = eventModal.querySelector('.btn-cancel');
    const addEventForm = document.getElementById('add-event-form');
    
    // Authentification d'admin (simple)
    let isAdmin = false;
    const adminPassword = "admin123"; // Mot de passe simple pour l'exemple
    
    // Vérifier si l'utilisateur est déjà connecté en tant qu'admin
    if (localStorage.getItem('isAdmin') === 'true') {
        isAdmin = true;
        addEventBtn.style.display = 'inline-block';
    } else {
        addEventBtn.style.display = 'none';
    }
    
    // Ajouter un bouton de connexion admin
    const adminLoginBtn = document.createElement('button');
    adminLoginBtn.classList.add('btn', 'admin-login-btn');
    adminLoginBtn.innerHTML = '<i class="fas fa-user-lock"></i> Admin';
    calendarContainer.querySelector('.calendar-actions').appendChild(adminLoginBtn);
    
    // Événement pour le bouton de connexion admin
    adminLoginBtn.addEventListener('click', function() {
        const password = prompt("Entrez le mot de passe administrateur:");
        if (password === adminPassword) {
            isAdmin = true;
            localStorage.setItem('isAdmin', 'true');
            addEventBtn.style.display = 'inline-block';
            alert("Connexion réussie. Vous pouvez maintenant gérer les événements.");
        } else if (password !== null) {
            alert("Mot de passe incorrect.");
        }
    });
    
    // Liste des événements
    let events = [];
    
    // Charger les événements depuis le localStorage
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
        // Convertir les chaînes de date en objets Date
        events = JSON.parse(savedEvents, (key, value) => {
            if (key === 'date') {
                return new Date(value);
            }
            return value;
        });
    } else {
        // Événements par défaut
        events = [
            { id: 1, title: "Aïd al-Fitr", date: new Date(2024, 3, 10), time: "07:00", location: "Grande salle" },
            { id: 2, title: "Cours de Coran débutants", date: new Date(2024, 3, 15), time: "18:30", location: "Salle d'étude" },
            { id: 3, title: "Iftar communautaire", date: new Date(2024, 3, 20), time: "19:45", location: "Salle de réception" },
            { id: 4, title: "Conférence: Islam et modernité", date: new Date(2024, 4, 5), time: "14:00", location: "Auditorium" },
            { id: 5, title: "Cours de langue arabe", date: new Date(2024, 4, 12), time: "10:00", location: "Salle 3" }
        ];
        
        // Sauvegarder les événements dans le localStorage
        saveEvents();
    }
    
    // Date actuelle
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Initialiser le calendrier
    updateCalendar();
    updateUpcomingEvents();
    
    // Ajouter les événements aux boutons
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateCalendar();
        });
    }
    
    // Ouvrir la modal d'ajout d'événement
    if (addEventBtn) {
        addEventBtn.addEventListener('click', function() {
            if (!isAdmin) {
                alert("Vous devez être administrateur pour ajouter des événements.");
                return;
            }
            
            // Initialiser le champ de date avec la date actuelle
            const today = new Date();
            const formattedDate = today.toISOString().substring(0, 10);
            document.getElementById('event-date').value = formattedDate;
            
            // Ouvrir la modal
            eventModal.classList.add('active');
        });
    }
    
    // Fermer la modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            eventModal.classList.remove('active');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            eventModal.classList.remove('active');
        });
    }
    
    // Soumission du formulaire d'ajout d'événement
    if (addEventForm) {
        addEventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!isAdmin) {
                alert("Vous devez être administrateur pour ajouter des événements.");
                return;
            }
            
            const title = document.getElementById('event-title').value;
            const dateStr = document.getElementById('event-date').value;
            const time = document.getElementById('event-time').value;
            const location = document.getElementById('event-location').value;
            const description = document.getElementById('event-description').value;
            
            // Créer l'objet date
            const dateParts = dateStr.split('-');
            const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            
            // Créer un nouvel événement
            const newEvent = {
                id: Date.now(), // ID unique basé sur le timestamp
                title,
                date,
                time,
                location,
                description,
                isUserEvent: true
            };
            
            // Ajouter l'événement à la liste
            events.push(newEvent);
            
            // Sauvegarder les événements dans le localStorage
            saveEvents();
            
            // Mettre à jour le calendrier et la liste des événements
            updateCalendar();
            updateUpcomingEvents();
            
            // Fermer la modal
            eventModal.classList.remove('active');
            
            // Réinitialiser le formulaire
            addEventForm.reset();
            
            alert("Événement ajouté avec succès !");
        });
    }
    
    // Fonction pour sauvegarder les événements dans le localStorage
    function saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }
    
    // Fonction pour mettre à jour le calendrier
    function updateCalendar() {
        if (!currentMonthElement || !calendarGrid) return;
        
        // Mettre à jour l'affichage du mois actuel
        const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Vider la grille du calendrier (après les jours de la semaine)
        const weekdayElements = calendarGrid.querySelectorAll('.calendar-weekday');
        const dayElements = calendarGrid.querySelectorAll('.calendar-day');
        
        dayElements.forEach(day => day.remove());
        
        // Obtenir le premier jour du mois
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        
        // Obtenir le jour de la semaine du premier jour (0 = Dimanche, 1 = Lundi, etc.)
        // Modifier pour que Lundi soit le premier jour (1-7 où 1=Lundi et 7=Dimanche)
        let firstDayWeekday = firstDayOfMonth.getDay() || 7; // Convertir 0 (dimanche) à 7
        
        // Ajouter les jours du mois précédent
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = firstDayWeekday - 1; i > 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day', 'other-month');
            dayElement.textContent = prevMonthLastDay - i + 1;
            calendarGrid.appendChild(dayElement);
        }
        
        // Ajouter les jours du mois actuel
        const today = new Date();
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = i;
            
            // Vérifier si c'est aujourd'hui
            if (currentYear === today.getFullYear() && 
                currentMonth === today.getMonth() && 
                i === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // Vérifier si ce jour a un événement
            const eventDate = new Date(currentYear, currentMonth, i);
            const dayEvents = events.filter(event => 
                event.date.getFullYear() === eventDate.getFullYear() && 
                event.date.getMonth() === eventDate.getMonth() && 
                event.date.getDate() === eventDate.getDate()
            );
            
            if (dayEvents.length > 0) {
                // Vérifier s'il y a des événements ajoutés par l'utilisateur
                const hasUserEvent = dayEvents.some(event => event.isUserEvent);
                
                if (hasUserEvent) {
                    dayElement.classList.add('user-event');
                } else {
                    dayElement.classList.add('has-event');
                }
                
                // Ajouter un événement pour afficher les détails
                dayElement.addEventListener('click', () => {
                    // Afficher les événements pour ce jour (à implémenter selon les besoins)
                    let eventInfo = "Événements du " + i + " " + monthNames[currentMonth] + " " + currentYear + ":\n\n";
                    
                    dayEvents.forEach(event => {
                        eventInfo += `- ${event.title} (${event.time}, ${event.location})\n`;
                        if (event.description) {
                            eventInfo += `  ${event.description}\n`;
                        }
                        
                        // Ajouter option de suppression pour l'admin
                        if (isAdmin && event.isUserEvent) {
                            eventInfo += "\n";
                        }
                    });
                    
                    if (isAdmin) {
                        if (confirm(eventInfo + "\nÊtes-vous administrateur ? Cliquez sur OK pour gérer les événements de ce jour.")) {
                            const eventIds = dayEvents.map(e => e.id);
                            const eventToDelete = prompt("Entrez l'ID de l'événement à supprimer parmi les suivants, ou annulez pour ne rien faire:\n\n" + 
                                dayEvents.map(e => `ID: ${e.id} - ${e.title}`).join("\n"));
                                
                            if (eventToDelete && eventIds.includes(parseInt(eventToDelete))) {
                                if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
                                    // Supprimer l'événement
                                    const eventIndex = events.findIndex(e => e.id === parseInt(eventToDelete));
                                    if (eventIndex !== -1) {
                                        events.splice(eventIndex, 1);
                                        saveEvents();
                                        updateCalendar();
                                        updateUpcomingEvents();
                                        alert("Événement supprimé avec succès !");
                                    }
                                }
                            }
                        } else {
                            alert(eventInfo);
                        }
                    } else {
                        alert(eventInfo);
                    }
                });
            }
            
            calendarGrid.appendChild(dayElement);
        }
        
        // Ajouter les jours du mois suivant pour compléter la grille
        const totalCellsAdded = firstDayWeekday - 1 + lastDayOfMonth.getDate();
        const remainingCells = 42 - totalCellsAdded; // 6 rangées x 7 jours = 42
        
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day', 'other-month');
            dayElement.textContent = i;
            calendarGrid.appendChild(dayElement);
        }
    }
    
    // Fonction pour mettre à jour la liste des événements à venir
    function updateUpcomingEvents() {
        const eventList = calendarContainer.querySelector('.event-list');
        if (!eventList) return;
        
        // Effacer les événements existants
        eventList.innerHTML = '';
        
        // Filtrer les événements à venir (prochains 30 jours)
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);
        
        const upcomingEvents = events.filter(event => 
            event.date >= today && event.date <= thirtyDaysLater
        ).sort((a, b) => a.date - b.date);
        
        // Limiter à 5 événements
        const eventsToShow = upcomingEvents.slice(0, 5);
        
        // Ajouter les événements à la liste
        if (eventsToShow.length === 0) {
            const noEventsElement = document.createElement('p');
            noEventsElement.textContent = 'Aucun événement à venir dans les 30 prochains jours.';
            eventList.appendChild(noEventsElement);
        } else {
            eventsToShow.forEach(event => {
                const eventItem = createEventItem(event);
                eventList.appendChild(eventItem);
            });
        }
    }
    
    // Fonction pour créer un élément d'événement
    function createEventItem(event) {
        const eventItem = document.createElement('div');
        eventItem.classList.add('event-item');
        
        // Ajouter une classe spéciale pour les événements utilisateur
        if (event.isUserEvent) {
            eventItem.classList.add('user-event');
        }
        
        const eventDate = document.createElement('div');
        eventDate.classList.add('event-date');
        
        const eventDay = document.createElement('span');
        eventDay.classList.add('event-day');
        eventDay.textContent = event.date.getDate();
        
        const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
        const eventMonth = document.createElement('span');
        eventMonth.classList.add('event-month');
        eventMonth.textContent = monthNames[event.date.getMonth()];
        
        eventDate.appendChild(eventDay);
        eventDate.appendChild(eventMonth);
        
        const eventInfo = document.createElement('div');
        eventInfo.classList.add('event-info');
        
        const eventTitle = document.createElement('h6');
        eventTitle.textContent = event.title;
        
        const eventTime = document.createElement('p');
        eventTime.innerHTML = `<i class="fas fa-clock"></i> ${event.time}`;
        
        const eventLocation = document.createElement('p');
        eventLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${event.location}`;
        
        eventInfo.appendChild(eventTitle);
        eventInfo.appendChild(eventTime);
        eventInfo.appendChild(eventLocation);
        
        // Ajouter un bouton de suppression pour les événements utilisateur (visible seulement pour l'admin)
        if (event.isUserEvent && isAdmin) {
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-event-btn');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = "Supprimer cet événement";
            
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ?`)) {
                    // Supprimer l'événement
                    const eventIndex = events.findIndex(e => e.id === event.id);
                    if (eventIndex !== -1) {
                        events.splice(eventIndex, 1);
                        saveEvents();
                        updateCalendar();
                        updateUpcomingEvents();
                        alert("Événement supprimé avec succès !");
                    }
                }
            });
            
            eventInfo.appendChild(deleteBtn);
        }
        
        eventItem.appendChild(eventDate);
        eventItem.appendChild(eventInfo);
        
        return eventItem;
    }
} 