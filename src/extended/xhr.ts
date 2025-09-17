import { EvaluateMagicProperty, IElementScopeCreatedCallbackParams, InsertHtml, InferComponent, ProcessDirectives, IElementScope } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

/** XHR insertion modes for content placement */
export type XhrModeType = 'replace' | 'append' | 'prepend' | 'before' | 'after' | 'replacebefore' | 'replaceafter';

/**
 * XhrElement - Advanced XHR content loading with transitions
 * 
 * Provides sophisticated content loading with multiple insertion modes, transitions,
 * and lifecycle callbacks. Supports dynamic source changes and conditional clearing.
 * 
 * @example
 * ```html
 * <!-- Basic content replacement -->
 * <injs-xhr src="/api/content" mode="replace"></injs-xhr>
 * 
 * <!-- With transitions and callbacks -->
 * <injs-xhr src="/api/news" mode="append" transition="true" 
 *     beforeinsert="showLoader(false)" afterinsert="updateLayout()"></injs-xhr>
 * 
 * <!-- Conditional loading -->
 * <injs-xhr hx-bind:src="selectedCategory ? `/api/items/${selectedCategory}` : null"
 *     clear-on="null" always="true"></injs-xhr>
 * ```
 */
export class XhrElement extends CustomElement{
    protected loaded_ = false;
    protected src_: string | boolean | null | undefined = '';

    protected clearOn_: string | boolean | null | undefined = null;
    protected insertedElements_: Array<Element> | null = null;
    
    /** Target element for content insertion (defaults to this element) */
    @Property({ type: 'object', checkStoredObject: true })
    public target: HTMLElement | null = null;

    /** Element to scope transitions to */
    @Property({ type: 'object', checkStoredObject: true })
    public transitionScope: HTMLElement | null = null;
    
    /** Content insertion mode - how to place the loaded content */
    @Property({ type: 'string' })
    public mode: XhrModeType = 'replace';

    /** Whether to always fetch even if source hasn't changed */
    @Property({ type: 'boolean' })
    public always = false;

    /** Whether to use transitions when inserting/removing content */
    @Property({ type: 'boolean' })
    public transition = false;

    /** Whether to process InlineJS directives in loaded content */
    @Property({ type: 'boolean' })
    public directives = false;

    /** Expression executed before removing existing content */
    @Property({ type: 'string' })
    public beforeremove = '';
    
    /** Expression executed before inserting new content */
    @Property({ type: 'string' })
    public beforeinsert = '';

    /** Expression executed after removing existing content */
    @Property({ type: 'string' })
    public afterremove = '';
    
    /** Expression executed after inserting new content */
    @Property({ type: 'string' })
    public afterinsert = '';

    /** Expression executed after transitions complete */
    @Property({ type: 'string' })
    public aftertransition = '';

    /**
     * Update the source URL and trigger content loading
     * @param value URL to load content from, or special values 'null', 'undefined', 'false'
     */
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

    /**
     * Set the value that triggers content clearing
     * @param value Value that when matched by src will clear content instead of loading
     */
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

    protected HandleElementScopeDestroyed_(scope: IElementScope): void {
        super.HandleElementScopeDestroyed_(scope);
        
        this.insertedElements_ = null;
        this.target = null;
        this.transitionScope = null;
    }

    protected HandlePostAttributesProcessPostfix_(): void {
        super.HandlePostAttributesProcessPostfix_();

        this.loaded_ = true;
        this.Fetch_();
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
