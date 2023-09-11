import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { Xhr } from "./xhr";
export declare class XhrSelect extends Xhr {
    protected select_: HTMLSelectElement | null;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected HandleData_(data: string): void;
}
export declare function XhrSelectCompact(): void;
