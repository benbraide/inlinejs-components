import { WaitForGlobal } from '@benbraide/inlinejs';
import { ComponentCompact } from './core/component';
import { CodeCompact } from './core/code';
import { OverlayCompact } from './extended/overlay';
import { XhrCompact } from './extended/xhr';
import { XhrSelectCompact } from './extended/xhr-select';
import { ImageCompact } from './dom/image';
import { FormActionCompact } from './dom/form/action';
import { SketchCompact } from './canvas/sketch';
import { SketchHistoryCompact } from './canvas/sketch-history';
import { SketchFreehandCompact } from './canvas/sketch-freehand';
import { SketchLineCompact } from './canvas/sketch-line';
import { SketchRectangleCompact } from './canvas/sketch-rectangle';
import { SketchCircleCompact } from './canvas/sketch-circle';
import { SketchBrushCompact } from './canvas/sketch-brush';
import { SketchEraserCompact } from './canvas/sketch-eraser';
import { SketchExportCompact } from './canvas/sketch-export';
export function InlineJSComponents() {
    WaitForGlobal().then(() => {
        ComponentCompact();
        CodeCompact();
        OverlayCompact();
        XhrCompact();
        XhrSelectCompact();
        ImageCompact();
        FormActionCompact();
        SketchCompact();
        SketchHistoryCompact();
        SketchFreehandCompact();
        SketchLineCompact();
        SketchRectangleCompact();
        SketchCircleCompact();
        SketchBrushCompact();
        SketchEraserCompact();
        SketchExportCompact();
    });
}
