import { WaitForGlobal } from '@benbraide/inlinejs';

import { ComponentElementCompact } from './core/component';
import { CodeElementCompact } from './core/code';
import { ProcessElementCompact } from './core/process';

import { OverlayElementCompact } from './extended/overlay';
import { XhrElementCompact } from './extended/xhr';
import { XhrSelectElementCompact } from './extended/xhr-select';

import { AttributeEventElementCompact } from './dom/attribute-event';
import { EventElementCompact } from './dom/event';
import { FormElementCompact } from './dom/form';
import { ImageElementCompact } from './dom/image';
import { ScriptElementCompact } from './dom/script';
import { StyleElementCompact } from './dom/style';

export function InlineJSComponents(){
    WaitForGlobal().then(() => {
        ComponentElementCompact();
        CodeElementCompact();
        ProcessElementCompact();

        OverlayElementCompact();
        XhrElementCompact();
        XhrSelectElementCompact();

        AttributeEventElementCompact();
        EventElementCompact();
        FormElementCompact();
        ImageElementCompact();
        ScriptElementCompact();
        StyleElementCompact();
    });
}
