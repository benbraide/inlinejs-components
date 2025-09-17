import { CustomElement } from "@benbraide/inlinejs-element";
/**
 * CodeElement - JavaScript code execution with reactive context
 *
 * Executes JavaScript code with specified context, reactivity options, and dependency tracking.
 * Supports immediate execution, reactive effects, watched expressions, and template storage.
 *
 * @example
 * ```html
 * <!-- Immediate execution -->
 * <injs-code>console.log('Hello!');</injs-code>
 *
 * <!-- Reactive effect -->
 * <injs-code effect="true">$el.textContent = `Count: ${count}`;</injs-code>
 *
 * <!-- Watch expression -->
 * <injs-code watch="user.name">document.title = `Welcome ${user.name}`;</injs-code>
 *
 * <!-- Template for reuse -->
 * <injs-code name="validate" template="true">return email.includes('@');</injs-code>
 * ```
 */
export declare class CodeElement extends CustomElement {
    /** Element to use as execution context (defaults to this element) */
    context: HTMLElement | null;
    /** Name to register this code block under for later reuse */
    name: string;
    /** Expression to watch for changes that trigger re-execution */
    watch: string;
    /** Whether this is a template (stored but not executed immediately) */
    template: boolean;
    /** Whether to run as a reactive effect with dependency tracking */
    effect: boolean;
    constructor();
    protected HandlePostAttributesProcessPostfix_(): void;
}
export declare function CodeElementCompact(): void;
