import { EvaluateLater, IElementScopeCreatedCallbackParams, InferComponent } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class EventElement extends CustomElement{
    @Property({  type: 'object', checkStoredObject: true })
    public target: HTMLElement | typeof globalThis | Document | null = null;
    
    @Property({  type: 'object', checkStoredObject: true })
    public context: HTMLElement | null = null;
    
    @Property({  type: 'string' })
    public type = '';
    
    @Property({  type: 'boolean' })
    public once = false;

    @Property({  type: 'boolean' })
    public prevent = false;
    
    @Property({  type: 'boolean' })
    public stop = false;

    @Property({  type: 'boolean' })
    public stopImmediate = false;

    @Property({  type: 'boolean' })
    public window = false;

    @Property({  type: 'boolean' })
    public document = false;

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            const target = (this.target || (this.window && window) || (this.document && document) || this.parentElement), type = this.type;
            if (target && type){
                const evaluate = EvaluateLater({
                    componentId: ((this.context && InferComponent(this.context)?.GetId()) || this.componentId_),
                    contextElement: (this.context || this),
                    expression: (this.textContent || '').trim(),
                    disableFunctionCall: false,
                });

                const handler = (event: Event) => {
                    this.prevent && event.preventDefault();

                    this.stop && event.stopPropagation();
                    this.stopImmediate && event.stopImmediatePropagation();
                    
                    evaluate(undefined, [event], { event });
                    this.once && target.removeEventListener(type, handler);
                };

                target.addEventListener(type, handler);
            }
            
            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function EventElementCompact(){
    RegisterCustomElement(EventElement, 'event');
}
