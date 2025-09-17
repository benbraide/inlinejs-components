import { IElementScope, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
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
export declare class FormElement extends CustomElement {
    protected form_: HTMLFormElement | null;
    protected formMethod_: HTMLInputElement | null;
    /** Enable AJAX form submission instead of default browser behavior */
    ajax: boolean;
    /** Enable state management for the form */
    state: boolean;
    /** Refresh the page after successful submission */
    refresh: boolean;
    /** Reload the page after successful submission */
    reload: boolean;
    /** Reset the form after successful submission */
    reset: boolean;
    /** Disable client-side form validation */
    novalidate: boolean;
    /** Silent submission without loading indicators */
    silent: boolean;
    /** Enable file upload support */
    upload: boolean;
    /** Handle response as download */
    download: boolean;
    /** Enable duplex communication */
    duplex: boolean;
    /** Handle response as blob data */
    blob: boolean;
    /** Save form data */
    save: boolean;
    /**
     * Set the HTTP method for the form
     * Supports both native methods (GET, POST, HEAD, OPTIONS) and RESTful methods (PUT, DELETE, PATCH)
     * Non-native methods are implemented using method spoofing with a hidden _method input
     * @param value HTTP method name (case insensitive)
     */
    UpdateMethodProperty(value: string): void;
    constructor();
    protected HandleElementScopeCreatedPrefix_(params: IElementScopeCreatedCallbackParams): void;
    protected HandlePostAttributesProcessPostfix_(): void;
    protected HandleElementScopeDestroyed_(scope: IElementScope): void;
    protected SetFormMethod_(method: string): void;
}
export declare function FormElementCompact(): void;
