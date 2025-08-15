document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------
  // Load Projects
  // ---------------------------
  fetch('projects.json')
    .then(res => res.json())
    .then(projects => {
      const container = document.getElementById('projectsContainer');
      if (!container) return;

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
      if (container) container.innerHTML = '<p class="text-red-600">Failed to load projects.json</p>';
      console.error(err);
    });

  // ---------------------------
  // Dark Mode Toggle
  // ---------------------------
  const darkToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    body.classList.add('dark');
  }

  darkToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.theme = body.classList.contains('dark') ? 'dark' : 'light';
  });

  // ---------------------------
  // Skill Bubbles Animation
  // ---------------------------
  const bubblesData = {
    languages: ["Go", "Java", "Python", "JavaScript", "C++"],
    tools: ["Git", "Docker", "Kubernetes", "Postman", "Jira"],
    frameworks: ["Spring Boot", "DropWizard", "Micronaut", "React", "Express", "gRPC"]
  };

  const colors = ["#FF6B6B","#4ECDC4","#FFD93D","#1A535C","#FF9F1C","#6A4C93","#00BFA6","#EF476F","#06D6A0","#118AB2"];

  function createBubbles(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Calculate diameter based on the longest text
    let maxLength = Math.max(...items.map(t => t.length));
    const diameter = Math.max(60, maxLength * 12); // ensure minimum size

    const bubbles = [];

    // Initial positions (grid-like to avoid overlap)
    const cols = Math.ceil(Math.sqrt(items.length));
    const rows = Math.ceil(items.length / cols);
    const spacingX = (container.offsetWidth - diameter) / (cols - 1 || 1);
    const spacingY = (container.offsetHeight - diameter) / (rows - 1 || 1);

    items.forEach((text, index) => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = text;
      bubble.style.width = `${diameter}px`;
      bubble.style.height = `${diameter}px`;
      bubble.style.fontSize = `${Math.min(16, diameter / 4)}px`;
      bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      const col = index % cols;
      const row = Math.floor(index / cols);

      // Base position
      bubble.dataset.baseX = col * spacingX;
      bubble.dataset.baseY = row * spacingY;

      // Small random offset for natural look
      bubble.dataset.offsetX = (Math.random() - 0.5) * 20;
      bubble.dataset.offsetY = (Math.random() - 0.5) * 20;

      bubble.style.left = `${bubble.dataset.baseX}px`;
      bubble.style.top = `${bubble.dataset.baseY}px`;

      container.appendChild(bubble);
      bubbles.push(bubble);
    });

    // Smooth float animation using sinusoidal motion
    let angle = 0;
    function animate() {
      angle += 0.02;
      bubbles.forEach((b, i) => {
        const floatX = Math.sin(angle + i) * b.dataset.offsetX;
        const floatY = Math.cos(angle + i) * b.dataset.offsetY;
        b.style.left = `${parseFloat(b.dataset.baseX) + floatX}px`;
        b.style.top = `${parseFloat(b.dataset.baseY) + floatY}px`;
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  createBubbles("languagesBubbles", bubblesData.languages);
  createBubbles("toolsBubbles", bubblesData.tools);
  createBubbles("frameworksBubbles", bubblesData.frameworks);

});