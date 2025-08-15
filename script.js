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

  function createPhysicsBubbles(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const bubbles = [];
    const diameter = 80; // fixed size

    items.forEach(text => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = text;
      bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      // Random initial position
      const left = Math.random() * (container.offsetWidth - diameter);
      const top = Math.random() * (container.offsetHeight - diameter);
      bubble.style.left = `${left}px`;
      bubble.style.top = `${top}px`;

      container.appendChild(bubble);

      bubbles.push({element: bubble, x: left, y: top, vx: 0, vy: 0});
    });

    // Simple physics loop
    function update() {
      const gravity = 0.2;
      const friction = 0.9;
      const repelDistance = 90;

      bubbles.forEach((b, i) => {
        // Gravity
        b.vy += gravity;

        // Repel other bubbles
        bubbles.forEach((other, j) => {
          if (i === j) return;
          const dx = b.x - other.x;
          const dy = b.y - other.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < repelDistance && dist > 0) {
            const force = (repelDistance - dist) / 2;
            b.vx += (dx / dist) * force * 0.05;
            b.vy += (dy / dist) * force * 0.05;
          }
        });

        // Update position
        b.x += b.vx;
        b.y += b.vy;

        // Bounce off walls
        if (b.x < 0) { b.x = 0; b.vx *= -0.5; }
        if (b.x > container.offsetWidth - diameter) { b.x = container.offsetWidth - diameter; b.vx *= -0.5; }
        if (b.y < 0) { b.y = 0; b.vy *= -0.5; }
        if (b.y > container.offsetHeight - diameter) { b.y = container.offsetHeight - diameter; b.vy *= -0.5; }

        // Apply friction
        b.vx *= friction;
        b.vy *= friction;

        // Apply position
        b.element.style.left = `${b.x}px`;
        b.element.style.top = `${b.y}px`;
      });

      requestAnimationFrame(update);
    }

    update();
  }

  createPhysicsBubbles("languagesBubbles", bubblesData.languages);
  createPhysicsBubbles("toolsBubbles", bubblesData.tools);
  createPhysicsBubbles("frameworksBubbles", bubblesData.frameworks);

});