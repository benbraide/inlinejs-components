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
exports.SketchPlugin = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const inlinejs_1 = require("@benbraide/inlinejs");
class SketchPlugin extends inlinejs_element_1.CustomElement {
    constructor(name) {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.canvas_ = null;
        this.name = '';
        this.disabled = false;
        this.name = (name || '');
    }
    GetName() {
        return this.name;
    }
    SetCanvas(canvas) {
        this.canvas_ = canvas;
    }
    Handle(_a) {
        var { stage } = _a, rest = __rest(_a, ["stage"]);
        if (this.disabled) {
            return;
        }
        switch (stage) {
            case 'begin': return this.HandleBeginDraw(Object.assign({ stage }, rest));
            case 'end': return this.HandleEndDraw(Object.assign({ stage }, rest));
            case 'draw': return this.HandleDraw(Object.assign({ stage }, rest));
        }
    }
    HandleBeginDraw(params) { }
    HandleEndDraw(params) { }
    HandleDraw(params) { }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            const ancestor = (0, inlinejs_1.FindAncestor)(this, ancestor => ('AddPlugin' in ancestor));
            ancestor && ancestor.AddPlugin(this);
            postAttributesCallback && postAttributesCallback();
        });
        scope.AddUninitCallback(() => {
            this.canvas_ = null;
            const ancestor = (0, inlinejs_1.FindAncestor)(this, ancestor => ('RemovePlugin' in ancestor));
            ancestor && ancestor.RemovePlugin(this);
        });
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], SketchPlugin.prototype, "name", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], SketchPlugin.prototype, "disabled", void 0);
exports.SketchPlugin = SketchPlugin;
