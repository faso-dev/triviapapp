# Frontend - Trivia API

## Getting Setup

### Installing Dependencies

To install the dependencies, run the following commands in the `frontend` directory:

```bash
npm install
```

> _tip_: `npm i`is shorthand for `npm install``

## Required Tasks

### Running Your Frontend in Dev Mode

Before to run the frontend, you need to start the backend server and set the api server base url
in your `src/config/config.js` file.

To run the frontend in dev mode, run the following command:

```bash
npm start
```

After the server is running, you can navigate to `http://localhost:3000` in your browser.
Now you'll see the homepage with the questions and categories list.

### Stand out

- Add a base layout to wrap all others components. `(src/layout => base-layout.js)`
- Add config file to store the api base url. `(src/config => config.js)`
- Improve the styling of the components. `(src/components => *.js)`
- Improve the header with navigation bar. `(src/components => Header.js)`
- Use `react-dom-router` to handle the routing. `(src/components => Header.js)`
- Add category creation form and processing. `(src/components => QuestionView.js)`

### Resources

- [React Router](https://reacttraining.com/react-router/web/guides/quick-start)