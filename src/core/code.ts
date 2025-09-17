import { DeepCopy, EvaluateLater, GetGlobal, InferComponent, IsEqual, UseEffect } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

/**
 * CodeElement - JavaScript code execution with reactive context
 * 
 * Executes JavaScript code with specified context, reactivity options, and dependency tracking.
 * Supports immediate execution, reactive effects, watched expressions, and template storage.
 * 
 * @example
 * ```html
 * <!-- Immediate execution -->
 * <injs-code>console.log('Hello!');</injs-code>
 * 
 * <!-- Reactive effect -->
 * <injs-code effect="true">$el.textContent = `Count: ${count}`;</injs-code>
 * 
 * <!-- Watch expression -->
 * <injs-code watch="user.name">document.title = `Welcome ${user.name}`;</injs-code>
 * 
 * <!-- Template for reuse -->
 * <injs-code name="validate" template="true">return email.includes('@');</injs-code>
 * ```
 */
export class CodeElement extends CustomElement{
    /** Element to use as execution context (defaults to this element) */
    @Property({  type: 'object', checkStoredObject: true })
    public context: HTMLElement | null = null;
    
    /** Name to register this code block under for later reuse */
    @Property({  type: 'string' })
    public name = '';

    /** Expression to watch for changes that trigger re-execution */
    @Property({  type: 'string' })
    public watch = '';
    
    /** Whether this is a template (stored but not executed immediately) */
    @Property({  type: 'boolean' })
    public template = false;

    /** Whether to run as a reactive effect with dependency tracking */
    @Property({  type: 'boolean' })
    public effect = false;

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    protected HandlePostAttributesProcessPostfix_(): void {
        super.HandlePostAttributesProcessPostfix_();
        
        const content = (this.textContent || '').trim();
            
        this.name && GetGlobal().GetConcept<any>('code')?.AddBlock(this.name, content);
        if (!this.template){
            const evaluate = EvaluateLater({
                componentId: ((this.context && InferComponent(this.context)?.GetId()) || this.componentId_),
                contextElement: (this.context || this),
                expression: content,
                disableFunctionCall: true,
            });

            if (this.effect){
                UseEffect({
                    componentId: this.componentId_,
                    contextElement: this,
                    callback: () => this.EvaluateWithStoredProxyAccessHandler(evaluate),
                });
            }
            else if (this.watch){//Execute once on load and then whenever the watch expression changes
                let lastValue: any = undefined, isFirstEntry = true;
                UseEffect({
                    componentId: this.componentId_,
                    contextElement: this,
                    callback: () => {
                        EvaluateLater({
                            componentId: this.componentId_,
                            contextElement: this,
                            expression: this.watch,
                            disableFunctionCall: false,
                        })((value) => {
                            if (isFirstEntry || !IsEqual(value, lastValue)){
                                isFirstEntry = false;
                                lastValue = DeepCopy(value);
                                this.EvaluateWithStoredProxyAccessHandler(evaluate);
                            }
                        });
                    },
                });
            }
            else{
                this.EvaluateWithStoredProxyAccessHandler(evaluate);
            }
        }
    }
}

export function CodeElementCompact(){
    RegisterCustomElement(CodeElement, 'code');
}
