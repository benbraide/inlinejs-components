"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSComponents = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const component_1 = require("./core/component");
const code_1 = require("./core/code");
const process_1 = require("./core/process");
const fetch_1 = require("./extended/fetch");
const overlay_1 = require("./extended/overlay");
const xhr_1 = require("./extended/xhr");
const xhr_select_1 = require("./extended/xhr-select");
const attribute_event_1 = require("./dom/attribute-event");
const event_1 = require("./dom/event");
const form_1 = require("./dom/form");
const image_1 = require("./dom/image");
const script_1 = require("./dom/script");
const style_1 = require("./dom/style");
function InlineJSComponents() {
    (0, inlinejs_1.WaitForGlobal)().then(() => {
        (0, component_1.ComponentElementCompact)();
        (0, code_1.CodeElementCompact)();
        (0, process_1.ProcessElementCompact)();
        (0, fetch_1.ProgressFetchElementCompact)();
        (0, overlay_1.OverlayElementCompact)();
        (0, xhr_1.XhrElementCompact)();
        (0, xhr_select_1.XhrSelectElementCompact)();
        (0, attribute_event_1.AttributeEventElementCompact)();
        (0, event_1.EventElementCompact)();
        (0, form_1.FormElementCompact)();
        (0, image_1.ImageElementCompact)();
        (0, script_1.ScriptElementCompact)();
        (0, style_1.StyleElementCompact)();
    });
}
exports.InlineJSComponents = InlineJSComponents;
