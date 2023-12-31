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
import { IsObject } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class DataViewElement extends CustomElement {
    constructor() {
        super();
        this.codeElement_ = null;
        this.classPrefix_ = 'dt-view-';
        this.value_ = undefined;
    }
    UpdateClassPrefixProperty(value) {
        this.classPrefix_ = value;
        this.Refresh_();
    }
    UpdateValueProperty(value) {
        this.value_ = value;
        this.Refresh_();
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        scope.AddPostProcessCallback(() => {
            this.codeElement_ = document.createElement('code');
            this.codeElement_.classList.add(this.CreateClassName_('container'));
            this.appendChild(this.codeElement_);
            this.Refresh_();
        });
        scope.AddUninitCallback(() => {
            this.codeElement_ = null;
        });
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), postAttributesCallback);
    }
    CreateClassName_(name) {
        return `${this.classPrefix_}${name}`;
    }
    Refresh_() {
        if (!this.codeElement_) {
            return;
        }
        while (this.codeElement_.firstChild) {
            this.codeElement_.firstChild.remove();
        }
        if (this.value_ !== undefined) {
            const rendered = this.RenderValue_(this.value_);
            (Array.isArray(rendered) ? rendered : [rendered]).forEach(el => { var _a; return (_a = this.codeElement_) === null || _a === void 0 ? void 0 : _a.appendChild(el); });
        }
    }
    RenderValue_(value) {
        if (typeof value === 'string') {
            return this.CreateSpanValue_(`"${value}"`, ['value', 'string']);
        }
        if (typeof value === 'boolean') {
            return this.CreateSpanValue_((value ? 'true' : 'false'), ['value', 'boolean']);
        }
        if (typeof value === 'number') {
            return this.CreateSpanValue_(`${value}`, ['value', 'number']);
        }
        if (value === null) {
            return this.CreateSpanValue_('null', ['value', 'null']);
        }
        if (Array.isArray(value)) {
            const els = [this.CreateSpanValue_('[', ['bracket', 'open-bracket'])], divEl = document.createElement('div');
            divEl.classList.add(this.CreateClassName_('collection'));
            divEl.classList.add(this.CreateClassName_('array'));
            value.forEach((item, index) => {
                const rendered = this.RenderValue_(item);
                (Array.isArray(rendered) ? rendered : [rendered]).forEach(el => divEl.appendChild(el));
                (index < (value.length - 1)) && divEl.appendChild(this.CreateSpanValue_(',', 'comma'));
            });
            els.push(divEl);
            els.push(this.CreateSpanValue_(']', ['bracket', 'close-bracket']));
            return els;
        }
        if (IsObject(value)) {
            const els = [this.CreateSpanValue_('{', ['brace', 'open-brace'])], divEl = document.createElement('div');
            divEl.classList.add(this.CreateClassName_('collection'));
            divEl.classList.add(this.CreateClassName_('object'));
            const entries = Object.entries(value);
            entries.forEach(([key, value], index) => {
                const codeEl = document.createElement('code');
                codeEl.appendChild(this.CreateSpanValue_(`${key}:`, 'key'));
                divEl.appendChild(codeEl);
                const rendered = this.RenderValue_(value);
                (Array.isArray(rendered) ? rendered : [rendered]).forEach(el => codeEl.appendChild(el));
                (index < (entries.length - 1)) && codeEl.appendChild(this.CreateSpanValue_(',', 'comma'));
            });
            els.push(divEl);
            els.push(this.CreateSpanValue_('}', ['brace', 'open-brace']));
            return els;
        }
        return this.CreateSpanValue_(JSON.stringify(value), ['value', 'unknown']);
    }
    CreateSpanValue_(value, className) {
        const spanEl = document.createElement('span');
        spanEl.textContent = value;
        className && spanEl.classList.add(...(Array.isArray(className) ? className : [className]).map(cn => this.CreateClassName_(cn)));
        return spanEl;
    }
}
__decorate([
    Property({ type: 'string' })
], DataViewElement.prototype, "UpdateClassPrefixProperty", null);
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], DataViewElement.prototype, "UpdateValueProperty", null);
export function DataViewElementCompact() {
    RegisterCustomElement(DataViewElement, 'data-view');
}
