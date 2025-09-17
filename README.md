# InlineJS Components

HTML5 extension components for the InlineJS reactive framework.

## Overview

InlineJS Components provides a comprehensive set of custom HTML elements that extend the functionality of the InlineJS reactive framework. These components offer advanced features for dynamic content loading, event handling, form management, and more.

## Installation

```bash
npm install @benbraide/inlinejs-components
```

## Usage

```javascript
import { InlineJSComponents } from '@benbraide/inlinejs-components';

// Initialize all components
InlineJSComponents();
```

Or include the built JavaScript file directly:

```html
<script src="dist/inlinejs-components.min.js"></script>
```

## Available Components

### Core Components

#### `<injs-component>` - Dynamic Component Loader

Loads and renders components dynamically from external sources.

**Properties:**
- `name` (string): The name of the component to load
- `src-prefix` (string): URL prefix for component loading
- `src` (string): Full URL to load the component from
- `load` (boolean): Whether to automatically load the component
- `extend` (boolean): Whether to append to existing content (true) or replace (false)
- `cache` (boolean): Whether to cache the loaded component
- `onloaded` (string): Expression to execute after content is loaded
- `onready` (string): Expression to execute after transitions complete
- `sanitize` (boolean): Whether to sanitize the loaded HTML

**Usage Examples:**

```html
<!-- Load a component by name -->
<injs-component name="header" load="true" src-prefix="/components"></injs-component>

<!-- Load from a specific URL -->
<injs-component src="/templates/navbar.html" load="true" sanitize="true"></injs-component>

<!-- Load with callbacks -->
<injs-component name="modal" load="true" 
    onloaded="console.log('Modal loaded')" 
    onready="$modal.show()">
</injs-component>
```

#### `<injs-code>` - JavaScript Code Execution

Executes JavaScript code with specified context and reactivity options.

**Properties:**
- `context` (HTMLElement): The element to use as execution context
- `name` (string): Name to register the code block under
- `watch` (string): Expression to watch for changes
- `template` (boolean): Whether this is a template (doesn't execute immediately)
- `effect` (boolean): Whether to run as a reactive effect

**Usage Examples:**

```html
<!-- Execute code immediately -->
<injs-code>
    console.log('Hello from InlineJS!');
</injs-code>

<!-- Watch for changes -->
<injs-code watch="user.name">
    document.title = `Welcome ${user.name}`;
</injs-code>

<!-- Create a named code block -->
<injs-code name="validation" template="true">
    return email.includes('@') && email.includes('.');
</injs-code>

<!-- Reactive effect -->
<injs-code effect="true">
    $el.textContent = `Count: ${count}`;
</injs-code>
```

#### `<injs-process>` - Processing Control

Controls the timing of directive processing for its children.

**Properties:**
- `active` (boolean): Whether processing is active

**Usage Examples:**

```html
<!-- Delay processing until activated -->
<injs-process hx-data="{ ready: false }">
    <div hx-show="ready">
        <p>This content is processed only when ready</p>
    </div>
    <button hx-on:click="ready = true; $process.active = true">
        Activate
    </button>
</injs-process>
```

### DOM Components

#### `<injs-form>` - Enhanced Form Handling

Creates enhanced forms with AJAX support and additional features.

**Properties:**
- `ajax` (boolean): Enable AJAX form submission
- `state` (boolean): Enable state management
- `refresh` (boolean): Refresh page after submission
- `reload` (boolean): Reload page after submission
- `reset` (boolean): Reset form after submission
- `novalidate` (boolean): Disable form validation
- `silent` (boolean): Silent submission (no loading indicators)
- `upload` (boolean): Enable file upload support
- `download` (boolean): Handle download responses
- `duplex` (boolean): Enable duplex communication
- `blob` (boolean): Handle blob responses
- `save` (boolean): Save form data
- `method` (string): HTTP method (get, post, put, delete, patch, etc.)

**Usage Examples:**

```html
<!-- Basic AJAX form -->
<injs-form ajax="true" method="post">
    <input type="text" name="username" required>
    <input type="email" name="email" required>
    <button type="submit">Submit</button>
</injs-form>

<!-- Upload form -->
<injs-form ajax="true" upload="true" method="post">
    <input type="file" name="document" accept=".pdf,.doc">
    <button type="submit">Upload</button>
</injs-form>

<!-- Form with custom method -->
<injs-form ajax="true" method="patch" reset="true">
    <input type="hidden" name="id" value="123">
    <input type="text" name="title">
    <button type="submit">Update</button>
</injs-form>
```

#### `<injs-event>` - Advanced Event Handling

Provides comprehensive event handling with modifiers and filtering.

**Properties:**
- `target` (HTMLElement): Event target element
- `context` (HTMLElement): Execution context element
- `type` (string|Array): Event type(s) to listen for
- `outside` (boolean): Listen for events outside the target
- `directive` (boolean): Handle as a directive
- `once` (boolean): Execute only once
- `debounce` (number): Debounce delay in milliseconds
- `throttle` (number): Throttle delay in milliseconds
- `prevent` (boolean): Prevent default behavior
- `stop` (boolean): Stop event propagation
- `stop-immediate` (boolean): Stop immediate propagation
- `window` (boolean): Listen on window object
- `document` (boolean): Listen on document object
- `parent` (boolean): Listen on parent element
- `passive` (boolean): Use passive event listener
- `mobile` (boolean): Map to mobile events
- `self` (boolean): Only trigger if target is the element itself
- `modifiers` (Array): Modifier keys required
- `ctrl` (boolean): Require Ctrl key
- `alt` (boolean): Require Alt key
- `shift` (boolean): Require Shift key
- `meta` (boolean): Require Meta key
- `filter` (function|string): Event filter function/expression
- `keys` (Array|string): Required key(s)
- `alpha` (boolean): Only alphabetic keys
- `digit` (boolean): Only digit keys
- `esc` (boolean): Only escape key

**Usage Examples:**

```html
<!-- Basic click handler -->
<injs-event type="click">
    console.log('Clicked!');
</injs-event>

<!-- Keyboard shortcuts -->
<injs-event type="keydown" ctrl="true" keys="s" prevent="true">
    save();
</injs-event>

<!-- Debounced input -->
<injs-event type="input" debounce="300">
    search($event.target.value);
</injs-event>

<!-- Outside click -->
<injs-event type="click" outside="true">
    closeModal();
</injs-event>

<!-- Mobile-friendly events -->
<injs-event type="click" mobile="true">
    handleTouch();
</injs-event>
```

#### `<injs-image>` - Enhanced Image Loading

Provides enhanced image loading with lazy loading and fitting options.

**Properties:**
- `lazy-options` (object): Intersection observer options for lazy loading
- `lazy-threshold` (number): Intersection threshold (default: 0.90)
- `lazy` (boolean): Enable lazy loading
- `parent` (boolean): Use parent dimensions for fitting
- `src` (string): Image source URL
- `fit` (boolean): Enable image fitting
- `fit-type` (string): Fit type ('contain' or 'cover')

**Usage Examples:**

```html
<!-- Basic lazy-loaded image -->
<injs-image src="/images/hero.jpg" lazy="true">
</injs-image>

<!-- Fitted image -->
<injs-image src="/images/banner.jpg" fit="true" fit-type="cover" 
    style="width: 100%; height: 300px;">
</injs-image>

<!-- Lazy with custom threshold -->
<injs-image src="/images/gallery-1.jpg" lazy="true" lazy-threshold="0.5">
</injs-image>

<!-- Use parent dimensions -->
<div style="width: 200px; height: 200px;">
    <injs-image src="/images/profile.jpg" fit="true" parent="true">
    </injs-image>
</div>
```

#### `<injs-script>` - Dynamic Script Loading

Dynamically loads and executes JavaScript files or inline scripts.

**Properties:**
- `src` (string): External script URL

**Usage Examples:**

```html
<!-- Load external script -->
<injs-script src="/js/analytics.js"></injs-script>

<!-- Inline script -->
<injs-script>
    console.log('Script executed!');
    initializeApp();
</injs-script>
```

#### `<injs-style>` - Dynamic CSS Injection

Dynamically injects CSS styles from external files or inline content.

**Properties:**
- `src` (string): External CSS file URL

**Usage Examples:**

```html
<!-- Load external stylesheet -->
<injs-style src="/css/theme.css"></injs-style>

<!-- Inline styles -->
<injs-style>
    .highlight {
        background-color: yellow;
        padding: 0.2em;
    }
</injs-style>
```

#### `<injs-attribute-event>` - Attribute Event Handler

Sets event handlers as HTML attributes on target elements.

**Properties:**
- `target` (HTMLElement): Target element for the attribute
- `context` (HTMLElement): Execution context
- `type` (string|Array): Event type(s) for the attributes

**Usage Examples:**

```html
<!-- Set onclick attribute -->
<injs-attribute-event type="click" target="#button1">
    alert('Button clicked!');
</injs-attribute-event>

<!-- Multiple event types -->
<injs-attribute-event type="['focus', 'blur']" target=".form-input">
    console.log('Input ' + event.type);
</injs-attribute-event>
```

### Extended Components

#### `<injs-xhr>` - Advanced XHR Handling

Provides advanced XHR functionality with transitions and multiple insertion modes.

**Properties:**
- `target` (HTMLElement): Target element for content insertion
- `transition-scope` (HTMLElement): Element to scope transitions to
- `mode` (string): Insertion mode ('replace', 'append', 'prepend', 'before', 'after', 'replacebefore', 'replaceafter')
- `always` (boolean): Always fetch regardless of source changes
- `transition` (boolean): Use transitions for content changes
- `directives` (boolean): Process InlineJS directives in loaded content
- `beforeremove` (string): Expression to execute before removing content
- `beforeinsert` (string): Expression to execute before inserting content
- `afterremove` (string): Expression to execute after removing content
- `afterinsert` (string): Expression to execute after inserting content
- `aftertransition` (string): Expression to execute after transitions complete
- `src` (string): URL to fetch content from
- `clear-on` (string): Value that triggers content clearing

**Usage Examples:**

```html
<!-- Basic content loading -->
<injs-xhr src="/api/content" mode="replace">
</injs-xhr>

<!-- With transitions -->
<injs-xhr src="/api/news" mode="append" transition="true" 
    afterinsert="console.log('News loaded')">
</injs-xhr>

<!-- Conditional loading -->
<injs-xhr hx-data="{ url: null }" 
    hx-bind:src="url" 
    clear-on="null"
    beforeinsert="showLoader(false)">
</injs-xhr>

<!-- Insert relative to element -->
<div id="content"></div>
<injs-xhr src="/api/sidebar" mode="after" target="#content">
</injs-xhr>
```

#### `<injs-xhr-select>` - XHR-Powered Select

Creates select dropdowns populated via XHR requests with JSON data.

**Properties:**
Inherits all properties from `<injs-xhr>`, but specialized for select element content.

**Usage Examples:**

```html
<!-- Basic select population -->
<injs-xhr-select src="/api/countries" mode="replace">
</injs-xhr-select>

<!-- Append new options -->
<injs-xhr-select src="/api/more-options" mode="append">
    <option value="">Select an option...</option>
</injs-xhr-select>

<!-- Dynamic loading based on another select -->
<select hx-on:change="$refs.cities.src = '/api/cities/' + $event.target.value">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
</select>
<injs-xhr-select hx-ref="cities" mode="replace">
    <option value="">Select a city...</option>
</injs-xhr-select>
```

Expected JSON format:
```json
// Array format
["Option 1", "Option 2", "Option 3"]

// Object format  
{"value1": "Display Text 1", "value2": "Display Text 2"}

// Detailed format
[
    {"value": "us", "text": "United States"},
    {"value": "ca", "text": "Canada"}
]
```

#### `<injs-overlay>` - Overlay Management

Manages overlay visibility with show/hide functionality and styling.

**Properties:**
- `visible-class` (string): CSS class applied when overlay is visible (default: 'overlay')
- `overflow-class` (string): CSS class applied for overflow handling (default: 'overflow')
- `visible-target` (HTMLElement): Element to apply classes to (default: document.body)
- `custom` (boolean): Skip default overlay styling
- `z-index` (number): Z-index value (default: 999)
- `width` (string): Overlay width when visible (default: '100vw')

**Usage Examples:**

```html
<!-- Basic overlay -->
<injs-overlay hx-data="{ showModal: false }" 
    hx-show="showModal"
    hx-on:overlay.click="showModal = false">
    <div class="modal">
        <h2>Modal Content</h2>
        <button hx-on:click="showModal = false">Close</button>
    </div>
</injs-overlay>

<!-- Custom styled overlay -->
<injs-overlay custom="true" z-index="1000" 
    visible-class="custom-overlay-visible">
    <div class="custom-modal">
        Custom overlay content
    </div>
</injs-overlay>

<!-- Overlay with custom target -->
<div id="modal-container">
    <injs-overlay visible-target="#modal-container">
        Content here
    </injs-overlay>
</div>
```

#### `<injs-progress-fetch>` - Progress-Aware Fetch

Provides fetch functionality with progress tracking capabilities.

**Properties:**
- `defer` (boolean): Defer mounting as global fetch concept
- `cycle` (number): Progress update cycle in milliseconds (default: 100)
- `seed` (number): Random progress increment seed (default: 0.045)
- `start` (number): Initial progress value (default: 0.036)
- `oncustomprogress` (string): Expression to execute on progress updates

**Usage Examples:**

```html
<!-- Basic progress fetch -->
<injs-progress-fetch>
    updateProgressBar(progress * 100);
</injs-progress-fetch>

<!-- Custom progress handling -->
<injs-progress-fetch cycle="50" seed="0.02" 
    oncustomprogress="$refs.progressBar.style.width = (progress * 100) + '%'">
</injs-progress-fetch>

<!-- Deferred mounting -->
<injs-progress-fetch defer="true" hx-data="{ enableProgress: false }">
    if (enableProgress) $el.Mount();
    setProgress(progress);
</injs-progress-fetch>
```

## Events

### Global Events

#### Overlay Events
- `overlay.click` - Fired when overlay is clicked
- `overlay.visibility` - Fired when overlay visibility changes  
- `overlay.visible` - Fired when overlay becomes visible
- `overlay.hidden` - Fired when overlay becomes hidden

```javascript
// Listen for overlay events
window.addEventListener('overlay.click', (e) => {
    console.log('Overlay clicked:', e.detail);
});

window.addEventListener('overlay.visibility', (e) => {
    console.log('Visibility changed:', e.detail.isVisible);
});
```

## Best Practices

### Performance
- Use lazy loading for images that are not immediately visible
- Implement debouncing for frequently triggered events
- Cache component content when appropriate
- Use transitions sparingly for better performance

### Security
- Always sanitize content when loading from external sources
- Validate form data on both client and server
- Use CSP headers when loading external scripts and styles

### Accessibility
- Provide proper alt text for images
- Ensure keyboard navigation works with custom event handlers
- Use semantic HTML within your components
- Test with screen readers

### Development
- Use descriptive names for components
- Implement proper error handling in event handlers
- Test components across different browsers and devices
- Document custom implementations and extensions

## Browser Support

InlineJS Components supports all modern browsers that support:
- ES6+ features
- Custom Elements v1
- Web Components
- Intersection Observer API (for lazy loading)

## Contributing

Contributions are welcome! Please read the contributing guidelines and submit pull requests to the main repository.

## License

MIT License - see LICENSE file for details.
