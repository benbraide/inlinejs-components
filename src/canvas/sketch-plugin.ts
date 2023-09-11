import { CustomElement, Property } from "@benbraide/inlinejs-element";
import { ISketchPlugin, ISketchPluginParams } from "../types";
import { FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";

export class SketchPlugin extends CustomElement implements ISketchPlugin{
    protected canvas_: HTMLCanvasElement | null = null;

    @Property({  type: 'string' })
    public name = '';

    @Property({  type: 'boolean' })
    public disabled = false;
    
    public constructor(name?: string){
        super({
            isTemplate: true,
            isHidden: true,
        });

        this.name = (name || '');
    }

    public GetName(){
        return this.name;
    }

    public SetCanvas(canvas: HTMLCanvasElement | null): void{
        this.canvas_ = canvas;
    }
    
    public Handle({ stage, ...rest }: ISketchPluginParams){
        if (this.disabled){
            return;
        }
        
        switch (stage){
            case 'begin': return this.HandleBeginDraw({ stage, ...rest });
            case 'end': return this.HandleEndDraw({ stage, ...rest });
            case 'draw': return this.HandleDraw({ stage, ...rest });
        }
    }

    public HandleBeginDraw(params: ISketchPluginParams): void | boolean{}

    public HandleEndDraw(params: ISketchPluginParams){}

    public HandleDraw(params: ISketchPluginParams){}

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: (() => void) | undefined){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            const ancestor = FindAncestor(this, ancestor => ('AddPlugin' in ancestor));
            ancestor && (ancestor as any).AddPlugin(this);
            postAttributesCallback && postAttributesCallback();
        });

        scope.AddUninitCallback(() => {
            this.canvas_ = null;
            const ancestor = FindAncestor(this, ancestor => ('RemovePlugin' in ancestor));
            ancestor && (ancestor as any).RemovePlugin(this);
        });
    }
}
