# Automated development boilerplate
Automated workflow for developing vanilla websites with tasks for building assets (HTML, CSS, JS) for production (minifying), compiling SCSS files to CSS, sourcemaps, watching for html, scss and js file changes, live reload.

Using Babel to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments. It means that you can **"*Use next generation JavaScript, today!*"**

This workflow consists of **[Gulp](https://gulpjs.com/), [BrowserSync](https://www.browsersync.io/), [Babel](https://babeljs.io/) and [SASS](https://sass-lang.com/)**.

---

#### First
You will need to have **npm** installed - Node Package Manager (actually a JavaScript package manager) to install all the dependencies. It comes together with [Node.js](https://nodejs.org/en/).

## How to run
1. Clone or download the repo
2. Install all the dependencies with `npm i` (or `npm install`) command in the **root** folder
3. Run the development server (and watch sass files) with the `npm start` command

:tada: :fireworks:

- Default port: **3001**
- BrowserSync UI port: **3002**

**Note**:
You can also just compile SASS files with `npm run sass` command (and for example use a code editor's Live Server package to spin up the developmet server).

When development server is started Gulp will automatically watch for SCSS, JS and HTML file changes. When html or js files are modified BrowserSync will reload the browser window to apply those changes, but when scss (css) files are modified Gulp will just compile them to css and BrowserSync will inject them without refreshing the browser window.

**Image optimization**:
Image optimization is disabled because I still haven't found a compressor with good compression rate. `gulp-imagemin` package seems to perform very poorly on compressing compared to websites like compresspng/compressjpeg.com.

###### Contributions are very welcome! :)

---

## Build assets for production
- Make sure that your latest SCSS modifications are compiled to CSS
- Run `npm run build` command to optimize the assets and build them in the **/dist** directory
