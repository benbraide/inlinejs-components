import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class FormElement extends CustomElement {
    protected form_: HTMLFormElement | null;
    protected formMethod_: HTMLInputElement | null;
    ajax: boolean;
    state: boolean;
    refresh: boolean;
    reload: boolean;
    reset: boolean;
    novalidate: boolean;
    silent: boolean;
    upload: boolean;
    download: boolean;
    duplex: boolean;
    blob: boolean;
    save: boolean;
    UpdateMethodProperty(value: string): void;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected SetFormMethod_(method: string): void;
}
export declare function FormElementCompact(): void;
