import { IElementScope } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class StyleElement extends CustomElement{
    protected style_: HTMLStyleElement | HTMLLinkElement | null = null;
    
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
        this.style_?.remove();
        this.style_ = null;
    }

    protected HandlePostAttributesProcessPostfix_(): void {
        super.HandlePostAttributesProcessPostfix_();

        const content = (this.textContent || '').trim();
        if (!content && !this.src){
            return;
        }

        if (this.src){
            const link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = this.src;
            this.style_ = link;
        }
        else{
            const style = document.createElement('style');
            style.textContent = content;
            this.style_ = style;
        }

        document.body.appendChild(this.style_);
    }
}

export function StyleElementCompact(){
    RegisterCustomElement(StyleElement, 'style');
}
