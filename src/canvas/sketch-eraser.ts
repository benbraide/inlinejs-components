import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { SketchPlugin } from "./sketch-plugin";
import { ISketchPluginParams } from "../types";

export class SketchEraser extends SketchPlugin{
    @Property({  type: 'number' })
    public radius = 5;

    public constructor(){
        super('eraser');
    }

    public HandleDraw({ offsetX, offsetY }: ISketchPluginParams){
        const ctx = this.canvas_?.getContext('2d');
        if (ctx){
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(offsetX, offsetY, this.radius, 0, (2 * Math.PI));
            ctx.fill();
            ctx.restore();
        }
    }
}

export function SketchEraserCompact(){
    RegisterCustomElement(SketchEraser);
}
