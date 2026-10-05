function createProjectCard(project) {
    return `
    <a class="project-card" href="./project.html?id=${encodeURIComponent(project.id)}">
        <img class="project-card__image" src="${project.image}" alt="${project.title}">
        <span class="project-card__content">
            <span class="project-card__meta">${project.category} · ${project.year}</span>
            <span class="project-card__title">${project.title}</span>
            <span class="project-card__description">${project.description}</span>
        </span>
    </a>
    `;
}
