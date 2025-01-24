import { IElementScopeCreatedCallbackParams, IFetchConcept } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
interface IProgressHandlers {
    download(e: ProgressEvent<XMLHttpRequestEventTarget>): void;
    upload(e: ProgressEvent<XMLHttpRequestEventTarget>): void;
    success(data: string): void;
    error(err: string, code: number): void;
}
declare type ProgressRequestInitType = XMLHttpRequestBodyInit | RequestInit | Record<string, any>;
export declare class ProgressFetchElement extends CustomElement implements IFetchConcept {
    protected checkpoint_: number;
    defer: boolean;
    cycle: number;
    seed: number;
    start: number;
    oncustomprogress: string;
    constructor();
    Get(input: RequestInfo, init?: RequestInit): Promise<Response>;
    Mount(): void;
    protected HandleElementScopeCreated_(params: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected Fetch_(url: string, method: string, handlers: IProgressHandlers, init?: RequestInit): void;
    protected TransformRequestInit_(init: ProgressRequestInitType): XMLHttpRequestBodyInit;
}
export declare function ProgressFetchElementCompact(): void;
export {};
