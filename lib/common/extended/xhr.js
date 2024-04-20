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
        this.target = null;
        this.mode = 'replace';
        this.always = false;
    }
    UpdateSrcProperty(value) {
        if (this.always || this.src_ !== value) {
            this.src_ = value;
            this.Fetch_();
        }
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            this.loaded_ = true;
            this.Fetch_();
            postAttributesCallback && postAttributesCallback();
        });
    }
    Fetch_() {
        if (this.loaded_ && this.src_) {
            const magicGet = (0, inlinejs_1.EvaluateMagicProperty)(this.componentId_, this, '$get', '$');
            magicGet ? magicGet(this.src_).then((data) => this.HandleData_(data)) : fetch(this.src_).then(res => res.text()).then(data => this.HandleData_(data));
        }
    }
    HandleData_(data) {
        const target = (this.target || this);
        if (this.mode === 'before') {
            const template = document.createElement('template');
            template.innerHTML = data;
            if (target.parentElement) {
                Array.from(template.content.children).forEach(child => target.parentElement.insertBefore(child, target));
                (0, inlinejs_1.ProcessDirectives)({
                    component: ((0, inlinejs_1.InferComponent)(target.parentElement) || ''),
                    element: target.parentElement,
                });
            }
        }
        else if (this.mode === 'after') {
            const template = document.createElement('template');
            template.innerHTML = data;
            if (target.parentElement) {
                Array.from(template.content.children).forEach(child => target.parentElement.insertBefore(child, target.nextSibling));
                (0, inlinejs_1.ProcessDirectives)({
                    component: ((0, inlinejs_1.InferComponent)(target.parentElement) || ''),
                    element: target.parentElement,
                });
            }
        }
        else {
            (0, inlinejs_1.InsertHtml)({
                component: ((target === this) ? this.componentId_ : ((0, inlinejs_1.InferComponent)(target) || '')),
                element: target,
                html: data,
                type: this.mode,
                afterTransitionCallback: () => { }, //Enable transitions
            });
        }
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], XhrElement.prototype, "target", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], XhrElement.prototype, "mode", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], XhrElement.prototype, "always", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], XhrElement.prototype, "UpdateSrcProperty", null);
exports.XhrElement = XhrElement;
function XhrElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(XhrElement, 'xhr');
}
exports.XhrElementCompact = XhrElementCompact;
