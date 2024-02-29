const sections = ['home', 'about', 'contact'];
const ui = {};

function getHandles() {
  ui.mainnav = document.querySelector('header > nav');
  ui.main = document.querySelector('main');
}

function buildScreens() {
  const template = document.querySelector('#tmp-screen');
  for (const s of sections) {
    const section = template.content.cloneNode(true);
    const title = section.querySelector('.title');
    title.textContent = capitalize(s);
    section.firstElementChild.dataset.id = `sect-${s}`;
    ui.main.append(section);
  }
  ui.screens = document.querySelectorAll('.screen');
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

function setupNav() {
  for (const s of sections) {
    const button = document.createElement('button');
    button.textContent = s;
    button.dataset.screen = `sect-${s}`;
    button.addEventListener('click', show);
    ui.mainnav.append(button);
  }
}

function show(event) {
  for (const screen of ui.screens) {
    screen.classList.add('hidden');
  }

  const showScreen = event?.target?.dataset?.screen ?? 'sect-home';

  document.querySelector(`[data-id="${showScreen}"]`).classList.remove('hidden');
}

getHandles();
buildScreens();
setupNav();
show();
