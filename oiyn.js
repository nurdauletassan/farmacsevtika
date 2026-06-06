const MEMORY_PAIRS = [
  { id: 1, plant: 'Еркек қырыққұлағы', trait: 'Филицин, таспа құрт, бауырға уытты' },
  { id: 2, plant: 'Асқабақ дәні', trait: 'Кукурбитацин, уытсыз' },
  { id: 3, plant: 'Цина жусаны', trait: 'Сантонин, ксантопсия' },
  { id: 4, plant: 'Пижма гүлшоғыры', trait: 'Туйон, нейроуытты' },
  { id: 5, plant: 'Сарымсақ пиязы', trait: 'Аллицин, нематодтарға' }
];

const QUIZ_SHORT = [
  { q: 'Еркек қырыққұлағы тамырсабағының негізгі белсенді заты?', a: 'филицин' },
  { q: 'Асқабақ дәнінің қандай қасиеті оны жүктілерге қауіпсіз етеді?', a: 'уытсыз' },
  { q: 'Цина жусаны гүлшоғырын қабылдаған адамның сары түсті көруі қалай аталады?', a: 'ксантопсия' },
  { q: 'Таспа құрттарға қарсы ең күшті шикізат?', a: 'еркек қырыққұлағы' },
  { q: 'Тыңғылық шөбі қандай паразиттер класына тиімді?', a: 'нематод' }
];

const TRUE_FALSE = [
  { t: 'Еркек қырыққұлағы тамырсабағын жүкті әйелдерге қолдануға болады.', ok: false },
  { t: 'Асқабақ дәнін балаларға беруге болады, себебі ол уытсыз.', ok: true },
  { t: 'Пижма гүлшоғырының құрамындағы туйон жүйке жүйесіне пайдалы әсер етеді.', ok: false },
  { t: 'Цина жусаны гүлшоғыры таспа құрттарға қарсы тиімді.', ok: false },
  { t: 'Қалампыр бүршігінің эфир майы 15%-дан кем болмауы керек (фармакопея бойынша).', ok: true }
];

const MATCH_DATA = [
  { plant: 'Еркек қырыққұлағы', letter: 'D', answer: 'Филицин' },
  { plant: 'Асқабақ дәні', letter: 'E', answer: 'Кукурбитацин' },
  { plant: 'Цина жусаны', letter: 'B', answer: 'Сантонин' },
  { plant: 'Пижма', letter: 'A', answer: 'Туйон' },
  { plant: 'Анар қабығы', letter: 'C', answer: 'Пелетьерин' }
];

const MATCH_OPTIONS = [
  { letter: 'A', name: 'Туйон' },
  { letter: 'B', name: 'Сантонин' },
  { letter: 'C', name: 'Пелетьерин' },
  { letter: 'D', name: 'Филицин' },
  { letter: 'E', name: 'Кукурбитацин' }
];

const ORDER_SETS = [
  {
    title: 'Еркек қырыққұлағын қолдану алгоритмі',
    steps: ['Іш жүргізетін дәрі беру', 'Бауыр функциясын тексеру', 'Антигельминтикалық экстракт қабылдау', 'Дәрігердің бақылауы'],
    order: ['Бауыр функциясын тексеру', 'Іш жүргізетін дәрі беру', 'Антигельминтикалық экстракт қабылдау', 'Дәрігердің бақылауы']
  },
  {
    title: 'Асқабақ дәнін дайындау реті',
    steps: ['Ұнтақтау', 'Кептіру', 'Жинау', 'Сақтау'],
    order: ['Жинау', 'Кептіру', 'Ұнтақтау', 'Сақтау']
  },
  {
    title: 'Пижма гүлшоғырымен уланғандағы көмек',
    steps: ['Энтеросорбент беру', 'Жедел жәрдем шақыру', 'Асқазанды шаю', 'Құрысуға қарсы дәрі (дәрігер)'],
    order: ['Жедел жәрдем шақыру', 'Асқазанды шаю', 'Энтеросорбент беру', 'Құрысуға қарсы дәрі (дәрігер)']
  },
  {
    title: 'Қалампыр бүршігін сапалы бағалау',
    steps: ['Микроскопия', 'Макроскопия', 'Фармакопеямен салыстыру', 'Эфир майының мөлшерін анықтау'],
    order: ['Макроскопия', 'Микроскопия', 'Эфир майының мөлшерін анықтау', 'Фармакопеямен салыстыру']
  },
  {
    title: 'Жүктіліктегі қауіпсіз шикізатты таңдау',
    steps: ['Дәрігердің рұқсатын алу', 'Асқабақ дәнін ұсыну', 'Уытты шикізаттарды алып тастау', 'Төмен дозадан бастау'],
    order: ['Уытты шикізаттарды алып тастау', 'Асқабақ дәнін ұсыну', 'Дәрігердің рұқсатын алу', 'Төмен дозадан бастау']
  }
];

const FIND_RIDDLES = [
  {
    q: 'Тамырсабағы таспа құрттарға қарсы ең күшті әсерге ие, бірақ бауыр мен көзге уытты. Құрамында филицин бар.',
    a: 'еркек қырыққұлағы'
  },
  {
    q: 'Дәнінің құрамындағы кукурбитацин уытсыз, таспа және дөңгелек құрттарды салдандырады. Жүктілер мен балаларға ұсынылады.',
    a: 'асқабақ'
  },
  {
    q: 'Гүлшоғыры аскаридаларға әсер етеді, бірақ оны қабылдаған адамдар кейде «бәрін сары түсті көремін» дейді.',
    a: 'цина жусаны'
  },
  {
    q: 'Жеміс қабығында пелетьерин алкалоиды және көп таниндер бар. Дәмі тұтқыр. Микроскопияда склереидалар көрінеді.',
    a: 'анар'
  },
  {
    q: 'Шөбінде тимол бар, анкилостомалар мен нематодтарға әсер етеді. Дәмдеуіш ретінде де қолданылады.',
    a: 'тыңғылық'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => startGame(card.dataset.game));
  });
});

function normalize(text) {
  return (text || '').toLowerCase().replace(/[().,]/g, ' ').replace(/\s+/g, ' ').trim();
}

function answerMatches(input, expected) {
  const a = normalize(input);
  const b = normalize(expected);
  return a.includes(b) || b.includes(a);
}

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
  const cards = MEMORY_PAIRS.flatMap(p => [
    { text: p.plant, pair: p.id, type: 'plant' },
    { text: p.trait, pair: p.id, type: 'trait' }
  ]).sort(() => Math.random() - 0.5);

  let flipped = [];
  let matched = 0;

  area.innerHTML = `
    <h3>🃏 Жады ойыны</h3>
    <p class="game-area__hint">Шикізат пен оның ерекше белгісін жұптаңыз</p>
    <div class="memory-grid memory-grid--pairs">${cards.map((c, i) =>
      `<button class="memory-card memory-card--wide" data-i="${i}" data-pair="${c.pair}" data-type="${c.type}">?</button>`
    ).join('')}</div>
    <p id="memScore">Табылды: 0/5</p>
  `;

  area.querySelectorAll('.memory-card').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('matched') || flipped.length >= 2 || btn.classList.contains('flipped')) return;
      btn.textContent = cards[parseInt(btn.dataset.i, 10)].text;
      btn.classList.add('flipped');
      flipped.push(btn);

      if (flipped.length === 2) {
        const [a, b] = flipped;
        const isPair = a.dataset.pair === b.dataset.pair && a.dataset.type !== b.dataset.type;
        if (isPair) {
          a.classList.add('matched');
          b.classList.add('matched');
          matched++;
          document.getElementById('memScore').textContent = `Табылды: ${matched}/5`;
          if (matched === 5) area.insertAdjacentHTML('beforeend', '<p class="game-win">🎉 Барлық жұптар табылды!</p>');
        }
        setTimeout(() => {
          [a, b].forEach(card => {
            if (!card.classList.contains('matched')) {
              card.textContent = '?';
              card.classList.remove('flipped');
            }
          });
          flipped = [];
        }, 900);
      }
    });
  });
}

function initQuiz(area) {
  let i = 0;
  let score = 0;

  function show() {
    if (i >= QUIZ_SHORT.length) {
      area.innerHTML = `<h3>⚡ Нәтиже: ${score}/${QUIZ_SHORT.length}</h3><p class="game-win">${score >= 4 ? '🎉 Керемет!' : 'Қайта ойнаңыз!'}</p>`;
      return;
    }
    const item = QUIZ_SHORT[i];
    area.innerHTML = `
      <h3>⚡ Жылдам викторина — ${i + 1}/${QUIZ_SHORT.length}</h3>
      <p>${item.q}</p>
      <input type="text" class="match-input game-input" id="quizInput" placeholder="Қысқа жауап...">
      <button class="btn btn--primary" id="quizCheck">Жауап беру</button>
      <p id="quizRes"></p>
    `;
    const input = document.getElementById('quizInput');
    document.getElementById('quizCheck').addEventListener('click', () => {
      const ok = answerMatches(input.value, item.a);
      if (ok) score++;
      document.getElementById('quizRes').textContent = ok ? '✅ Дұрыс!' : `❌ Дұрыс жауап: ${item.a}`;
      setTimeout(() => { i++; show(); }, 1200);
    });
    input.focus();
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('quizCheck').click();
    });
  }
  show();
}

function initTrueFalse(area) {
  let i = 0;
  let score = 0;

  function show() {
    if (i >= TRUE_FALSE.length) {
      area.innerHTML = `<h3>✅ Нәтиже: ${score}/${TRUE_FALSE.length}</h3>`;
      return;
    }
    const item = TRUE_FALSE[i];
    area.innerHTML = `
      <h3>✅ Дұрыс / Бұрыс — ${i + 1}/${TRUE_FALSE.length}</h3>
      <p>${item.t}</p>
      <div class="tf-btns">
        <button class="btn btn--primary" data-ok="true">Дұрыс</button>
        <button class="btn btn--outline" data-ok="false">Бұрыс</button>
      </div>
    `;
    area.querySelectorAll('[data-ok]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.ok === String(item.ok)) score++;
        i++;
        show();
      });
    });
  }
  show();
}

function initMatch(area) {
  const opts = MATCH_OPTIONS.map(o => `<option value="${o.letter}">${o.letter}. ${o.name}</option>`).join('');
  area.innerHTML = `
    <h3>🔗 Сәйкестіру</h3>
    <p class="game-area__hint">Шикізатты белсенді затпен сәйкестендіріңіз (A–E)</p>
    <div class="match-options-ref">
      ${MATCH_OPTIONS.map(o => `<span><strong>${o.letter}</strong> — ${o.name}</span>`).join('')}
    </div>
    ${MATCH_DATA.map((m, i) => `
      <div class="match-row">
        <span>${i + 1}. ${m.plant}</span>
        <select class="match-select" data-letter="${m.letter}">
          <option value="">—</option>${opts}
        </select>
      </div>
    `).join('')}
    <button class="btn btn--primary" id="checkMatch">Тексеру</button>
    <p id="matchRes"></p>
  `;

  document.getElementById('checkMatch').addEventListener('click', () => {
    let ok = 0;
    area.querySelectorAll('.match-select').forEach(sel => {
      if (sel.value === sel.dataset.letter) ok++;
    });
    document.getElementById('matchRes').textContent = ok === MATCH_DATA.length
      ? '🎉 Барлығы дұрыс!'
      : `Дұрыс: ${ok}/${MATCH_DATA.length}`;
  });
}

function initOrder(area) {
  area.innerHTML = `
    <h3>📋 Реттеу</h3>
    <p class="game-area__hint">Әр сценарийде әрекеттерді 1–4 ретімен нөмірлеңіз</p>
    ${ORDER_SETS.map((set, si) => {
      const shuffled = [...set.steps].sort(() => Math.random() - 0.5);
      return `
        <div class="order-block" data-set="${si}">
          <h4>${si + 1}. ${set.title}</h4>
          ${shuffled.map(step => `
            <div class="order-row">
              <input type="number" min="1" max="4" class="order-num" data-s="${step}">
              <span>${step}</span>
            </div>
          `).join('')}
        </div>
      `;
    }).join('')}
    <button class="btn btn--primary" id="checkOrder">Тексеру</button>
    <p id="orderRes"></p>
  `;

  document.getElementById('checkOrder').addEventListener('click', () => {
    let correctSets = 0;
    ORDER_SETS.forEach((set, si) => {
      const block = area.querySelector(`.order-block[data-set="${si}"]`);
      let ok = true;
      block.querySelectorAll('.order-row').forEach(row => {
        const step = row.querySelector('.order-num').dataset.s;
        const num = parseInt(row.querySelector('.order-num').value, 10);
        const expected = set.order.indexOf(step) + 1;
        if (num !== expected) ok = false;
      });
      if (ok) correctSets++;
    });
    document.getElementById('orderRes').textContent = correctSets === ORDER_SETS.length
      ? '🎉 Барлық реттер дұрыс!'
      : `Дұрыс сценарийлер: ${correctSets}/${ORDER_SETS.length}`;
  });
}

function initFind(area) {
  let i = 0;
  let score = 0;

  function show() {
    if (i >= FIND_RIDDLES.length) {
      area.innerHTML = `<h3>🔍 Нәтиже: ${score}/${FIND_RIDDLES.length}</h3>`;
      return;
    }
    const item = FIND_RIDDLES[i];
    area.innerHTML = `
      <h3>🔍 Тапқыш — ${i + 1}/${FIND_RIDDLES.length}</h3>
      <p>${item.q}</p>
      <p class="game-area__hint">Бұл қандай дәрілік өсімдік (шикізат)?</p>
      <input type="text" class="match-input game-input" id="findInput" placeholder="Жауап...">
      <button class="btn btn--primary" id="findCheck">Тексеру</button>
      <p id="findRes"></p>
    `;
    const input = document.getElementById('findInput');
    document.getElementById('findCheck').addEventListener('click', () => {
      const ok = answerMatches(input.value, item.a);
      if (ok) score++;
      document.getElementById('findRes').textContent = ok ? '✅ Дұрыс!' : `❌ Жауап: ${item.a}`;
      setTimeout(() => { i++; show(); }, 1400);
    });
    input.focus();
  }
  show();
}
