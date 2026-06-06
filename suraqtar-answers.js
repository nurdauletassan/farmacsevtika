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
    setStatus('Supabase қосылмаған.', 'error');
    list.innerHTML = '';
    return;
  }

  setStatus('Жүктелуде...');

  const { data, error } = await client
    .from('suraqtar_answers')
    .select('student_name, answer_1, answer_2, answer_3, answer_4, answer_5, answer_6, answer_7, answer_8, answer_9, answer_10, updated_at')
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

  const questions = typeof SURAQTAR !== 'undefined' ? SURAQTAR : [];

  list.innerHTML = rows.map(row => {
    const date = row.updated_at
      ? new Date(row.updated_at).toLocaleString('kk-KZ')
      : '—';

    const answersHtml = questions.map((q, i) => `
      <div class="answer-block">
        <p class="answer-block__q">${i + 1}. ${escapeHtml(q.q)}</p>
        <p class="answer-block__a">${row[`answer_${i + 1}`]?.trim() ? escapeHtml(row[`answer_${i + 1}`].trim()) : '<em>Жауап жоқ</em>'}</p>
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
