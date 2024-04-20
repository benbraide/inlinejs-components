"use strict";
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
exports.XhrSelectElementCompact = exports.XhrSelectElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const xhr_1 = require("./xhr");
class XhrSelectElement extends xhr_1.XhrElement {
    constructor() {
        super();
        this.select_ = null;
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        this.select_ = document.createElement('select');
        this.SetNativeElement_(this.select_);
        this.appendChild(this.select_);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), postAttributesCallback);
        scope.AddUninitCallback(() => (this.select_ = null));
    }
    HandleData_(data) {
        if (!this.select_) {
            return;
        }
        if (this.mode === 'replace') {
            while (this.select_.firstChild) {
                this.select_.removeChild(this.select_.firstChild);
            }
        }
        try {
            let json = JSON.parse(data);
            if ((0, inlinejs_1.IsObject)(json)) {
                json = Object.entries(json).map(([key, value]) => ({ value: key, text: value }));
            }
            if (!Array.isArray(json)) {
                return;
            }
            ((this.mode === 'prepend') ? json.reverse() : json).filter(item => !!item).forEach((item) => {
                const isObject = (0, inlinejs_1.IsObject)(item);
                const option = document.createElement('option');
                option.value = (isObject ? (option.value || option.text) : (0, inlinejs_1.ToString)(isObject));
                option.text = (isObject ? (option.text || option.value) : (0, inlinejs_1.ToString)(isObject));
                (this.mode === 'prepend') ? this.select_.prepend(option) : this.select_.appendChild(option);
            });
        }
        catch (_a) { }
    }
}
exports.XhrSelectElement = XhrSelectElement;
function XhrSelectElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(XhrSelectElement, 'xhr-select');
}
exports.XhrSelectElementCompact = XhrSelectElementCompact;
