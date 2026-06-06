document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNav();
  initGame();
  initTests();
  initReflection();
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

function initTests() {
  const submitBtn = document.getElementById('submitTest');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const questions = document.querySelectorAll('.test-question');
    let correct = 0;
    let answered = 0;

    questions.forEach(q => {
      const selected = q.querySelector('.test-option.selected');
      if (selected) {
        answered++;
        if (selected.dataset.correct === 'true') correct++;
      }
    });

    const result = document.getElementById('testResult');
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

        if (isCorrect) {
          option.classList.add('correct');
        } else if (isSelected) {
          option.classList.add('wrong');
        }
      });
    });

    const percent = Math.round((correct / questions.length) * 100);
    result.textContent = `Нәтиже: ${correct}/${questions.length} дұрыс (${percent}%)`;
    result.className = `test-result show ${percent >= 60 ? 'success' : 'error'}`;

    if (typeof completeQuest === 'function') {
      const bonus = typeof getTestBonusXp === 'function' ? getTestBonusXp(percent) : 0;
      completeQuest('testy', bonus);
    }
  });

  document.querySelectorAll('.test-option').forEach(option => {
    option.addEventListener('click', () => {
      const parent = option.closest('.test-question');
      if (parent.classList.contains('checked')) return;

      parent.querySelectorAll('.test-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
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
      if (typeof completeQuest === 'function') {
        completeQuest('refleksiya');
      }
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
    if (typeof completeQuest === 'function') {
      completeQuest('refleksiya');
    }
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
