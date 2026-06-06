const QUESTS = [
  { id: 'daris', label: 'Дәріс', href: 'daris.html', xp: 50, icon: '📚', color: 'green' },
  { id: 'tirek', label: 'Тірек жазба', href: 'tirek.html', xp: 40, icon: '📝', color: 'blue' },
  { id: 'syzba', label: 'Сызба', href: 'syzba.html', xp: 40, icon: '🗺️', color: 'purple' },
  { id: 'suraqtar', label: 'Сұрақтар', href: 'suraqtar.html', xp: 60, icon: '❓', color: 'orange' },
  { id: 'test', label: 'Тест', href: 'test.html', xp: 80, icon: '✅', color: 'pink' },
  { id: 'praktika', label: 'Практика', href: 'praktika.html', xp: 70, icon: '🔬', color: 'green' },
  { id: 'zhagday', label: 'Жағдай', href: 'zhagday.html', xp: 50, icon: '💡', color: 'blue' },
  { id: 'kvest', label: 'Квест', href: 'kvest.html', xp: 30, icon: '🗺️', color: 'purple' },
  { id: 'oiyn', label: 'Ойындар', href: 'oiyn.html', xp: 60, icon: '🎮', color: 'orange' },
  { id: 'anyqtama', label: 'Анықтамалық', href: 'anyqtama.html', xp: 40, icon: '📖', color: 'pink' }
];

const LEVELS = [
  { min: 0, title: 'Жаңадан бастаушы' },
  { min: 100, title: 'Оқушы' },
  { min: 250, title: 'Зерттеуші' },
  { min: 400, title: 'Ботаник' },
  { min: 600, title: 'Маман' }
];

const TUTOR_TIPS = {
  'index.html': [
    'Сәлем! Мен Ұлбосын — сенің AI көмекшіңмін! 🌿',
    '11 бөлімнен тұратын оқу сапарын бастайық!',
    'Төмендегі карталардан «Дәріс» бөлімінен баста!'
  ],
  'daris.html': [
    'Дәріс — сапардың бірінші қадамы! 7 қадамды оқып шық.',
    'Соңында «Келесі: Тірек жазба» батырмасын бас — XP аласың!'
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
    '«Тексеру» батырмасын ұмытпа — дұрыс жауап = XP!'
  ],
  'test.html': [
    'Тест — 15 сұрақ, толық білімді тексеру!',
    '60% жоғары болса — сәтті өттің деп есептейміз ⭐'
  ],
  'praktika.html': [
    '6 практикалық тапсырма — теорияны іске асыр!',
    'Соңғы тапсырма — рефлексия: өз ойыңды жазы 💭'
  ],
  'zhagday.html': [
    'Жағдайлық тапсырмалар — нақты өмірдегі шешімдер!',
    'Әр жағдайға өз шешіміңді жазып, квестке өт!'
  ],
  'kvest.html': [
    'Квест картасы — барлық бөлімдерді көріп, XP жина!',
    'Ашық бөлімдерді ретімен аяқта 🗺️'
  ],
  'oiyn.html': [
    '6 ойын — білімді ойынмен бекіт!',
    'Жады, викторина, сәйкестіру — таңдап ойна 🎮'
  ],
  'anyqtama.html': [
    'Анықтамалық — соңғы қадам!',
    'Негізгі ұғымдарды оқып, басты бетке орал 🌱'
  ]
};

const STORAGE_KEY = 'ulbosyn_game_progress';

function getPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { xp: 0, completed: [] };
  } catch {
    return { xp: 0, completed: [] };
  }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getLevel(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.min) level = l;
  }
  return level;
}

function getNextLevel(xp) {
  for (const l of LEVELS) {
    if (xp < l.min) return l;
  }
  return { min: 600, title: 'Макс' };
}

function isQuestUnlocked(questId) {
  const idx = QUESTS.findIndex(q => q.id === questId);
  if (idx === 0) return true;
  const prev = QUESTS[idx - 1];
  return loadProgress().completed.includes(prev.id);
}

function isQuestCompleted(questId) {
  return loadProgress().completed.includes(questId);
}

function completeQuest(questId, bonusXp = 0) {
  const progress = loadProgress();
  if (progress.completed.includes(questId)) return 0;

  const quest = QUESTS.find(q => q.id === questId);
  const earned = (quest?.xp || 0) + bonusXp;
  progress.completed.push(questId);
  progress.xp += earned;
  saveProgress(progress);
  updateHUD();
  renderQuestMap();
  showXPPopup(earned);
  return earned;
}

function updateHUD() {
  const progress = loadProgress();
  const level = getLevel(progress.xp);
  const next = getNextLevel(progress.xp);
  const prevMin = level.min;
  const range = next.min - prevMin || 1;
  const pct = Math.min(100, ((progress.xp - prevMin) / range) * 100);

  const lvlEl = document.querySelector('.game-hud__level');
  const xpEl = document.querySelector('.game-hud__xp-fill');
  const xpText = document.querySelector('.game-hud__xp-text');
  const titleEl = document.querySelector('.game-hud__title');

  if (lvlEl) lvlEl.textContent = level.title;
  if (titleEl) titleEl.textContent = `${progress.xp} XP`;
  if (xpEl) xpEl.style.width = `${pct}%`;
  if (xpText) xpText.textContent = `${progress.xp} / ${next.min} XP`;
}

function injectHUD() {
  const header = document.querySelector('.header__inner');
  if (!header || document.querySelector('.game-hud')) return;

  const hud = document.createElement('div');
  hud.className = 'game-hud';
  hud.innerHTML = `
    <div class="game-hud__info">
      <span class="game-hud__level">Жаңадан бастаушы</span>
      <span class="game-hud__title">0 XP</span>
    </div>
    <div class="game-hud__xp"><div class="game-hud__xp-fill"></div></div>
    <span class="game-hud__xp-text">0 / 100 XP</span>
  `;
  header.insertBefore(hud, header.querySelector('.burger') || null);
  updateHUD();
}

function injectTutor() {
  if (document.getElementById('tutor')) return;

  const tutor = document.createElement('div');
  tutor.className = 'tutor';
  tutor.id = 'tutor';
  tutor.innerHTML = `
    <button class="tutor__toggle" aria-label="AI көмекші">🌿</button>
    <div class="tutor__panel">
      <div class="tutor__header">
        <span class="tutor__avatar">🤖</span>
        <div>
          <strong>Ұлбосын</strong>
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
  const tips = TUTOR_TIPS[page] || ['Оқу сапарын жалғастыр! 🌱'];
  box.innerHTML = tips.map((t, i) =>
    `<p class="tutor__msg" style="animation-delay:${i * 0.15}s">${t}</p>`
  ).join('');
}

function showXPPopup(amount) {
  const popup = document.createElement('div');
  popup.className = 'xp-popup';
  popup.textContent = `+${amount} XP 🎉`;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2200);
}

function renderQuestMap() {
  const map = document.getElementById('questMap');
  if (!map) return;

  map.innerHTML = QUESTS.map((q, i) => {
    const done = isQuestCompleted(q.id);
    const unlocked = isQuestUnlocked(q.id);
    const status = done ? 'done' : unlocked ? 'active' : 'locked';

    return `
      <a href="${unlocked ? q.href : '#'}"
         class="quest-node quest-node--${status} quest-node--c-${q.color}"
         ${!unlocked ? 'onclick="return false"' : ''}>
        <span class="quest-node__icon">${done ? '✓' : unlocked ? q.icon : '🔒'}</span>
        <span class="quest-node__label">${q.label}</span>
        <span class="quest-node__xp">+${q.xp} XP</span>
        ${i < QUESTS.length - 1 ? '<span class="quest-node__line"></span>' : ''}
      </a>
    `;
  }).join('');
}

function bindQuestCompletion() {
  const page = getPage();
  const questByPage = {
    'daris.html': 'daris',
    'tirek.html': 'tirek',
    'syzba.html': 'syzba',
    'zhagday.html': 'zhagday',
    'kvest.html': 'kvest',
    'oiyn.html': 'oiyn',
    'anyqtama.html': 'anyqtama'
  };

  document.querySelectorAll('.page-next a').forEach(link => {
    link.addEventListener('click', () => {
      const q = questByPage[page];
      if (q) completeQuest(q);
    });
  });
}

function initGame() {
  injectHUD();
  injectTutor();
  renderQuestMap();
  bindQuestCompletion();
}

window.completeQuest = completeQuest;
window.getTestBonusXp = (percent) => Math.round(percent * 0.5);
window.loadProgress = loadProgress;
