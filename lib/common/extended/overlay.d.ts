import { CustomElement } from "@benbraide/inlinejs-element";
export declare class Overlay extends CustomElement {
    protected showCount_: number;
    protected isVisibile_: boolean;
    protected zIndex_: number;
    protected width_: string;
    visibleClass: string;
    overflowClass: string;
    visibleTarget: HTMLElement | null;
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
    protected ToggleVisibility_(show: boolean): void;
}
export declare function OverlayCompact(): void;
