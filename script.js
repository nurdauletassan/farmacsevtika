document.addEventListener('DOMContentLoaded', () => {
  if (typeof injectNav === 'function') injectNav();
  initMobileNav();
  initActiveNav();
  initQuestions();
  initGame();
  initTestSubmits();
  initSuraqtar();
  initReflection();
  renderStructureGrid();
});

function initMobileNav() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.body.dataset.page = currentPage;
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });
}

function renderStructureGrid() {
  const grid = document.getElementById('structureGrid');
  if (!grid) return;

  const items = [
    { href: 'daris.html', label: 'Дәріс', icon: '📚', badge: '' },
    { href: 'tirek.html', label: 'Тірек жазба', icon: '📝', badge: '' },
    { href: 'syzba.html', label: 'Ақпараттық сызба', icon: '🗺️', badge: '' },
    { href: 'suraqtar.html', label: 'Сұрақтар', icon: '❓', badge: '10' },
    { href: 'test.html', label: 'Тест', icon: '✅', badge: '15' },
    { href: 'praktika.html', label: 'Практика', icon: '🔬', badge: '6' },
    { href: 'zhagday.html', label: 'Жағдай', icon: '💡', badge: '4' },
    { href: 'kvest.html', label: 'Квест', icon: '🗺️', badge: '' },
    { href: 'oiyn.html', label: 'Ойындар', icon: '🎮', badge: '6' },
    { href: 'anyqtama.html', label: 'Анықтамалық', icon: '📖', badge: '' }
  ];

  grid.innerHTML = items.map((item, i) => `
    <a href="${item.href}" class="structure-card structure-card--${i % 6}">
      <span class="structure-card__icon">${item.icon}</span>
      <strong>${item.label}</strong>
      ${item.badge ? `<span class="structure-card__badge">${item.badge}</span>` : ''}
    </a>
  `).join('');
}

function initQuestions() {
  if (typeof SURAQTAR !== 'undefined' && typeof renderOpenQuestions === 'function') {
    renderOpenQuestions('suraqtarQuestions', SURAQTAR);
  }
  if (typeof TEST15 !== 'undefined' && typeof renderQuestions === 'function') {
    renderQuestions('testQuestions', TEST15);
  }
  bindTestOptionClicks();
}

function bindTestOptionClicks() {
  document.querySelectorAll('.test-option').forEach(option => {
    if (option.dataset.bound) return;
    option.dataset.bound = '1';
    option.addEventListener('click', () => {
      const parent = option.closest('.test-question');
      if (!parent || parent.classList.contains('checked')) return;
      parent.querySelectorAll('.test-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
}

function initTestSubmits() {
  setupTestSubmit('submitTest', 'testResult', 'test');
}

function showSuraqtarMessage(text, type = 'success') {
  const msg = document.getElementById('suraqtarResult');
  if (!msg) return;
  msg.textContent = text;
  msg.className = `reflection-saved show ${type === 'error' ? 'error' : ''}`;
}

function initSuraqtar() {
  const saveBtn = document.getElementById('submitSuraqtar');
  const nameInput = document.getElementById('suraqtarStudentName');
  if (!saveBtn || !nameInput) return;

  const textareas = () => document.querySelectorAll('.open-question__input');
  const savedName = localStorage.getItem('suraqtar_student_name');
  if (savedName) {
    nameInput.value = savedName;
    loadSuraqtarAnswers(savedName, textareas());
  }

  nameInput.addEventListener('change', () => {
    const name = nameInput.value.trim();
    if (name) loadSuraqtarAnswers(name, textareas());
  });

  saveBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (!name) {
      showSuraqtarMessage('Алдымен атыңызды енгізіңіз!', 'error');
      nameInput.focus();
      return;
    }

    const answers = Array.from(textareas()).map(t => t.value);
    const empty = answers.filter(a => !a.trim()).length;

    if (empty === answers.length) {
      showSuraqtarMessage('Кем дегенде бір сұраққа жауап жазыңыз!', 'error');
      return;
    }

    localStorage.setItem('suraqtar_student_name', name);
    saveSuraqtarLocally(name, answers);

    const client = getSupabaseClient();
    if (!client) {
      showSuraqtarMessage(
        empty > 0
          ? `Жауаптар браузерде сақталды. ${empty} сұрақ бос қалды.`
          : 'Supabase қосылмаған. Барлық жауаптар браузерде сақталды.'
      );
      if (typeof completeQuest === 'function') completeQuest('suraqtar');
      return;
    }

    saveBtn.disabled = true;
    showSuraqtarMessage('Сақталуда...');

    const row = { student_name: name, updated_at: new Date().toISOString() };
    answers.forEach((a, i) => { row[`answer_${i + 1}`] = a || ''; });

    const { error } = await client.from('suraqtar_answers').upsert(row, { onConflict: 'student_name' });

    saveBtn.disabled = false;

    if (error) {
      showSuraqtarMessage('Қате: ' + error.message, 'error');
      return;
    }

    showSuraqtarMessage(
      empty > 0
        ? `✓ Сақталды! ${empty} сұрақ әлі бос.`
        : '✓ Барлық жауаптар Supabase-ке сақталды!'
    );
    if (typeof completeQuest === 'function') completeQuest('suraqtar');
  });
}

function saveSuraqtarLocally(name, answers) {
  answers.forEach((answer, i) => {
    localStorage.setItem(`suraqtar_${name}_${i}`, answer || '');
  });
}

async function loadSuraqtarAnswers(name, textareas) {
  const client = getSupabaseClient();

  if (!client) {
    textareas.forEach((textarea, i) => {
      textarea.value = localStorage.getItem(`suraqtar_${name}_${i}`) || '';
    });
    return;
  }

  const { data, error } = await client
    .from('suraqtar_answers')
    .select('answer_1, answer_2, answer_3, answer_4, answer_5, answer_6, answer_7, answer_8, answer_9, answer_10')
    .eq('student_name', name)
    .maybeSingle();

  if (error || !data) {
    textareas.forEach((textarea, i) => {
      textarea.value = localStorage.getItem(`suraqtar_${name}_${i}`) || '';
    });
    return;
  }

  textareas.forEach((textarea, i) => {
    textarea.value = data[`answer_${i + 1}`] || '';
  });
}

function setupTestSubmit(btnId, resultId, questId) {
  const submitBtn = document.getElementById(btnId);
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const container = submitBtn.closest('.container') || document;
    const questions = container.querySelectorAll('.test-question');
    let correct = 0;
    let answered = 0;

    questions.forEach(q => {
      const selected = q.querySelector('.test-option.selected');
      if (selected) {
        answered++;
        if (selected.dataset.correct === 'true') correct++;
      }
    });

    const result = document.getElementById(resultId);
    if (!result) return;

    if (answered < questions.length) {
      result.textContent = 'Барлық сұрақтарға жауап беріңіз!';
      result.className = 'test-result show error';
      return;
    }

    questions.forEach(q => {
      q.classList.add('checked');
      q.querySelectorAll('.test-option').forEach(option => {
        const isCorrect = option.dataset.correct === 'true';
        const isSelected = option.classList.contains('selected');
        option.classList.remove('correct', 'wrong');
        if (isCorrect) option.classList.add('correct');
        else if (isSelected) option.classList.add('wrong');
      });
    });

    const percent = Math.round((correct / questions.length) * 100);
    result.textContent = `Нәтиже: ${correct}/${questions.length} дұрыс (${percent}%)`;
    result.className = `test-result show ${percent >= 60 ? 'success' : 'error'}`;

    if (typeof completeQuest === 'function') {
      const bonus = typeof getTestBonusXp === 'function' ? getTestBonusXp(percent) : 0;
      completeQuest(questId, bonus);
    }
  });
}

function isSupabaseConfigured() {
  return window.SUPABASE_URL &&
    window.SUPABASE_ANON_KEY &&
    window.SUPABASE_URL !== 'https://YOUR_PROJECT.supabase.co' &&
    window.SUPABASE_ANON_KEY !== 'YOUR_ANON_KEY';
}

function getSupabaseClient() {
  if (!isSupabaseConfigured() || typeof supabase === 'undefined') return null;
  return supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
}

function showReflectionMessage(text, type = 'success') {
  const msg = document.getElementById('reflectionSaved');
  if (!msg) return;
  msg.textContent = text;
  msg.className = `reflection-saved show ${type === 'error' ? 'error' : ''}`;
}

function initReflection() {
  const saveBtn = document.getElementById('saveReflection');
  const nameInput = document.getElementById('studentName');
  if (!saveBtn || !nameInput) return;

  const textareas = document.querySelectorAll('.reflection-form textarea');
  const savedName = localStorage.getItem('reflection_student_name');
  if (savedName) {
    nameInput.value = savedName;
    loadReflectionFromSupabase(savedName, textareas);
  }

  nameInput.addEventListener('change', () => {
    const name = nameInput.value.trim();
    if (name) loadReflectionFromSupabase(name, textareas);
  });

  saveBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (!name) {
      showReflectionMessage('Атыңызды енгізіңіз!', 'error');
      return;
    }

    const answers = Array.from(textareas).map(t => t.value);
    localStorage.setItem('reflection_student_name', name);

    const client = getSupabaseClient();
    if (!client) {
      saveReflectionLocally(name, answers, textareas);
      showReflectionMessage('Supabase қосылмаған. Жауаптар браузерде сақталды.');
      if (typeof completeQuest === 'function') completeQuest('praktika');
      return;
    }

    saveBtn.disabled = true;
    showReflectionMessage('Сақталуда...');

    const { error } = await client.from('reflections').upsert(
      {
        student_name: name,
        answer_1: answers[0] || '',
        answer_2: answers[1] || '',
        answer_3: answers[2] || '',
        updated_at: new Date().toISOString()
      },
      { onConflict: 'student_name' }
    );

    saveBtn.disabled = false;

    if (error) {
      showReflectionMessage('Қате: ' + error.message, 'error');
      return;
    }

    showReflectionMessage('✓ Жауаптарыңыз Supabase-ке сақталды!');
    if (typeof completeQuest === 'function') completeQuest('praktika');
  });
}

function saveReflectionLocally(name, answers, textareas) {
  textareas.forEach((textarea, i) => {
    localStorage.setItem(`reflection_${name}_${i}`, answers[i] || '');
  });
}

async function loadReflectionFromSupabase(name, textareas) {
  const client = getSupabaseClient();

  if (!client) {
    textareas.forEach((textarea, i) => {
      textarea.value = localStorage.getItem(`reflection_${name}_${i}`) || '';
    });
    return;
  }

  const { data, error } = await client
    .from('reflections')
    .select('answer_1, answer_2, answer_3')
    .eq('student_name', name)
    .maybeSingle();

  if (error || !data) return;

  const answers = [data.answer_1, data.answer_2, data.answer_3];
  textareas.forEach((textarea, i) => {
    textarea.value = answers[i] || '';
  });
}
