import { FindComponentById, GetGlobal, IResourceConcept, InsertHtml } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

/**
 * ComponentElement - Dynamic component loader for InlineJS
 * 
 * Loads and renders component content dynamically from external sources.
 * Supports caching, sanitization, callbacks, and automatic URL construction.
 * 
 * @example
 * ```html
 * <!-- Load by name with prefix -->
 * <injs-component name="header" load="true" src-prefix="/components"></injs-component>
 * 
 * <!-- Load from specific URL -->
 * <injs-component src="/templates/navbar.html" load="true" sanitize="true"></injs-component>
 * 
 * <!-- With callbacks -->
 * <injs-component name="modal" load="true" onloaded="console.log('loaded')" onready="$modal.show()"></injs-component>
 * ```
 */
export class ComponentElement extends CustomElement{
    /** Component name for automatic URL construction */
    @Property({ type: 'string' })
    public name = '';

    /** URL prefix for component loading when using name-based loading */
    @Property({ type: 'string' })
    public srcPrefix = '';

    /** Complete URL to load component content from */
    @Property({ type: 'string' })
    public src = '';

    /** Whether to automatically load the component */
    @Property({ type: 'boolean' })
    public load = false;

    /** Whether to append to existing content (true) or replace it (false) */
    @Property({ type: 'boolean' })
    public extend = false;

    /** Whether to use resource caching for loaded content */
    @Property({ type: 'boolean' })
    public cache = false;

    /** Expression to execute after content is loaded */
    @Property({ type: 'string' })
    public onloaded = '';
    
    /** Expression to execute after transitions are complete */
    @Property({ type: 'string' })
    public onready = '';

    /** Whether to sanitize the loaded HTML content */
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

/**
 * Register the ComponentElement as a custom element with tag name 'component'
 * Call this function to make <injs-component> elements available in the DOM
 */
export function ComponentElementCompact(){
    RegisterCustomElement(ComponentElement, 'component');
}
