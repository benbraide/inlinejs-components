import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class FormElement extends CustomElement {
    protected form_: HTMLFormElement | null;
    protected formMethod_: HTMLInputElement | null;
    ajax: boolean;
    state: boolean;
    UpdateMethodProperty(value: string): void;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected SetFormMethod_(method: string): void;
}
export declare function FormElementCompact(): void;
