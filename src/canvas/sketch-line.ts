import { RegisterCustomElement } from "@benbraide/inlinejs-element";
import { SketchLineTool } from "./sketch-line-tool";

export class SketchLine extends SketchLineTool{
    public constructor(){
        super('line');
    }
    
    protected HandleDraw_(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number){
        ctx.moveTo(this.saved_.x, this.saved_.y);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    }
}

export function SketchLineCompact(){
    RegisterCustomElement(SketchLine);
}
