// Globals
// This is where we define how many sections our app has, there is
// expected to be an associated .inc file in the 'screens' folder
// with the content.
const sections = ['home', 'foods', 'about', 'contact', 'login', 'logout'];

// Contains references to main UI elements
const ui = {};

// Contains references to where our templates are stored.
const templates = {};

// Quickly get the user if it's available
const user = () => localStorage.getItem('user') ?? null;

/*
  Populate the UI object with useful handles on the main areas of our
  page to make life easier later
*/
function getHandles() {
  ui.mainnav = document.querySelector('header > nav');
  ui.main = document.querySelector('main');
  ui.footer = document.querySelector('footer');
  ui.footer.loginStatus = ui.footer.querySelector('.login-status');
  ui.footer.saveStatus = ui.footer.querySelector('.save-status');
  // this will store references to each screen element once they are created
  ui.screens = {};
  // helper function to get an array of all the screen elements
  ui.getScreens = () => Object.values(ui.screens);
  // helper function to get an array of all the nav buttons
  ui.getButtons = () => Object.values(ui.buttons);
  // templates object to store templates
  templates.screen = document.querySelector('#tmp-screen');
}

/*
  Build each 'screen' of our app, which will be cloned from the template
  in index.html, then appended to the <main> element.
*/
function buildScreens() {
  const template = templates.screen;
  for (const s of sections) {
    // by default we get a document fragment containing our <section>, so
    // we have to ask for its firstElementChild.
    // Not intuitive, but there you go
    const section = template.content.cloneNode(true).firstElementChild;

    // set the title of the section, with the first letter capitalised
    const title = section.querySelector('.title');
    title.textContent = capitalize(s);

    section.dataset.id = `sect-${s}`;
    section.dataset.name = s;

    ui.main.append(section);
    // store this screen in the ui global for eas(ier) access later.
    ui.screens[s] = section;
  }
}

/*
  Build the navbar by creating a button for each section that our app has
  and setting its dataset to show the corresponding screen for this section
  Add relevant event handlers to each button. Each one will show its associated
  screen when pressed, and update the browser's history when it does so.
*/
function setupNav() {
  ui.buttons = {};
  for (const s of sections) {
    const button = document.createElement('button');
    button.textContent = s;
    button.dataset.screen = s;
    button.addEventListener('click', show);
    button.addEventListener('click', storeState);
    ui.mainnav.append(button);
    ui.buttons[s] = button;
    if (s === 'logout') {
      hideElement(button);
    }
  }

  ui.buttons.logout.addEventListener('click', logout);
}

/*
  Fetch the html for one 'screen' (parameter: s) in the app from the server.
*/
async function fetchScreenContent(s) {
  const url = `/screens/${s}.inc`;
  const response = await fetch(url);
  if (response.ok) {
    return await response.text();
  } else {
    return `sorry, a ${response.status} error ocurred retrieving section data for: <pre>${url}</pre>`;
  }
}

/*
  get the content for each screen for all sections in the app
*/
async function getContent() {
  for (const section of sections) {
    const content = await fetchScreenContent(section);
    const article = document.createElement('article');
    article.innerHTML = content;
    ui.screens[section].append(article);
  }
  ui.foodEditor = document.querySelector('.food-editor');
}
/*
Utility function to capitalise the first letter of a string
*/
function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

/*
 Hides all the screens.
*/
function hideAllScreens() {
  for (const screen of ui.getScreens()) {
    hideElement(screen);
  }
}

function enableAllButtons() {
  for (const button of ui.getButtons()) {
    button.removeAttribute('disabled');
  }
}

/*
 Show a screen when one of the buttons in the <nav> is pressed.
 If no event is passed, then show the `home` screen instead.
*/
function show(event) {
  ui.previous = ui.current;
  const screen = event?.target?.dataset?.screen ?? 'home';
  showScreen(screen);
}

/*
 Show a screen with the specified name
*/

function showScreen(name) {
  hideAllScreens();
  enableAllButtons();
  showElement(ui.screens[name]);
  ui.current = name;
  document.title = `Simple SPA | ${name}`;
  ui.buttons[name].disabled = 'disabled';
}

/*
 Store the app's state in the History API to allow the back button
 to work
*/
function storeState() {
  history.pushState(ui.current, ui.current, `/app/${ui.current}`);
}

/*
 Read the URL path from the address bar, utility function
*/
function readPath() {
  const path = window.location.pathname.slice(5);
  if (path) {
    return path;
  }
  return 'home';
}

/*
 Fetch a the data for a specified user from the server
*/
async function getUserData(userid) {
  const response = await fetch(`/user/${userid}`);
  if (response.ok) {
    return await response.json();
  } else {
    return false;
  }
}

/*
 Handle a login - get the user's data from the server, then call
 utility functions to populate the relevant areas of the app
*/
async function login(event) {
  const userid = event.target.dataset.user;

  const user = await getUserData(userid);
  populateUserData(user);

  localStorage.setItem('user', userid);
  showScreen(ui.previous);
  storeState();
  hideElement(ui.buttons.login);
  showElement(ui.buttons.logout);
}

/*
 Utility function to add user data to relevant screens of the app
*/
function populateUserData(user) {
  for (const elem of document.querySelectorAll('.username')) {
    elem.textContent = user.name;
  }
  updateFoods(user.foods);
  buildFoodEditor(user.foods);
  ui.footer.loginStatus.textContent = `You are logged in as: ${user.name}. `;
}

function updateFoods(foods) {
  const favs = document.querySelectorAll('.favourites');
  for (const fav of favs) {
    fav.textContent = stringifyArrayItems(foods, 'Your favourite foods are: ');
  }
}

function buildFoodEditor(foods) {
  ui.foodEditor.classList.remove('hidden');
  const list = ui.foodEditor.querySelector('ol');
  for (let i = 0; i < foods.length; i++) {
    const row = document.querySelector('#tmp-food-input').content.cloneNode(true).firstElementChild;
    const input = row.querySelector('.food-entry');
    input.value = foods[i];
    input.removeAttribute('disabled');
    input.dataset.foodindex = i;
    input.addEventListener('input', foodsChange);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        updateFood(event);
      }
    });
    const save = row.querySelector('button');
    save.dataset.foodindex = i;
    list.append(row);
  }
}

function foodsChange(event) {
  const save = event.target.parentElement.querySelector('button');
  save.removeAttribute('disabled');
  save.addEventListener('click', updateFood);
}

async function updateFood(event) {
  const foodIndex = event.target.dataset.foodindex;
  addToStatus('saving...', true);
  const buttons = ui.foodEditor.querySelectorAll('button');
  const buttonsToReEnable = [];
  for (const button of buttons) {
    if (!button.disabled) {
      buttonsToReEnable.push(button);
    }
    button.setAttribute('disabled', 'disabled');
  }
  const food = ui.foodEditor.querySelector(`input[data-foodindex="${foodIndex}"]`).value;

  const saved = await sendFoodUpdate(foodIndex, food);

  for (const button of buttonsToReEnable) {
    button.removeAttribute('disabled');
  }

  if (saved) {
    addToStatus('save successful');
    ui.foodEditor.querySelector(`button[data-foodindex="${foodIndex}"]`).disabled = 'disabled';
    refreshUI(saved);
  } else {
    addToStatus('could not save due to some error, try refreshing the page.', true);
  }
}

async function sendFoodUpdate(index, food) {
  const payload = {
    id: user(),
    food,
    index,
  };

  if (!payload.id || !payload.food || !payload.index) {
    return false;
  }

  const response = await fetch('/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return false;
  }

  return await response.json();
}

function refreshUI(user) {
  for (const elem of document.querySelectorAll('.username')) {
    elem.textContent = user.name;
  }
  updateFoods(user.foods);
}

function addToStatus(message, persistent = false) {
  ui.footer.saveStatus.textContent = message;
  if (!persistent) {
    setTimeout(() => {
      ui.footer.saveStatus.textContent = 'ready';
    }, 2000);
  }
}

/*
 Silly function to turn the array of favourite foods
 for the user into a sentence.
*/
function stringifyArrayItems(arr, startText = '') {
  for (let i = 0; i < arr.length; i++) {
    startText += arr[i];
    if (i === arr.length - 1) {
      startText += '.';
    } else if (i === arr.length - 2) {
      startText += ', and ';
    } else {
      startText += ', ';
    }
  }
  return startText;
}

/*
Get all user data from the server for testing purposes
*/
async function getAllUsers() {
  // YOU WOULD NOT have this function or route in production.
  const response = await fetch('/users');
  if (response.ok) {
    populateUserList(await response.json());
  }
}

/*
 Populate user accounts on the login screen
*/
function populateUserList(users) {
  const userList = document.querySelector('nav.userlist');
  userList.removeChild(userList.firstElementChild);
  for (const user of users) {
    const button = document.createElement('button');
    button.dataset.user = user.id;
    button.textContent = user.name;
    button.addEventListener('click', login);
    userList.append(button);
  }
}

/*
Handle a logout. Client side only.
*/
function logout() {
  localStorage.removeItem('user');
  window.location.reload();
}

/*
Utility function to show the specified element
*/
function showElement(e) {
  e.classList.remove('hidden');
}

/*
Utility function to hide the specified element
*/
function hideElement(e) {
  e.classList.add('hidden');
}

/*
 Function to check whether we've seen this user before
 at startup, and set the login/logout buttons to the appropriate state.
*/
async function checkLoggedIn() {
  if (user()) {
    hideElement(ui.buttons.login);
    showElement(ui.buttons.logout);
    populateUserData(await (getUserData(user())));
  }
}

/*
 Load a screen at startup, based on the URL in the address bar of the browser.
*/
function loadInitialScreen() {
  ui.current = readPath();
  showScreen(ui.current);
}

/*
The main function for our app once it runs.
*/
async function main() {
  getHandles();
  buildScreens();
  setupNav();
  await getContent();
  await getAllUsers();
  await checkLoggedIn();
  window.addEventListener('popstate', loadInitialScreen);
  loadInitialScreen();
}

// start!
main();
