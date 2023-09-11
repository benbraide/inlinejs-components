import { Property } from "@benbraide/inlinejs-element";
import { SketchTool } from "./sketch-tool";
import { ISketchPluginParams } from "../types";

export class SketchLineTool extends SketchTool{
    @Property({ type: 'string' })
    public color = 'black';

    @Property({ type: 'string' })
    public mode = 'stroke';

    @Property({ type: 'number' })
    public lineWidth = 1;
    
    @Property({ type: 'string' })
    public lineCap: CanvasLineCap = 'round';

    public constructor(name?: string){
        super(name);
    }

    public HandleBeginDraw(params: ISketchPluginParams){
        super.HandleBeginDraw(params);
        
        const ctx = this.canvas_?.getContext('2d');
        if (ctx){
            ctx.lineCap = this.lineCap;
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
        }
    }
}
