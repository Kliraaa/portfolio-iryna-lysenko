async function loadProjects() {
    const response = await fetch('./data/projets.json');

    if (!response.ok) {
        throw new Error(`Impossible de charger les projets (${response.status}).`);
    }

    return response.json();
}
