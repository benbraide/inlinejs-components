var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { GetGlobal } from "@benbraide/inlinejs";
import { CustomElement, NativeElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
/** Native HTTP methods supported by forms */
const NativeFormMethods = ['get', 'post', 'head', 'options'];
/** HTTP methods that require spoofing via hidden input */
const NonNativeFormMethods = ['put', 'delete', 'patch'];
/**
 * FormElement - Enhanced form wrapper with AJAX capabilities
 *
 * Creates an enhanced form with AJAX submission support, HTTP method spoofing,
 * and extensive configuration options for different submission behaviors.
 *
 * @example
 * ```html
 * <!-- Basic AJAX form -->
 * <injs-form ajax="true" method="post">
 *     <input type="text" name="username" required>
 *     <button type="submit">Submit</button>
 * </injs-form>
 *
 * <!-- File upload form -->
 * <injs-form ajax="true" upload="true" method="post">
 *     <input type="file" name="document" accept=".pdf">
 *     <button type="submit">Upload</button>
 * </injs-form>
 *
 * <!-- RESTful form with custom method -->
 * <injs-form ajax="true" method="patch" reset="true">
 *     <input type="hidden" name="id" value="123">
 *     <input type="text" name="title">
 *     <button type="submit">Update</button>
 * </injs-form>
 * ```
 */
export class FormElement extends CustomElement {
    constructor() {
        super();
        this.form_ = null;
        this.formMethod_ = null;
        /** Enable AJAX form submission instead of default browser behavior */
        this.ajax = false;
        /** Enable state management for the form */
        this.state = false;
        /** Refresh the page after successful submission */
        this.refresh = false;
        /** Reload the page after successful submission */
        this.reload = false;
        /** Reset the form after successful submission */
        this.reset = false;
        /** Disable client-side form validation */
        this.novalidate = false;
        /** Silent submission without loading indicators */
        this.silent = false;
        /** Enable file upload support */
        this.upload = false;
        /** Handle response as download */
        this.download = false;
        /** Enable duplex communication */
        this.duplex = false;
        /** Handle response as blob data */
        this.blob = false;
        /** Save form data */
        this.save = false;
    }
    /**
     * Set the HTTP method for the form
     * Supports both native methods (GET, POST, HEAD, OPTIONS) and RESTful methods (PUT, DELETE, PATCH)
     * Non-native methods are implemented using method spoofing with a hidden _method input
     * @param value HTTP method name (case insensitive)
     */
    UpdateMethodProperty(value) {
        this.SetFormMethod_(value);
    }
    HandleElementScopeCreatedPrefix_(params) {
        super.HandleElementScopeCreatedPrefix_(params);
        this.form_ = document.createElement('form');
        this.SetNativeElement_(this.form_);
        this.appendChild(this.form_);
        Array.from(this.children).forEach((child) => {
            if (child !== this.nativeElement_ && !(child instanceof NativeElement)) {
                child.remove();
                this.nativeElement_.appendChild(child);
            }
        });
    }
    HandlePostAttributesProcessPostfix_() {
        var _a, _b;
        super.HandlePostAttributesProcessPostfix_();
        if (this.ajax) {
            let directive = GetGlobal().GetConfig().GetDirectiveName('form');
            this.refresh && (directive += '.refresh');
            this.reload && (directive += '.reload');
            this.reset && (directive += '.reset');
            this.novalidate && (directive += '.novalidate');
            this.silent && (directive += '.silent');
            this.upload && (directive += '.upload');
            this.download && (directive += '.download');
            this.duplex && (directive += '.duplex');
            this.blob && (directive += '.blob');
            this.save && (directive += '.save');
            (_a = this.form_) === null || _a === void 0 ? void 0 : _a.setAttribute(directive, '');
        }
        this.state && ((_b = this.form_) === null || _b === void 0 ? void 0 : _b.setAttribute(GetGlobal().GetConfig().GetDirectiveName('state'), ''));
    }
    HandleElementScopeDestroyed_(scope) {
        super.HandleElementScopeDestroyed_(scope);
        this.form_ = null;
        this.formMethod_ = null;
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
    Property({ type: 'boolean' })
], FormElement.prototype, "ajax", void 0);
__decorate([
    Property({ type: 'boolean' })
], FormElement.prototype, "state", void 0);
__decorate([
    Property({ type: 'boolean' })
], FormElement.prototype, "refresh", void 0);
__decorate([
    Property({ type: 'boolean' })
], FormElement.prototype, "reload", void 0);
__decorate([
    Property({ type: 'boolean' })
], FormElement.prototype, "reset", void 0);
__decorate([
    Property({ type: 'boolean' })
], FormElement.prototype, "novalidate", void 0);
__decorate([
    Property({ type: 'boolean' })
], FormElement.prototype, "silent", void 0);
__decorate([
    Property({ type: 'boolean' })
], FormElement.prototype, "upload", void 0);
__decorate([
    Property({ type: 'boolean' })
], FormElement.prototype, "download", void 0);
__decorate([
    Property({ type: 'boolean' })
], FormElement.prototype, "duplex", void 0);
__decorate([
    Property({ type: 'boolean' })
], FormElement.prototype, "blob", void 0);
__decorate([
    Property({ type: 'boolean' })
], FormElement.prototype, "save", void 0);
__decorate([
    Property({ type: 'string' })
], FormElement.prototype, "UpdateMethodProperty", null);
export function FormElementCompact() {
    RegisterCustomElement(FormElement, 'form');
}
