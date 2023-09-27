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
exports.FormElementCompact = exports.FormElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const NativeFormMethods = ['get', 'post', 'head', 'options'];
const NonNativeFormMethods = ['put', 'delete', 'patch'];
class FormElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super();
        this.form_ = null;
        this.formMethod_ = null;
        this.ajax = false;
        this.state = false;
    }
    UpdateMethodProperty(value) {
        this.SetFormMethod_(value);
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        this.form_ = document.createElement('form');
        this.SetNativeElement_(this.form_);
        this.appendChild(this.form_);
        Array.from(this.children).forEach((child) => {
            if (child !== this.nativeElement_ && !(child instanceof inlinejs_element_1.NativeElement)) {
                child.remove();
                this.nativeElement_.appendChild(child);
            }
        });
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            var _a, _b;
            this.ajax && ((_a = this.form_) === null || _a === void 0 ? void 0 : _a.setAttribute((0, inlinejs_1.GetGlobal)().GetConfig().GetDirectiveName('form'), ''));
            this.state && ((_b = this.form_) === null || _b === void 0 ? void 0 : _b.setAttribute((0, inlinejs_1.GetGlobal)().GetConfig().GetDirectiveName('state'), ''));
            postAttributesCallback && postAttributesCallback();
        });
        scope.AddUninitCallback(() => {
            this.form_ = null;
            this.formMethod_ = null;
        });
    }
    SetFormMethod_(method) {
        if (!this.form_) {
            return;
        }
        method = (method || 'get').toLowerCase();
        method = ((NativeFormMethods.includes(method) || NonNativeFormMethods.includes(method)) ? method : 'get');
        const nativeMethod = (NativeFormMethods.includes(method) ? method : 'post');
        if (nativeMethod !== method) { //Add hidden input for non-native methods
            if (!this.formMethod_) { //Create hidden input
                this.formMethod_ = document.createElement('input');
                this.formMethod_.type = 'hidden';
                this.formMethod_.name = '_method';
                this.form_.appendChild(this.formMethod_);
            }
            this.formMethod_.value = method;
        }
        else if (this.formMethod_) { //Remove hidden input
            this.formMethod_.remove();
            this.formMethod_ = null;
        }
        this.form_.method = nativeMethod;
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], FormElement.prototype, "ajax", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], FormElement.prototype, "state", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], FormElement.prototype, "UpdateMethodProperty", null);
exports.FormElement = FormElement;
function FormElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(FormElement, 'form');
}
exports.FormElementCompact = FormElementCompact;
