const SITE_SECTIONS = [
  {
    id: 'theory',
    label: 'Теория',
    icon: '📖',
    items: [
      { href: 'daris.html', label: 'Дәріс', icon: '📚', badge: '' },
      { href: 'tirek.html', label: 'Тірек жазба', icon: '📝', badge: '' },
      { href: 'syzba.html', label: 'Ақпараттық сызба', icon: '🗺️', badge: '' },
      { href: 'anyqtama.html', label: 'Анықтамалық', icon: '📖', badge: '10' }
    ]
  },
  {
    id: 'practice',
    label: 'Тәжірибе',
    icon: '🔬',
    items: [
      { href: 'emf.html', label: 'МФ РК', labelLong: 'Мемлекеттік Фармакопея', icon: '📋', badge: '2' },
      { href: 'praktika.html', label: 'Тәжірибелік жұмыс', icon: '🔬', badge: '5' },
      { href: 'zhagday.html', label: 'Жағдай (кейс)', icon: '💡', badge: '10' },
      { href: 'kvest.html', label: 'Квест', icon: '🔍', badge: '5' },
      { href: 'oiyn.html', label: 'Ойындар', icon: '🎮', badge: '6' }
    ]
  },
  {
    id: 'assessment',
    label: 'Бағалау',
    icon: '✅',
    items: [
      { href: 'suraqtar.html', label: 'Өзін-өзі тексеру', labelLong: 'Өзін-өзі тексеру сұрақтары', icon: '❓', badge: '10' },
      { href: 'test.html', label: 'Тест', icon: '✅', badge: '15' },
      { href: 'refleksiya.html', label: 'Рефлексия', icon: '💭', badge: '3' }
    ]
  }
];

const NAV_ITEMS = [
  { href: 'index.html', label: 'Басты бет' },
  ...SITE_SECTIONS.flatMap(s => s.items.map(i => ({
    href: i.href,
    label: i.labelLong || i.label
  })))
];

const PAGE_FLOW = [
  'index.html',
  ...SITE_SECTIONS.flatMap(s => s.items.map(i => i.href))
];

function injectNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let html = '<a href="index.html" class="nav__link">Басты бет</a>';

  SITE_SECTIONS.forEach(section => {
    html += `<div class="nav__group"><span class="nav__group-label">${section.icon} ${section.label}</span>`;
    section.items.forEach(item => {
      html += `<a href="${item.href}" class="nav__link nav__link--${section.id}">${item.labelLong || item.label}</a>`;
    });
    html += '</div>';
  });

  nav.innerHTML = html;
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
