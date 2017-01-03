## Contributing

As of right now, I am the only one contributing to this project. I welcome you to open issues and submit pull requests so that toloko can be even better.

### Build process

- The **bin** task transpiles all ES6 code to ES5 using [Babel](http://babeljs.io) and pipes to the bin folder.
- The **clean** task removes test output and the bin folder, then runs the **bin** task

### Changelog & Versioning

- toloko uses the [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog-angular/blob/master/convention.md) format. [commitizen](http://commitizen.github.io/cz-cli/) automates this formatting.
- There is no development branch on top of master, so the workflow is clean and simple. [git town](http://www.git-town.com/) helps automate this workflow.
- [standard-version](https://github.com/conventional-changelog/standard-version) automates [semantic versioning](http://semver.org/spec/v2.0.0.html) and changelog generation.
- See the [CHANGELOG](https://github.com/drawnepicenter/toloko/blob/master/CHANGELOG.md) for progress.

### Coding Style & Linting

Code is linted with [ESLint](http://eslint.org). If you want to contribute code please consider using the provided .eslintrc as a styleguide. It's based on [Airbnb's styleguide](https://github.com/airbnb/javascript), and customized to my liking.

### Testing

[Mocha](http://mochajs.org) is the test runner and it uses [Chai](http://chaijs.org) for assertions. Tests are written in BDD style. Coverage is calculated with [nyc](https://github.com/istanbuljs/nyc) and [babel-plugin-istanbul](https://github.com/istanbuljs/babel-plugin-istanbul).
