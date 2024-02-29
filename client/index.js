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

    ui.main.append(section);
    section.id = (`sect-${s}`);
  }
  ui.screens = document.querySelectorAll('.screen');
  // setDataSets();
}

// function setDataSets() {
//   for (const s of ui.screens) {
//     s.dataset.id = s.name;
//   }
// }

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

  let showScreen;
  if (event) {
    showScreen = event.target.dataset.screen;
  } else {
    showScreen = 'sect-home';
  }
  // document.querySelector(`[data-id="${showScreen}"]`).classList.remove('hidden');
  document.querySelector('#' + showScreen).classList.remove('hidden');
}

getHandles();
buildScreens();
setupNav();
show();
