import { IElementScopeCreatedCallbackParams, JournalTry, ToString } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { ISketchPlugin, SketchDrawStageType } from "../types";

export class Sketch extends CustomElement{
    protected shadow_: HTMLCanvasElement | null = null;
    protected ctx_: CanvasRenderingContext2D | null = null;

    protected isDrawing_ = false;
    protected plugins_: Record<string, Array<ISketchPlugin>> = {};

    @Property({ type: 'object', checkStoredObject: true })
    public plugin: Array<string> | string = '';

    @Property({ type: 'boolean' })
    public disabled = false;

    @Property({ type: 'number', spread: 'size' })
    public UpdateWidthProperty(value: number){
        this.style.width = `${value}px`;
        this.shadow_?.setAttribute('width', ToString(value));
    }
    
    @Property({ type: 'number', spread: 'size' })
    public UpdateHeightProperty(value: number){
        this.style.height = `${value}px`;
        this.shadow_?.setAttribute('height', ToString(value));
    }

    public constructor(){
        super();
        this.style.display = 'flex';
    }

    public GetContext(){
        return this.ctx_;
    }

    public GetNative(){
        return this.shadow_;
    }

    public GetBlob(type = 'image/png'){
        return (this.shadow_ ? new Promise<Blob | null>(resolve => this.shadow_!.toBlob(blob => resolve(blob), type)) : null);
    }

    public GetDataUrl(type = 'image/png'){
        return (this.shadow_ ? this.shadow_.toDataURL(type) : '');
    }

    public AddPlugin(plugin: ISketchPlugin){
        const name = plugin.GetName();
        this.plugins_[name] || (this.plugins_[name] = []);
        this.plugins_[name].push(plugin);
        plugin.SetCanvas(this.shadow_);
    }

    public RemovePlugin(plugin: ISketchPlugin){
        Object.entries(this.plugins_).forEach(([name, plugins]) => {
            this.plugins_[name] = plugins.filter(p => (p !== plugin));
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: (() => void) | undefined){
        super.HandleElementScopeCreated_({ scope, ...rest }, postAttributesCallback);
        scope.AddUninitCallback(() => (this.shadow_ = null));
        scope.AddPostProcessCallback(() => this.InitializeShadow_());
    }

    protected InitializeShadow_(){
        this.shadow_ = document.createElement('canvas');

        this.shadow_.setAttribute('width', (this.getAttribute('width') || '0'));
        this.shadow_.setAttribute('height', (this.getAttribute('height') || '0'));
        
        this.attachShadow({
            mode: 'open',
        });

        this.shadowRoot?.append(this.shadow_);
        
        this.ctx_ = (this.shadow_.getContext('2d') || null);
        this.ctx_ && (this.ctx_.imageSmoothingQuality = 'high');

        window.addEventListener('mouseup', (event) => {
            (event.button === 0) && this.EndDraw_(event.offsetX, event.offsetY);
        });

        window.addEventListener('touchend', (event) => {
            const touch = event.changedTouches[0];
            const offsetX = (touch.clientX - (touch.target as HTMLElement).offsetLeft);
            const offsetY = (touch.clientY - (touch.target as HTMLElement).offsetTop);
            this.EndDraw_(offsetX, offsetY);
        });

        window.addEventListener('touchcancel', (event) => {
            const touch = event.changedTouches[0];
            const offsetX = (touch.clientX - (touch.target as HTMLElement).offsetLeft);
            const offsetY = (touch.clientY - (touch.target as HTMLElement).offsetTop);
            this.EndDraw_(offsetX, offsetY);
        });

        this.shadow_.addEventListener('mousedown', (event) => {
            (event.button === 0) && this.BeginDraw_(event.offsetX, event.offsetY);
        });

        this.shadow_.addEventListener('touchstart', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            const offsetX = (touch.clientX - (touch.target as HTMLElement).offsetLeft);
            const offsetY = (touch.clientY - (touch.target as HTMLElement).offsetTop);
            this.BeginDraw_(offsetX, offsetY);
        });

        this.shadow_.addEventListener('mousemove', event => this.Draw_(event.offsetX, event.offsetY));

        this.shadow_.addEventListener('touchmove', (event) => {
            const touch = event.touches[0];
            const offsetX = (touch.clientX - (touch.target as HTMLElement).offsetLeft);
            const offsetY = (touch.clientY - (touch.target as HTMLElement).offsetTop);
            this.Draw_(offsetX, offsetY);
        });

        Object.values(this.plugins_).forEach(plugins => plugins.forEach(plugin => plugin.SetCanvas(this.shadow_)));
    }

    protected BeginDraw_(offsetX: number, offsetY: number){
        if (!this.disabled && !this.isDrawing_){
            this.isDrawing_ = true;

            this.ctx_?.save();
            this.ctx_?.beginPath();

            this.CallPlugins_('begin', offsetX, offsetY);
        }
    }

    protected EndDraw_(offsetX: number, offsetY: number){
        if (this.isDrawing_){
            this.CallPlugins_('end', offsetX, offsetY);
            this.ctx_?.restore();
            this.isDrawing_ = false;
        }
    }

    protected Draw_(offsetX: number, offsetY: number){
        this.isDrawing_ && this.CallPlugins_('draw', offsetX, offsetY);
    }

    protected CallPlugins_(stage: SketchDrawStageType, offsetX: number, offsetY: number){
        if (this.plugin){//Call only specified plugins
            (Array.isArray(this.plugin) ? this.plugin : [this.plugin]).forEach((name) => {
                (name in this.plugins_) && this.plugins_[name].forEach(plugin => JournalTry(() => plugin.Handle({ stage, offsetX, offsetY })));
            });
        }
        else{//Call all plugins
            Object.values(this.plugins_).forEach((plugins) => plugins.forEach(plugin => JournalTry(() => plugin.Handle({ stage, offsetX, offsetY }))));
        }
    }
}

export function SketchCompact(){
    RegisterCustomElement(Sketch);
}
