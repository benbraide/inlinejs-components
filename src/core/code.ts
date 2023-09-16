import { DeepCopy, EvaluateLater, GetGlobal, IElementScopeCreatedCallbackParams, InferComponent, IsEqual, UseEffect } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class CodeElement extends CustomElement{
    @Property({  type: 'object', checkStoredObject: true })
    public context: HTMLElement | null = null;
    
    @Property({  type: 'string' })
    public name = '';

    @Property({  type: 'string' })
    public watch = '';
    
    @Property({  type: 'boolean' })
    public template = false;

    @Property({  type: 'boolean' })
    public effect = false;

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
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
                        callback: () => evaluate(),
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
                                    evaluate();
                                }
                            });
                        },
                    });
                }
                else{
                    evaluate();
                }
            }
            
            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function CodeElementCompact(){
    RegisterCustomElement(CodeElement, 'code');
}
