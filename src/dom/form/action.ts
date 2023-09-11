import { EvaluateLater, FindAncestorByTagName, GetGlobal, IElementScopeCreatedCallbackParams, JournalError } from "@benbraide/inlinejs";
import { CustomElement, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class FormAction extends CustomElement{
    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, postAttributesCallback);
        const form = FindAncestorByTagName(this, 'FORM');
        if (form){
            const content = (this.textContent || '').trim();
            const evaluate = EvaluateLater({
                componentId: this.componentId_,
                contextElement: this,
                expression: content,
                disableFunctionCall: true,
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                evaluate();
            });
        }
        else{
            JournalError('Form action must be used within a form element', GetGlobal().GetConfig().GetElementName('form-action'), this);
        }
    }
}

export function FormActionCompact(){
    RegisterCustomElement(FormAction);
}
