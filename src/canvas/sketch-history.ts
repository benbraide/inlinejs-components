import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { SketchPlugin } from "./sketch-plugin";

export class SketchHistory extends SketchPlugin{
    protected index_ = 0;
    protected entries_ = new Array<string>();

    protected isSaved_ = false;
    protected savedBeforeUndo_ = false;
    
    @Property({  type: 'number' })
    public size = -1;

    public constructor(){
        super('history');
    }

    public HandleBeginDraw(){
        this.Save_();
    }

    public HandleEndDraw(){
        this.isSaved_ = false;
    }

    public Undo(){
        if (!this.canvas_ || this.index_ == 0 || this.entries_.length == 0){
            return;
        }
        
        const ctx = this.canvas_.getContext('2d');
        if (!ctx){
            return;
        }
        
        const image = new Image();

        image.onload = () => {
            ctx.clearRect(0, 0, this.canvas_!.width, this.canvas_!.height);
            ctx.drawImage(image, 0, 0);
        };
        
        if (!this.isSaved_){
            this.Save_();
            this.savedBeforeUndo_ = true;
            image.src = this.entries_[this.index_ -= 2];
        }
        else{
            image.src = this.entries_[this.index_ -= ((this.savedBeforeUndo_ && this.index_ >= this.entries_.length) ? 2 : 1)];
        }
    }

    public Redo(){
        if (!this.canvas_ || this.index_ == this.entries_.length){
            return;
        }
        
        const ctx = this.canvas_.getContext('2d');
        if (!ctx){
            return;
        }
        
        const image = new Image();

        image.onload = () => {
            ctx.clearRect(0, 0, this.canvas_!.width, this.canvas_!.height);
            ctx.drawImage(image, 0, 0);
        };
        
        image.src = this.entries_[++this.index_];
        this.index_ = ((this.savedBeforeUndo_ && this.index_ >= (this.entries_.length - 1)) ? this.entries_.length : this.index_);
    }

    public Reset(){
        if (!this.canvas_){
            return;
        }
        
        const ctx = this.canvas_.getContext('2d');
        if (!ctx){
            return;
        }
        
        ctx.clearRect(0, 0, this.canvas_!.width, this.canvas_!.height);
        this.index_ = 0;
        this.entries_ = new Array<string>();
    }

    protected Save_(){
        if (!this.canvas_ || this.isSaved_ || !this.size){
            return;
        }

        const image = this.canvas_.toDataURL('image/png');
        (this.size > 0 && this.entries_.length >= this.size) && this.entries_.shift();
        (this.index_ < this.entries_.length) ? this.entries_.splice(this.index_, (this.entries_.length - this.index_), image) : this.entries_.push(image);

        this.index_ = this.entries_.length;
        this.isSaved_ = true;
        this.savedBeforeUndo_ = false;
    }
}

export function SketchHistoryCompact(){
    RegisterCustomElement(SketchHistory);
}
