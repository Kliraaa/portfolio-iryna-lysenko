async function init() {
    const grid = document.querySelector('.projects__grid');

    if (!grid) {
        return;
    }

    try {
        const projects = await loadProjects();
        grid.innerHTML = projects.map(createProjectCard).join('');
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p class="projects__error">Les projets ne peuvent pas être chargés pour le moment.</p>';
    }
}

init();
