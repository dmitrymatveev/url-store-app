# UrlStoreApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.9.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# Technical Design

## Overview
Angular standalone application to store url links on local clients.

## Scope 
* Angular front-end only application with no server-side backend
* Uses native browser APIs (indexedDB) for URL storage
* Validates urls and ensures urls are real.

## Key technologies
* Angular 18+: Framework for building the SPA, using standalone components and modern routing.
* IndexedDB: Browser-based storage for persisting URLs, implemented natively without libraries.
* Fetch API: Used for URL reachability checks (HEAD and GET with Range: bytes=0-0).
* TypeScript: For type safety and modern JavaScript features.
* CSS: Global (styles.css) and component-specific styles (app.component.css) for responsive UI.

## Functional requirements
* Url submission via form, url validation
* Url persistent local storage
* Paginated url display
* Error handling is simple error promt.

## Key implementation details
* IndexedDB  
  Native api for storing and indexing entries  
  Allows for pagination
  May be extended to enfocrse unique entries
* Fetch API  
  Used to perform head requests for testing url validity
  Uses abort controller to prevent too long requests

## Future enhancements
* Ability to manage existing url records
* Filtering sorting and search
* Export / import urls
* Cache UI state in a service worker to allow offline access.

## Conclusion
The Local URL Store is a lightweight,  Angular application that efficiently handles URL submission, storage, and display using modern browser APIs. The modular architecture and minimal dependencies make it easy to maintain and extend.


