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
    frameworks: ["Spring Boot", "Gin", "React", "Express", "gRPC"]
  };

  const colors = [
    "#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#FF9F1C",
    "#6A4C93", "#00BFA6", "#EF476F", "#06D6A0", "#118AB2"
  ];

  function createBubbles(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const bubbles = [];

    function isOverlapping(x, y, width, height) {
      for (const b of bubbles) {
        const dx = x - b.left;
        const dy = y - b.top;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < (width + b.width)/2) return true;
      }
      return false;
    }

    items.forEach(text => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = text;
      bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      // Temporarily append to measure width/height
      container.appendChild(bubble);
      const width = bubble.offsetWidth + 10;  // extra padding
      const height = bubble.offsetHeight + 10;

      let left, top, attempts = 0;
      do {
        left = Math.random() * (container.offsetWidth - width);
        top = Math.random() * (container.offsetHeight - height);
        attempts++;
      } while (isOverlapping(left, top, width, height) && attempts < 100);

      bubble.style.left = `${left}px`;
      bubble.style.top = `${top}px`;

      bubbles.push({left, top, width, height, element: bubble});

      // Gentle floating within small range
      setInterval(() => {
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        let newLeft = Math.min(Math.max(0, parseFloat(bubble.style.left) + offsetX), container.offsetWidth - width);
        let newTop = Math.min(Math.max(0, parseFloat(bubble.style.top) + offsetY), container.offsetHeight - height);

        let safe = true;
        for (const b of bubbles) {
          if (b.element === bubble) continue;
          const dx = newLeft - b.left;
          const dy = newTop - b.top;
          const distance = Math.sqrt(dx*dx + dy*dy);
          if (distance < (width + b.width)/2) {
            safe = false;
            break;
          }
        }
        if (safe) {
          bubble.style.left = `${newLeft}px`;
          bubble.style.top = `${newTop}px`;
        }
      }, 3000 + Math.random() * 2000);
    });
  }

  createBubbles("languagesBubbles", bubblesData.languages);
  createBubbles("toolsBubbles", bubblesData.tools);
  createBubbles("frameworksBubbles", bubblesData.frameworks);

});