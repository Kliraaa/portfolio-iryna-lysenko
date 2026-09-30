// ========================================
// Exercice : du JSON à la carte
// Suivez les étapes de la page d'exercice, une à la fois.
// Vérifiez chaque étape dans le navigateur avant de passer à la suivante.
// ========================================


// ÉTAPE 1 : charger les données avec fetch()
// Écrire une fonction async loadProjects() qui retourne le tableau de data/projects.json
async function loadProjects() {
  const response = await fetch('data/projects.json');
  const projects = await response.json();            
  return projects;                                   
}

async function init() { 
  const projects = await loadProjects();
  console.table(projects);
  // ÉTAPE 2 : parcourir le tableau avec forEach()
  // Afficher le titre de chaque projet dans la console
  projects.forEach(project => {
  console.log(project.title)})
  
  const grid = document.querySelector('.projects__grid');
  projects.forEach(project => {
  grid.innerHTML += createProjectCard(project);
  });
}
init();

// ÉTAPE 3 : un gabarit littéral pour UNE carte
// Écrire createProjectCard(project) et afficher la carte du premier projet
function createProjectCard(project) {
    return `
    <article class="project-card">
    <div style="padding:56.25% 0 0 0;position:relative;">
      <iframe src="${project.embedvimeo}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Ascension - 3D animated short film"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
        <img class="project-card__image" src="${project.image}" alt="${project.title}">
        <div class="project-card__content">
            <h3 class="project-card__title">${project.title}</h3>
            <p class="project-card__meta">${project.category} · ${project.year}</p>
            <p class="project-card__description">${project.description}</p>
        </div>
    </article>
    `;
}



// ÉTAPE 4 : toutes les cartes
// Afficher une carte pour chaque projet dans .projects__grid




// BONUS : afficher le lien « Voir en ligne » seulement si le projet en a un
