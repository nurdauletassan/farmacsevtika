document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNav();
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

function initReflection() {
  const saveBtn = document.getElementById('saveReflection');
  if (!saveBtn) return;

  const textareas = document.querySelectorAll('.reflection-form textarea');
  const pageKey = window.location.pathname.split('/').pop() || 'refleksiya.html';

  textareas.forEach((textarea, i) => {
    const key = `reflection_${pageKey}_${i}`;
    const saved = localStorage.getItem(key);
    if (saved) textarea.value = saved;
  });

  saveBtn.addEventListener('click', () => {
    textareas.forEach((textarea, i) => {
      const key = `reflection_${pageKey}_${i}`;
      localStorage.setItem(key, textarea.value);
    });

    const msg = document.getElementById('reflectionSaved');
    if (msg) {
      msg.classList.add('show');
      setTimeout(() => msg.classList.remove('show'), 3000);
    }
  });
}
