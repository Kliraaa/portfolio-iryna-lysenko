function getSoftware(project) {
    return project.software || project['software '];
}

function createGallery(project) {
    if (!Array.isArray(project.gallery) || !project.gallery.length) {
        return '';
    }

    return `
        <section class="project-details__section">
            <h2>Galerie</h2>
            <div class="project-details__gallery">
                ${project.gallery.map((image, index) => `
                    <button class="project-details__gallery-item" type="button" data-gallery-index="${index}" aria-label="Agrandir l'image ${index + 1}">
                        <img src="${image}" alt="${project.title} - image ${index + 1}">
                    </button>
                `).join('')}
            </div>
        </section>
    `;
}

function addGalleryLightbox(project) {
    if (!Array.isArray(project.gallery) || !project.gallery.length) {
        return;
    }

    const style = document.createElement('style');
    style.textContent = `
        .project-details__gallery-item { border: 0; padding: 0; background: none; cursor: zoom-in; }
        .project-details__lightbox { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 4rem; background: rgba(0, 0, 0, .82); backdrop-filter: blur(12px); }
        .project-details__lightbox[hidden] { display: none; }
        .project-details__lightbox-image { max-width: min(90vw, 1200px); max-height: 85vh; object-fit: contain; }
        .project-details__lightbox-close, .project-details__lightbox-prev, .project-details__lightbox-next { position: absolute; border: 0; color: #fff; background: rgba(0, 0, 0, .45); cursor: pointer; font-size: 2rem; line-height: 1; padding: .6rem .9rem; }
        .project-details__lightbox-close { top: 1rem; left: 1rem; }
        .project-details__lightbox-prev { left: 1rem; top: 50%; transform: translateY(-50%); }
        .project-details__lightbox-next { right: 1rem; top: 50%; transform: translateY(-50%); }
        .project-details__lightbox-close:hover, .project-details__lightbox-prev:hover, .project-details__lightbox-next:hover { background: rgba(0, 0, 0, .75); }
    `;
    document.head.appendChild(style);

    const lightbox = document.createElement('div');
    lightbox.className = 'project-details__lightbox';
    lightbox.hidden = true;
    lightbox.innerHTML = `
        <button class="project-details__lightbox-close" type="button" aria-label="Fermer">×</button>
        <button class="project-details__lightbox-prev" type="button" aria-label="Image précédente">‹</button>
        <img class="project-details__lightbox-image" alt="">
        <button class="project-details__lightbox-next" type="button" aria-label="Image suivante">›</button>
    `;
    document.body.appendChild(lightbox);

    const imageElement = lightbox.querySelector('.project-details__lightbox-image');
    let currentIndex = 0;

    const showImage = (index) => {
        currentIndex = (index + project.gallery.length) % project.gallery.length;
        imageElement.src = project.gallery[currentIndex];
        imageElement.alt = `${project.title} - image ${currentIndex + 1}`;
    };
    const close = () => {
        lightbox.hidden = true;
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.project-details__gallery-item').forEach((button) => {
        button.addEventListener('click', () => {
            showImage(Number(button.dataset.galleryIndex));
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        });
    });
    lightbox.querySelector('.project-details__lightbox-close').addEventListener('click', close);
    lightbox.querySelector('.project-details__lightbox-prev').addEventListener('click', () => showImage(currentIndex - 1));
    lightbox.querySelector('.project-details__lightbox-next').addEventListener('click', () => showImage(currentIndex + 1));
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) close();
    });
    document.addEventListener('keydown', (event) => {
        if (lightbox.hidden) return;
        if (event.key === 'Escape') close();
        if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    });
}

function createProjectDetails(project) {
    const gallery = createGallery(project);
    const video = project.embedvimeo
        ? `
            <div class="project-details__video">
                <iframe src="${project.embedvimeo}" title="${project.title}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
            </div>
        `
        : '';
    const image = project.embedvimeo
        ? ''
        : `<img class="project-details__image" src="${project.image}" alt="${project.title}">`;
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
            ${image}
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
        addGalleryLightbox(project);
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="projects__error">Les détails du projet ne peuvent pas être chargés pour le moment.</p>';
    }
}

showProject();
