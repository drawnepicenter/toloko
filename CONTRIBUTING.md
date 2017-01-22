## Contributing

As of right now, I am the only one contributing to this project. I welcome you to open issues and submit pull requests so that toloko can be even better.

### Build process

- Mocha is the test harness and Chai is assertions
- Test style is BDD
- Build is managed with npm scripts. [redrun](https://github.com/coderaiser/redrun) is my task runner. Here are the tasks:

- **bin** - transpiles src into bin
- **bump** - after release task, pushes version to repo and publishes npm package
- **clean** - deletes all generated files
- **climate** - CI-only task to submit test coverage
- **cover** - instruments code, calculates coverage, generates lcov and cleans up
- **lcov** - generates lcov.info from nyc data
- **lint** - fixes stylistic issues in src folder
- **test** - compiles test file, uses test runner
- **release** - uses standard-version to update the CHANGELOG and modify the version in package.json
- **report** - generates a nice HTML test report to load in your browser
- **watch** - watches src directory for changes and automatically compiles to bin folder

### Changelog & Versioning

- toloko uses the [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog-angular/blob/master/convention.md) format. [commitizen](http://commitizen.github.io/cz-cli/) automates this formatting.
- There is no development branch on top of master, so the workflow is clean and simple. [git town](http://www.git-town.com/) helps automate this workflow.
- [standard-version](https://github.com/conventional-changelog/standard-version) automates [semantic versioning](http://semver.org/spec/v2.0.0.html) and changelog generation.
- See the [CHANGELOG](https://github.com/drawnepicenter/toloko/blob/master/CHANGELOG.md) for progress.

### Coding Style & Linting

This project adheres to [standard](https://github.com/feross/standard) formatting rules.

### Testing

[Mocha](http://mochajs.org) is the test runner and it uses [Chai](http://chaijs.org) for assertions. Tests are written in BDD style. Coverage is calculated with [nyc](https://github.com/istanbuljs/nyc) and [babel-plugin-istanbul](https://github.com/istanbuljs/babel-plugin-istanbul).
