# A 'simple' Single Page Application (SPA)

This small web app runs in a single page in the web browser. It has support for the History API which allows the browser's forward and back buttons to work as expected.

## What this application does

* includes all the content for each of its 'pages' by requesting their content through `fetch` (note that this include is done on the *client*, not the server.)
* each 'page' is rendered in the DOM for `index.html`, however, only one 'page' shows at a time
* provides a simple dummy login to demonstrate that we can handle multiple users without needing to implement auth
* allows each user to store their three favourite foods.
* provides a simple server which handles api routes to retrieve and update user data, as well as serve the application

## files
* `svr.js` - a simple express application to serve the application and provide a small API
* `users.js` - user data storage, in memory only. If you restart the server it will revert to default values. Feel free to add persistent storage!
* `client/index.html` - bare bones structure of the application
* `client/index.js` - the app's functionality that runs once the HTML has loaded
* `client/style.css` - basic CSS for the app

### client/includes
The files in this folder contain the HTML fragments required by `index.js` for the app to construct its screens. 

## How it works

First, `index.js` will construct a HTML `<section>` with a class of `screen` for each of the entries in the `pages` array by cloning the template from `index.html`. It will then use each entry's `screen` property to retrieve the associated `.inc` file from the server, and place this content inside the section. For example, the homepage is represented by the first object in the pages array, which has a title of `Home` and a screen of `home`. `index.js` will then request `/screens/home.inc` at runtime in order to populate the content.

You can add another page by adding a new entry in the `pages` array and adding an associated `.inc` file in the `screens` folder.

Warning - deleting certain existing pages (`foods, login, logout`) will cause bits of `index.js` to break because it is not (yet) modularised.

Once all the content has been included, the code will then add the relevant event handlers and show the homescreen. Every time a button in the header navigation is pressed, the UI's state is pushed into the browser history. When the back or forward button is pressed, the state is restored.

The rest of the code is commented - feel free to ask questions if you don't understand it.

## A note on Routing

As the server redirects all requests to `/app/*` to `index.html`, `href` and `src` attributes in the elements in `index.html`, and the URLs used by `fetch` in `index.js` must be prefixed with their absolute path relative to the domain. This is why the `<script>` tag in `index.html`'s `src` is set to `/index.js`, for example. 

## Installation

* Clone the repository and run `npm i`.

## Starting the application

* run `npm start`
* visit `http://localhost:8080` in your browser.
