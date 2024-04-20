import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { XhrElement } from "./xhr";
export declare class XhrSelectElement extends XhrElement {
    protected select_: HTMLSelectElement | null;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected HandleData_(data: string): void;
}
export declare function XhrSelectElementCompact(): void;
