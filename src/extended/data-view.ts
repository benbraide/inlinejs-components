import { IElementScopeCreatedCallbackParams, IsObject } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class DataViewElement extends CustomElement{
    protected codeElement_: HTMLElement | null = null;

    protected classPrefix_ = 'dt-view-';
    protected value_: any = undefined;

    @Property({  type: 'string' })
    public UpdateClassPrefixProperty(value: string){
        this.classPrefix_ = value;
        this.Refresh_();
    }

    @Property({  type: 'object', checkStoredObject: true })
    public UpdateValueProperty(value: any){
        this.value_ = value;
        this.Refresh_();
    }

    public constructor(){
        super();
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        scope.AddPostProcessCallback(() => {
            this.codeElement_ = document.createElement('code');
            this.codeElement_.classList.add(this.CreateClassName_('container'));
            this.appendChild(this.codeElement_);
            this.Refresh_();
        });

        scope.AddUninitCallback(() => {
            this.codeElement_ = null;
        });

        super.HandleElementScopeCreated_({ scope, ...rest }, postAttributesCallback);
    }

    protected CreateClassName_(name: string){
        return `${this.classPrefix_}${name}`;
    }

    protected Refresh_(){
        if (!this.codeElement_){
            return;
        }
        
        while (this.codeElement_.firstChild){
            this.codeElement_.firstChild.remove();
        }

        if (this.value_ !== undefined){
            const rendered = this.RenderValue_(this.value_);
            (Array.isArray(rendered) ? rendered : [rendered]).forEach(el => this.codeElement_?.appendChild(el));
        }
    }

    protected RenderValue_(value: any){
        if (typeof value === 'string'){
            return this.CreateSpanValue_(`"${value}"`, ['value', 'string']);
        }

        if (typeof value === 'boolean'){
            return this.CreateSpanValue_((value ? 'true' : 'false'), ['value', 'boolean']);
        }

        if (typeof value === 'number'){
            return this.CreateSpanValue_(`${value}`, ['value', 'number']);
        }

        if (value === null){
            return this.CreateSpanValue_('null', ['value', 'null']);
        }
        
        if (Array.isArray(value)){
            const els: Array<HTMLElement> = [this.CreateSpanValue_('[', ['bracket', 'open-bracket'])], divEl = document.createElement('div');
            
            divEl.classList.add(this.CreateClassName_('collection'));
            divEl.classList.add(this.CreateClassName_('array'));

            value.forEach((item, index) => {
                const rendered = this.RenderValue_(item);
                (Array.isArray(rendered) ? rendered : [rendered]).forEach(el => divEl.appendChild(el));
                (index < (value.length - 1)) && divEl.appendChild(this.CreateSpanValue_(',', 'comma'));
            });

            els.push(divEl);
            els.push(this.CreateSpanValue_(']', ['bracket', 'close-bracket']));
            
            return els;
        }
        
        if (IsObject(value)){
            const els: Array<HTMLElement> = [this.CreateSpanValue_('{', ['brace', 'open-brace'])], divEl = document.createElement('div');

            divEl.classList.add(this.CreateClassName_('collection'));
            divEl.classList.add(this.CreateClassName_('object'));
            
            const entries = Object.entries(value);
            entries.forEach(([key, value], index) => {
                const codeEl = document.createElement('code');

                codeEl.appendChild(this.CreateSpanValue_(`${key}:`, 'key'));
                divEl.appendChild(codeEl);
                
                const rendered = this.RenderValue_(value);
                (Array.isArray(rendered) ? rendered : [rendered]).forEach(el => codeEl.appendChild(el));

                (index < (entries.length - 1)) && codeEl.appendChild(this.CreateSpanValue_(',', 'comma'));
            });

            els.push(divEl);
            els.push(this.CreateSpanValue_('}', ['brace', 'open-brace']));
            
            return els;
        }

        return this.CreateSpanValue_(JSON.stringify(value), ['value', 'unknown']);
    }

    protected CreateSpanValue_(value: string, className: string|Array<string>|null){
        const spanEl = document.createElement('span');
        spanEl.textContent = value;
        className && spanEl.classList.add(...(Array.isArray(className) ? className : [className]).map(cn => this.CreateClassName_(cn)));
        return spanEl;
    }
}

export function DataViewElementCompact(){
    RegisterCustomElement(DataViewElement, 'data-view');
}
