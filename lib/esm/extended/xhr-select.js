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
import { RegisterCustomElement } from "@benbraide/inlinejs-element";
import { Xhr } from "./xhr";
export class XhrSelect extends Xhr {
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
            if (IsObject(json)) {
                json = Object.entries(json).map(([key, value]) => ({ value: key, text: value }));
            }
            if (!Array.isArray(json)) {
                return;
            }
            ((this.mode === 'prepend') ? json.reverse() : json).forEach((item) => {
                item = ((typeof item === 'string') ? { value: item, text: item } : item);
                const option = document.createElement('option');
                option.value = item.value;
                option.text = item.text;
                (this.mode === 'prepend') ? this.select_.prepend(option) : this.select_.appendChild(option);
            });
        }
        catch (_a) { }
    }
}
export function XhrSelectCompact() {
    RegisterCustomElement(XhrSelect);
}
