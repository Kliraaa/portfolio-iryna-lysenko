function getSoftware(project) {
    return project.software || project['software '];
}

function createProjectDetails(project) {
    const gallery = Array.isArray(project.gallery) && project.gallery.length
        ? `
            <section class="project-details__section">
                <h2>Galerie</h2>
                <div class="project-details__gallery">
                    ${project.gallery.map((image, index) => `
                        <img src="${image}" alt="${project.title} - image ${index + 1}">
                    `).join('')}
                </div>
            </section>
        `
        : '';
    const video = project.embedvimeo
        ? `
            <div class="project-details__video">
                <iframe src="${project.embedvimeo}" title="${project.title}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
            </div>
        `
        : '';
    const externalLink = project.link
        ? `<a class="project-details__link" href="${project.link}" target="_blank" rel="noopener noreferrer">Voir le projet</a>`
        : '';
    const members = Array.isArray(project.members) && project.members.length
        ? project.members.join(', ')
        : 'Projet individuel';

    return `
        <article class="project-details">
            <a class="project-details__back" href="./index.html#creations">← Retour aux créations</a>
            <header class="project-details__header">
                <p class="project-details__meta">${project.category} · ${project.year}</p>
                <h1>${project.title}</h1>
                <p class="project-details__intro">${project.description}</p>
            </header>
            <img class="project-details__image" src="${project.image}" alt="${project.title}">
            ${video}
            ${externalLink}
            <dl class="project-details__facts">
                <div><dt>Rôle</dt><dd>${project.role}</dd></div>
                <div><dt>Logiciel</dt><dd>${getSoftware(project) || 'Non précisé'}</dd></div>
                <div><dt>Membres</dt><dd>${members}</dd></div>
            </dl>
            <section class="project-details__section">
                <h2>Mandat</h2>
                <p>${project.description_task}</p>
            </section>
            <section class="project-details__section">
                <h2>Description technique</h2>
                <p>${project.description_technique}</p>
            </section>
            ${gallery}
        </article>
    `;
}

async function showProject() {
    const container = document.querySelector('.project-page__content');
    const projectId = new URLSearchParams(window.location.search).get('id');

    if (!container || !projectId) {
        if (container) {
            container.innerHTML = '<p class="projects__error">Projet introuvable. <a href="./index.html#creations">Retour aux créations</a></p>';
        }
        return;
    }

    try {
        const projects = await loadProjects();
        const project = projects.find((item) => item.id === projectId);

        if (!project) {
            container.innerHTML = '<p class="projects__error">Projet introuvable. <a href="./index.html#creations">Retour aux créations</a></p>';
            return;
        }

        document.title = `${project.title} - Portfolio Iryna Lysenko`;
        container.innerHTML = createProjectDetails(project);
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="projects__error">Les détails du projet ne peuvent pas être chargés pour le moment.</p>';
    }
}

showProject();
