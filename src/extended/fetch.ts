import { GetGlobal, IElementScopeCreatedCallbackParams, IFetchConcept, IsObject, JournalWarn } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

interface IProgressHandlers{
    download(e: ProgressEvent<XMLHttpRequestEventTarget>): void;
    upload(e: ProgressEvent<XMLHttpRequestEventTarget>): void;
    success(data: string): void;
    error(err: string, code: number): void;
}

type ProgressRequestInitType = XMLHttpRequestBodyInit | RequestInit | Record<string, any>;

export class ProgressFetchElement extends CustomElement implements IFetchConcept{
    protected checkpoint_ = 0;

    @Property({ type: 'boolean' })
    public defer = false;

    @Property({ type: 'number' })
    public cycle = 100;

    @Property({ type: 'number' })
    public seed = 0.045;// Default seed (0.45 = 4.5%)

    @Property({ type: 'number' })
    public start = 0.036;// Default progress (0.036 = 3.6%)

    @Property({ type: 'string' })
    public oncustomprogress = '';
    
    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    public Get(input: RequestInfo, init?: RequestInit){
        const checkpoint = ++this.checkpoint_, evaluate = () => this.EvaluateExpression((this.oncustomprogress || this.textContent || '').trim(), {
            params: [progress, isComplete],
            contexts: {progress, isComplete},
            disableFunctionCall: false,
        });

        const complete = (value: number) => {
            isComplete = true;
            progress = value;
            evaluate();
        };

        const addProgress = () => {
            if (!isComplete && checkpoint == this.checkpoint_){
                progress = (progress || 0) + Math.random() * this.seed;
                this.seed && evaluate();
                this.seed && this.cycle && window.setTimeout(addProgress, this.cycle);
            }
        };

        const onUploadProgress = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
            if (checkpoint === this.checkpoint_){
                const fraction = e.lengthComputable ? e.loaded / e.total : 0;
                if (fraction){
                    progress = fraction / 2;
                    evaluate();
                }
            }
        };

        const onDownloadProgress = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
            if (checkpoint === this.checkpoint_){
                const fraction = e.lengthComputable ? e.loaded / e.total : 0;
                if (fraction){
                    progress = 0.5 + (fraction / 2);
                    evaluate();
                }
            }
        };

        let isComplete = false, progress: number | null = null;
        return new Promise<Response>((resolve, reject) => {
            isComplete = false;
            progress = Math.random() * this.start;
            this.start && evaluate();
            this.cycle && window.setTimeout(addProgress, this.cycle);
            let method: string;
            if (init){
                method = init.method || 'get';
            }
            else{
                method = typeof input === 'string' ? 'get' : input.method;
            }

            this.Fetch_(typeof input === 'string' ? input : input.url, method, {
                download: onDownloadProgress,
                upload: onUploadProgress,
                success: (data) => {
                    checkpoint === this.checkpoint_ && complete(1);
                    resolve(new Response(data));
                },
                error: (err, code) => {
                    checkpoint === this.checkpoint_ && complete(0);
                    reject({ err, code });
                },
            }, init);
        });
    }

    public Mount(){
        GetGlobal().SetFetchConcept(this);
    }

    protected HandlePostAttributesProcessPostfix_(): void {
        super.HandlePostAttributesProcessPostfix_();
        !this.defer && this.Mount();
    }

    protected Fetch_(url: string, method:string, handlers: IProgressHandlers, init?: RequestInit | null){
        const request = new XMLHttpRequest(), clean = () => {
            request.upload && request.upload.removeEventListener('error', onError);
            request.upload && request.upload.removeEventListener('load', handlers.upload);
            request.upload && request.upload.removeEventListener('progress', handlers.upload);
            request.removeEventListener('error', onError);
            request.removeEventListener('load', onLoad);
            request.removeEventListener('progress', handlers.download);
        };
        const onLoad = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
            handlers.download(e);
            handlers.success(request.responseText);
            clean();
        };
        const onError = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
            handlers.error(request.statusText, request.status);
            clean();
        };
        request.addEventListener('progress', handlers.download);
        request.addEventListener('load', onLoad);
        request.addEventListener('error', onError);
        request.upload && request.upload.addEventListener('progress', handlers.upload);
        request.upload && request.upload.addEventListener('load', handlers.upload);
        request.upload && request.upload.addEventListener('error', onError);
        request.open(method, url, true);
        request.send(this.TransformRequestInit_(init?.body || null));
    }

    protected TransformRequestInit_(body: BodyInit | null): XMLHttpRequestBodyInit | null {
        if (!body) {
            return null;
        }

        if (IsObject(body)) {
            const formData = new FormData();
            Object.entries(body as Record<string, any>).forEach(([key, value]) => formData.append(key, (value instanceof Blob) ? value : String(value)));
            return formData;
        }

        if (body instanceof ReadableStream) {
            JournalWarn('ProgressFetchElement does not support ReadableStream bodies.', 'hx-progress-fetch::TransformRequestInit_', this);
            return null;
        }

        return body as XMLHttpRequestBodyInit;
    }
}

export function ProgressFetchElementCompact(){
    RegisterCustomElement(ProgressFetchElement, 'progress-fetch');
}
