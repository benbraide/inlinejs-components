import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { SketchPlugin } from "./sketch-plugin";
import { ISketchPluginParams } from "../types";
import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";

export class SketchExport extends SketchPlugin{
    protected hiddenInput_: HTMLInputElement | null = null;
    
    @Property({  type: 'string' })
    public UpdateNameProperty(value: string){
        this.hiddenInput_?.setAttribute('name', value);
    }

    public constructor(){
        super('export');
    }

    public HandleEndDraw(params: ISketchPluginParams){
        this.hiddenInput_ && this.canvas_ && (this.hiddenInput_.value = this.canvas_.toDataURL());
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: (() => void) | undefined): void {
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.hiddenInput_ = document.createElement('input');
            this.hiddenInput_.type = 'hidden';
            this.hiddenInput_.name = (this.getAttribute('name') || '');
            this.hiddenInput_.value = '';
            this.appendChild(this.hiddenInput_);

            postAttributesCallback && postAttributesCallback();
        });
    }
}

export function SketchExportCompact(){
    RegisterCustomElement(SketchExport);
}
