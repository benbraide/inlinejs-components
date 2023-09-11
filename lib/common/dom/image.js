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
exports.ImageCompact = exports.Image = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class Image extends inlinejs_element_1.CustomElement {
    constructor() {
        super();
        this.loaded_ = false;
        this.paragraph_ = null;
        this.image_ = null;
        this.intersectionObserver_ = null;
        this.resizeObserver_ = null;
        this.fit_ = false;
        this.fitType_ = 'contain';
        this.lazyOptions = null;
        this.lazyThreshold = 0.90;
        this.lazy = false;
        this.style.display = 'flex';
        this.style.flexDirection = 'column';
        this.style.justifyContent = 'center';
        this.style.alignItems = 'center';
        this.style.overflow = 'hidden';
    }
    UpdateSrcProperty(value) {
        this.image_ && this.image_.src !== value && this.loaded_ && this.SetImageSrc_(value);
    }
    UpdateFitProperty(value) {
        if (this.fit_ !== value) {
            this.fit_ = value;
            this.UpdateFit_();
        }
    }
    UpdateFitTypeProperty(value) {
        if (this.fitType_ !== value) {
            this.fitType_ = value;
            this.UpdateFit_();
        }
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        this.image_ = document.createElement('img');
        this.SetNativeElement_(this.image_);
        this.image_.addEventListener('load', () => {
            this.loaded_ = true;
            this.paragraph_ && (this.paragraph_.style.display = 'none');
            this.image_ && this.image_.style.removeProperty('display');
            this.UpdateFit_();
        });
        this.image_.addEventListener('error', () => {
            this.ShowParagraph_('Failed to load image.');
        });
        this.appendChild(this.image_);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            this.lazy ? this.EnableLazy_() : this.SetImageSrc_();
            postAttributesCallback && postAttributesCallback();
        });
        scope.AddUninitCallback(() => {
            var _a, _b;
            this.paragraph_ = null;
            this.image_ = null;
            (_a = this.intersectionObserver_) === null || _a === void 0 ? void 0 : _a.Unobserve(this);
            this.intersectionObserver_ = null;
            (_b = this.resizeObserver_) === null || _b === void 0 ? void 0 : _b.Unobserve(this);
            this.resizeObserver_ = null;
        });
        this.resizeObserver_ = new inlinejs_1.ResizeObserver();
        this.resizeObserver_.Observe(this, () => this.UpdateFit_());
    }
    SetImageSrc_(value) {
        if (this.image_) {
            this.ShowParagraph_('Loading image...');
            this.image_.src = (value || this.getAttribute('src') || '');
            this.loaded_ = false;
        }
    }
    UpdateFit_() {
        console.log('Fit update');
        if (!this.image_ || !this.loaded_) {
            return;
        }
        if (this.fit_) {
            const imageSize = { width: this.image_.naturalWidth, height: this.image_.naturalHeight };
            const containerSize = { width: this.clientWidth, height: this.clientHeight };
            let ratio;
            if (this.fitType_ === 'cover') {
                ratio = Math.max((containerSize.width / imageSize.width), (containerSize.height / imageSize.height));
            }
            else { //Contain
                ratio = Math.min((containerSize.width / imageSize.width), (containerSize.height / imageSize.height));
            }
            this.image_.style.width = `${imageSize.width * ratio}px`;
            this.image_.style.height = `${imageSize.height * ratio}px`;
            console.log('Fit updated');
        }
        else {
            this.image_.style.removeProperty('width');
            this.image_.style.removeProperty('height');
            console.log('Fit removed');
        }
    }
    EnableLazy_() {
        var _a;
        if (this.intersectionObserver_ || !this.lazy || !this.image_ || this.loaded_) {
            return;
        }
        const options = ((0, inlinejs_1.IsObject)(this.lazyOptions) ? this.lazyOptions : { root: this.lazyOptions });
        options.root = (options.root || null);
        options.rootMargin = (options.rootMargin || '0px');
        options.threshold = (options.threshold || this.lazyThreshold || 0);
        this.intersectionObserver_ = new inlinejs_1.IntersectionObserver((((_a = (0, inlinejs_1.FindComponentById)(this.componentId_)) === null || _a === void 0 ? void 0 : _a.GenerateUniqueId('img_')) || ''), options);
        this.intersectionObserver_.Observe(this, ({ entry } = {}) => {
            var _a;
            if (entry === null || entry === void 0 ? void 0 : entry.isIntersecting) {
                (_a = this.intersectionObserver_) === null || _a === void 0 ? void 0 : _a.Unobserve(this);
                this.intersectionObserver_ = null;
                this.SetImageSrc_();
            }
        });
        this.ShowParagraph_('Waiting for image to be in view...');
    }
    ShowParagraph_(text) {
        var _a;
        if (!this.paragraph_) {
            this.paragraph_ = document.createElement('p');
            this.paragraph_.style.margin = '0';
            this.paragraph_.style.padding = '0';
            this.paragraph_.style.fontSize = '1rem';
            this.paragraph_.style.fontFamily = 'sans-serif';
            this.paragraph_.style.fontWeight = '500';
            this.paragraph_.style.color = 'rgba(0, 0, 0, 0.5)';
            this.paragraph_.style.textAlign = 'center';
            this.paragraph_.style.userSelect = 'none';
            this.appendChild(this.paragraph_);
        }
        this.paragraph_.textContent = (((_a = this.image_) === null || _a === void 0 ? void 0 : _a.alt) || text);
        this.paragraph_.style.display = 'block';
        this.image_ && (this.image_.style.display = 'none');
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object' })
], Image.prototype, "lazyOptions", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'number' })
], Image.prototype, "lazyThreshold", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], Image.prototype, "lazy", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], Image.prototype, "UpdateSrcProperty", null);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], Image.prototype, "UpdateFitProperty", null);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], Image.prototype, "UpdateFitTypeProperty", null);
exports.Image = Image;
function ImageCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(Image);
}
exports.ImageCompact = ImageCompact;
