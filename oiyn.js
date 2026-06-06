const GAME_PAIRS = ['🌿 Айыр', '🌸 Мүйіз', '🍃 Тимьян', '🌾 Қыран', '🫐 Қарақат', '🌿 Айыр'];
const MATCH_DATA = [
  { plant: 'Айыр', disease: 'Құрттар' },
  { plant: 'Қара мүйіз', disease: 'Аскаридоз' },
  { plant: 'Қыран құйрық', disease: 'Тенія' },
  { plant: 'Тимьян', disease: 'Антисептика' }
];
const ORDER_STEPS = ['Шикізатты алу', 'Су құю', '15–20 мин қайнату', 'Сүзу', 'Ішу'];
const TRUE_FALSE = [
  { t: 'Айыр — антигельминттік өсімдік', ok: true },
  { t: 'Қыран құйрықты өз бетінше дайындауға болады', ok: false },
  { t: 'Қара мүйіз аскаридозға қарсы', ok: true },
  { t: 'Дәрілік өсімдіктер әрдайым қауіпсіз', ok: false },
  { t: 'Сесқиттерпен — айырдағы зат', ok: true }
];

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => startGame(card.dataset.game));
  });
});

function startGame(type) {
  const area = document.getElementById('gameArea');
  if (!area) return;
  if (type === 'memory') initMemory(area);
  else if (type === 'quiz') initQuiz(area);
  else if (type === 'truefalse') initTrueFalse(area);
  else if (type === 'match') initMatch(area);
  else if (type === 'order') initOrder(area);
  else if (type === 'find') initFind(area);
}

function initMemory(area) {
  const shuffled = [...GAME_PAIRS].sort(() => Math.random() - 0.5);
  let flipped = [], matched = 0;
  area.innerHTML = `<h3>🃏 Жады ойыны</h3><div class="memory-grid">${shuffled.map((p, i) =>
    `<button class="memory-card" data-i="${i}" data-v="${p}">?</button>`).join('')}</div><p id="memScore">Табылды: 0/6</p>`;
  area.querySelectorAll('.memory-card').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('matched') || flipped.length >= 2) return;
      btn.textContent = btn.dataset.v;
      btn.classList.add('flipped');
      flipped.push(btn);
      if (flipped.length === 2) {
        const [a, b] = flipped;
        if (a.dataset.v === b.dataset.v) {
          a.classList.add('matched'); b.classList.add('matched');
          matched++;
          document.getElementById('memScore').textContent = `Табылды: ${matched}/6`;
          if (matched === 6) area.insertAdjacentHTML('beforeend', '<p class="game-win">🎉 Жеңдіңіз!</p>');
        }
        setTimeout(() => {
          if (!a.classList.contains('matched')) { a.textContent = '?'; a.classList.remove('flipped'); }
          if (!b.classList.contains('matched')) { b.textContent = '?'; b.classList.remove('flipped'); }
          flipped = [];
        }, 700);
      }
    });
  });
}

function initQuiz(area) {
  const qs = (typeof TEST15 !== 'undefined' ? TEST15 : []).slice(0, 5);
  let i = 0, score = 0;
  function show() {
    if (i >= qs.length) {
      area.innerHTML = `<h3>⚡ Нәтиже: ${score}/5</h3>`;
      return;
    }
    const q = qs[i];
    area.innerHTML = `<h3>⚡ Сұрақ ${i + 1}/5</h3><p>${q.q}</p><div class="test-options">${q.opts.map((o, j) =>
      `<button class="test-option" data-c="${j === q.c}">${o}</button>`).join('')}</div>`;
    area.querySelectorAll('.test-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.c === 'true') score++;
        i++; show();
      });
    });
  }
  show();
}

function initTrueFalse(area) {
  let i = 0, score = 0;
  function show() {
    if (i >= TRUE_FALSE.length) {
      area.innerHTML = `<h3>✅ Нәтиже: ${score}/${TRUE_FALSE.length}</h3>`;
      return;
    }
    const item = TRUE_FALSE[i];
    area.innerHTML = `<h3>✅ ${i + 1}/${TRUE_FALSE.length}</h3><p>${item.t}</p>
      <div class="tf-btns"><button class="btn btn--primary" data-ok="true">Дұрыс</button>
      <button class="btn btn--outline" data-ok="false">Бұрыс</button></div>`;
    area.querySelectorAll('[data-ok]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.ok === String(item.ok)) score++;
        i++; show();
      });
    });
  }
  show();
}

function initMatch(area) {
  area.innerHTML = `<h3>🔗 Сәйкестіру</h3>${MATCH_DATA.map((m, i) => `
    <div class="match-row"><span>${m.plant}</span> → <input class="match-input" data-a="${m.disease}" placeholder="Ауру..."></div>`).join('')}
    <button class="btn btn--primary" id="checkMatch">Тексеру</button><p id="matchRes"></p>`;
  document.getElementById('checkMatch').addEventListener('click', () => {
    let ok = 0;
    area.querySelectorAll('.match-input').forEach(inp => {
      if (inp.value.trim().toLowerCase() === inp.dataset.a.toLowerCase()) ok++;
    });
    document.getElementById('matchRes').textContent = `Дұрыс: ${ok}/${MATCH_DATA.length}`;
  });
}

function initOrder(area) {
  const shuffled = [...ORDER_STEPS].sort(() => Math.random() - 0.5);
  area.innerHTML = `<h3>📋 Реттеу: айыр шайын дайындау</h3><p>1-ден 5-ке дейін нөмірлеңіз</p>
    ${shuffled.map(s => `<div class="order-row"><input type="number" min="1" max="5" class="order-num" data-s="${s}"> ${s}</div>`).join('')}
    <button class="btn btn--primary" id="checkOrder">Тексеру</button><p id="orderRes"></p>`;
  document.getElementById('checkOrder').addEventListener('click', () => {
    let ok = true;
    area.querySelectorAll('.order-row').forEach((row, i) => {
      const num = parseInt(row.querySelector('.order-num').value, 10);
      if (num !== ORDER_STEPS.indexOf(row.querySelector('.order-num').dataset.s) + 1) ok = false;
    });
    document.getElementById('orderRes').textContent = ok ? '🎉 Дұрыс рет!' : 'Қайта көріңіз';
  });
}

function initFind(area) {
  area.innerHTML = `<h3>🔍 Тапқыш</h3><p>Аскаридозға қарсы өсімдікті тап:</p>
    <div class="test-options">
      <button class="test-option">Айыр</button><button class="test-option" data-ok="true">Қара мүйіз</button>
      <button class="test-option">Тимьян</button><button class="test-option">Қына</button>
    </div><p id="findRes"></p>`;
  area.querySelectorAll('.test-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('findRes').textContent = btn.dataset.ok ? '🎉 Дұрыс!' : '❌ Қайта көріңіз';
    });
  });
}
