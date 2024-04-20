import { GetGlobal, IElementScopeCreatedCallbackParams, IResourceConcept } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class ScriptElement extends CustomElement{
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
            const insertScript = () => {
                const content = (this.textContent || '').trim();
                if (!content){
                    return;
                }

                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.textContent = content;

                document.body.appendChild(script);
                scope.AddUninitCallback(() => script.remove());
            };
            
            if (this.src){
                const resourceConcept = GetGlobal().GetConcept<IResourceConcept>('resource');
                if (resourceConcept){
                    resourceConcept.GetScript(this.src);
                }
                else{
                    insertScript();
                }
            }
            else{
                insertScript();
            }
            
            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function ScriptElementCompact(){
    RegisterCustomElement(ScriptElement, 'script');
}
