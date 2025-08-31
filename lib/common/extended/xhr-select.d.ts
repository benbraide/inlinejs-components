import { IElementScope, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { XhrElement } from "./xhr";
export declare class XhrSelectElement extends XhrElement {
    protected select_: HTMLSelectElement | null;
    constructor();
    protected HandleElementScopeCreatedPrefix_(params: IElementScopeCreatedCallbackParams): void;
    protected HandleElementScopeDestroyed_(scope: IElementScope): void;
    protected HandleData_(data: string): void;
}
export declare function XhrSelectElementCompact(): void;
