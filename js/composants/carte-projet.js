async function loadProjects() {
  const response = await fetch('data/projets.json');
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
   
        <img class="project-card__image" src="${project.image}" alt="${project.title}">
        <div class="project-card__content">
            <h3 class="project-card__title">${project.title}</h3>
            <p class="project-card__meta">${project.category} · ${project.year}</p>
            <p class="project-card__description">${project.description}</p>
        </div>
    </article>
    `;
}

