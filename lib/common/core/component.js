"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentElementCompact = exports.ComponentElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class ComponentElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super();
        this.name = '';
        this.srcPrefix = '';
        this.src = '';
        this.load = false;
        this.extend = false;
        this.cache = false;
        this.onloaded = '';
        this.onready = '';
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            const component = (0, inlinejs_1.FindComponentById)(this.componentId_);
            if ((component === null || component === void 0 ? void 0 : component.GetRoot()) === this) {
                component.SetName(this.name);
                scope.SetLocal('$name', this.name);
            }
            let src = '';
            if (!this.src && this.srcPrefix) {
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
            postAttributesCallback && postAttributesCallback();
        });
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
exports.ComponentElement = ComponentElement;
function ComponentElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(ComponentElement, 'component');
}
exports.ComponentElementCompact = ComponentElementCompact;
