import { RegisterCustomElement } from "@benbraide/inlinejs-element";
import { ISketchPluginParams } from "../types";
import { SketchLinePlugin } from "./sketch-line-plugin";

export class SketchFreehand extends SketchLinePlugin{
    public constructor(){
        super('freehand');
    }

    public HandleDraw({ offsetX, offsetY }: ISketchPluginParams){
        const ctx = this.canvas_?.getContext('2d');
        if (ctx){
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
        }
    }
}

export function SketchFreehandCompact(){
    RegisterCustomElement(SketchFreehand);
}
