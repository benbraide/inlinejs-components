import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class ComponentElement extends CustomElement {
    name: string;
    srcPrefix: string;
    src: string;
    load: boolean;
    extend: boolean;
    cache: boolean;
    onloaded: string;
    onready: string;
    sanitize: boolean;
    constructor();
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function ComponentElementCompact(): void;
