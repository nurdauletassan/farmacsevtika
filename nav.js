const NAV_ITEMS = [
  { href: 'index.html', label: 'Басты бет' },
  { href: 'daris.html', label: 'Дәріс' },
  { href: 'tirek.html', label: 'Тірек жазба' },
  { href: 'syzba.html', label: 'Ақпараттық сызба' },
  { href: 'suraqtar.html', label: 'Сұрақтар' },
  { href: 'test.html', label: 'Тест' },
  { href: 'praktika.html', label: 'Практика' },
  { href: 'zhagday.html', label: 'Жағдай' },
  { href: 'kvest.html', label: 'Квест' },
  { href: 'oiyn.html', label: 'Ойындар' },
  { href: 'anyqtama.html', label: 'Анықтамалық' }
];

const PAGE_FLOW = [
  'index.html', 'daris.html', 'tirek.html', 'syzba.html', 'suraqtar.html',
  'test.html', 'praktika.html', 'zhagday.html', 'kvest.html', 'oiyn.html', 'anyqtama.html'
];

function injectNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  nav.innerHTML = NAV_ITEMS.map(item =>
    `<a href="${item.href}" class="nav__link">${item.label}</a>`
  ).join('');
}

function getNextPage(current) {
  const page = current || window.location.pathname.split('/').pop() || 'index.html';
  const idx = PAGE_FLOW.indexOf(page);
  if (idx === -1 || idx >= PAGE_FLOW.length - 1) return null;
  return PAGE_FLOW[idx + 1];
}

function getNextLabel(href) {
  const item = NAV_ITEMS.find(n => n.href === href);
  return item ? item.label : 'Келесі';
}
