const ROUTE_SECTIONS = [
  { label: 'Дәріс', href: 'daris.html', icon: '📚', color: 'green' },
  { label: 'Тірек жазба', href: 'tirek.html', icon: '📝', color: 'blue' },
  { label: 'Ақпараттық сызба', href: 'syzba.html', icon: '🗺️', color: 'purple' },
  { label: 'Сұрақтар', href: 'suraqtar.html', icon: '❓', color: 'orange' },
  { label: 'Тест', href: 'test.html', icon: '✅', color: 'pink' },
  { label: 'Практика', href: 'praktika.html', icon: '🔬', color: 'green' },
  { label: 'Рефлексия', href: 'refleksiya.html', icon: '💭', color: 'purple' },
  { label: 'Жағдай', href: 'zhagday.html', icon: '💡', color: 'blue' },
  { label: 'Ойындар', href: 'oiyn.html', icon: '🎮', color: 'orange' },
  { label: 'Анықтамалық', href: 'anyqtama.html', icon: '📖', color: 'pink' }
];

const TUTOR_TIPS = {
  'index.html': [
    'Сәлем! Мен Шипобот — сенің AI көмекшіңмін! 🌿',
    'Жасыл дәріханаға қош келдіңіз! 12 бөлімнен оқу сапарын бастайық!',
    'Төмендегі карталардан «Дәріс» бөлімінен баста!'
  ],
  'daris.html': [
    'Дәріс — сапардың бірінші қадамы! 7 қадамды оқып шық.',
    'Соңында «Келесі: Тірек жазба» батырмасын бас!'
  ],
  'tirek.html': [
    'Тірек жазба — негізгі ұғымдарды қысқаша қайтала!',
    'Дайын болған соң ақпараттық сызбаға өт 🗺️'
  ],
  'syzba.html': [
    'Сызба паразиттерге әсер ету механизмін көрсетеді.',
    'Көргеннен кейін 10 сұраққа жауап бер!'
  ],
  'suraqtar.html': [
    '10 сұрақ — білімді бекіту уақыты! 🎯',
    'Атыңызды енгізіп, жауаптарды сақта!'
  ],
  'test.html': [
    'Тест — 15 сұрақ, толық білімді тексеру!',
    '60% жоғары болса — сәтті өттің деп есептейміз ⭐'
  ],
  'praktika.html': [
    '5 практикалық тапсырма — теорияны іске асыр!',
    'Дайын болған соң «Рефлексия» бөліміне өт 💭'
  ],
  'refleksiya.html': [
    'Рефлексия — оқу процесін бағалау уақыты!',
    '3 сұраққа жауап жазып, «Сақтау» батырмасын бас 📝'
  ],
  'zhagday.html': [
    '10 жағдайлық тапсырма — нақты өмірдегі шешімдер!',
    'Әр тапсырмада 3 сұраққа жауап жаз!'
  ],
  'kvest.html': [
    'Оқу маршруты — барлық бөлімдерді көріп, ретімен өт!',
    'Кез келген бөлімнен бастауға болады 🗺️'
  ],
  'oiyn.html': [
    '6 ойын — білімді ойынмен бекіт!',
    'Жады, викторина, сәйкестіру — таңдап ойна 🎮'
  ],
  'anyqtama.html': [
    'Анықтамалық — соңғы қадам!',
    'Негізгі ұғымдарды оқып, Жасыл дәріханаға орал 💊'
  ]
};

function getPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function injectTutor() {
  if (document.getElementById('tutor')) return;

  const tutor = document.createElement('div');
  tutor.className = 'tutor open';
  tutor.id = 'tutor';
  tutor.innerHTML = `
    <button class="tutor__toggle" aria-label="AI көмекші Шипобот">🤖</button>
    <div class="tutor__panel">
      <div class="tutor__header">
        <span class="tutor__avatar">🤖</span>
        <div>
          <strong>Шипобот</strong>
          <span>AI оқу көмекшісі</span>
        </div>
      </div>
      <div class="tutor__messages" id="tutorMessages"></div>
    </div>
  `;
  document.body.appendChild(tutor);

  tutor.querySelector('.tutor__toggle').addEventListener('click', () => {
    tutor.classList.toggle('open');
  });

  showTutorTips();
}

function showTutorTips() {
  const box = document.getElementById('tutorMessages');
  if (!box) return;

  const page = getPage();
  const tips = TUTOR_TIPS[page] || ['Оқу сапарын жалғастыр! 💊'];
  box.innerHTML = tips.map((t, i) =>
    `<p class="tutor__msg" style="animation-delay:${i * 0.15}s">${t}</p>`
  ).join('');
}

function renderRouteMap() {
  const map = document.getElementById('questMap');
  if (!map) return;

  map.innerHTML = ROUTE_SECTIONS.map(s => `
    <a href="${s.href}" class="quest-node quest-node--active quest-node--c-${s.color}">
      <span class="quest-node__icon">${s.icon}</span>
      <span class="quest-node__label">${s.label}</span>
    </a>
  `).join('');
}

function initGame() {
  injectTutor();
  renderRouteMap();
}
