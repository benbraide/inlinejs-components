# InlineJS Components

InlineJS Components is a TypeScript library that provides HTML5 extension components for the InlineJS reactive framework. It's built as an NPM package that exports both CommonJS and ES modules, with webpack bundles for direct browser usage.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Build the Repository
- Install dependencies: `npm install` -- takes ~15 seconds
- Install core InlineJS dependencies: `npm run download` -- takes ~15 seconds (optional, dependencies should already be installed)
- Build TypeScript modules: `npm run compile` -- takes ~4 seconds. Compiles to lib/common/ (CommonJS) and lib/esm/ (ES modules)
- Build webpack bundles: `npm run build` -- takes ~8 seconds. NEVER CANCEL. Set timeout to 30+ seconds. Creates dist/inlinejs-components.js and dist/inlinejs-components.min.js

### Full Build Process
Run these commands in sequence to fully build the project:
```bash
cd /path/to/repo
npm install
npm run compile
npm run build
```

### Testing
- There are NO test files in this repository. The npm test and npm run ts-test commands will fail with "No test files found"
- For manual validation, test by including the built JavaScript files in an HTML page and verifying component functionality

### Publishing Commands
- `npm run prepublishOnly` -- runs npm run compile automatically before publishing
- `npm run upload` -- builds and publishes to NPM with public access
- `npm run push` -- downloads dependencies, then uploads to NPM

## Validation

### Build Validation
ALWAYS run these commands after making changes to verify the build still works:
1. `npm run compile` -- must complete successfully in ~4 seconds
2. `npm run build` -- must complete successfully in ~8 seconds  
3. Verify output files exist:
   - `ls dist/` should show inlinejs-components.js, inlinejs-components.min.js, and .LICENSE.txt
   - `ls lib/common/` should show compiled .js and .d.ts files
   - `ls lib/esm/` should show ES module versions

### Manual Functionality Testing
Since there are no automated tests, ALWAYS manually test your changes:
1. Create a test HTML file that includes the built JavaScript
2. Test basic InlineJS functionality with components from this library
3. Verify that custom elements like `<injs-component>`, `<injs-form>`, etc. are properly registered
4. Check browser console for any JavaScript errors

### Code Quality
- There are NO linting or formatting tools configured in this repository
- Follow the existing TypeScript style conventions in the codebase
- Use TypeScript strict mode settings as configured in tsconfig.json

## Common Tasks

### Repository Structure
```
src/                    # TypeScript source code
├── core/              # Core components (component, code, process)
├── dom/               # DOM-related components (form, image, script, style, event)
├── extended/          # Extended components (fetch, overlay, xhr)
├── entry.ts           # Main entry point that registers all components
├── index.ts           # Export definitions
└── inlinejs-components.ts  # Webpack entry point

lib/                   # Compiled TypeScript output
├── common/            # CommonJS modules + .d.ts files
└── esm/              # ES modules

dist/                  # Webpack bundle output
├── inlinejs-components.js      # Development bundle
├── inlinejs-components.min.js  # Production bundle (minified)
└── inlinejs-components.min.js.LICENSE.txt

package.json           # NPM configuration and scripts
tsconfig.json         # TypeScript config for CommonJS output
tsconfig.esm.json     # TypeScript config for ES module output
webpack.config.js     # Development webpack build
webpack2.config.js    # Production webpack build (minified)
```

### Key Source Files
- `src/entry.ts` -- Main registration function that calls all component compact functions
- `src/index.ts` -- All exports for the library
- `src/core/component.ts` -- Core `<injs-component>` element for loading/rendering components
- `src/dom/form.ts` -- Form handling component
- `src/extended/xhr.ts` -- XHR/fetch utilities

### Package Scripts Reference
```json
{
  "test": "mocha -r jsdom-global/register lib/**/*.spec.js",          // NO TESTS EXIST
  "ts-test": "mocha -r ts-node/register -r jsdom-global/register src/**/*.spec.ts",  // NO TESTS EXIST
  "compile": "tsc -p ./tsconfig.json && tsc -p ./tsconfig.esm.json", // ~4 seconds
  "build": "webpack -c ./webpack.config.js && webpack -c ./webpack2.config.js",  // ~8 seconds
  "prepublishOnly": "npm run compile",                                // Runs before npm publish
  "upload": "npm run build && npm publish --access=public",          // Build and publish
  "download": "npm i @benbraide/inlinejs @benbraide/inlinejs-element && npm audit fix",  // Install deps
  "push": "npm run download && npm run upload"                       // Full update cycle
}
```

### Dependencies
- `@benbraide/inlinejs` -- Core InlineJS reactive framework
- `@benbraide/inlinejs-element` -- InlineJS custom element utilities  
- Main build tools: TypeScript, Webpack, Terser (for minification)
- Testing tools: Mocha, Chai, jsdom (configured but no tests exist)

### Troubleshooting
- If `npm install` shows audit warnings about mocha/nanoid/serialize-javascript, this is expected. The project uses older versions that have known moderate vulnerabilities
- Running `npm audit fix --force` would update to mocha@11.7.2 which may introduce breaking changes
- The webpack configs exclude `src/inlinejs*.ts` files from TypeScript compilation -- this is intentional
- If builds fail, ensure all dependencies are installed with `npm install`

## Important Notes for Agents

### Timing and Patience
- NEVER CANCEL npm install (takes ~15 seconds)
- NEVER CANCEL npm run compile (takes ~4 seconds)  
- NEVER CANCEL npm run build (takes ~8 seconds)
- Set timeouts to at least 30 seconds for build commands to avoid premature cancellation

### Development Workflow
1. Make changes to TypeScript files in src/
2. Run `npm run compile` to update lib/ output
3. Run `npm run build` to update dist/ bundles
4. Manually test functionality by including bundles in HTML
5. Check that both CommonJS (lib/common/) and ES modules (lib/esm/) are generated correctly

### Critical Build Dependencies
- Ensure Node.js is available
- Ensure npm is available  
- All required devDependencies are in package.json and will be installed with `npm install`
- The build process requires both TypeScript and Webpack to complete successfully

### No Testing Infrastructure
This repository has NO working test infrastructure. Do not attempt to run tests. Focus on:
1. Successful compilation and building
2. Manual verification of functionality
3. Ensuring built files are generated correctly
4. Checking that exports are available in the built modules