import { IElementScopeCreatedCallbackParams, IsObject, ToString } from "@benbraide/inlinejs";
import { RegisterCustomElement } from "@benbraide/inlinejs-element";
import { XhrElement } from "./xhr";

export class XhrSelectElement extends XhrElement{
    protected select_: HTMLSelectElement | null = null;
    
    public constructor(){
        super();
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        this.select_ = document.createElement('select');
        this.SetNativeElement_(this.select_);
        this.appendChild(this.select_);
        super.HandleElementScopeCreated_({ scope, ...rest }, postAttributesCallback);
        scope.AddUninitCallback(() => (this.select_ = null));
    }

    protected HandleData_(data: string){
        if (!this.select_){
            return;
        }

        if (this.mode === 'replace'){
            while (this.select_.firstChild){
                this.select_.removeChild(this.select_.firstChild);
            }
        }
        
        try{
            let json = JSON.parse(data);
            if (IsObject(json)){
                json = Object.entries(json).map(([key, value]) => ({ value: key, text: value }));
            }
            
            if (!Array.isArray(json)){
                return;
            }
            
            ((this.mode === 'prepend') ? json.reverse() : json).filter(item => !!item).forEach((item) => {
                const isObject = IsObject(item);

                const option = document.createElement('option');
                option.value = ToString(isObject ? (item.value ?? item.text) : item);
                option.text = ToString(isObject ? (item.text ?? item.value) : item);
                
                (this.mode === 'prepend') ? this.select_!.prepend(option) : this.select_!.appendChild(option);
            });
        }
        catch{}
    }
}

export function XhrSelectElementCompact(){
    RegisterCustomElement(XhrSelectElement, 'xhr-select');
}
