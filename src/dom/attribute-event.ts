import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class AttributeEventElement extends CustomElement{
    @Property({  type: 'object', checkStoredObject: true })
    public target: HTMLElement | null = null;
    
    @Property({  type: 'object', checkStoredObject: true })
    public context: HTMLElement | null = null;
    
    @Property({  type: 'array', checkStoredObject: true })
    public type: Array<string> | string = '';

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            const target = (this.target || this.parentElement), type = this.type;
            if (target && type){
                (Array.isArray(type) ? type : [type]).forEach((t) => target.setAttribute(`on${t}`, (this.textContent || '')));
                scope.AddUninitCallback(() => (Array.isArray(type) ? type : [type]).forEach((t) => target.removeAttribute(`on${t}`)));
            }
            
            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function AttributeEventElementCompact(){
    RegisterCustomElement(AttributeEventElement, 'attribute-event');
}
