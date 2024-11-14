// Classe pour gérer les projets
class Project {
    constructor(id, title, description, image) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.image = image;
    }
}

// Classe pour gérer l'application
class PortfolioApp {
    constructor() {
        this.projects = [];
        this.loadProjects();
        this.bindEvents();
    }

    // Charge les projets depuis une API fictive ou localStorage
    async loadProjects() {
        // Vérifie si des projets sont dans le localStorage
        const savedProjects = JSON.parse(localStorage.getItem('projects'));
        
        if (savedProjects && savedProjects.length > 0) {
            this.projects = savedProjects.map(
                p => new Project(p.id, p.title, p.description, p.image)
            );
            this.displayProjects();
        } else {
            // Sinon, charge depuis une API fictive
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=3');
                const data = await response.json();
                this.projects = data.map(
                    (item, index) => new Project(index, `Projet ${index + 1}`, item.title, item.url)
                );
                this.saveProjects();
                this.displayProjects();
            } catch (error) {
                console.error("Erreur lors de la récupération des projets :", error);
            }
        }
    }

    // Sauvegarde les projets dans le localStorage
    saveProjects() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    // Affiche les projets sur la page
    displayProjects() {
        const container = document.getElementById('project-container');
        container.innerHTML = '';

        this.projects.forEach((project) => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <button data-id="${project.id}" class="view-project">Voir les détails</button>
            `;
            container.appendChild(projectCard);
        });
    }

    // Associe les événements aux boutons
    bindEvents() {
        document.getElementById('project-container').addEventListener('click', (event) => {
            if (event.target.classList.contains('view-project')) {
                const projectId = event.target.getAttribute('data-id');
                this.showProjectDetails(projectId);
            }
        });
    }

    // Affiche les détails d'un projet spécifique
    showProjectDetails(id) {
        const project = this.projects.find(p => p.id == id);
        if (project) {
            const modal = document.getElementById('modal');
            modal.querySelector('.modal-content').innerHTML = `
                <h2>${project.title}</h2>
                <img src="${project.image}" alt="${project.title}">
                <p>${project.description}</p>
                <button class="close-modal">Fermer</button>
            `;
            modal.style.display = 'flex';

            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    }
}

// Initialisation de l'application au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
});
