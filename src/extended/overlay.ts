import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class OverlayElement extends CustomElement{
    protected showCount_ = 0;
    protected isVisibile_ = false;

    protected zIndex_ = 999;
    protected width_ = '100vw';

    @Property({ type: 'string' })
    public visibleClass = 'overlay';

    @Property({ type: 'string' })
    public overflowClass = 'overflow';

    @Property({ type: 'object', checkStoredObject: true })
    public visibleTarget: HTMLElement | null = null;

    @Property({ type: 'boolean' })
    public custom = false;

    @Property({ type: 'number' })
    public UpdateZIndexProperty(value: number){
        this.zIndex_ = value;
        this.style.zIndex = `${value}`;
    }

    @Property({ type: 'string' })
    public UpdateWidthProperty(value: string){
        this.width_ = value;
        this.isVisibile_ && (this.style.width = value);
    }

    public constructor(){
        super();

        this.style.width = '0';
        this.style.zIndex = `${this.zIndex_}`;

        this.addEventListener('click', (e: MouseEvent) => {
            window.dispatchEvent(new CustomEvent('overlay.click', {
                detail: { native: e, overlay: this, bubbled: (e.target !== this) },
            }));
        });
    }

    public Show(){
        ++this.showCount_;
        this.ToggleVisibility_(true);
    }

    public Hide(){
        (this.showCount_ > 0) && --this.showCount_;
        (this.showCount_ === 0) && this.ToggleVisibility_(false);
    }

    public SetShowCount(count: number){
        this.showCount_ = count;
        this.ToggleVisibility_(count > 0);
    }

    public GetShowCount(){
        return this.showCount_;
    }

    public IsVisible(){
        return this.isVisibile_;
    }

    public GetZIndex(){
        return this.zIndex_;
    }

    public GetWidth(){
        return this.width_;
    }
    
    public HandleElementScopeCreated_(params: IElementScopeCreatedCallbackParams, postAttributesCallback?: (() => void) | undefined){
        super.HandleElementScopeCreated_(params, () => {
            if (!this.custom){
                this.style.position = 'fixed';
                this.style.top = '0';
                this.style.left = '0';
                this.style.height = '100vh';
                this.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                ('backdropFilter' in this.style) && ((this.style as any).backdropFilter = 'blur(4px)');
                this.style.overflow = 'hidden';
            }

            postAttributesCallback?.();
        });
    }

    protected ToggleVisibility_(show: boolean){
        if (show === this.isVisibile_){
            return;
        }
        
        const visibleTarget = (this.visibleTarget || document.body), isOverflow = (document.body.clientHeight < document.body.scrollHeight);
        if (show){
            this.visibleClass && visibleTarget.classList.add(this.visibleClass);
            isOverflow && this.overflowClass && visibleTarget.classList.add(this.overflowClass);
        }
        else{
            this.visibleClass && visibleTarget.classList.contains(this.visibleClass) && visibleTarget.classList.remove(this.visibleClass);
            this.overflowClass && visibleTarget.classList.contains(this.overflowClass) && visibleTarget.classList.remove(this.overflowClass);
        }

        this.isVisibile_ = show;
        this.style.width = (show ? this.width_ : '0');

        window.dispatchEvent(new CustomEvent('overlay.visibility', {
            detail: { overlay: this, isVisible: show },
        }));

        window.dispatchEvent(new CustomEvent(`overlay.${show ? 'visible' : 'hidden'}`, {
            detail: { overlay: this },
        }));
    }
}

export function OverlayElementCompact(){
    RegisterCustomElement(OverlayElement, 'overlay');
}
