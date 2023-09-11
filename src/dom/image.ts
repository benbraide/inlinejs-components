import {
    FindComponentById,
    IElementScopeCreatedCallbackParams,
    IIntersectionObserver,
    IIntersectionOptions,
    IntersectionObserver,
    IsObject,
    ResizeObserver
} from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

export class Image extends CustomElement{
    protected loaded_ = false;

    protected paragraph_: HTMLParagraphElement | null = null;
    protected image_: HTMLImageElement | null = null;

    protected intersectionObserver_: IIntersectionObserver | null = null;
    protected resizeObserver_: ResizeObserver | null = null;

    protected fit_ = false;
    protected fitType_ = 'contain';

    @Property({ type: 'object' })
    public lazyOptions: HTMLElement | IIntersectionOptions | null = null;

    @Property({ type: 'number' })
    public lazyThreshold = 0.90;

    @Property({ type: 'boolean' })
    public lazy = false;

    @Property({ type: 'string' })
    public UpdateSrcProperty(value: string){
        this.image_ && this.image_.src !== value && this.loaded_ && this.SetImageSrc_(value);
    }

    @Property({ type: 'boolean' })
    public UpdateFitProperty(value: boolean){
        if (this.fit_ !== value){
            this.fit_ = value;
            this.UpdateFit_();
        }
    }

    @Property({ type: 'string' })
    public UpdateFitTypeProperty(value: string){
        if (this.fitType_ !== value){
            this.fitType_ = value;
            this.UpdateFit_();
        }
    }

    public constructor(){
        super();
        this.style.display = 'flex';
        this.style.flexDirection = 'column';
        this.style.justifyContent = 'center';
        this.style.alignItems = 'center';
        this.style.overflow = 'hidden';
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        this.image_ = document.createElement('img');
        this.SetNativeElement_(this.image_);

        this.image_.addEventListener('load', () => {
            this.loaded_ = true;
            this.paragraph_ && (this.paragraph_.style.display = 'none');
            this.image_ && this.image_.style.removeProperty('display');
            this.UpdateFit_();
        });

        this.image_.addEventListener('error', () => {
            this.ShowParagraph_('Failed to load image.');
        });

        this.appendChild(this.image_);

        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.lazy ? this.EnableLazy_() : this.SetImageSrc_();
            postAttributesCallback && postAttributesCallback();
        });

        scope.AddUninitCallback(() => {
            this.paragraph_ = null;
            this.image_ = null;

            this.intersectionObserver_?.Unobserve(this);
            this.intersectionObserver_ = null;

            this.resizeObserver_?.Unobserve(this);
            this.resizeObserver_ = null;
        });

        this.resizeObserver_ = new ResizeObserver();
        this.resizeObserver_.Observe(this, () => this.UpdateFit_());
    }

    protected SetImageSrc_(value?: string){
        if (this.image_){
            this.ShowParagraph_('Loading image...');
            this.image_.src = (value || this.getAttribute('src') || '');
            this.loaded_ = false;
        }
    }
    
    protected UpdateFit_(){
        console.log('Fit update');
        if (!this.image_ || !this.loaded_){
            return;
        }
        
        if (this.fit_){
            const imageSize = { width: this.image_.naturalWidth, height: this.image_.naturalHeight };
            const containerSize = { width: this.clientWidth, height: this.clientHeight };
            
            let ratio: number;
            if (this.fitType_ === 'cover'){
                ratio = Math.max((containerSize.width / imageSize.width), (containerSize.height / imageSize.height));
            }
            else{//Contain
                ratio = Math.min((containerSize.width / imageSize.width), (containerSize.height / imageSize.height));
            }

            this.image_.style.width = `${imageSize.width * ratio}px`;
            this.image_.style.height = `${imageSize.height * ratio}px`;

            console.log('Fit updated');
        }
        else{
            this.image_.style.removeProperty('width');
            this.image_.style.removeProperty('height');
            console.log('Fit removed');
        }
    }

    protected EnableLazy_(){
        if (this.intersectionObserver_ || !this.lazy || !this.image_ || this.loaded_){
            return;
        }

        const options = (IsObject(this.lazyOptions) ? <IIntersectionOptions>this.lazyOptions : <IIntersectionOptions>{ root: this.lazyOptions });
        options.root = (options.root || null);
        options.rootMargin = (options.rootMargin || '0px');
        options.threshold = (options.threshold || this.lazyThreshold || 0);

        this.intersectionObserver_ = new IntersectionObserver((FindComponentById(this.componentId_)?.GenerateUniqueId('img_') || ''), options);
        this.intersectionObserver_.Observe(this, ({ entry } = {}) => {
            if (entry?.isIntersecting){
                this.intersectionObserver_?.Unobserve(this);
                this.intersectionObserver_ = null;
                this.SetImageSrc_();
            }
        });

        this.ShowParagraph_('Waiting for image to be in view...');
    }

    protected ShowParagraph_(text: string){
        if (!this.paragraph_){
            this.paragraph_ = document.createElement('p');
            this.paragraph_.style.margin = '0';
            this.paragraph_.style.padding = '0';
            this.paragraph_.style.fontSize = '1rem';
            this.paragraph_.style.fontFamily = 'sans-serif';
            this.paragraph_.style.fontWeight = '500';
            this.paragraph_.style.color = 'rgba(0, 0, 0, 0.5)';
            this.paragraph_.style.textAlign = 'center';
            this.paragraph_.style.userSelect = 'none';
            this.appendChild(this.paragraph_);
        }

        this.paragraph_.textContent = (this.image_?.alt || text);
        this.paragraph_!.style.display = 'block';
        this.image_ && (this.image_.style.display = 'none');
    }
}

export function ImageCompact(){
    RegisterCustomElement(Image);
}
