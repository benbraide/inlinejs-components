"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentElementCompact = exports.ComponentElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
/**
 * ComponentElement - Dynamic component loader for InlineJS
 *
 * Loads and renders component content dynamically from external sources.
 * Supports caching, sanitization, callbacks, and automatic URL construction.
 *
 * @example
 * ```html
 * <!-- Load by name with prefix -->
 * <injs-component name="header" load="true" src-prefix="/components"></injs-component>
 *
 * <!-- Load from specific URL -->
 * <injs-component src="/templates/navbar.html" load="true" sanitize="true"></injs-component>
 *
 * <!-- With callbacks -->
 * <injs-component name="modal" load="true" onloaded="console.log('loaded')" onready="$modal.show()"></injs-component>
 * ```
 */
class ComponentElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super();
        /** Component name for automatic URL construction */
        this.name = '';
        /** URL prefix for component loading when using name-based loading */
        this.srcPrefix = '';
        /** Complete URL to load component content from */
        this.src = '';
        /** Whether to automatically load the component */
        this.load = false;
        /** Whether to append to existing content (true) or replace it (false) */
        this.extend = false;
        /** Whether to use resource caching for loaded content */
        this.cache = false;
        /** Expression to execute after content is loaded */
        this.onloaded = '';
        /** Expression to execute after transitions are complete */
        this.onready = '';
        /** Whether to sanitize the loaded HTML content */
        this.sanitize = false;
    }
    HandlePostAttributesProcessPostfix_() {
        super.HandlePostAttributesProcessPostfix_();
        const component = (0, inlinejs_1.FindComponentById)(this.componentId_);
        if (!component)
            return;
        const scope = component.FindElementScope(this);
        if (!scope)
            return;
        if ((component === null || component === void 0 ? void 0 : component.GetRoot()) === this) {
            component.SetName(this.name);
            scope.SetLocal('$name', this.name);
        }
        let src = '';
        if (!this.src && this.load && this.srcPrefix) {
            src = (this.srcPrefix.endsWith('/') ? `${this.srcPrefix}components/${this.name}` : `${this.srcPrefix}/components/${this.name}`);
            src = (src.startsWith('/') ? src : `/${src}`);
        }
        else {
            src = (this.src || (this.load ? `/components/${this.name}` : ''));
        }
        if (src) { //Load component
            const insertText = (text) => {
                const insert = () => (0, inlinejs_1.InsertHtml)({
                    type: (this.extend ? 'append' : 'replace'),
                    component: this.componentId_,
                    element: this,
                    html: text,
                    sanitize: this.sanitize,
                    afterInsert: () => (this.onloaded && this.EvaluateExpression(this.onloaded, { disableFunctionCall: false })),
                    afterTransitionCallback: () => (this.onready && this.EvaluateExpression(this.onready, { disableFunctionCall: false })),
                });
                this.storedProxyAccessHandler_ ? this.storedProxyAccessHandler_(insert) : insert();
            };
            const resourceConcept = (this.cache ? (0, inlinejs_1.GetGlobal)().GetConcept('resource') : null);
            if (!resourceConcept) {
                (0, inlinejs_1.GetGlobal)().GetFetchConcept().Get(src, {
                    method: 'GET',
                    credentials: 'same-origin',
                }).then(res => res.text()).then(insertText);
            }
            else { //Use resource
                resourceConcept.GetData(src).then((data) => {
                    Array.isArray(data) ? insertText(data[0] || '') : insertText(data);
                });
            }
        }
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], ComponentElement.prototype, "name", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], ComponentElement.prototype, "srcPrefix", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], ComponentElement.prototype, "src", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], ComponentElement.prototype, "load", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], ComponentElement.prototype, "extend", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], ComponentElement.prototype, "cache", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], ComponentElement.prototype, "onloaded", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], ComponentElement.prototype, "onready", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], ComponentElement.prototype, "sanitize", void 0);
exports.ComponentElement = ComponentElement;
/**
 * Register the ComponentElement as a custom element with tag name 'component'
 * Call this function to make <injs-component> elements available in the DOM
 */
function ComponentElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(ComponentElement, 'component');
}
exports.ComponentElementCompact = ComponentElementCompact;
