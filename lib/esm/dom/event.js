var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AddOutsideEventListener, CreateDirective, DispatchDirective, EvaluateLater, GetGlobal, InferComponent, JournalTry, RemoveOutsideEventListener } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
function GetMobileMap() {
    return {
        click: 'touchend',
        mouseup: 'touchend',
        mousedown: 'touchstart',
        mousemove: 'touchmove',
    };
}
export class EventElement extends CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.unsubscribe_ = null;
        this.target = null;
        this.context = null;
        this.type = '';
        this.outside = false;
        this.directive = false;
        this.once = false;
        this.debounce = 0;
        this.throttle = 0;
        this.prevent = false;
        this.stop = false;
        this.stopImmediate = false;
        this.window = false;
        this.document = false;
        this.parent = false;
        this.passive = false;
        this.mobile = false;
        this.self = false;
        this.modifiers = null;
        this.ctrl = false;
        this.alt = false;
        this.shift = false;
        this.meta = false;
        this.filter = '';
        this.keys = '';
        this.alpha = false;
        this.digit = false;
        this.esc = false;
    }
    keyIs(event, keys) {
        return (Array.isArray(keys) ? keys : [keys]).some((key) => this.filterKey_(event, k => {
            const mapped = GetGlobal().GetConfig().MapKeyEvent(key);
            return Array.isArray(mapped) ? mapped.includes(k) : mapped === k;
        }));
    }
    HandleElementScopeDestroyed_(scope) {
        super.HandleElementScopeDestroyed_(scope);
        const mobileMap = GetMobileMap();
        const getMappedEvent = (e) => ((this.mobile && e in mobileMap) ? mobileMap[e] : null);
        (Array.isArray(this.type) ? this.type : [this.type]).forEach((t) => { var _a; return (_a = this.unsubscribe_) === null || _a === void 0 ? void 0 : _a.call(this, t, getMappedEvent(t)); });
    }
    HandlePostAttributesProcessPostfix_() {
        var _a;
        super.HandlePostAttributesProcessPostfix_();
        const target = (this.target || (this.window && window) || (this.document && document) || ((this.parent || !this.self) && this.parentElement) || this);
        const type = this.type;
        if (target && type) {
            const componentId = ((this.context && ((_a = InferComponent(this.context)) === null || _a === void 0 ? void 0 : _a.GetId())) || this.componentId_);
            if ((typeof this.type === 'string' && (this.directive && this.type.includes(':'))) && target instanceof HTMLElement) {
                const directive = CreateDirective(this.type, (this.textContent || '').trim()); // Example: hx-router:load
                if (directive && DispatchDirective(componentId, target, directive)) {
                    return;
                }
            }
            const modifiers = (this.modifiers ? (Array.isArray(this.modifiers) ? this.modifiers : [this.modifiers]) : []), mobileMap = GetMobileMap();
            const evaluate = EvaluateLater({
                componentId: componentId,
                contextElement: (this.context || this),
                expression: (this.textContent || '').trim(),
                disableFunctionCall: false,
            });
            const evaluateFilter = (typeof this.filter === 'string' && this.filter.trim() ? EvaluateLater({
                componentId: componentId,
                contextElement: (this.context || this),
                expression: this.filter.trim(),
                disableFunctionCall: false,
            }) : null);
            const filterKeys = new Array();
            this.alpha && filterKeys.push('alpha');
            this.digit && filterKeys.push('digit');
            this.esc && filterKeys.push('esc');
            const filter = (event) => {
                if (evaluateFilter) {
                    return evaluateFilter(undefined, [event], { event });
                }
                if (typeof this.filter === 'function') {
                    return JournalTry(() => this.filter(event));
                }
                if (this.keys && (typeof this.keys === 'string' || this.keys.length > 0)) {
                    return this.keyIs(event, this.keys);
                }
                if (filterKeys.length > 0) {
                    return this.keyIs(event, filterKeys);
                }
                return true;
            };
            const handleEvent = (event) => {
                this.prevent && event.preventDefault();
                this.stop && event.stopPropagation();
                this.stopImmediate && event.stopImmediatePropagation();
                evaluate(undefined, [event], { event });
                if (this.once) { // Remove the event listener after the first invocation
                    (Array.isArray(type) ? type : [type]).forEach((t) => unsubscribe === null || unsubscribe === void 0 ? void 0 : unsubscribe(t, getMappedEvent(t)));
                }
            };
            let throttling = false, debounceCheckpoint = 0;
            const handler = (event) => {
                if (throttling || this.self && event.target !== target) {
                    return;
                }
                const physicalEvent = ((event instanceof MouseEvent) ? event : ((event instanceof KeyboardEvent) ? event : null));
                if ((this.ctrl || modifiers.includes('ctrl')) && !(physicalEvent === null || physicalEvent === void 0 ? void 0 : physicalEvent.ctrlKey)) { //Check for control key
                    return;
                }
                if ((this.alt || modifiers.includes('alt')) && !(physicalEvent === null || physicalEvent === void 0 ? void 0 : physicalEvent.altKey)) { //Check for alt key
                    return;
                }
                if ((this.shift || modifiers.includes('shift')) && !(physicalEvent === null || physicalEvent === void 0 ? void 0 : physicalEvent.shiftKey)) { //Check for shift key
                    return;
                }
                if ((this.meta || modifiers.includes('meta')) && !(physicalEvent === null || physicalEvent === void 0 ? void 0 : physicalEvent.metaKey)) { //Check for meta key
                    return;
                }
                if (filter(event) === false) {
                    return;
                }
                if (!this.once && this.debounce > 0) { // Debounce upcoming events
                    const checkpoint = ++debounceCheckpoint;
                    setTimeout(() => ((checkpoint == debounceCheckpoint) && handleEvent(event)), this.debounce);
                    return;
                }
                if (!this.once && this.throttle > 0) { //Throttle upcoming events
                    throttling = true;
                    setTimeout(() => (throttling = false), this.throttle);
                }
                handleEvent(event);
            };
            const passive = this.passive, mobile = this.mobile;
            const getMappedEvent = (e) => ((mobile && e in mobileMap) ? mobileMap[e] : null);
            let subscribe = null, unsubscribe = null;
            if (this.outside && target instanceof HTMLElement) {
                subscribe = (e, m) => {
                    AddOutsideEventListener(target, e, handler);
                    m && AddOutsideEventListener(target, m, handler);
                };
                unsubscribe = (e, m) => {
                    RemoveOutsideEventListener(target, e, handler);
                    m && RemoveOutsideEventListener(target, m, handler);
                };
            }
            else {
                subscribe = (e, m) => {
                    target.addEventListener(e, handler, { passive });
                    m && target.addEventListener(m, handler, { passive });
                };
                unsubscribe = (e, m) => {
                    target.removeEventListener(e, handler);
                    m && target.removeEventListener(m, handler);
                };
            }
            this.unsubscribe_ = unsubscribe;
            (Array.isArray(type) ? type : [type]).forEach((t) => subscribe === null || subscribe === void 0 ? void 0 : subscribe(t, getMappedEvent(t)));
        }
    }
    filterKey_(event, handler) {
        return event instanceof KeyboardEvent ? handler((event.key || '').toLowerCase()) : false;
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], EventElement.prototype, "target", void 0);
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], EventElement.prototype, "context", void 0);
__decorate([
    Property({ type: 'array', checkStoredObject: true })
], EventElement.prototype, "type", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "outside", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "directive", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "once", void 0);
__decorate([
    Property({ type: 'number' })
], EventElement.prototype, "debounce", void 0);
__decorate([
    Property({ type: 'number' })
], EventElement.prototype, "throttle", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "prevent", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "stop", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "stopImmediate", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "window", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "document", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "parent", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "passive", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "mobile", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "self", void 0);
__decorate([
    Property({ type: 'array', checkStoredObject: true })
], EventElement.prototype, "modifiers", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "ctrl", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "alt", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "shift", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "meta", void 0);
__decorate([
    Property({ type: 'string', checkStoredObject: true })
], EventElement.prototype, "filter", void 0);
__decorate([
    Property({ type: 'array', checkStoredObject: true })
], EventElement.prototype, "keys", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "alpha", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "digit", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "esc", void 0);
export function EventElementCompact() {
    RegisterCustomElement(EventElement, 'event');
}
