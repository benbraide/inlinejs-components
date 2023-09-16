import { EvaluateMagicProperty, FindComponentById, IElementScopeCreatedCallbackParams, InsertHtml } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class ComponentElement extends CustomElement{
    @Property({ type: 'string' })
    public name = '';

    @Property({ type: 'string' })
    public srcPrefix = '';

    @Property({ type: 'string' })
    public src = '';

    @Property({ type: 'boolean' })
    public load = false;

    @Property({ type: 'boolean' })
    public extend = false;

    public constructor(){
        super({ isHidden: true });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            const component = FindComponentById(this.componentId_);
            if (component?.GetRoot() === this){
                component.SetName(this.name);
                scope.SetLocal('$name', this.name);
            }

            let src = '';
            if (!this.src && this.srcPrefix){
                src = (this.srcPrefix.endsWith('/') ? `${this.srcPrefix}components/${this.name}` : `${this.srcPrefix}/components/${this.name}`);
                src = (src.startsWith('/') ? src : `/${src}`);
            }
            else{
                src = (this.src || (this.load ? `/components/${this.name}` : ''));
            }

            if (src){//Load component
                const magicGet = EvaluateMagicProperty(this.componentId_, this, '$get', '$'), insertText = (text: string) => InsertHtml({
                    type: (this.extend ? 'append' : 'replace'),
                    component: this.componentId_,
                    element: this,
                    html: text,
                });

                magicGet ? magicGet(src).then(insertText) : fetch(src).then(res => res.text()).then(insertText);
            }

            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function ComponentElementCompact(){
    RegisterCustomElement(ComponentElement, 'component');
}
