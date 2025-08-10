// Load projects from JSON
fetch('projects.json')
  .then(res => res.json())
  .then(projects => {
    const container = document.getElementById('projectsContainer');
    if (!projects || projects.length === 0) {
      container.innerHTML = '<p class="dark:text-gray-300 text-gray-600">No projects yet — add some in <code>projects.json</code>.</p>';
      return;
    }
    projects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition';
      card.innerHTML = `
        <h3 class="text-xl font-semibold mb-2 dark:text-white">${p.name}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">${p.description}</p>
        ${p.url ? `<a href="${p.url}" class="text-blue-600 hover:underline" target="_blank" rel="noopener">View on GitHub →</a>` : ''}
      `;
      container.appendChild(card);
    });
  })
  .catch(err => {
    const container = document.getElementById('projectsContainer');
    container.innerHTML = '<p class="text-red-600">Failed to load projects.json</p>';
    console.error(err);
  });

// Dark mode toggle
const darkToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Load saved mode
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  body.classList.add('dark');
}

darkToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.theme = body.classList.contains('dark') ? 'dark' : 'light';
});
