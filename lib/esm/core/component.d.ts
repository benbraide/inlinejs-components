import { CustomElement } from "@benbraide/inlinejs-element";
/**
 * ComponentElement - Dynamic component loader for InlineJS
 *
 * Loads and renders component content dynamically from external sources.
 * Supports caching, sanitization, callbacks, and automatic URL construction.
 *
 * @example
 * ```html
 * <!-- Load by name with prefix -->
 * <injs-component name="header" load="true" src-prefix="/components"></injs-component>
 *
 * <!-- Load from specific URL -->
 * <injs-component src="/templates/navbar.html" load="true" sanitize="true"></injs-component>
 *
 * <!-- With callbacks -->
 * <injs-component name="modal" load="true" onloaded="console.log('loaded')" onready="$modal.show()"></injs-component>
 * ```
 */
export declare class ComponentElement extends CustomElement {
    /** Component name for automatic URL construction */
    name: string;
    /** URL prefix for component loading when using name-based loading */
    srcPrefix: string;
    /** Complete URL to load component content from */
    src: string;
    /** Whether to automatically load the component */
    load: boolean;
    /** Whether to append to existing content (true) or replace it (false) */
    extend: boolean;
    /** Whether to use resource caching for loaded content */
    cache: boolean;
    /** Expression to execute after content is loaded */
    onloaded: string;
    /** Expression to execute after transitions are complete */
    onready: string;
    /** Whether to sanitize the loaded HTML content */
    sanitize: boolean;
    constructor();
    protected HandlePostAttributesProcessPostfix_(): void;
}
/**
 * Register the ComponentElement as a custom element with tag name 'component'
 * Call this function to make <injs-component> elements available in the DOM
 */
export declare function ComponentElementCompact(): void;
