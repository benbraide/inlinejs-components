import { GetGlobal, IElementScope, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, NativeElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

/** Native HTTP methods supported by forms */
const NativeFormMethods = ['get', 'post', 'head', 'options'];
/** HTTP methods that require spoofing via hidden input */
const NonNativeFormMethods = ['put', 'delete', 'patch'];

/**
 * FormElement - Enhanced form wrapper with AJAX capabilities
 * 
 * Creates an enhanced form with AJAX submission support, HTTP method spoofing,
 * and extensive configuration options for different submission behaviors.
 * 
 * @example
 * ```html
 * <!-- Basic AJAX form -->
 * <injs-form ajax="true" method="post">
 *     <input type="text" name="username" required>
 *     <button type="submit">Submit</button>
 * </injs-form>
 * 
 * <!-- File upload form -->
 * <injs-form ajax="true" upload="true" method="post">
 *     <input type="file" name="document" accept=".pdf">
 *     <button type="submit">Upload</button>
 * </injs-form>
 * 
 * <!-- RESTful form with custom method -->
 * <injs-form ajax="true" method="patch" reset="true">
 *     <input type="hidden" name="id" value="123">
 *     <input type="text" name="title">
 *     <button type="submit">Update</button>
 * </injs-form>
 * ```
 */
export class FormElement extends CustomElement{
    protected form_: HTMLFormElement | null = null;
    protected formMethod_: HTMLInputElement | null = null;
    
    /** Enable AJAX form submission instead of default browser behavior */
    @Property({  type: 'boolean' })
    public ajax = false;

    /** Enable state management for the form */
    @Property({  type: 'boolean' })
    public state = false;

    /** Refresh the page after successful submission */
    @Property({  type: 'boolean' })
    public refresh = false;

    /** Reload the page after successful submission */
    @Property({  type: 'boolean' })
    public reload = false;

    /** Reset the form after successful submission */
    @Property({  type: 'boolean' })
    public reset = false;

    /** Disable client-side form validation */
    @Property({  type: 'boolean' })
    public novalidate = false;

    /** Silent submission without loading indicators */
    @Property({  type: 'boolean' })
    public silent = false;

    /** Enable file upload support */
    @Property({  type: 'boolean' })
    public upload = false;

    /** Handle response as download */
    @Property({  type: 'boolean' })
    public download = false;

    /** Enable duplex communication */
    @Property({  type: 'boolean' })
    public duplex = false;

    /** Handle response as blob data */
    @Property({  type: 'boolean' })
    public blob = false;

    /** Save form data */
    @Property({  type: 'boolean' })
    public save = false;

    /**
     * Set the HTTP method for the form
     * Supports both native methods (GET, POST, HEAD, OPTIONS) and RESTful methods (PUT, DELETE, PATCH)
     * Non-native methods are implemented using method spoofing with a hidden _method input
     * @param value HTTP method name (case insensitive)
     */
    @Property({  type: 'string' })
    public UpdateMethodProperty(value: string){
        this.SetFormMethod_(value);
    }

    public constructor(){
        super();
    }

    protected HandleElementScopeCreatedPrefix_(params: IElementScopeCreatedCallbackParams): void {
        super.HandleElementScopeCreatedPrefix_(params);

        this.form_ = document.createElement('form');
        this.SetNativeElement_(this.form_);
        this.appendChild(this.form_);

        Array.from(this.children).forEach((child) => {//Move children to form
            if (child !== this.nativeElement_ && !(child instanceof NativeElement)){
                child.remove();
                this.nativeElement_!.appendChild(child);
            }
        });
    }

    protected HandlePostAttributesProcessPostfix_(): void {
        super.HandlePostAttributesProcessPostfix_();

        if (this.ajax){
            let directive = GetGlobal().GetConfig().GetDirectiveName('form');

            this.refresh && (directive += '.refresh');
            this.reload && (directive += '.reload');
            this.reset && (directive += '.reset');
            this.novalidate && (directive += '.novalidate');
            this.silent && (directive += '.silent');
            this.upload && (directive += '.upload');
            this.download && (directive += '.download');
            this.duplex && (directive += '.duplex');
            this.blob && (directive += '.blob');
            this.save && (directive += '.save');
            
            this.form_?.setAttribute(directive, '');
        }
        
        this.state && this.form_?.setAttribute(GetGlobal().GetConfig().GetDirectiveName('state'), '');
    }

    protected HandleElementScopeDestroyed_(scope: IElementScope): void {
        super.HandleElementScopeDestroyed_(scope);

        this.form_ = null;
        this.formMethod_ = null;
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
        
        this.form_.method = nativeMethod;
    }
}

export function FormElementCompact(){
    RegisterCustomElement(FormElement, 'form');
}
