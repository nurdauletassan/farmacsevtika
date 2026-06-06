const QUESTIONS = [
  { title: 'Не білдім?', hint: 'Бүгінгі сабақтан алған жаңа білімім' },
  { title: 'Не қызықты болды?', hint: 'Маған ерекше әсер еткен ақпарат немесе тапсырма' },
  { title: 'Болашақта қалай қолданамын?', hint: 'Алған білімімді оқуымда, тәжірибеде немесе болашақ мамандығымда қалай қолданамын' }
];

let allAnswers = [];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('refreshAnswers')?.addEventListener('click', loadAnswers);
  document.getElementById('answersSearch')?.addEventListener('input', filterAnswers);
  loadAnswers();
});

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

function setStatus(text, type = '') {
  const el = document.getElementById('answersStatus');
  if (!el) return;
  el.textContent = text;
  el.className = `answers-status ${type}`;
}

async function loadAnswers() {
  const list = document.getElementById('answersList');
  if (!list) return;

  const client = getSupabaseClient();
  if (!client) {
    setStatus('Supabase қосылмаған. supabase-config.js файлын толтырыңыз.', 'error');
    list.innerHTML = '';
    return;
  }

  setStatus('Жүктелуде...');

  const { data, error } = await client
    .from('reflections')
    .select('student_name, answer_1, answer_2, answer_3, updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    setStatus('Қате: ' + error.message, 'error');
    list.innerHTML = '';
    return;
  }

  allAnswers = data || [];
  setStatus(`Барлығы: ${allAnswers.length} жауап`);
  renderAnswers(allAnswers);
}

function filterAnswers() {
  const query = document.getElementById('answersSearch')?.value.trim().toLowerCase() || '';
  const filtered = query
    ? allAnswers.filter(r => r.student_name.toLowerCase().includes(query))
    : allAnswers;
  renderAnswers(filtered);
}

function renderAnswers(rows) {
  const list = document.getElementById('answersList');
  if (!list) return;

  if (!rows.length) {
    list.innerHTML = '<p class="answers-empty">Жауаптар табылмады</p>';
    return;
  }

  list.innerHTML = rows.map(row => {
    const date = row.updated_at
      ? new Date(row.updated_at).toLocaleString('kk-KZ')
      : '—';
    const answers = [row.answer_1, row.answer_2, row.answer_3];

    const answersHtml = QUESTIONS.map((q, i) => `
      <div class="answer-block">
        <p class="answer-block__q">${i + 1}. ${q.title}</p>
        <p class="answer-block__hint">${q.hint}</p>
        <p class="answer-block__a">${answers[i]?.trim() || '<em>Жауап жоқ</em>'}</p>
      </div>
    `).join('');

    return `
      <article class="answer-card">
        <header class="answer-card__header">
          <h2 class="answer-card__name">${escapeHtml(row.student_name)}</h2>
          <time class="answer-card__date">${date}</time>
        </header>
        <div class="answer-card__body">${answersHtml}</div>
      </article>
    `;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
