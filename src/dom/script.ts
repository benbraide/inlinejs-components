import { IElementScope } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class ScriptElement extends CustomElement{
    protected script_: HTMLScriptElement | null = null;
    
    @Property({  type: 'string' })
    public src = '';

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    protected HandleElementScopeDestroyed_(scope: IElementScope): void {
        super.HandleElementScopeDestroyed_(scope);
        this.script_?.remove();
        this.script_ = null;
    }

    protected HandlePostAttributesProcessPostfix_(): void {
        super.HandlePostAttributesProcessPostfix_();

        const content = (this.textContent || '').trim();
        if (!content && !this.src){
            return;
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';

        if (this.src){
            script.src = this.src;
        }
        else{
            script.textContent = content;
        }

        document.body.appendChild(script);
        this.script_ = script;
    }
}

export function ScriptElementCompact(){
    RegisterCustomElement(ScriptElement, 'script');
}
