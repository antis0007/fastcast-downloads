/* Optional enhancements. Navigation, downloads, images and FAQs work without JS. */
const dialog = document.querySelector('.image-dialog');
if (dialog && typeof dialog.showModal === 'function') {
  let imageTrigger;
  document.querySelectorAll('[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      imageTrigger = link;
      const image = link.querySelector('img');
      const fullImage = dialog.querySelector('img');
      fullImage.src = link.href;
      fullImage.alt = image.alt;
      dialog.showModal();
    });
  });
  dialog.addEventListener('close', () => imageTrigger?.focus());
}

const search = document.querySelector('#faq-search');
if (search) {
  const groups = [...document.querySelectorAll('.faq-group')];
  const answers = groups.flatMap(group => [...group.querySelectorAll('details')]);
  const searchText = new Map(answers.map(answer => [answer, answer.textContent.toLocaleLowerCase()]));
  const status = document.querySelector('#search-status');
  document.querySelector('.help-search').hidden = false;
  search.maxLength = 160;
  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const answer of answers) {
      const matches = searchText.get(answer).includes(query);
      answer.hidden = !matches;
      answer.open = Boolean(query && matches);
      if (matches) count += 1;
    }
    for (const group of groups) {
      group.hidden = ![...group.querySelectorAll('details')].some(answer => !answer.hidden);
    }
    document.querySelector('#no-results').hidden = count > 0;
    status.textContent = query ? `${count} ${count === 1 ? 'answer' : 'answers'} found` : '';
  });
  // Topic navigation restores the complete list if a search had hidden a topic.
  document.querySelectorAll('.section-nav a').forEach(link => {
    link.addEventListener('click', () => {
      search.value = '';
      search.dispatchEvent(new Event('input'));
    });
  });
}

const platform = /Android/i.test(navigator.userAgent) ? 'android'
  : /Windows/i.test(navigator.userAgent) ? 'windows' : null;
if (platform) {
  const label = document.querySelector(`[data-platform="${platform}"] .recommendation`);
  if (label) label.hidden = false;
  // Keep both direct downloads visible; only promote the matching platform.
  document.querySelectorAll('.hero [data-download]').forEach(link => {
    const matches = link.dataset.download === platform;
    link.classList.toggle('primary', matches);
    link.style.order = matches ? '-1' : '0';
  });
}
