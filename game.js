const TUTOR_TIPS = {
  'index.html': [
    'Сәлем! Мен Шипабот — сенің AI көмекшіңмін! 🌿',
    'Жасыл дәріхана 3 бөлімнен тұрады: Теория, Тәжірибе, Бағалау!',
    '«Теория» бөлімінен — Дәріспен баста!'
  ],
  'daris.html': [
    'Дәріс — Теория бөлімінің бірінші қадамы!',
    'Соңында «Келесі: Тірек жазба» батырмасын бас!'
  ],
  'tirek.html': [
    'Тірек жазба — негізгі ұғымдарды қысқаша қайтала!',
    'Дайын болған соң ақпараттық сызбаға өт 🗺️'
  ],
  'syzba.html': [
    'Сызба паразиттерге әсер ету механизмін көрсетеді.',
    'Көргеннен кейін Анықтамалыққа өт!'
  ],
  'anyqtama.html': [
    'Анықтамалық — Теория бөлімінің соңы!',
    'Келесі: Тәжірибе бөлімі — ЭМФ 📋'
  ],
  'emf.html': [
    'Мемлекеттік Фармакопея — 1 және 2-томдар!',
    'Мұқабаны басып, толық PDF-ті аш 📋'
  ],
  'praktika.html': [
    'Нұсқаулық карта — 5 тәжірибелік тапсырма!',
    'Макроскопия, микроскопия, сәйкестіру және дайындау 🔬'
  ],
  'zhagday.html': [
    '10 жағдайлық тапсырма — нақты өмірдегі шешімдер!',
    'Әр тапсырмада 3 сұраққа жауап жаз!'
  ],
  'kvest.html': [
    'Фармакогноз-детектив — 5 миссия!',
    'Профессор Айман Ахметоваға көмектес, анықтамалықты толтыр 🔍'
  ],
  'oiyn.html': [
    '6 ойын — антигельминтикалық шикізаттар бойынша!',
    'Жады, викторина, сәйкестіру, тапқыш — таңдап ойна 🎮'
  ],
  'suraqtar.html': [
    'Өзін-өзі тексеру — 10 ашық сұрақ! 🎯',
    'Атыңызды енгізіп, жауаптарды сақта!'
  ],
  'test.html': [
    'Тест — 15 сұрақ, толық білімді тексеру!',
    '60% жоғары болса — сәтті өттің деп есептейміз ⭐'
  ],
  'refleksiya.html': [
    'Рефлексия — оқу процесін бағалау уақыты!',
    '3 сұраққа жауап жазып, «Сақтау» батырмасын бас 📝'
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
    <button class="tutor__toggle" aria-label="AI көмекші Шипабот">🤖</button>
    <div class="tutor__panel">
      <div class="tutor__header">
        <span class="tutor__avatar">🤖</span>
        <div>
          <strong>Шипабот</strong>
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
  if (!map || typeof SITE_SECTIONS === 'undefined') return;

  const colors = { theory: 'green', practice: 'blue', assessment: 'purple' };

  map.innerHTML = SITE_SECTIONS.map(section => `
    <div class="quest-group">
      <h3 class="quest-group__title">${section.icon} ${section.label}</h3>
      <div class="quest-group__items">
        ${section.items.map(item => `
          <a href="${item.href}" class="quest-node quest-node--active quest-node--c-${colors[section.id] || 'green'}">
            <span class="quest-node__icon">${item.icon}</span>
            <span class="quest-node__label">${item.labelLong || item.label}</span>
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function initGame() {
  injectTutor();
  renderRouteMap();
}
