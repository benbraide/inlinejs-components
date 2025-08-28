import { EvaluateMagicProperty, IElementScopeCreatedCallbackParams, InsertHtml, InferComponent, ProcessDirectives } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export type XhrModeType = 'replace' | 'append' | 'prepend' | 'before' | 'after' | 'replacebefore' | 'replaceafter';

export class XhrElement extends CustomElement{
    protected loaded_ = false;
    protected src_: string | boolean | null | undefined = '';

    protected clearOn_: string | boolean | null | undefined = null;
    protected insertedElements_: Array<Element> | null = null;
    
    @Property({ type: 'object', checkStoredObject: true })
    public target: HTMLElement | null = null;

    @Property({ type: 'object', checkStoredObject: true })
    public transitionScope: HTMLElement | null = null;
    
    @Property({ type: 'string' })
    public mode: XhrModeType = 'replace';

    @Property({ type: 'boolean' })
    public always = false;

    @Property({ type: 'boolean' })
    public transition = false;

    @Property({ type: 'boolean' })
    public directives = false;

    @Property({ type: 'string' })
    public beforeremove = '';
    
    @Property({ type: 'string' })
    public beforeinsert = '';

    @Property({ type: 'string' })
    public afterremove = '';
    
    @Property({ type: 'string' })
    public afterinsert = '';

    @Property({ type: 'string' })
    public aftertransition = '';

    @Property({ type: 'string' })
    public UpdateSrcProperty(value: string){
        const previousSrc = this.src_;
        
        if (value === 'null'){
            this.src_ = null;
        }
        else if (value === 'undefined'){
            this.src_ = undefined;
        }
        else if (value === 'false'){
            this.src_ = false;
        }
        else{
            this.src_ = value;
        }
        
        if (this.always || this.src_ !== previousSrc){
            this.src_ === this.clearOn_ ? this.Clear_() : this.Fetch_();
        }
    }

    @Property({ type: 'string' })
    public UpdateClearOnProperty(value: string){
        if (value === 'null'){
            this.clearOn_ = null;
        }
        else if (value === 'undefined'){
            this.clearOn_ = undefined;
        }
        else if (value === 'false'){
            this.clearOn_ = false;
        }
        else{
            this.clearOn_ = value;
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

        scope.AddUninitCallback(() => {
            this.insertedElements_ = null;
            this.target = null;
            this.transitionScope = null;
        });
    }

    protected Fetch_(){
        if (this.loaded_ && this.src_ && typeof this.src_ === 'string'){
            const magicGet = EvaluateMagicProperty(this.componentId_, this, '$get', '$');
            magicGet ? magicGet(this.src_).then((data: string) => this.HandleData_(data)) : fetch(this.src_).then(res => res.text()).then(data => this.HandleData_(data));
        }
    }

    protected HandleData_(data: string){
        const target = (this.target || this);
        if (this.mode === 'before' || this.mode === 'replacebefore'){
            if (target.parentElement){
                this.mode === 'replacebefore' && this.Clear_();
                
                const template = document.createElement('template');
                template.innerHTML = data;
                
                this.insertedElements_ = Array.from(template.content.children);
                const component = (InferComponent(target.parentElement) || '');
                
                this.insertedElements_.forEach(child => {
                    target.parentElement!.insertBefore(child, target);
                    component && ProcessDirectives({ component, element: child as HTMLElement });
                });
            }
        }
        else if (this.mode === 'after' || this.mode === 'replaceafter'){
            if (target.parentElement){
                this.mode === 'replaceafter' && this.Clear_();
                
                const template = document.createElement('template');
                template.innerHTML = data;
                
                this.insertedElements_ = Array.from(template.content.children);
                const component = (InferComponent(target.parentElement) || '');

                this.insertedElements_.forEach(child => {
                    target.parentElement!.insertBefore(child, target.nextSibling);
                    component && ProcessDirectives({ component, element: child as HTMLElement });
                });
            }
        }
        else{
            InsertHtml({
                component: ((target === this) ? this.componentId_ : (InferComponent(target) || '')),
                element: target,
                html: data,
                type: this.mode,
                useTransition: this.transition,
                processDirectives: this.directives,
                transitionScope: this.transitionScope || undefined,
                beforeRemove: this.beforeremove ? beforeTransition => this.EvaluateExpression(this.beforeremove, {
                    disableFunctionCall: false,
                    params: [data, beforeTransition],
                    contexts: { data, beforeTransition },
                }) : undefined,
                beforeInsert: this.beforeinsert ? () => this.EvaluateExpression(this.beforeinsert, {
                    disableFunctionCall: false,
                    params: [data],
                    contexts: { data },
                }) : undefined,
                afterRemove: this.afterremove ? () => this.EvaluateExpression(this.afterremove, {
                    disableFunctionCall: false,
                    params: [data],
                    contexts: { data },
                }) : undefined,
                afterInsert: this.afterinsert ? () => this.EvaluateExpression(this.afterinsert, {
                    disableFunctionCall: false,
                    params: [data],
                    contexts: { data },
                }) : undefined,
                afterTransitionCallback: this.aftertransition ? () => this.EvaluateExpression(this.aftertransition, {
                    disableFunctionCall: false,
                    params: [data],
                    contexts: { data },
                }) : undefined,
            });
        }
    }

    protected Clear_(){
        if (this.mode === 'replace'){
            Array.from((this.target || this).children).forEach(child => child.remove());
        }
        
        this.insertedElements_?.forEach(element => element.remove());
        this.insertedElements_ = null;
    }
}

export function XhrElementCompact(){
    RegisterCustomElement(XhrElement, 'xhr');
}
