import { IElementScope, IElementScopeCreatedCallbackParams, IIntersectionObserver, IIntersectionOptions, ResizeObserver } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class ImageElement extends CustomElement {
    protected loaded_: boolean;
    protected src_: string | null;
    protected paragraph_: HTMLParagraphElement | null;
    protected image_: HTMLImageElement | null;
    protected intersectionObserver_: IIntersectionObserver | null;
    protected resizeObserver_: ResizeObserver | null;
    protected fit_: boolean;
    protected fitType_: string;
    lazyOptions: HTMLElement | IIntersectionOptions | null;
    lazyThreshold: number;
    lazy: boolean;
    parent: boolean;
    UpdateSrcProperty(value: string): void;
    UpdateFitProperty(value: boolean): void;
    UpdateFitTypeProperty(value: string): void;
    constructor();
    protected HandleElementScopeCreatedPrefix_(params: IElementScopeCreatedCallbackParams): void;
    protected HandleElementScopeCreatedPostfix_(params: IElementScopeCreatedCallbackParams): void;
    protected HandleElementScopeDestroyed_(scope: IElementScope): void;
    protected HandlePostAttributesProcessPostfix_(): void;
    protected SetImageSrc_(value?: string): void;
    protected UpdateFit_(): void;
    protected EnableLazy_(): void;
    protected ShowParagraph_(text: string): void;
}
export declare function ImageElementCompact(): void;
