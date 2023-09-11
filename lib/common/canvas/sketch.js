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
exports.SketchCompact = exports.Sketch = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class Sketch extends inlinejs_element_1.CustomElement {
    constructor() {
        super();
        this.shadow_ = null;
        this.ctx_ = null;
        this.isDrawing_ = false;
        this.plugins_ = {};
        this.plugin = '';
        this.disabled = false;
        this.style.display = 'flex';
    }
    UpdateWidthProperty(value) {
        var _a;
        this.style.width = `${value}px`;
        (_a = this.shadow_) === null || _a === void 0 ? void 0 : _a.setAttribute('width', (0, inlinejs_1.ToString)(value));
    }
    UpdateHeightProperty(value) {
        var _a;
        this.style.height = `${value}px`;
        (_a = this.shadow_) === null || _a === void 0 ? void 0 : _a.setAttribute('height', (0, inlinejs_1.ToString)(value));
    }
    GetContext() {
        return this.ctx_;
    }
    GetNative() {
        return this.shadow_;
    }
    GetBlob(type = 'image/png') {
        return (this.shadow_ ? new Promise(resolve => this.shadow_.toBlob(blob => resolve(blob), type)) : null);
    }
    GetDataUrl(type = 'image/png') {
        return (this.shadow_ ? this.shadow_.toDataURL(type) : '');
    }
    AddPlugin(plugin) {
        const name = plugin.GetName();
        this.plugins_[name] || (this.plugins_[name] = []);
        this.plugins_[name].push(plugin);
        plugin.SetCanvas(this.shadow_);
    }
    RemovePlugin(plugin) {
        Object.entries(this.plugins_).forEach(([name, plugins]) => {
            this.plugins_[name] = plugins.filter(p => (p !== plugin));
        });
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), postAttributesCallback);
        scope.AddUninitCallback(() => (this.shadow_ = null));
        scope.AddPostProcessCallback(() => this.InitializeShadow_());
    }
    InitializeShadow_() {
        var _a;
        this.shadow_ = document.createElement('canvas');
        this.shadow_.setAttribute('width', (this.getAttribute('width') || '0'));
        this.shadow_.setAttribute('height', (this.getAttribute('height') || '0'));
        this.attachShadow({
            mode: 'open',
        });
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.append(this.shadow_);
        this.ctx_ = (this.shadow_.getContext('2d') || null);
        this.ctx_ && (this.ctx_.imageSmoothingQuality = 'high');
        window.addEventListener('mouseup', (event) => {
            (event.button === 0) && this.EndDraw_(event.offsetX, event.offsetY);
        });
        window.addEventListener('touchend', (event) => {
            const touch = event.changedTouches[0];
            const offsetX = (touch.clientX - touch.target.offsetLeft);
            const offsetY = (touch.clientY - touch.target.offsetTop);
            this.EndDraw_(offsetX, offsetY);
        });
        window.addEventListener('touchcancel', (event) => {
            const touch = event.changedTouches[0];
            const offsetX = (touch.clientX - touch.target.offsetLeft);
            const offsetY = (touch.clientY - touch.target.offsetTop);
            this.EndDraw_(offsetX, offsetY);
        });
        this.shadow_.addEventListener('mousedown', (event) => {
            (event.button === 0) && this.BeginDraw_(event.offsetX, event.offsetY);
        });
        this.shadow_.addEventListener('touchstart', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            const offsetX = (touch.clientX - touch.target.offsetLeft);
            const offsetY = (touch.clientY - touch.target.offsetTop);
            this.BeginDraw_(offsetX, offsetY);
        });
        this.shadow_.addEventListener('mousemove', event => this.Draw_(event.offsetX, event.offsetY));
        this.shadow_.addEventListener('touchmove', (event) => {
            const touch = event.touches[0];
            const offsetX = (touch.clientX - touch.target.offsetLeft);
            const offsetY = (touch.clientY - touch.target.offsetTop);
            this.Draw_(offsetX, offsetY);
        });
        Object.values(this.plugins_).forEach(plugins => plugins.forEach(plugin => plugin.SetCanvas(this.shadow_)));
    }
    BeginDraw_(offsetX, offsetY) {
        var _a, _b;
        if (!this.disabled && !this.isDrawing_) {
            this.isDrawing_ = true;
            (_a = this.ctx_) === null || _a === void 0 ? void 0 : _a.save();
            (_b = this.ctx_) === null || _b === void 0 ? void 0 : _b.beginPath();
            this.CallPlugins_('begin', offsetX, offsetY);
        }
    }
    EndDraw_(offsetX, offsetY) {
        var _a;
        if (this.isDrawing_) {
            this.CallPlugins_('end', offsetX, offsetY);
            (_a = this.ctx_) === null || _a === void 0 ? void 0 : _a.restore();
            this.isDrawing_ = false;
        }
    }
    Draw_(offsetX, offsetY) {
        this.isDrawing_ && this.CallPlugins_('draw', offsetX, offsetY);
    }
    CallPlugins_(stage, offsetX, offsetY) {
        if (this.plugin) { //Call only specified plugins
            (Array.isArray(this.plugin) ? this.plugin : [this.plugin]).forEach((name) => {
                (name in this.plugins_) && this.plugins_[name].forEach(plugin => (0, inlinejs_1.JournalTry)(() => plugin.Handle({ stage, offsetX, offsetY })));
            });
        }
        else { //Call all plugins
            Object.values(this.plugins_).forEach((plugins) => plugins.forEach(plugin => (0, inlinejs_1.JournalTry)(() => plugin.Handle({ stage, offsetX, offsetY }))));
        }
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], Sketch.prototype, "plugin", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], Sketch.prototype, "disabled", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'number', spread: 'size' })
], Sketch.prototype, "UpdateWidthProperty", null);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'number', spread: 'size' })
], Sketch.prototype, "UpdateHeightProperty", null);
exports.Sketch = Sketch;
function SketchCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(Sketch);
}
exports.SketchCompact = SketchCompact;
