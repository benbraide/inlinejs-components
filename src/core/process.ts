import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class ProcessElement extends CustomElement{
    protected callback_: (() => void) | null = null;
    protected active_ = false;
    
    @Property({  type: 'boolean' })
    public UpdateActiveProperty(value: boolean){
        if (!this.active_ && (this.active_ = value) && this.callback_){
            this.callback_();
            this.callback_ = null;
        }
    };

    public constructor(){
        super({
            isTemplate: false,
            isHidden: false,
        });
    }

    public ProcessDirectivesCallback(callback: () => void){
        this.active_ ? callback() : (this.callback_ = callback);
    }

    protected HandleElementScopeCreated_(params: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_(params, () => {
            if (!this.active_ && this.callback_){
                this.callback_();
                this.callback_ = null;
            }

            postAttributesCallback?.();
        });
    }
}

export function ProcessElementCompact(){
    RegisterCustomElement(ProcessElement, 'process');
}
