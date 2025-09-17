# Component Reference

This document provides detailed technical documentation for all InlineJS Components.

## Component Architecture

All InlineJS Components extend the `CustomElement` class and use the `@Property` decorator to define reactive properties. Components are registered using the `RegisterCustomElement` function and have a consistent lifecycle.

### Base Component Features

All components inherit these base features:
- Reactive property binding
- Component scope management
- Element lifecycle hooks
- Expression evaluation
- Storage and proxy access handling

## Core Components

### ComponentElement (`<injs-component>`)

**File:** `src/core/component.ts`  
**Element Tag:** `injs-component`

Dynamically loads and renders component content from external sources.

#### Technical Details

```typescript
class ComponentElement extends CustomElement {
    @Property({ type: 'string' }) name: string
    @Property({ type: 'string' }) srcPrefix: string
    @Property({ type: 'string' }) src: string
    @Property({ type: 'boolean' }) load: boolean
    @Property({ type: 'boolean' }) extend: boolean
    @Property({ type: 'boolean' }) cache: boolean
    @Property({ type: 'string' }) onloaded: string
    @Property({ type: 'string' }) onready: string
    @Property({ type: 'boolean' }) sanitize: boolean
}
```

#### Property Details

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | string | `''` | Component name for dynamic path construction |
| `srcPrefix` | string | `''` | Base URL prefix for component loading |
| `src` | string | `''` | Complete URL to load component from |
| `load` | boolean | `false` | Whether to automatically load the component |
| `extend` | boolean | `false` | Append to existing content (true) vs replace (false) |
| `cache` | boolean | `false` | Use resource cache for loaded content |
| `onloaded` | string | `''` | Expression executed after content loads |
| `onready` | string | `''` | Expression executed after transitions complete |
| `sanitize` | boolean | `false` | Sanitize loaded HTML content |

#### Loading Behavior

1. If `src` is provided, loads from that URL
2. If `name` and `load` are provided, constructs URL from `srcPrefix + '/components/' + name`
3. Default path is `/components/{name}` if no prefix is specified
4. Uses fetch API or resource cache based on `cache` setting

#### Usage Patterns

```html
<!-- Convention-based loading -->
<injs-component name="user-profile" load="true" cache="true"></injs-component>

<!-- Explicit URL loading -->
<injs-component src="/api/widgets/weather" load="true" sanitize="true"></injs-component>

<!-- With callbacks and extending -->
<injs-component name="notifications" load="true" extend="true"
    onloaded="console.log('Notifications loaded')"
    onready="initializeNotifications()">
</injs-component>
```

---

### CodeElement (`<injs-code>`)

**File:** `src/core/code.ts`  
**Element Tag:** `injs-code`

Executes JavaScript code with reactive context and dependency tracking.

#### Technical Details

```typescript
class CodeElement extends CustomElement {
    @Property({ type: 'object', checkStoredObject: true }) context: HTMLElement | null
    @Property({ type: 'string' }) name: string
    @Property({ type: 'string' }) watch: string
    @Property({ type: 'boolean' }) template: boolean
    @Property({ type: 'boolean' }) effect: boolean
}
```

#### Property Details

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `context` | HTMLElement | `null` | Element to use as execution context |
| `name` | string | `''` | Register code block with this name |
| `watch` | string | `''` | Expression to watch for reactive re-execution |
| `template` | boolean | `false` | Store as template (don't execute immediately) |
| `effect` | boolean | `false` | Run as reactive effect with dependency tracking |

#### Execution Modes

1. **Immediate**: Default mode, executes code once on load
2. **Template**: Stores code for later execution via code concept
3. **Effect**: Reactive mode with automatic dependency tracking
4. **Watch**: Executes when watched expression changes

#### Integration with Code Concept

When `name` is provided, registers the code block with the global code concept for reuse:

```javascript
GetGlobal().GetConcept('code')?.AddBlock(name, content);
```

#### Usage Patterns

```html
<!-- Immediate execution -->
<injs-code>
    console.log('Page initialized');
    $refs.counter.textContent = '0';
</injs-code>

<!-- Reactive effect -->
<injs-code effect="true">
    $el.style.backgroundColor = darkMode ? '#333' : '#fff';
</injs-code>

<!-- Watch expression -->
<injs-code watch="user.preferences">
    updateUserInterface(user.preferences);
</injs-code>

<!-- Template for reuse -->
<injs-code name="validate-email" template="true">
    return email.includes('@') && email.includes('.');
</injs-code>
```

---

### ProcessElement (`<injs-process>`)

**File:** `src/core/process.ts`  
**Element Tag:** `injs-process`

Controls when child elements have their InlineJS directives processed.

#### Technical Details

```typescript
class ProcessElement extends CustomElement {
    @Property({ type: 'boolean' }) active: boolean
    
    ProcessDirectivesCallback(callback: () => void): void
}
```

#### Property Details

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `active` | boolean | `false` | Whether directive processing is active |

#### Processing Control

The `ProcessElement` intercepts the normal directive processing flow:
- When `active` is false, child directives are not processed
- Setting `active` to true triggers processing of pending directives
- Useful for conditional activation and performance optimization

#### Usage Patterns

```html
<!-- Conditional processing -->
<injs-process hx-data="{ userReady: false, activate() { this.userReady = true; $process.active = true; } }">
    <div hx-show="userReady">
        <expensive-component hx-data="heavyComputation()"></expensive-component>
    </div>
    <button hx-on:click="activate()">Load Content</button>
</injs-process>

<!-- Permission-based activation -->
<injs-process hx-data="{ hasPermission: false }" 
    hx-bind:active="hasPermission"
    hx-init="checkUserPermissions().then(result => hasPermission = result)">
    <admin-panel></admin-panel>
</injs-process>
```

## DOM Components

### FormElement (`<injs-form>`)

**File:** `src/dom/form.ts`  
**Element Tag:** `injs-form`

Enhanced form wrapper with AJAX capabilities and method spoofing.

#### Technical Details

Creates a native `<form>` element and moves all child elements into it, providing enhanced functionality through InlineJS directives.

#### HTTP Method Support

- **Native methods**: GET, POST, HEAD, OPTIONS
- **Spoofed methods**: PUT, DELETE, PATCH (via hidden `_method` input)

#### AJAX Integration

When `ajax="true"`, automatically applies InlineJS form directive with modifiers:

```javascript
let directive = 'hx-form';
this.refresh && (directive += '.refresh');
this.reload && (directive += '.reload');
// ... other modifiers
this.form_.setAttribute(directive, '');
```

#### Usage Patterns

```html
<!-- Basic AJAX form -->
<injs-form ajax="true" action="/api/users" method="post">
    <input type="text" name="username" required>
    <button type="submit">Create User</button>
</injs-form>

<!-- File upload with progress -->
<injs-form ajax="true" upload="true" method="post" 
    beforesubmit="showProgressBar()"
    aftersubmit="hideProgressBar()">
    <input type="file" name="document" accept=".pdf">
    <button type="submit">Upload</button>
</injs-form>

<!-- RESTful operations -->
<injs-form ajax="true" method="put" reset="true">
    <input type="hidden" name="id" value="123">
    <input type="text" name="title" value="Current Title">
    <button type="submit">Update</button>
</injs-form>
```

---

### EventElement (`<injs-event>`)

**File:** `src/dom/event.ts`  
**Element Tag:** `injs-event`

Comprehensive event handling with advanced filtering and modifier support.

#### Technical Details

Provides a declarative way to handle events with extensive customization options including:
- Event filtering and key combinations
- Mobile event mapping
- Debouncing and throttling
- Outside event detection
- Modifier key requirements

#### Mobile Event Mapping

```javascript
const mobileMap = {
    click: 'touchend',
    mouseup: 'touchend', 
    mousedown: 'touchstart',
    mousemove: 'touchmove'
};
```

#### Key Filtering

Supports multiple key filtering approaches:
- `keys`: Specific key names
- `alpha`: Alphabetic characters only
- `digit`: Numeric digits only
- `esc`: Escape key only

#### Usage Patterns

```html
<!-- Keyboard shortcuts -->
<injs-event type="keydown" ctrl="true" keys="['s', 'S']" prevent="true">
    saveDocument();
</injs-event>

<!-- Mobile-optimized events -->
<injs-event type="click" mobile="true" target="#menu-button">
    toggleMobileMenu();
</injs-event>

<!-- Debounced search -->
<injs-event type="input" target="#search" debounce="300">
    performSearch($event.target.value);
</injs-event>

<!-- Outside click detection -->
<injs-event type="click" outside="true" target="#modal">
    closeModal();
</injs-event>

<!-- Complex event filtering -->
<injs-event type="keydown" 
    filter="$event.key.length === 1 && /[a-zA-Z]/.test($event.key)"
    throttle="100">
    handleTyping($event.key);
</injs-event>
```

---

### ImageElement (`<injs-image>`)

**File:** `src/dom/image.ts`  
**Element Tag:** `injs-image`

Enhanced image component with lazy loading, fitting, and responsive features.

#### Technical Details

Creates a native `<img>` element with additional functionality:
- Intersection Observer for lazy loading
- Resize Observer for responsive fitting
- Automatic aspect ratio preservation
- Loading state management

#### Fitting Algorithm

```javascript
const getRatio = (width, height) => 
    (this.fitType_ === 'cover') ? Math.max(width, height) : Math.min(width, height);
const ratio = getRatio(
    (containerSize.width / imageSize.width), 
    (containerSize.height / imageSize.height)
);
```

#### Usage Patterns

```html
<!-- Lazy loading with threshold -->
<injs-image src="/images/hero.jpg" lazy="true" lazy-threshold="0.3">
</injs-image>

<!-- Responsive fitting -->
<div style="width: 300px; height: 200px;">
    <injs-image src="/images/banner.jpg" fit="true" fit-type="cover">
    </injs-image>
</div>

<!-- Custom lazy loading options -->
<injs-image src="/images/gallery.jpg" lazy="true"
    lazy-options="{ rootMargin: '50px', threshold: [0, 0.5, 1] }">
</injs-image>
```

---

### ScriptElement (`<injs-script>`)

**File:** `src/dom/script.ts`  
**Element Tag:** `injs-script`

Dynamic script loading and execution.

#### Usage Patterns

```html
<!-- External script -->
<injs-script src="/js/analytics.js"></injs-script>

<!-- Inline script -->
<injs-script>
    window.customFunction = function() {
        console.log('Custom function loaded');
    };
</injs-script>
```

---

### StyleElement (`<injs-style>`)

**File:** `src/dom/style.ts`  
**Element Tag:** `injs-style`

Dynamic CSS injection from external files or inline content.

#### Usage Patterns

```html
<!-- External stylesheet -->
<injs-style src="/css/theme-dark.css"></injs-style>

<!-- Inline styles -->
<injs-style>
    .dynamic-class {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        animation: fadeIn 0.3s ease-in;
    }
</injs-style>
```

---

### AttributeEventElement (`<injs-attribute-event>`)

**File:** `src/dom/attribute-event.ts`  
**Element Tag:** `injs-attribute-event`

Sets native HTML event attributes on target elements.

#### Usage Patterns

```html
<!-- Set onclick attribute -->
<button id="my-button">Click Me</button>
<injs-attribute-event type="click" target="#my-button">
    alert('Button clicked via attribute!');
</injs-attribute-event>

<!-- Multiple events -->
<input id="my-input" type="text">
<injs-attribute-event type="['focus', 'blur']" target="#my-input">
    console.log('Input event:', event.type);
</injs-attribute-event>
```

## Extended Components

### XhrElement (`<injs-xhr>`)

**File:** `src/extended/xhr.ts`  
**Element Tag:** `injs-xhr`

Advanced XHR functionality with multiple insertion modes and transitions.

#### Insertion Modes

- `replace`: Replace target content (default)
- `append`: Append to target content
- `prepend`: Prepend to target content  
- `before`: Insert before target element
- `after`: Insert after target element
- `replacebefore`: Clear and insert before target
- `replaceafter`: Clear and insert after target

#### Usage Patterns

```html
<!-- Basic content replacement -->
<div id="content"></div>
<injs-xhr src="/api/content" target="#content" mode="replace">
</injs-xhr>

<!-- Infinite scroll -->
<div id="posts"></div>
<injs-xhr src="/api/posts" target="#posts" mode="append"
    beforeinsert="showLoader()"
    afterinsert="hideLoader()">
</injs-xhr>

<!-- Conditional loading -->
<injs-xhr hx-data="{ endpoint: null }"
    hx-bind:src="endpoint"
    clear-on="null"
    transition="true">
</injs-xhr>
```

---

### XhrSelectElement (`<injs-xhr-select>`)

**File:** `src/extended/xhr-select.ts`  
**Element Tag:** `injs-xhr-select`

Specialized XHR component for populating select elements with JSON data.

#### Data Format Support

```javascript
// Simple array
["Option 1", "Option 2", "Option 3"]

// Object with key-value pairs
{"us": "United States", "ca": "Canada"}

// Detailed objects
[
    {"value": "us", "text": "United States"},
    {"value": "ca", "text": "Canada"}
]
```

#### Usage Patterns

```html
<!-- Country/state cascade -->
<select id="country" hx-on:change="updateStates($event.target.value)">
    <option value="">Select Country</option>
    <option value="us">United States</option>
    <option value="ca">Canada</option>
</select>

<injs-xhr-select id="state" mode="replace">
    <option value="">Select State</option>
</injs-xhr-select>

<script>
function updateStates(country) {
    document.getElementById('state').src = `/api/states/${country}`;
}
</script>
```

---

### OverlayElement (`<injs-overlay>`)

**File:** `src/extended/overlay.ts`  
**Element Tag:** `injs-overlay`

Modal overlay management with visibility tracking and custom events.

#### Event System

```javascript
// Events fired by overlay
window.addEventListener('overlay.click', (e) => {
    // e.detail: { native: MouseEvent, overlay: OverlayElement, bubbled: boolean }
});

window.addEventListener('overlay.visibility', (e) => {
    // e.detail: { overlay: OverlayElement, isVisible: boolean }
});
```

#### Public Methods

```javascript
const overlay = document.querySelector('injs-overlay');
overlay.Show();           // Increment show count and display
overlay.Hide();           // Decrement show count, hide if zero
overlay.SetShowCount(5);  // Set exact count
overlay.GetShowCount();   // Get current count
overlay.IsVisible();      // Check visibility state
```

#### Usage Patterns

```html
<!-- Modal dialog -->
<injs-overlay hx-data="{ showModal: false }" 
    hx-show="showModal"
    hx-on:overlay.click="if (!$event.detail.bubbled) showModal = false">
    <div class="modal-content" hx-on:click.stop>
        <h2>Modal Title</h2>
        <p>Modal content here</p>
        <button hx-on:click="showModal = false">Close</button>
    </div>
</injs-overlay>

<!-- Notification overlay -->
<injs-overlay custom="true" z-index="2000" 
    visible-class="notification-visible">
    <div class="notification">
        <p>Important message!</p>
    </div>
</injs-overlay>
```

---

### ProgressFetchElement (`<injs-progress-fetch>`)

**File:** `src/extended/fetch.ts`  
**Element Tag:** `injs-progress-fetch`

Fetch implementation with progress tracking for upload and download operations.

#### Progress Calculation

- Upload progress: 0% to 50% of total progress
- Download progress: 50% to 100% of total progress  
- Simulated progress between events using configurable seed values

#### Implementation Details

```typescript
interface IProgressHandlers {
    download(e: ProgressEvent): void;
    upload(e: ProgressEvent): void;
    success(data: string): void;
    error(err: string, code: number): void;
}
```

#### Usage Patterns

```html
<!-- Global progress fetch -->
<injs-progress-fetch>
    updateGlobalProgress(progress * 100);
</injs-progress-fetch>

<!-- Component-specific progress -->
<div hx-data="{ uploadProgress: 0 }">
    <injs-progress-fetch cycle="50" 
        oncustomprogress="uploadProgress = progress * 100">
    </injs-progress-fetch>
    
    <div class="progress-bar">
        <div class="progress-fill" 
            hx-bind:style="`width: ${uploadProgress}%`">
        </div>
    </div>
</div>

<!-- Deferred activation -->
<injs-progress-fetch defer="true" hx-ref="progressFetch">
    showProgressIndicator(progress);
</injs-progress-fetch>

<button hx-on:click="$refs.progressFetch.Mount()">
    Enable Progress Tracking
</button>
```

## Performance Considerations

### Memory Management
- Components automatically clean up event listeners and observers
- Use `HandleElementScopeDestroyed_` for custom cleanup
- Avoid memory leaks by properly removing DOM references

### Optimization Tips
- Use lazy loading for images below the fold
- Implement debouncing for high-frequency events
- Cache component content when appropriate
- Use `passive: true` for scroll and touch events

### Bundle Size
- Individual components can be imported selectively
- Tree shaking eliminates unused components in modern bundlers
- Use the minified bundle for production deployments

## Browser Compatibility

### Required APIs
- Custom Elements v1
- Web Components
- Intersection Observer (for lazy loading)
- Resize Observer (for responsive fitting)
- Fetch API
- Proxy objects

### Polyfill Support
Consider polyfills for older browsers:
- `@webcomponents/custom-elements` for Custom Elements
- `intersection-observer` for Intersection Observer
- `resize-observer-polyfill` for Resize Observer

## Testing Strategies

### Unit Testing
```javascript
// Example component test
describe('ComponentElement', () => {
    let element;
    
    beforeEach(() => {
        element = document.createElement('injs-component');
        document.body.appendChild(element);
    });
    
    afterEach(() => {
        element.remove();
    });
    
    it('should load content when src is set', async () => {
        element.src = '/test/content.html';
        element.load = true;
        
        // Wait for content to load
        await new Promise(resolve => {
            element.onloaded = 'resolve()';
        });
        
        expect(element.innerHTML).toContain('expected content');
    });
});
```

### Integration Testing
- Test component interactions with InlineJS framework
- Verify event handling and state management
- Test responsive behavior across different screen sizes

### End-to-End Testing
- Test complete user workflows
- Verify accessibility compliance
- Test across different browsers and devices