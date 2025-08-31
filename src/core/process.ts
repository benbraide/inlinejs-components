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

    protected HandlePostAttributesProcessPostfix_(): void {
        super.HandlePostAttributesProcessPostfix_();
        if (!this.active_ && this.callback_){
            this.callback_();
            this.callback_ = null;
        }
    }
}

export function ProcessElementCompact(){
    RegisterCustomElement(ProcessElement, 'process');
}
