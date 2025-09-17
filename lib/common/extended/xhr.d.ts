import { IElementScope } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
/** XHR insertion modes for content placement */
export declare type XhrModeType = 'replace' | 'append' | 'prepend' | 'before' | 'after' | 'replacebefore' | 'replaceafter';
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
export declare class XhrElement extends CustomElement {
    protected loaded_: boolean;
    protected src_: string | boolean | null | undefined;
    protected clearOn_: string | boolean | null | undefined;
    protected insertedElements_: Array<Element> | null;
    /** Target element for content insertion (defaults to this element) */
    target: HTMLElement | null;
    /** Element to scope transitions to */
    transitionScope: HTMLElement | null;
    /** Content insertion mode - how to place the loaded content */
    mode: XhrModeType;
    /** Whether to always fetch even if source hasn't changed */
    always: boolean;
    /** Whether to use transitions when inserting/removing content */
    transition: boolean;
    /** Whether to process InlineJS directives in loaded content */
    directives: boolean;
    /** Expression executed before removing existing content */
    beforeremove: string;
    /** Expression executed before inserting new content */
    beforeinsert: string;
    /** Expression executed after removing existing content */
    afterremove: string;
    /** Expression executed after inserting new content */
    afterinsert: string;
    /** Expression executed after transitions complete */
    aftertransition: string;
    /**
     * Update the source URL and trigger content loading
     * @param value URL to load content from, or special values 'null', 'undefined', 'false'
     */
    UpdateSrcProperty(value: string): void;
    /**
     * Set the value that triggers content clearing
     * @param value Value that when matched by src will clear content instead of loading
     */
    UpdateClearOnProperty(value: string): void;
    constructor();
    protected HandleElementScopeDestroyed_(scope: IElementScope): void;
    protected HandlePostAttributesProcessPostfix_(): void;
    protected Fetch_(): void;
    protected HandleData_(data: string): void;
    protected Clear_(): void;
}
export declare function XhrElementCompact(): void;
