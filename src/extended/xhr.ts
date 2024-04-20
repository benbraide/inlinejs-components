import { EvaluateMagicProperty, IElementScopeCreatedCallbackParams, InsertHtml, InferComponent, ProcessDirectives } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export type XhrModeType = 'replace' | 'append' | 'prepend' | 'before' | 'after';

export class XhrElement extends CustomElement{
    protected loaded_ = false;
    protected src_ = '';
    
    @Property({ type: 'object', checkStoredObject: true })
    public target: HTMLElement | null = null;
    
    @Property({ type: 'string' })
    public mode: XhrModeType = 'replace';

    @Property({ type: 'boolean' })
    public always = false;

    @Property({ type: 'string' })
    public UpdateSrcProperty(value: string){
        if (this.always || this.src_ !== value){
            this.src_ = value;
            this.Fetch_();
        }
    }

    public constructor(){
        super();
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.loaded_ = true;
            this.Fetch_();
            postAttributesCallback && postAttributesCallback();
        });
    }

    protected Fetch_(){
        if (this.loaded_ && this.src_){
            const magicGet = EvaluateMagicProperty(this.componentId_, this, '$get', '$');
            magicGet ? magicGet(this.src_).then((data: string) => this.HandleData_(data)) : fetch(this.src_).then(res => res.text()).then(data => this.HandleData_(data));
        }
    }

    protected HandleData_(data: string){
        const target = (this.target || this);
        if (this.mode === 'before'){
            const template = document.createElement('template');
            template.innerHTML = data;
            if (target.parentElement){
                Array.from(template.content.children).forEach(child => target.parentElement!.insertBefore(child, target));
                ProcessDirectives({
                    component: (InferComponent(target.parentElement) || ''),
                    element: target.parentElement,
                });
            }
        }
        else if (this.mode === 'after'){
            const template = document.createElement('template');
            template.innerHTML = data;
            if (target.parentElement){
                Array.from(template.content.children).forEach(child => target.parentElement!.insertBefore(child, target.nextSibling));
                ProcessDirectives({
                    component: (InferComponent(target.parentElement) || ''),
                    element: target.parentElement,
                });
            }
        }
        else{
            InsertHtml({
                component: ((target === this) ? this.componentId_ : (InferComponent(target) || '')),
                element: target,
                html: data,
                type: this.mode,
                afterTransitionCallback: () => {},//Enable transitions
            });
        }
    }
}

export function XhrElementCompact(){
    RegisterCustomElement(XhrElement, 'xhr');
}
