import { FindComponentById, GetGlobal, IResourceConcept, InsertHtml } from "@benbraide/inlinejs";
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

    @Property({ type: 'boolean' })
    public cache = false;

    @Property({ type: 'string' })
    public onloaded = '';
    
    @Property({ type: 'string' })
    public onready = '';

    @Property({ type: 'boolean' })
    public sanitize = false;

    public constructor(){
        super();
    }

    protected HandlePostAttributesProcessPostfix_(): void {
        super.HandlePostAttributesProcessPostfix_();
        
        const component = FindComponentById(this.componentId_);
        if (!component) return;

        const scope = component.FindElementScope(this);
        if (!scope) return;
        
        if (component?.GetRoot() === this){
            component.SetName(this.name);
            scope.SetLocal('$name', this.name);
        }

        let src = '';
        if (!this.src && this.load && this.srcPrefix){
            src = (this.srcPrefix.endsWith('/') ? `${this.srcPrefix}components/${this.name}` : `${this.srcPrefix}/components/${this.name}`);
            src = (src.startsWith('/') ? src : `/${src}`);
        }
        else{
            src = (this.src || (this.load ? `/components/${this.name}` : ''));
        }

        if (src){//Load component
            const insertText = (text: string) => {
                const insert = () => InsertHtml({
                    type: (this.extend ? 'append' : 'replace'),
                    component: this.componentId_,
                    element: this,
                    html: text,
                    sanitize: this.sanitize,
                    afterInsert: () => (this.onloaded && this.EvaluateExpression(this.onloaded, { disableFunctionCall: false })),
                    afterTransitionCallback: () => (this.onready && this.EvaluateExpression(this.onready, { disableFunctionCall: false })),
                });
                
                this.storedProxyAccessHandler_ ? this.storedProxyAccessHandler_(insert) : insert();
            };

            const resourceConcept = (this.cache ? GetGlobal().GetConcept<IResourceConcept>('resource') : null);
            if (!resourceConcept){
                GetGlobal().GetFetchConcept().Get(src, {
                    method: 'GET',
                    credentials: 'same-origin',
                }).then(res => res.text()).then(insertText);
            }
            else{//Use resource
                resourceConcept.GetData(src).then((data) => {
                    Array.isArray(data) ? insertText(data[0] || '') : insertText(data);
                });
            }
        }
    }
}

export function ComponentElementCompact(){
    RegisterCustomElement(ComponentElement, 'component');
}
