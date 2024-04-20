import { GetGlobal, IElementScopeCreatedCallbackParams, IResourceConcept } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class StyleElement extends CustomElement{
    @Property({  type: 'string' })
    public src = '';

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            const insertStyle = () => {
                const content = (this.textContent || '').trim();
                if (!content){
                    return;
                }

                const style = document.createElement('style');
                style.textContent = content;

                document.head.appendChild(style);
                scope.AddUninitCallback(() => style.remove());
            };
            
            if (this.src){
                const resourceConcept = GetGlobal().GetConcept<IResourceConcept>('resource');
                if (resourceConcept){
                    resourceConcept.GetStyle(this.src);
                }
                else{
                    insertStyle();
                }
            }
            else{
                insertStyle();
            }
            
            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function StyleElementCompact(){
    RegisterCustomElement(StyleElement, 'style');
}
