import {
    AddOutsideEventListener,
    CreateDirective,
    DispatchDirective,
    EvaluateLater,
    GetGlobal,
    IElementScopeCreatedCallbackParams,
    InferComponent,
    JournalTry,
    RemoveOutsideEventListener
} from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

type ModifierType = 'ctrl' | 'alt' | 'shift' | 'meta';

export class EventElement extends CustomElement{
    @Property({ type: 'object', checkStoredObject: true })
    public target: HTMLElement | typeof globalThis | Document | null = null;
    
    @Property({ type: 'object', checkStoredObject: true })
    public context: HTMLElement | null = null;
    
    @Property({ type: 'array', checkStoredObject: true })
    public type: Array<string> | string = '';
    
    @Property({ type: 'boolean' })
    public outside = false;

    @Property({ type: 'boolean' })
    public directive = false;
    
    @Property({ type: 'boolean' })
    public once = false;

    @Property({ type: 'number' })
    public debounce = 0;

    @Property({ type: 'number' })
    public throttle = 0;

    @Property({ type: 'boolean' })
    public prevent = false;
    
    @Property({ type: 'boolean' })
    public stop = false;

    @Property({ type: 'boolean' })
    public stopImmediate = false;

    @Property({ type: 'boolean' })
    public window = false;

    @Property({ type: 'boolean' })
    public document = false;

    @Property({ type: 'boolean' })
    public parent = false;

    @Property({ type: 'boolean' })
    public passive = false;

    @Property({ type: 'boolean' })
    public mobile = false;

    @Property({ type: 'boolean' })
    public self = false;

    @Property({ type: 'array', checkStoredObject: true })
    public modifiers: Array<ModifierType> | ModifierType | null = null;

    @Property({ type: 'boolean' })
    public ctrl = false;

    @Property({ type: 'boolean' })
    public alt = false;

    @Property({ type: 'boolean' })
    public shift = false;

    @Property({ type: 'boolean' })
    public meta = false;

    @Property({ type: 'string', checkStoredObject: true })
    public filter: ((event: Event) => boolean) | string = '';

    @Property({ type: 'array', checkStoredObject: true })
    public keys: Array<string> | string = '';

    @Property({ type: 'boolean' })
    public alpha = false;

    @Property({ type: 'boolean' })
    public digit = false;

    @Property({ type: 'boolean' })
    public esc = false;

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }

    public keyIs(event: Event, keys: Array<string> | string){
        return (Array.isArray(keys) ? keys : [keys]).some((key) => this.filterKey_(event, k => {
            const mapped = GetGlobal().GetConfig().MapKeyEvent(key);
            return Array.isArray(mapped) ? mapped.includes(k) : mapped === k;
        }));
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            const target = (this.target || (this.window && window) || (this.document && document) || ((this.parent || !this.self) && this.parentElement) || this);
            const type = this.type;
            
            if (target && type){
                const componentId = ((this.context && InferComponent(this.context)?.GetId()) || this.componentId_);
                if ((typeof this.type === 'string' && (this.directive && this.type.includes(':'))) && target instanceof HTMLElement){
                    const directive = CreateDirective(this.type,  (this.textContent || '').trim());// Example: hx-router:load
                    if (directive && DispatchDirective(componentId, target, directive)){
                        return;
                    }
                }
                
                const modifiers = (this.modifiers ? (Array.isArray(this.modifiers) ? this.modifiers : [this.modifiers]) : []), mobileMap = {
                    click: 'touchend',
                    mouseup: 'touchend',
                    mousedown: 'touchstart',
                    mousemove: 'touchmove',
                };
                
                const evaluate = EvaluateLater({
                    componentId: componentId,
                    contextElement: (this.context || this),
                    expression: (this.textContent || '').trim(),
                    disableFunctionCall: false,
                });

                const evaluateFilter = (typeof this.filter === 'string' && this.filter.trim() ? EvaluateLater({
                    componentId: componentId,
                    contextElement: (this.context || this),
                    expression: this.filter.trim(),
                    disableFunctionCall: false,
                }) : null);

                const filterKeys = new Array<string>();

                this.alpha && filterKeys.push('alpha');
                this.digit && filterKeys.push('digit');
                this.esc && filterKeys.push('esc');

                const filter = (event: Event) => {
                    if (evaluateFilter){
                        return evaluateFilter(undefined, [event], { event });
                    }

                    if (typeof this.filter === 'function'){
                        return JournalTry(() => (this.filter as any)(event));
                    }

                    if (this.keys && (typeof this.keys === 'string' || this.keys.length > 0)){
                        return this.keyIs(event, this.keys);
                    }

                    if (filterKeys.length > 0){
                        return this.keyIs(event, filterKeys);
                    }
                    
                    return true;
                };

                const handleEvent = (event: Event) => {
                    this.prevent && event.preventDefault();

                    this.stop && event.stopPropagation();
                    this.stopImmediate && event.stopImmediatePropagation();
                    
                    evaluate(undefined, [event], { event });
                    if (this.once){// Remove the event listener after the first invocation
                        (Array.isArray(type) ? type : [type]).forEach((t) => unsubscribe?.(t, getMappedEvent(t)));
                    }
                };

                let throttling = false, debounceCheckpoint = 0;
                const handler = (event: Event) => {
                    if (throttling || this.self && event.target !== target){
                        return;
                    }

                    const physicalEvent = ((event instanceof MouseEvent) ? event : ((event instanceof KeyboardEvent) ? event : null));
                    if ((this.ctrl || modifiers.includes('ctrl')) && !physicalEvent?.ctrlKey){//Check for control key
                        return;
                    }

                    if ((this.alt || modifiers.includes('alt')) && !physicalEvent?.altKey){//Check for alt key
                        return;
                    }

                    if ((this.shift || modifiers.includes('shift')) && !physicalEvent?.shiftKey){//Check for shift key
                        return;
                    }

                    if ((this.meta || modifiers.includes('meta')) && !physicalEvent?.metaKey){//Check for meta key
                        return;
                    }

                    if (filter(event) === false){
                        return;
                    }

                    if (!this.once && this.debounce > 0){// Debounce upcoming events
                        const checkpoint = ++debounceCheckpoint;
                        setTimeout(() => ((checkpoint == debounceCheckpoint) && handleEvent(event)), this.debounce);
                        return;
                    }

                    if (!this.once && this.throttle > 0){//Throttle upcoming events
                        throttling = true;
                        setTimeout(() => (throttling = false), this.throttle);
                    }
                    
                    handleEvent(event);
                };

                const passive = this.passive, mobile = this.mobile;
                const getMappedEvent = (e: string) => ((mobile && e in mobileMap) ? <string>mobileMap[e] : null);
                
                let subscribe: ((e: string, m: string | null) => void) | null = null, unsubscribe: ((e: string, m: string | null) => void) | null = null;
                if (this.outside && target instanceof HTMLElement){
                    subscribe = (e: string, m: string | null) => {
                        AddOutsideEventListener(target, e, (handler as any));
                        m && AddOutsideEventListener(target, m, (handler as any));
                    };

                    unsubscribe = (e: string, m: string | null) => {
                        RemoveOutsideEventListener(target, e, (handler as any));
                        m && RemoveOutsideEventListener(target, m, (handler as any));
                    };
                }
                else{
                    subscribe = (e: string, m: string | null) => {
                        target.addEventListener(e, handler, { passive });
                        m && target.addEventListener(m, handler, { passive });
                    };

                    unsubscribe = (e: string, m: string | null) => {
                        target.removeEventListener(e, handler);
                        m && target.removeEventListener(m, handler);
                    };
                }

                (Array.isArray(type) ? type : [type]).forEach((t) => subscribe?.(t, getMappedEvent(t)));
                scope.AddUninitCallback(() => (Array.isArray(type) ? type : [type]).forEach((t) => unsubscribe?.(t, getMappedEvent(t))));
            }
            
            postAttributesCallback && postAttributesCallback();
        });
    }

    protected filterKey_(event: Event, handler: (key: string) => boolean){
        return event instanceof KeyboardEvent ? handler((event.key || '').toLowerCase()) : false;
    }
}

export function EventElementCompact(){
    RegisterCustomElement(EventElement, 'event');
}
