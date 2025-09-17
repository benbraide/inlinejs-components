var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { EvaluateMagicProperty, InsertHtml, InferComponent, ProcessDirectives } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
/**
 * XhrElement - Advanced XHR content loading with transitions
 *
 * Provides sophisticated content loading with multiple insertion modes, transitions,
 * and lifecycle callbacks. Supports dynamic source changes and conditional clearing.
 *
 * @example
 * ```html
 * <!-- Basic content replacement -->
 * <injs-xhr src="/api/content" mode="replace"></injs-xhr>
 *
 * <!-- With transitions and callbacks -->
 * <injs-xhr src="/api/news" mode="append" transition="true"
 *     beforeinsert="showLoader(false)" afterinsert="updateLayout()"></injs-xhr>
 *
 * <!-- Conditional loading -->
 * <injs-xhr hx-bind:src="selectedCategory ? `/api/items/${selectedCategory}` : null"
 *     clear-on="null" always="true"></injs-xhr>
 * ```
 */
export class XhrElement extends CustomElement {
    constructor() {
        super();
        this.loaded_ = false;
        this.src_ = '';
        this.clearOn_ = null;
        this.insertedElements_ = null;
        /** Target element for content insertion (defaults to this element) */
        this.target = null;
        /** Element to scope transitions to */
        this.transitionScope = null;
        /** Content insertion mode - how to place the loaded content */
        this.mode = 'replace';
        /** Whether to always fetch even if source hasn't changed */
        this.always = false;
        /** Whether to use transitions when inserting/removing content */
        this.transition = false;
        /** Whether to process InlineJS directives in loaded content */
        this.directives = false;
        /** Expression executed before removing existing content */
        this.beforeremove = '';
        /** Expression executed before inserting new content */
        this.beforeinsert = '';
        /** Expression executed after removing existing content */
        this.afterremove = '';
        /** Expression executed after inserting new content */
        this.afterinsert = '';
        /** Expression executed after transitions complete */
        this.aftertransition = '';
    }
    /**
     * Update the source URL and trigger content loading
     * @param value URL to load content from, or special values 'null', 'undefined', 'false'
     */
    UpdateSrcProperty(value) {
        const previousSrc = this.src_;
        if (value === 'null') {
            this.src_ = null;
        }
        else if (value === 'undefined') {
            this.src_ = undefined;
        }
        else if (value === 'false') {
            this.src_ = false;
        }
        else {
            this.src_ = value;
        }
        if (this.always || this.src_ !== previousSrc) {
            this.src_ === this.clearOn_ ? this.Clear_() : this.Fetch_();
        }
    }
    /**
     * Set the value that triggers content clearing
     * @param value Value that when matched by src will clear content instead of loading
     */
    UpdateClearOnProperty(value) {
        if (value === 'null') {
            this.clearOn_ = null;
        }
        else if (value === 'undefined') {
            this.clearOn_ = undefined;
        }
        else if (value === 'false') {
            this.clearOn_ = false;
        }
        else {
            this.clearOn_ = value;
        }
    }
    HandleElementScopeDestroyed_(scope) {
        super.HandleElementScopeDestroyed_(scope);
        this.insertedElements_ = null;
        this.target = null;
        this.transitionScope = null;
    }
    HandlePostAttributesProcessPostfix_() {
        super.HandlePostAttributesProcessPostfix_();
        this.loaded_ = true;
        this.Fetch_();
    }
    Fetch_() {
        if (this.loaded_ && this.src_ && typeof this.src_ === 'string') {
            const magicGet = EvaluateMagicProperty(this.componentId_, this, '$get', '$');
            magicGet ? magicGet(this.src_).then((data) => this.HandleData_(data)) : fetch(this.src_).then(res => res.text()).then(data => this.HandleData_(data));
        }
    }
    HandleData_(data) {
        const target = (this.target || this);
        if (this.mode === 'before' || this.mode === 'replacebefore') {
            if (target.parentElement) {
                this.mode === 'replacebefore' && this.Clear_();
                const template = document.createElement('template');
                template.innerHTML = data;
                this.insertedElements_ = Array.from(template.content.children);
                const component = (InferComponent(target.parentElement) || '');
                this.insertedElements_.forEach(child => {
                    target.parentElement.insertBefore(child, target);
                    component && ProcessDirectives({ component, element: child });
                });
            }
        }
        else if (this.mode === 'after' || this.mode === 'replaceafter') {
            if (target.parentElement) {
                this.mode === 'replaceafter' && this.Clear_();
                const template = document.createElement('template');
                template.innerHTML = data;
                this.insertedElements_ = Array.from(template.content.children);
                const component = (InferComponent(target.parentElement) || '');
                this.insertedElements_.forEach(child => {
                    target.parentElement.insertBefore(child, target.nextSibling);
                    component && ProcessDirectives({ component, element: child });
                });
            }
        }
        else {
            InsertHtml({
                component: ((target === this) ? this.componentId_ : (InferComponent(target) || '')),
                element: target,
                html: data,
                type: this.mode,
                useTransition: this.transition,
                processDirectives: this.directives,
                transitionScope: this.transitionScope || undefined,
                beforeRemove: this.beforeremove ? beforeTransition => this.EvaluateExpression(this.beforeremove, {
                    disableFunctionCall: false,
                    params: [data, beforeTransition],
                    contexts: { data, beforeTransition },
                }) : undefined,
                beforeInsert: this.beforeinsert ? () => this.EvaluateExpression(this.beforeinsert, {
                    disableFunctionCall: false,
                    params: [data],
                    contexts: { data },
                }) : undefined,
                afterRemove: this.afterremove ? () => this.EvaluateExpression(this.afterremove, {
                    disableFunctionCall: false,
                    params: [data],
                    contexts: { data },
                }) : undefined,
                afterInsert: this.afterinsert ? () => this.EvaluateExpression(this.afterinsert, {
                    disableFunctionCall: false,
                    params: [data],
                    contexts: { data },
                }) : undefined,
                afterTransitionCallback: this.aftertransition ? () => this.EvaluateExpression(this.aftertransition, {
                    disableFunctionCall: false,
                    params: [data],
                    contexts: { data },
                }) : undefined,
            });
        }
    }
    Clear_() {
        var _a;
        if (this.mode === 'replace') {
            Array.from((this.target || this).children).forEach(child => child.remove());
        }
        (_a = this.insertedElements_) === null || _a === void 0 ? void 0 : _a.forEach(element => element.remove());
        this.insertedElements_ = null;
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], XhrElement.prototype, "target", void 0);
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], XhrElement.prototype, "transitionScope", void 0);
__decorate([
    Property({ type: 'string' })
], XhrElement.prototype, "mode", void 0);
__decorate([
    Property({ type: 'boolean' })
], XhrElement.prototype, "always", void 0);
__decorate([
    Property({ type: 'boolean' })
], XhrElement.prototype, "transition", void 0);
__decorate([
    Property({ type: 'boolean' })
], XhrElement.prototype, "directives", void 0);
__decorate([
    Property({ type: 'string' })
], XhrElement.prototype, "beforeremove", void 0);
__decorate([
    Property({ type: 'string' })
], XhrElement.prototype, "beforeinsert", void 0);
__decorate([
    Property({ type: 'string' })
], XhrElement.prototype, "afterremove", void 0);
__decorate([
    Property({ type: 'string' })
], XhrElement.prototype, "afterinsert", void 0);
__decorate([
    Property({ type: 'string' })
], XhrElement.prototype, "aftertransition", void 0);
__decorate([
    Property({ type: 'string' })
], XhrElement.prototype, "UpdateSrcProperty", null);
__decorate([
    Property({ type: 'string' })
], XhrElement.prototype, "UpdateClearOnProperty", null);
export function XhrElementCompact() {
    RegisterCustomElement(XhrElement, 'xhr');
}
