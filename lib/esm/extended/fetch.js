var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { GetGlobal, IsObject, JournalWarn } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class ProgressFetchElement extends CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.checkpoint_ = 0;
        this.defer = false;
        this.cycle = 100;
        this.seed = 0.045; // Default seed (0.45 = 4.5%)
        this.start = 0.036; // Default progress (0.036 = 3.6%)
        this.oncustomprogress = '';
    }
    Get(input, init) {
        const checkpoint = ++this.checkpoint_, evaluate = () => this.EvaluateExpression((this.oncustomprogress || this.textContent || '').trim(), {
            params: [progress, isComplete],
            contexts: { progress, isComplete },
            disableFunctionCall: false,
        });
        const complete = (value) => {
            isComplete = true;
            progress = value;
            evaluate();
        };
        const addProgress = () => {
            if (!isComplete && checkpoint == this.checkpoint_) {
                progress = (progress || 0) + Math.random() * this.seed;
                this.seed && evaluate();
                this.seed && this.cycle && window.setTimeout(addProgress, this.cycle);
            }
        };
        const onUploadProgress = (e) => {
            if (checkpoint === this.checkpoint_) {
                const fraction = e.lengthComputable ? e.loaded / e.total : 0;
                if (fraction) {
                    progress = fraction / 2;
                    evaluate();
                }
            }
        };
        const onDownloadProgress = (e) => {
            if (checkpoint === this.checkpoint_) {
                const fraction = e.lengthComputable ? e.loaded / e.total : 0;
                if (fraction) {
                    progress = 0.5 + (fraction / 2);
                    evaluate();
                }
            }
        };
        let isComplete = false, progress = null;
        return new Promise((resolve, reject) => {
            isComplete = false;
            progress = Math.random() * this.start;
            this.start && evaluate();
            this.cycle && window.setTimeout(addProgress, this.cycle);
            let method;
            if (init) {
                method = init.method || 'get';
            }
            else {
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
    Mount() {
        GetGlobal().SetFetchConcept(this);
    }
    HandlePostAttributesProcessPostfix_() {
        super.HandlePostAttributesProcessPostfix_();
        !this.defer && this.Mount();
    }
    Fetch_(url, method, handlers, init) {
        const request = new XMLHttpRequest(), clean = () => {
            request.upload && request.upload.removeEventListener('error', onError);
            request.upload && request.upload.removeEventListener('load', handlers.upload);
            request.upload && request.upload.removeEventListener('progress', handlers.upload);
            request.removeEventListener('error', onError);
            request.removeEventListener('load', onLoad);
            request.removeEventListener('progress', handlers.download);
        };
        const onLoad = (e) => {
            handlers.download(e);
            handlers.success(request.responseText);
            clean();
        };
        const onError = (e) => {
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
        request.send(this.TransformRequestInit_((init === null || init === void 0 ? void 0 : init.body) || null));
    }
    TransformRequestInit_(body) {
        if (!body) {
            return null;
        }
        if (IsObject(body)) {
            const formData = new FormData();
            Object.entries(body).forEach(([key, value]) => formData.append(key, (value instanceof Blob) ? value : String(value)));
            return formData;
        }
        if (body instanceof ReadableStream) {
            JournalWarn('ProgressFetchElement does not support ReadableStream bodies.', 'hx-progress-fetch::TransformRequestInit_', this);
            return null;
        }
        return body;
    }
}
__decorate([
    Property({ type: 'boolean' })
], ProgressFetchElement.prototype, "defer", void 0);
__decorate([
    Property({ type: 'number' })
], ProgressFetchElement.prototype, "cycle", void 0);
__decorate([
    Property({ type: 'number' })
], ProgressFetchElement.prototype, "seed", void 0);
__decorate([
    Property({ type: 'number' })
], ProgressFetchElement.prototype, "start", void 0);
__decorate([
    Property({ type: 'string' })
], ProgressFetchElement.prototype, "oncustomprogress", void 0);
export function ProgressFetchElementCompact() {
    RegisterCustomElement(ProgressFetchElement, 'progress-fetch');
}
