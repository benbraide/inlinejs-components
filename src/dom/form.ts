import { GetGlobal, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, NativeElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

const NativeFormMethods = ['get', 'post', 'head', 'options'];
const NonNativeFormMethods = ['put', 'delete', 'patch'];

export class FormElement extends CustomElement{
    protected form_: HTMLFormElement | null = null;
    protected formMethod_: HTMLInputElement | null = null;
    
    @Property({  type: 'boolean' })
    public ajax = false;

    @Property({  type: 'boolean' })
    public state = false;

    @Property({  type: 'string' })
    public UpdateMethodProperty(value: string){
        this.SetFormMethod_(value);
    }

    public constructor(){
        super();
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        this.form_ = document.createElement('form');
        this.SetNativeElement_(this.form_);
        this.appendChild(this.form_);

        Array.from(this.children).forEach((child) => {//Move children to form
            if (child !== this.nativeElement_ && !(child instanceof NativeElement)){
                child.remove();
                this.nativeElement_!.appendChild(child);
            }
        });
        
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.ajax && this.form_?.setAttribute(GetGlobal().GetConfig().GetDirectiveName('form'), '');
            this.state && this.form_?.setAttribute(GetGlobal().GetConfig().GetDirectiveName('state'), '');
            postAttributesCallback && postAttributesCallback();
        });

        scope.AddUninitCallback(() => {
            this.form_ = null;
            this.formMethod_ = null;
        });
    }

    protected SetFormMethod_(method: string){
        if (!this.form_){
            return;
        }

        method = (method || 'get').toLowerCase();
        method = ((NativeFormMethods.includes(method) || NonNativeFormMethods.includes(method)) ? method : 'get');
        
        const nativeMethod = (NativeFormMethods.includes(method) ? method : 'post');
        if (nativeMethod !== method){//Add hidden input for non-native methods
            if (!this.formMethod_){//Create hidden input
                this.formMethod_ = document.createElement('input');
                this.formMethod_.type = 'hidden';
                this.formMethod_.name = '_method';
                this.form_.appendChild(this.formMethod_);
            }

            this.formMethod_.value = method;
        }
        else if (this.formMethod_){//Remove hidden input
            this.formMethod_.remove();
            this.formMethod_ = null;
        }
        
        this.form_.method = method;
    }
}

export function FormElementCompact(){
    RegisterCustomElement(FormElement, 'form');
}
