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
exports.XhrElementCompact = exports.XhrElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class XhrElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super();
        this.loaded_ = false;
        this.src_ = '';
        this.clearOn_ = null;
        this.insertedElements_ = null;
        this.target = null;
        this.transitionScope = null;
        this.mode = 'replace';
        this.always = false;
        this.transition = false;
        this.directives = false;
        this.beforeremove = '';
        this.beforeinsert = '';
        this.afterremove = '';
        this.afterinsert = '';
        this.aftertransition = '';
    }
    UpdateSrcProperty(value) {
        const previousSrc = this.src_;
        if (value === 'null') {
            this.src_ = null;
        }
        else if (value === 'undefined') {
            this.src_ = undefined;
        }
        else if (value === 'false') {
            this.src_ = false;
        }
        else {
            this.src_ = value;
        }
        if (this.always || this.src_ !== previousSrc) {
            this.src_ === this.clearOn_ ? this.Clear_() : this.Fetch_();
        }
    }
    UpdateClearOnProperty(value) {
        if (value === 'null') {
            this.clearOn_ = null;
        }
        else if (value === 'undefined') {
            this.clearOn_ = undefined;
        }
        else if (value === 'false') {
            this.clearOn_ = false;
        }
        else {
            this.clearOn_ = value;
        }
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            this.loaded_ = true;
            this.Fetch_();
            postAttributesCallback && postAttributesCallback();
        });
        scope.AddUninitCallback(() => {
            this.insertedElements_ = null;
            this.target = null;
            this.transitionScope = null;
        });
    }
    Fetch_() {
        if (this.loaded_ && this.src_ && typeof this.src_ === 'string') {
            const magicGet = (0, inlinejs_1.EvaluateMagicProperty)(this.componentId_, this, '$get', '$');
            magicGet ? magicGet(this.src_).then((data) => this.HandleData_(data)) : fetch(this.src_).then(res => res.text()).then(data => this.HandleData_(data));
        }
    }
    HandleData_(data) {
        const target = (this.target || this);
        if (this.mode === 'before' || this.mode === 'replacebefore') {
            if (target.parentElement) {
                this.mode === 'replacebefore' && this.Clear_();
                const template = document.createElement('template');
                template.innerHTML = data;
                this.insertedElements_ = Array.from(template.content.children);
                const component = ((0, inlinejs_1.InferComponent)(target.parentElement) || '');
                this.insertedElements_.forEach(child => {
                    target.parentElement.insertBefore(child, target);
                    component && (0, inlinejs_1.ProcessDirectives)({ component, element: child });
                });
            }
        }
        else if (this.mode === 'after' || this.mode === 'replaceafter') {
            if (target.parentElement) {
                this.mode === 'replaceafter' && this.Clear_();
                const template = document.createElement('template');
                template.innerHTML = data;
                this.insertedElements_ = Array.from(template.content.children);
                const component = ((0, inlinejs_1.InferComponent)(target.parentElement) || '');
                this.insertedElements_.forEach(child => {
                    target.parentElement.insertBefore(child, target.nextSibling);
                    component && (0, inlinejs_1.ProcessDirectives)({ component, element: child });
                });
            }
        }
        else {
            (0, inlinejs_1.InsertHtml)({
                component: ((target === this) ? this.componentId_ : ((0, inlinejs_1.InferComponent)(target) || '')),
                element: target,
                html: data,
                type: this.mode,
                useTransition: this.transition,
                processDirectives: this.directives,
                transitionScope: this.transitionScope || undefined,
                beforeRemove: this.beforeremove ? beforeTransition => this.EvaluateExpression(this.beforeremove, {
                    disableFunctionCall: false,
                    params: [data, beforeTransition],
                    contexts: { data, beforeTransition },
                }) : undefined,
                beforeInsert: this.beforeinsert ? () => this.EvaluateExpression(this.beforeinsert, {
                    disableFunctionCall: false,
                    params: [data],
                    contexts: { data },
                }) : undefined,
                afterRemove: this.afterremove ? () => this.EvaluateExpression(this.afterremove, {
                    disableFunctionCall: false,
                    params: [data],
                    contexts: { data },
                }) : undefined,
                afterInsert: this.afterinsert ? () => this.EvaluateExpression(this.afterinsert, {
                    disableFunctionCall: false,
                    params: [data],
                    contexts: { data },
                }) : undefined,
                afterTransitionCallback: this.aftertransition ? () => this.EvaluateExpression(this.aftertransition, {
                    disableFunctionCall: false,
                    params: [data],
                    contexts: { data },
                }) : undefined,
            });
        }
    }
    Clear_() {
        var _a;
        if (this.mode === 'replace') {
            Array.from((this.target || this).children).forEach(child => child.remove());
        }
        (_a = this.insertedElements_) === null || _a === void 0 ? void 0 : _a.forEach(element => element.remove());
        this.insertedElements_ = null;
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], XhrElement.prototype, "target", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], XhrElement.prototype, "transitionScope", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], XhrElement.prototype, "mode", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], XhrElement.prototype, "always", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], XhrElement.prototype, "transition", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], XhrElement.prototype, "directives", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], XhrElement.prototype, "beforeremove", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], XhrElement.prototype, "beforeinsert", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], XhrElement.prototype, "afterremove", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], XhrElement.prototype, "afterinsert", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], XhrElement.prototype, "aftertransition", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], XhrElement.prototype, "UpdateSrcProperty", null);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], XhrElement.prototype, "UpdateClearOnProperty", null);
exports.XhrElement = XhrElement;
function XhrElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(XhrElement, 'xhr');
}
exports.XhrElementCompact = XhrElementCompact;
