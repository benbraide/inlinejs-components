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
exports.SketchExportCompact = exports.SketchExport = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const sketch_plugin_1 = require("./sketch-plugin");
class SketchExport extends sketch_plugin_1.SketchPlugin {
    constructor() {
        super('export');
        this.hiddenInput_ = null;
    }
    UpdateNameProperty(value) {
        var _a;
        (_a = this.hiddenInput_) === null || _a === void 0 ? void 0 : _a.setAttribute('name', value);
    }
    HandleEndDraw(params) {
        this.hiddenInput_ && this.canvas_ && (this.hiddenInput_.value = this.canvas_.toDataURL());
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            this.hiddenInput_ = document.createElement('input');
            this.hiddenInput_.type = 'hidden';
            this.hiddenInput_.name = (this.getAttribute('name') || '');
            this.hiddenInput_.value = '';
            this.appendChild(this.hiddenInput_);
            postAttributesCallback && postAttributesCallback();
        });
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], SketchExport.prototype, "UpdateNameProperty", null);
exports.SketchExport = SketchExport;
function SketchExportCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(SketchExport);
}
exports.SketchExportCompact = SketchExportCompact;
