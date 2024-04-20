import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class OverlayElement extends CustomElement {
    protected showCount_: number;
    protected isVisibile_: boolean;
    protected zIndex_: number;
    protected width_: string;
    visibleClass: string;
    overflowClass: string;
    visibleTarget: HTMLElement | null;
    custom: boolean;
    UpdateZIndexProperty(value: number): void;
    UpdateWidthProperty(value: string): void;
    constructor();
    Show(): void;
    Hide(): void;
    SetShowCount(count: number): void;
    GetShowCount(): number;
    IsVisible(): boolean;
    GetZIndex(): number;
    GetWidth(): string;
    HandleElementScopeCreated_(params: IElementScopeCreatedCallbackParams, postAttributesCallback?: (() => void) | undefined): void;
    protected ToggleVisibility_(show: boolean): void;
}
export declare function OverlayElementCompact(): void;
