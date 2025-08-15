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

function createBubble(text, container) {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  bubble.style.left = Math.random() * 90 + "%";
  bubble.style.top = -50 + "px"; // start above container
  bubble.style.animationDuration = (6 + Math.random() * 6) + "s";
  bubble.style.fontSize = 14 + Math.random() * 6 + "px";
  container.appendChild(bubble);

  // Remove bubble after animation ends
  setTimeout(() => bubble.remove(), parseFloat(bubble.style.animationDuration) * 1000);
}

function spawnBubbles(containerId, items) {
  const container = document.getElementById(containerId);
  // Initial spawn
  items.forEach(item => createBubble(item, container));

  // Continuously spawn
  setInterval(() => {
    const item = items[Math.floor(Math.random() * items.length)];
    createBubble(item, container);
  }, 1000);
}

// Start bubbles in hero and skills section
spawnBubbles("bubblesContainer", [...bubblesData.languages, ...bubblesData.tools, ...bubblesData.frameworks]);
spawnBubbles("skillsBubbles", [...bubblesData.languages, ...bubblesData.tools, ...bubblesData.frameworks]);