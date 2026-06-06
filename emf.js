(function () {
  const FILENAMES = {
    'Gosudarstvennaya-farmakopeya-Respubliki-Kazahstan-tom-I.pdf': 'MF-RK-tom-1.pdf',
    'Gosudarstvennaya-farmakopeya-Respubliki-Kazahstan-tom-II.pdf': 'MF-RK-tom-2.pdf',
  };

  document.querySelectorAll('[data-emf-download]').forEach((link) => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();

      const href = link.getAttribute('href').split('?')[0];
      const filename = FILENAMES[href] || href.split('/').pop();
      const label = link.textContent;

      link.setAttribute('aria-busy', 'true');
      link.textContent = 'Жүктелуде...';

      try {
        const res = await fetch(href);
        if (!res.ok) throw new Error('PDF unavailable');

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch {
        window.location.assign(href + '?download=1');
      } finally {
        link.removeAttribute('aria-busy');
        link.textContent = label;
      }
    });
  });
})();
