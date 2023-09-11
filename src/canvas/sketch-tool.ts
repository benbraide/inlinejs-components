import { SketchPlugin } from "./sketch-plugin";
import { ISketchPluginParams } from "../types";

export class SketchTool extends SketchPlugin{
    protected saved_ = {
        image: <string | null>null,
        x: 0,
        y: 0,
    };
    
    protected checkpoint_ = 0;

    public constructor(name?: string){
        super(name);
    }

    public HandleBeginDraw({ offsetX, offsetY }: ISketchPluginParams): boolean | void {
        this.saved_ = {
            image: (this.canvas_?.toDataURL() || null),
            x: offsetX,
            y: offsetY,
        };
    }

    public HandleEndDraw(){
        this.saved_ = {
            image: null,
            x: 0,
            y: 0,
        };
    }
    
    public HandleDraw({ offsetX, offsetY }: ISketchPluginParams){
        const ctx = this.canvas_?.getContext('2d');
        if (!ctx){
            return;
        }

        const checkpoint = ++this.checkpoint_, draw = (ctx: CanvasRenderingContext2D) => {
            if (checkpoint == this.checkpoint_){
                ctx.save();
                ctx.beginPath();
                this.HandleDraw_(ctx, offsetX, offsetY);
                ctx.restore();
            }
        };

        if (this.saved_.image){
            const image = new Image();

            image.onload = () => {
                ctx.clearRect(0, 0, this.canvas_!.width, this.canvas_!.height);
                ctx.drawImage(image, 0, 0);
                draw(ctx);
            };
            
            image.src = this.saved_.image;
        }
        else{
            draw(ctx);
        }
    }

    protected HandleDraw_(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number){}
}
