import { WaitForGlobal } from '@benbraide/inlinejs';
import { ComponentElementCompact } from './core/component';
import { CodeElementCompact } from './core/code';
import { OverlayElementCompact } from './extended/overlay';
import { XhrCompact } from './extended/xhr';
import { XhrSelectCompact } from './extended/xhr-select';
import { DataViewElementCompact } from './extended/data-view';
import { AttributeEventElementCompact } from './dom/attribute-event';
import { EventElementCompact } from './dom/event';
import { FormElementCompact } from './dom/form';
import { ImageElementCompact } from './dom/image';
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
        ComponentElementCompact();
        CodeElementCompact();
        OverlayElementCompact();
        XhrCompact();
        XhrSelectCompact();
        DataViewElementCompact();
        AttributeEventElementCompact();
        EventElementCompact();
        FormElementCompact();
        ImageElementCompact();
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
