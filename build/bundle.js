
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$1;
    }

    const is_client = typeof window !== 'undefined';
    let now$1 = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now$1() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now$1() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    // Adapted from https://github.com/hperrin/svelte-material-ui/blob/master/packages/common/forwardEvents.js

    // prettier-ignore
    const events = [
        'focus', 'blur',
        'fullscreenchange', 'fullscreenerror', 'scroll',
        'cut', 'copy', 'paste',
        'keydown', 'keypress', 'keyup',
        'auxclick', 'click', 'contextmenu', 'dblclick',
        'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseout', 'mouseup',
        'pointerlockchange', 'pointerlockerror', 'select', 'wheel',
        'drag', 'dragend', 'dragenter', 'dragstart', 'dragleave', 'dragover', 'drop',
        'touchcancel', 'touchend', 'touchmove', 'touchstart',
        'pointerover', 'pointerenter', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerout', 'pointerleave', 
        'gotpointercapture', 'lostpointercapture'
      ];

    function forwardEventsBuilder() {
      const component = get_current_component();

      return node => {
        const destructors = events.map(event =>
          listen(node, event, e => bubble(component, e))
        );

        return {
          destroy: () => destructors.forEach(destroy => destroy())
        };
      };
    }

    class RenderManager {
      constructor() {
        this.register = this.register.bind(this);
        this.unregister = this.unregister.bind(this);
        this.redraw = this.redraw.bind(this);
        this.resize = this.resize.bind(this);
        this.render = this.render.bind(this);

        this.currentLayerId = 0;
        this.setups = new Map();
        this.renderers = new Map();

        this.needsSetup = false;
        this.needsResize = true;
        this.needsRedraw = true;

        this.layerSequence = [];
      }

      redraw() {
        this.needsRedraw = true;
      }

      resize() {
        this.needsResize = true;
        this.needsRedraw = true;
      }

      register({ setup, render }) {
        if (setup) {
          this.setups.set(this.currentLayerId, setup);
          this.needsSetup = true;
        }

        this.renderers.set(this.currentLayerId, render);

        this.needsRedraw = true;
        return this.currentLayerId++;
      }

      unregister(layerId) {
        this.renderers.delete(layerId);
        this.needsRedraw = true;
      }

      render({ autoclear, pixelRatio, context, width, height }) {
        const renderProps = { context, width, height };

        if (this.needsResize) {
          context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          this.needsResize = false;
        }

        if (this.needsSetup) {
          for (const [layerId, setup] of this.setups) {
            setup(renderProps);
            this.setups.delete(layerId);
          }

          this.needsSetup = false;
        }

        if (this.needsRedraw) {
          if (autoclear) {
            context.clearRect(0, 0, width, height);
          }

          for (const layerId of this.layerSequence) {
            this.renderers.get(layerId)(renderProps);
          }

          this.needsRedraw = false;
        }
      }
    }

    /* node_modules\svelte-canvas\src\components\Canvas.svelte generated by Svelte v3.47.0 */
    const file$2 = "node_modules\\svelte-canvas\\src\\components\\Canvas.svelte";

    function create_fragment$3(ctx) {
    	let canvas_1;
    	let canvas_1_style_value;
    	let canvas_1_width_value;
    	let canvas_1_height_value;
    	let t;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			t = space();
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(canvas_1, "style", canvas_1_style_value = "display: block; width: " + /*width*/ ctx[1] + "px; height: " + /*height*/ ctx[2] + "px;" + (/*style*/ ctx[3] ? ` ${/*style*/ ctx[3]}` : ''));
    			attr_dev(canvas_1, "width", canvas_1_width_value = /*width*/ ctx[1] * /*pixelRatio*/ ctx[0]);
    			attr_dev(canvas_1, "height", canvas_1_height_value = /*height*/ ctx[2] * /*pixelRatio*/ ctx[0]);
    			add_location(canvas_1, file$2, 80, 0, 1793);
    			set_style(div, "display", "none");
    			add_location(div, file$2, 90, 0, 2004);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[14](canvas_1);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[15](div);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*forwardEvents*/ ctx[6].call(null, canvas_1));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*width, height, style*/ 14 && canvas_1_style_value !== (canvas_1_style_value = "display: block; width: " + /*width*/ ctx[1] + "px; height: " + /*height*/ ctx[2] + "px;" + (/*style*/ ctx[3] ? ` ${/*style*/ ctx[3]}` : ''))) {
    				attr_dev(canvas_1, "style", canvas_1_style_value);
    			}

    			if (!current || dirty & /*width, pixelRatio*/ 3 && canvas_1_width_value !== (canvas_1_width_value = /*width*/ ctx[1] * /*pixelRatio*/ ctx[0])) {
    				attr_dev(canvas_1, "width", canvas_1_width_value);
    			}

    			if (!current || dirty & /*height, pixelRatio*/ 5 && canvas_1_height_value !== (canvas_1_height_value = /*height*/ ctx[2] * /*pixelRatio*/ ctx[0])) {
    				attr_dev(canvas_1, "height", canvas_1_height_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[14](null);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[15](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const KEY = {};

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Canvas', slots, ['default']);
    	let { width = 640, height = 640, pixelRatio = undefined, style = null, autoclear = true } = $$props;
    	let canvas, context, animationLoop, layerRef, layerObserver;
    	const forwardEvents = forwardEventsBuilder();
    	const manager = new RenderManager();

    	function redraw() {
    		manager.redraw();
    	}

    	function getCanvas() {
    		return canvas;
    	}

    	function getContext() {
    		return context;
    	}

    	if (pixelRatio === undefined) {
    		if (typeof window === 'undefined') {
    			pixelRatio = 2;
    		} else {
    			pixelRatio = window.devicePixelRatio;
    		}
    	}

    	function draw() {
    		manager.render({
    			context,
    			width,
    			height,
    			pixelRatio,
    			autoclear
    		});

    		animationLoop = window.requestAnimationFrame(draw);
    	}

    	setContext(KEY, {
    		register: manager.register,
    		unregister: manager.unregister,
    		redraw: manager.redraw
    	});

    	onMount(() => {
    		context = canvas.getContext('2d');
    		layerObserver = new MutationObserver(getLayerSequence);
    		layerObserver.observe(layerRef, { childList: true });
    		getLayerSequence();
    		draw();

    		function getLayerSequence() {
    			const sequence = [...layerRef.children].map(layer => +layer.dataset.layerId);
    			$$invalidate(11, manager.layerSequence = sequence, manager);
    			manager.redraw();
    		}
    	});

    	onDestroy(() => {
    		if (typeof window === 'undefined') return;
    		window.cancelAnimationFrame(animationLoop);
    		layerObserver.disconnect();
    	});

    	const writable_props = ['width', 'height', 'pixelRatio', 'style', 'autoclear'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Canvas> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(4, canvas);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			layerRef = $$value;
    			$$invalidate(5, layerRef);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('pixelRatio' in $$props) $$invalidate(0, pixelRatio = $$props.pixelRatio);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('autoclear' in $$props) $$invalidate(7, autoclear = $$props.autoclear);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		KEY,
    		onMount,
    		onDestroy,
    		setContext,
    		forwardEventsBuilder,
    		RenderManager,
    		width,
    		height,
    		pixelRatio,
    		style,
    		autoclear,
    		canvas,
    		context,
    		animationLoop,
    		layerRef,
    		layerObserver,
    		forwardEvents,
    		manager,
    		redraw,
    		getCanvas,
    		getContext,
    		draw
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('pixelRatio' in $$props) $$invalidate(0, pixelRatio = $$props.pixelRatio);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('autoclear' in $$props) $$invalidate(7, autoclear = $$props.autoclear);
    		if ('canvas' in $$props) $$invalidate(4, canvas = $$props.canvas);
    		if ('context' in $$props) context = $$props.context;
    		if ('animationLoop' in $$props) animationLoop = $$props.animationLoop;
    		if ('layerRef' in $$props) $$invalidate(5, layerRef = $$props.layerRef);
    		if ('layerObserver' in $$props) layerObserver = $$props.layerObserver;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width, height, pixelRatio, autoclear, manager*/ 2183) {
    			(manager.resize());
    		}
    	};

    	return [
    		pixelRatio,
    		width,
    		height,
    		style,
    		canvas,
    		layerRef,
    		forwardEvents,
    		autoclear,
    		redraw,
    		getCanvas,
    		getContext,
    		manager,
    		$$scope,
    		slots,
    		canvas_1_binding,
    		div_binding
    	];
    }

    class Canvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			width: 1,
    			height: 2,
    			pixelRatio: 0,
    			style: 3,
    			autoclear: 7,
    			redraw: 8,
    			getCanvas: 9,
    			getContext: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Canvas",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get width() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pixelRatio() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pixelRatio(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoclear() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoclear(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get redraw() {
    		return this.$$.ctx[8];
    	}

    	set redraw(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getCanvas() {
    		return this.$$.ctx[9];
    	}

    	set getCanvas(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getContext() {
    		return this.$$.ctx[10];
    	}

    	set getContext(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-canvas\src\components\Layer.svelte generated by Svelte v3.47.0 */

    const { Error: Error_1 } = globals;
    const file$1 = "node_modules\\svelte-canvas\\src\\components\\Layer.svelte";

    function create_fragment$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "data-layer-id", /*layerId*/ ctx[0]);
    			add_location(div, file$1, 24, 0, 548);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Layer', slots, []);
    	const { register, unregister, redraw } = getContext(KEY);

    	let { setup = undefined, render = () => {
    		
    	} } = $$props;

    	if (typeof setup !== 'function' && setup !== undefined) {
    		throw new Error('setup must be a function');
    	}

    	if (typeof render !== 'function') {
    		throw new Error('render must be a function');
    	}

    	const layerId = register({ setup, render });
    	onDestroy(() => unregister(layerId));
    	const writable_props = ['setup', 'render'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Layer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('setup' in $$props) $$invalidate(1, setup = $$props.setup);
    		if ('render' in $$props) $$invalidate(2, render = $$props.render);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		KEY,
    		register,
    		unregister,
    		redraw,
    		setup,
    		render,
    		layerId
    	});

    	$$self.$inject_state = $$props => {
    		if ('setup' in $$props) $$invalidate(1, setup = $$props.setup);
    		if ('render' in $$props) $$invalidate(2, render = $$props.render);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*render*/ 4) {
    			(redraw());
    		}
    	};

    	return [layerId, setup, render];
    }

    class Layer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { setup: 1, render: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layer",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get setup() {
    		throw new Error_1("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setup(value) {
    		throw new Error_1("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get render() {
    		throw new Error_1("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set render(value) {
    		throw new Error_1("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let frame;

    const now = Date.now();

    function start(set) {
      set(Date.now() - now);

      frame = window.requestAnimationFrame(() => start(set));
      return () => window.cancelAnimationFrame(frame);
    }

    function noop() {}

    var t = readable(
      Date.now() - now,
      typeof window === 'undefined' ? noop : start
    );

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\Bar.svelte generated by Svelte v3.47.0 */

    function create_fragment$1(ctx) {
    	let layer;
    	let current;

    	layer = new Layer({
    			props: { render: /*render*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(layer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layer_changes = {};
    			if (dirty & /*render*/ 1) layer_changes.render = /*render*/ ctx[0];
    			layer.$set(layer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let render;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Bar', slots, []);
    	let { pos, val2, type, size, maxVal, img = null } = $$props;
    	const writable_props = ['pos', 'val2', 'type', 'size', 'maxVal', 'img'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pos' in $$props) $$invalidate(1, pos = $$props.pos);
    		if ('val2' in $$props) $$invalidate(2, val2 = $$props.val2);
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('maxVal' in $$props) $$invalidate(5, maxVal = $$props.maxVal);
    		if ('img' in $$props) $$invalidate(6, img = $$props.img);
    	};

    	$$self.$capture_state = () => ({
    		Canvas,
    		Layer,
    		t,
    		pos,
    		val2,
    		type,
    		size,
    		maxVal,
    		img,
    		render
    	});

    	$$self.$inject_state = $$props => {
    		if ('pos' in $$props) $$invalidate(1, pos = $$props.pos);
    		if ('val2' in $$props) $$invalidate(2, val2 = $$props.val2);
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('maxVal' in $$props) $$invalidate(5, maxVal = $$props.maxVal);
    		if ('img' in $$props) $$invalidate(6, img = $$props.img);
    		if ('render' in $$props) $$invalidate(0, render = $$props.render);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*size, maxVal, val2, type, img, pos*/ 126) {
    			//x1,x2,y1,y2,color='black',img=null,num=null,type=null;
    			$$invalidate(0, render = ({ context, width, height }) => {
    				let itemWidth = width / size,
    					itemHeight = height / maxVal,
    					val = Math.abs(val2);

    				if (type == 5) {
    					let scale = Math.max(width / img.width, height / img.height);
    					context.drawImage(img, Math.floor(itemWidth * (val - 1) / scale), 0, Math.floor(itemWidth * val / scale) - Math.floor(itemWidth * (val - 1) / scale), img.height, Math.floor(itemWidth * pos), 0, Math.floor(itemWidth * (pos + 1)) - Math.floor(itemWidth * pos) + 1, height);
    					return;
    				}

    				if (type == 4 || type == 8) {
    					context.fillStyle = "hsl(" + val * 360 / size + ",100%,50%)";
    				} else if (val2 < 0) {
    					context.fillStyle = "#719c92";
    				} else {
    					context.fillStyle = "#f3e2b7";
    				}

    				if (type == 6 || type == 8) {
    					itemWidth = 1 / size * 2 * Math.PI;
    					context.beginPath();
    					context.moveTo(width / 2, height / 2);
    					if (type == 6) context.arc(width / 2, height / 2, val / maxVal * Math.min(width, height) / 2, pos * itemWidth, (pos + 1) * itemWidth); else if (type == 8) context.arc(width / 2, height / 2, Math.min(width, height) / 2, pos * itemWidth, (pos + 1 + Number(pos + 1 < size)) * itemWidth);
    					context.moveTo(width / 2, height / 2);
    					context.fill();
    				} else if (type == 9) {
    					context.beginPath();
    					context.moveTo(0, val * itemHeight);
    					context.lineTo((pos + 1) * itemWidth, 0);
    					context.stroke();
    				} else if (type == 10) {
    					itemWidth = 1 / size * 2 * Math.PI;
    					context.beginPath();
    					context.arc(width / 2 + Math.min(width, height) / 2 * Math.sin(pos * itemWidth), height / 2 + Math.min(width, height) / 2 * Math.cos(pos * itemWidth), 2, 0, 2 * Math.PI);
    					context.fill();
    					context.beginPath();
    					context.moveTo(width / 2 + Math.min(width, height) / 2 * Math.sin(pos * itemWidth), height / 2 + Math.min(width, height) / 2 * Math.cos(pos * itemWidth));
    					context.lineTo(width / 2 + Math.min(width, height) / 2 * Math.sin((val - 1) * itemWidth), height / 2 + Math.min(width, height) / 2 * Math.cos((val - 1) * itemWidth));
    					context.stroke();
    				} else {
    					let x1, y1, x2, y2;

    					if (type == 3) {
    						x1 = pos * itemWidth;
    						x2 = Math.max(3, itemWidth);
    						y1 = height - val * itemHeight;
    						y2 = Math.max(3, itemHeight);
    					} else if (type == 7) {
    						itemWidth = 1 / size * 2 * Math.PI;
    						x1 = width / 2 + val / maxVal * Math.min(width, height) / 2 * Math.sin(pos * itemWidth);
    						y1 = height / 2 + val / maxVal * Math.min(width, height) / 2 * Math.cos(pos * itemWidth);
    						x2 = 5;
    						y2 = 5;
    					} else {
    						x1 = pos * itemWidth;
    						x2 = itemWidth;

    						if (type == 4 || size < 3000) {
    							x1 = Math.floor(x1);
    							x2 = Math.floor(x1 + x2) - Math.floor(x1) + 2;
    						}

    						if (type == 4) {
    							y1 = 0;
    							y2 = height;
    						} else if (type == 1) {
    							y1 = height - itemHeight * val;
    							y2 = itemHeight * val;
    						} else if (type == 2) {
    							y1 = 0;
    							y2 = itemHeight * val;
    						}
    					}

    					context.fillRect(x1, y1, x2, y2);
    				}
    			});
    		}
    	};

    	return [render, pos, val2, type, size, maxVal, img];
    }

    class Bar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			pos: 1,
    			val2: 2,
    			type: 3,
    			size: 4,
    			maxVal: 5,
    			img: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bar",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pos*/ ctx[1] === undefined && !('pos' in props)) {
    			console.warn("<Bar> was created without expected prop 'pos'");
    		}

    		if (/*val2*/ ctx[2] === undefined && !('val2' in props)) {
    			console.warn("<Bar> was created without expected prop 'val2'");
    		}

    		if (/*type*/ ctx[3] === undefined && !('type' in props)) {
    			console.warn("<Bar> was created without expected prop 'type'");
    		}

    		if (/*size*/ ctx[4] === undefined && !('size' in props)) {
    			console.warn("<Bar> was created without expected prop 'size'");
    		}

    		if (/*maxVal*/ ctx[5] === undefined && !('maxVal' in props)) {
    			console.warn("<Bar> was created without expected prop 'maxVal'");
    		}
    	}

    	get pos() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pos(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get val2() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set val2(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxVal() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxVal(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get img() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.47.0 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[75] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[78] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[78] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[83] = list[i];
    	child_ctx[85] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[78] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[78] = list[i];
    	return child_ctx;
    }

    // (1065:4) {#each displayOptions as option}
    function create_each_block_5(ctx) {
    	let option;
    	let t_1_value = /*option*/ ctx[78].text + "";
    	let t_1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t_1 = text(t_1_value);
    			option.__value = /*option*/ ctx[78].id;
    			option.value = option.__value;
    			add_location(option, file, 1065, 5, 25710);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t_1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(1065:4) {#each displayOptions as option}",
    		ctx
    	});

    	return block;
    }

    // (1071:4) {#each audioOptions as option}
    function create_each_block_4(ctx) {
    	let option;
    	let t_1_value = /*option*/ ctx[78].text + "";
    	let t_1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t_1 = text(t_1_value);
    			option.__value = /*option*/ ctx[78].id;
    			option.value = option.__value;
    			add_location(option, file, 1071, 5, 25938);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t_1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(1071:4) {#each audioOptions as option}",
    		ctx
    	});

    	return block;
    }

    // (1076:2) {#key speed}
    function create_key_block(ctx) {
    	let div;
    	let t_1;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t_1 = text(/*speedup*/ ctx[11]);
    			add_location(div, file, 1076, 3, 26040);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t_1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*speedup*/ 2048) set_data_dev(t_1, /*speedup*/ ctx[11]);
    		},
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fly, { y: 20 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(1076:2) {#key speed}",
    		ctx
    	});

    	return block;
    }

    // (1080:3) {#each arr as num, i}
    function create_each_block_3(ctx) {
    	let bar;
    	let current;

    	bar = new Bar({
    			props: {
    				pos: /*i*/ ctx[85],
    				val2: /*num*/ ctx[83],
    				type: /*displayType*/ ctx[5],
    				size: /*size*/ ctx[0],
    				maxVal: /*maxVal*/ ctx[9],
    				img: /*img*/ ctx[12]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(bar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bar_changes = {};
    			if (dirty[0] & /*arr*/ 256) bar_changes.val2 = /*num*/ ctx[83];
    			if (dirty[0] & /*displayType*/ 32) bar_changes.type = /*displayType*/ ctx[5];
    			if (dirty[0] & /*size*/ 1) bar_changes.size = /*size*/ ctx[0];
    			if (dirty[0] & /*maxVal*/ 512) bar_changes.maxVal = /*maxVal*/ ctx[9];
    			if (dirty[0] & /*img*/ 4096) bar_changes.img = /*img*/ ctx[12];
    			bar.$set(bar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(1080:3) {#each arr as num, i}",
    		ctx
    	});

    	return block;
    }

    // (1079:2) <Canvas {width} {height}>
    function create_default_slot(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_3 = /*arr*/ ctx[8];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*arr, displayType, size, maxVal, img*/ 4897) {
    				each_value_3 = /*arr*/ ctx[8];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_3.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(1079:2) <Canvas {width} {height}>",
    		ctx
    	});

    	return block;
    }

    // (1101:3) {#each arrayOptions as option}
    function create_each_block_2(ctx) {
    	let option;
    	let t_1_value = /*option*/ ctx[78].text + "";
    	let t_1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t_1 = text(t_1_value);
    			option.__value = /*option*/ ctx[78].id;
    			option.value = option.__value;
    			add_location(option, file, 1101, 4, 26629);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t_1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(1101:3) {#each arrayOptions as option}",
    		ctx
    	});

    	return block;
    }

    // (1114:27) 
    function create_if_block_3(ctx) {
    	let textarea;
    	let textarea_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "maxlength", "5000");
    			attr_dev(textarea, "class", "svelte-1a4ueem");
    			add_location(textarea, file, 1114, 3, 26895);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(textarea, "input", /*input_handler*/ ctx[29], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!textarea_transition) textarea_transition = create_bidirectional_transition(textarea, fade, {}, true);
    				textarea_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!textarea_transition) textarea_transition = create_bidirectional_transition(textarea, fade, {}, false);
    			textarea_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			if (detaching && textarea_transition) textarea_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(1114:27) ",
    		ctx
    	});

    	return block;
    }

    // (1105:2) {#if arrayType == 2 || arrayType == 3}
    function create_if_block_2(ctx) {
    	let input;
    	let input_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", "1");
    			attr_dev(input, "step", "0.01");
    			attr_dev(input, "class", "svelte-1a4ueem");
    			add_location(input, file, 1105, 3, 26745);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*arrayAdjust*/ ctx[3]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[28]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[28])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*arrayAdjust*/ 8) {
    				set_input_value(input, /*arrayAdjust*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!input_transition) input_transition = create_bidirectional_transition(input, fade, {}, true);
    				input_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!input_transition) input_transition = create_bidirectional_transition(input, fade, {}, false);
    			input_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching && input_transition) input_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(1105:2) {#if arrayType == 2 || arrayType == 3}",
    		ctx
    	});

    	return block;
    }

    // (1126:3) {:else}
    function create_else_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Sort";
    			attr_dev(button, "class", "svelte-1a4ueem");
    			add_location(button, file, 1126, 4, 27190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*go*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(1126:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1124:25) 
    function create_if_block_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Pause";
    			attr_dev(button, "class", "svelte-1a4ueem");
    			add_location(button, file, 1124, 4, 27122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[31], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(1124:25) ",
    		ctx
    	});

    	return block;
    }

    // (1122:3) {#if paused == 1}
    function create_if_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Resume";
    			attr_dev(button, "class", "svelte-1a4ueem");
    			add_location(button, file, 1122, 4, 27038);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[30], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(1122:3) {#if paused == 1}",
    		ctx
    	});

    	return block;
    }

    // (1140:5) {#each group.options as option}
    function create_each_block_1(ctx) {
    	let li;
    	let t_1_value = /*option*/ ctx[78].text + "";
    	let t_1;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[32](/*option*/ ctx[78]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t_1 = text(t_1_value);
    			attr_dev(li, "class", "svelte-1a4ueem");
    			toggle_class(li, "a", /*option*/ ctx[78].id === /*sortType*/ ctx[4]);
    			add_location(li, file, 1140, 6, 27559);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t_1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*sortOptions, sortType*/ 32784) {
    				toggle_class(li, "a", /*option*/ ctx[78].id === /*sortType*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(1140:5) {#each group.options as option}",
    		ctx
    	});

    	return block;
    }

    // (1133:3) {#each sortOptions as group}
    function create_each_block(ctx) {
    	let ul;
    	let li;
    	let t0_value = /*group*/ ctx[75].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let each_value_1 = /*group*/ ctx[75].options;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			set_style(li, "font-weight", "bold");
    			set_style(li, "color", "#d3869b");
    			add_location(li, file, 1136, 5, 27440);
    			set_style(ul, "display", "inline-block");
    			set_style(ul, "list-style-type", "none");
    			set_style(ul, "padding", "0");
    			set_style(ul, "margin", "1rem");
    			add_location(ul, file, 1133, 4, 27342);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li);
    			append_dev(li, t0);
    			append_dev(ul, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sortOptions, sortType*/ 32784) {
    				each_value_1 = /*group*/ ctx[75].options;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(1133:3) {#each sortOptions as group}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let img_1;
    	let img_1_src_value;
    	let t0;
    	let div0;
    	let t2;
    	let div1;
    	let span0;
    	let t3;
    	let t4_value = Math.round(/*speed*/ ctx[7]) + "";
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let span1;
    	let label0;
    	let t10;
    	let input0;
    	let t11;
    	let label1;
    	let t13;
    	let select0;
    	let t14;
    	let label2;
    	let t16;
    	let select1;
    	let t17;
    	let previous_key = /*speed*/ ctx[7];
    	let t18;
    	let canvas;
    	let t19;
    	let div4;
    	let label3;
    	let t21;
    	let input1;
    	let t22;
    	let label4;
    	let t24;
    	let select2;
    	let t25;
    	let current_block_type_index;
    	let if_block0;
    	let t26;
    	let div2;
    	let t27;
    	let button;
    	let t29;
    	let div3;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_5 = /*displayOptions*/ ctx[16];
    	validate_each_argument(each_value_5);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_3[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	let each_value_4 = /*audioOptions*/ ctx[17];
    	validate_each_argument(each_value_4);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_2[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	let key_block = create_key_block(ctx);

    	canvas = new Canvas({
    			props: {
    				width: /*width*/ ctx[18],
    				height: /*height*/ ctx[19],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value_2 = /*arrayOptions*/ ctx[14];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const if_block_creators = [create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*arrayType*/ ctx[2] == 2 || /*arrayType*/ ctx[2] == 3) return 0;
    		if (/*arrayType*/ ctx[2] == 6) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	function select_block_type_1(ctx, dirty) {
    		if (/*paused*/ ctx[10] == 1) return create_if_block;
    		if (/*paused*/ ctx[10] == 0) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block1 = current_block_type(ctx);
    	let each_value = /*sortOptions*/ ctx[15];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			img_1 = element("img");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "Sorting";
    			t2 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t3 = text("Speed: ");
    			t4 = text(t4_value);
    			t5 = text(" (x");
    			t6 = text(/*speedMult*/ ctx[13]);
    			t7 = text(")");
    			t8 = space();
    			span1 = element("span");
    			label0 = element("label");
    			label0.textContent = "Speed Adjust:";
    			t10 = space();
    			input0 = element("input");
    			t11 = space();
    			label1 = element("label");
    			label1.textContent = "Display:";
    			t13 = space();
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t14 = space();
    			label2 = element("label");
    			label2.textContent = "Audio:";
    			t16 = space();
    			select1 = element("select");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t17 = space();
    			key_block.c();
    			t18 = space();
    			create_component(canvas.$$.fragment);
    			t19 = space();
    			div4 = element("div");
    			label3 = element("label");
    			label3.textContent = "Size";
    			t21 = space();
    			input1 = element("input");
    			t22 = space();
    			label4 = element("label");
    			label4.textContent = "Array Type";
    			t24 = space();
    			select2 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t25 = space();
    			if (if_block0) if_block0.c();
    			t26 = space();
    			div2 = element("div");
    			if_block1.c();
    			t27 = space();
    			button = element("button");
    			button.textContent = "Reset";
    			t29 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (!src_url_equal(img_1.src, img_1_src_value = "https://media.discordapp.net/attachments/600494444722257930/964100517854847067/desktop.jpg")) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", "testimg");
    			set_style(img_1, "display", "none");
    			add_location(img_1, file, 1041, 1, 24970);
    			attr_dev(div0, "class", "container svelte-1a4ueem");
    			set_style(div0, "width", "70%");
    			set_style(div0, "margin-left", "auto");
    			add_location(div0, file, 1047, 1, 25137);
    			add_location(span0, file, 1049, 2, 25238);
    			attr_dev(label0, "for", "speedAdjust");
    			set_style(label0, "display", "inline");
    			add_location(label0, file, 1051, 3, 25326);
    			attr_dev(input0, "id", "speedAdjust");
    			set_style(input0, "padding", "0");
    			attr_dev(input0, "type", "range");
    			attr_dev(input0, "min", "0");
    			attr_dev(input0, "max", "1");
    			attr_dev(input0, "step", "0.01");
    			attr_dev(input0, "class", "svelte-1a4ueem");
    			add_location(input0, file, 1053, 3, 25403);
    			attr_dev(label1, "for", "displayType");
    			set_style(label1, "display", "inline");
    			add_location(label1, file, 1062, 3, 25548);
    			attr_dev(select0, "id", "displayType");
    			attr_dev(select0, "class", "svelte-1a4ueem");
    			if (/*displayType*/ ctx[5] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[24].call(select0));
    			add_location(select0, file, 1063, 3, 25617);
    			attr_dev(label2, "for", "audioType");
    			set_style(label2, "display", "inline");
    			add_location(label2, file, 1068, 3, 25787);
    			attr_dev(select1, "id", "audioType");
    			attr_dev(select1, "class", "svelte-1a4ueem");
    			if (/*audioType*/ ctx[6] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[25].call(select1));
    			add_location(select1, file, 1069, 3, 25851);
    			set_style(span1, "float", "right");
    			add_location(span1, file, 1050, 2, 25295);
    			attr_dev(div1, "class", "container svelte-1a4ueem");
    			add_location(div1, file, 1048, 1, 25212);
    			attr_dev(label3, "for", "size");
    			add_location(label3, file, 1096, 2, 26413);
    			attr_dev(input1, "id", "size");
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "svelte-1a4ueem");
    			add_location(input1, file, 1097, 2, 26446);
    			attr_dev(label4, "for", "arrayType");
    			add_location(label4, file, 1098, 2, 26500);
    			attr_dev(select2, "id", "arrayType");
    			attr_dev(select2, "class", "svelte-1a4ueem");
    			if (/*arrayType*/ ctx[2] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[27].call(select2));
    			add_location(select2, file, 1099, 2, 26544);
    			attr_dev(button, "class", "svelte-1a4ueem");
    			add_location(button, file, 1129, 3, 27239);
    			add_location(div2, file, 1120, 2, 27007);
    			attr_dev(div3, "style", "");
    			add_location(div3, file, 1131, 2, 27291);
    			attr_dev(div4, "class", "container svelte-1a4ueem");
    			set_style(div4, "max-width", screen.width > 1000 ? "17.5%" : "100%", false);
    			add_location(div4, file, 1092, 1, 26324);
    			attr_dev(main, "class", "svelte-1a4ueem");
    			add_location(main, file, 1040, 0, 24962);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, img_1);
    			/*img_1_binding*/ ctx[22](img_1);
    			append_dev(main, t0);
    			append_dev(main, div0);
    			append_dev(main, t2);
    			append_dev(main, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t3);
    			append_dev(span0, t4);
    			append_dev(span0, t5);
    			append_dev(span0, t6);
    			append_dev(span0, t7);
    			append_dev(div1, t8);
    			append_dev(div1, span1);
    			append_dev(span1, label0);
    			append_dev(span1, t10);
    			append_dev(span1, input0);
    			set_input_value(input0, /*speedAdjust*/ ctx[1]);
    			append_dev(span1, t11);
    			append_dev(span1, label1);
    			append_dev(span1, t13);
    			append_dev(span1, select0);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(select0, null);
    			}

    			select_option(select0, /*displayType*/ ctx[5]);
    			append_dev(span1, t14);
    			append_dev(span1, label2);
    			append_dev(span1, t16);
    			append_dev(span1, select1);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(select1, null);
    			}

    			select_option(select1, /*audioType*/ ctx[6]);
    			append_dev(div1, t17);
    			key_block.m(div1, null);
    			append_dev(div1, t18);
    			mount_component(canvas, div1, null);
    			append_dev(main, t19);
    			append_dev(main, div4);
    			append_dev(div4, label3);
    			append_dev(div4, t21);
    			append_dev(div4, input1);
    			set_input_value(input1, /*size*/ ctx[0]);
    			append_dev(div4, t22);
    			append_dev(div4, label4);
    			append_dev(div4, t24);
    			append_dev(div4, select2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select2, null);
    			}

    			select_option(select2, /*arrayType*/ ctx[2]);
    			append_dev(div4, t25);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div4, null);
    			}

    			append_dev(div4, t26);
    			append_dev(div4, div2);
    			if_block1.m(div2, null);
    			append_dev(div2, t27);
    			append_dev(div2, button);
    			append_dev(div4, t29);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_input_handler*/ ctx[23]),
    					listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[23]),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[24]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[25]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[26]),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[27]),
    					listen_dev(button, "click", /*updArr*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*speed*/ 128) && t4_value !== (t4_value = Math.round(/*speed*/ ctx[7]) + "")) set_data_dev(t4, t4_value);
    			if (!current || dirty[0] & /*speedMult*/ 8192) set_data_dev(t6, /*speedMult*/ ctx[13]);

    			if (dirty[0] & /*speedAdjust*/ 2) {
    				set_input_value(input0, /*speedAdjust*/ ctx[1]);
    			}

    			if (dirty[0] & /*displayOptions*/ 65536) {
    				each_value_5 = /*displayOptions*/ ctx[16];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_5(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_5.length;
    			}

    			if (dirty[0] & /*displayType, displayOptions*/ 65568) {
    				select_option(select0, /*displayType*/ ctx[5]);
    			}

    			if (dirty[0] & /*audioOptions*/ 131072) {
    				each_value_4 = /*audioOptions*/ ctx[17];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_4(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_4.length;
    			}

    			if (dirty[0] & /*audioType, audioOptions*/ 131136) {
    				select_option(select1, /*audioType*/ ctx[6]);
    			}

    			if (dirty[0] & /*speed*/ 128 && safe_not_equal(previous_key, previous_key = /*speed*/ ctx[7])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$1);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(div1, t18);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			const canvas_changes = {};

    			if (dirty[0] & /*arr, displayType, size, maxVal, img*/ 4897 | dirty[2] & /*$$scope*/ 268435456) {
    				canvas_changes.$$scope = { dirty, ctx };
    			}

    			canvas.$set(canvas_changes);

    			if (dirty[0] & /*size*/ 1 && to_number(input1.value) !== /*size*/ ctx[0]) {
    				set_input_value(input1, /*size*/ ctx[0]);
    			}

    			if (dirty[0] & /*arrayOptions*/ 16384) {
    				each_value_2 = /*arrayOptions*/ ctx[14];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty[0] & /*arrayType, arrayOptions*/ 16388) {
    				select_option(select2, /*arrayType*/ ctx[2]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block0) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block0 = if_blocks[current_block_type_index];

    					if (!if_block0) {
    						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block0.c();
    					} else {
    						if_block0.p(ctx, dirty);
    					}

    					transition_in(if_block0, 1);
    					if_block0.m(div4, t26);
    				} else {
    					if_block0 = null;
    				}
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div2, t27);
    				}
    			}

    			if (dirty[0] & /*sortOptions, sortType*/ 32784) {
    				each_value = /*sortOptions*/ ctx[15];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			transition_in(canvas.$$.fragment, local);
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			transition_out(canvas.$$.fragment, local);
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			/*img_1_binding*/ ctx[22](null);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			key_block.d(detaching);
    			destroy_component(canvas);
    			destroy_each(each_blocks_1, detaching);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if_block1.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const MIN_INTERVAL = 10, MAX_VALUE = 30000;

    function scale(val, max) {
    	return Math.floor(val * max);
    }

    function scaleExp(val, max) {
    	return Math.floor(max ** val);
    }

    function instance($$self, $$props, $$invalidate) {
    	let speedMult;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const arrayOptions = [
    		{ id: 1, text: "Random" },
    		{ id: 2, text: "Almost Sorted" },
    		{ id: 3, text: "Most Elements Sorted" },
    		{ id: 4, text: "Sorted" },
    		{ id: 5, text: "Reversed" },
    		{ id: 6, text: "Custom" }
    	];

    	const sortOptions = [
    		{
    			name: "Simple",
    			options: [
    				{ id: 1, text: "Insertion" },
    				{ id: 2, text: "Selection" },
    				{ id: 3, text: "Bubble" }
    			]
    		},
    		{
    			name: "Normal",
    			options: [
    				{ id: 4, text: "Quick" },
    				{ id: 5, text: "Merge" },
    				{ id: 6, text: "Heap" }
    			]
    		},
    		{
    			name: "Esoteric",
    			options: [
    				{ id: 14, text: "Cocktail" },
    				{ id: 15, text: "Odd-Even" },
    				{ id: 16, text: "2 Way Selection" },
    				{ id: 17, text: "Gnome" },
    				{ id: 18, text: "Cycle" },
    				{ id: 19, text: "Shell 1" },
    				{ id: 20, text: "Shell 2" },
    				{ id: 21, text: "Shell 3" },
    				{ id: 22, text: "Comb" },
    				{ id: 23, text: "Shaker" }
    			]
    		},
    		{
    			name: "Value based",
    			options: [
    				{ id: 7, text: "Counting" },
    				{ id: 8, text: "Radix LSD (Base 2)" },
    				{ id: 9, text: "Radix MSD (Base 4)" },
    				{ id: 10, text: "Radix LSD (Base 256)" },
    				{ id: 11, text: "Radix MSD (Base 64)" }
    			]
    		},
    		{
    			name: "Hybrid",
    			options: [
    				{ id: 12, text: "Bucket (16 Buckets)" },
    				{ id: 13, text: "Bucket (256 Buckets)" },
    				{ id: 24, text: "Tim" }
    			]
    		},
    		{
    			name: "Fastest",
    			options: [{ id: 25, text: "Slow" }, { id: 26, text: "Bogo" }]
    		}
    	];

    	const displayOptions = [
    		{ id: 1, text: "Bars" },
    		{ id: 2, text: "Flipped Bars" },
    		{ id: 3, text: "Scatterplot" },
    		{ id: 4, text: "Rainbow" },
    		{ id: 5, text: "Image" },
    		{ id: 6, text: "Spiral Bar" },
    		{ id: 7, text: "Spiral" },
    		{ id: 8, text: "Color Wheel" },
    		{ id: 9, text: "Lines" },
    		{ id: 10, text: "Lines Circle" }
    	];

    	const audioOptions = [
    		{ id: 0, text: "None" },
    		{ id: 1, text: "Audio 1" },
    		{ id: 2, text: "Audio 2" },
    		{ id: 3, text: "Audio 3" },
    		{ id: 4, text: "Audio 4" }
    	];

    	const timer = ms => new Promise(res => setTimeout(res, ms));

    	const width = screen.width > 1000
    		? screen.width * 0.7
    		: screen.width * 0.95,
    		height = Math.min(width, screen.height * 0.7);

    	let size = scale(Math.random() ** 2, 100) + 3,
    		speedAdjust = 0.5,
    		algorithm = 1,
    		arrayType = 1,
    		arrayAdjust = 0.5,
    		sortType = 1,
    		displayType = 1,
    		audioType = 0;

    	let speed = 1, arr = [], maxVal = 0;

    	function updArr(val = null) {
    		sortID++;
    		$$invalidate(10, paused = -1);
    		$$invalidate(7, speed = 1);
    		$$invalidate(0, size = Math.max(Math.min(size, 10000), 1));
    		if (arrayType != 6) $$invalidate(8, arr = Array.from({ length: size }, (v, i) => i + 1));

    		switch (arrayType) {
    			case 1:
    				for (let i = arr.length - 1; i >= 0; i--) {
    					let j = scale(Math.random(), i + 1);
    					$$invalidate(8, [arr[i], arr[j]] = [arr[j], arr[i]], arr);
    				}
    				break;
    			case 2:
    				let d = scaleExp(arrayAdjust, arr.length);
    				for (let i = 0; i < arr.length; i++) {
    					let a = Math.floor(Math.min(i, d));
    					let j = i - scale(Math.random() ** 2, a);
    					$$invalidate(8, [arr[i], arr[j]] = [arr[j], arr[i]], arr);
    				}
    				break;
    			case 3:
    				let swaps = scaleExp(arrayAdjust, arr.length);
    				while (swaps--) {
    					let i = scale(Math.random(), size), j = scale(Math.random(), size);
    					$$invalidate(8, [arr[i], arr[j]] = [arr[j], arr[i]], arr);
    				}
    				break;
    			case 4:
    				break;
    			case 5:
    				arr.reverse();
    				break;
    			case 6:
    				if (!val) break;
    				$$invalidate(8, arr = val.split(/[^0-9]/).filter(x => x).map(x => Math.max(1, Math.min(MAX_VALUE, x))));
    				$$invalidate(0, size = arr.length);
    				break;
    		}

    		$$invalidate(9, maxVal = Math.max(...arr));
    	}

    	let sortID = 0, step = 1, paused = true, time, speedup = "", steps;

    	async function displayEvent(curID, a = null, b = null) {
    		if (curID != sortID) return true;

    		if (a) {
    			$$invalidate(8, arr[a] *= -1, arr);
    			playNote(arr[a] / maxVal);
    		}

    		if (b) {
    			$$invalidate(8, arr[b] *= -1, arr);
    		}

    		await timer(time);
    		while (paused == 1) await timer(200);
    		if (curID != sortID) return true;
    		if (a) $$invalidate(8, arr[a] *= -1, arr);
    		if (b) $$invalidate(8, arr[b] *= -1, arr);
    		return false;
    	}

    	async function insertionSort() {
    		let curID = ++sortID;

    		for (let i = 0; i < size; i++) {
    			if (step >= size) {
    				if (curID != sortID) return;
    				let a = [], aa = Math.ceil(step / size), newSteps = 0;

    				for (let j = i; j <= i + aa && j < size; j++) {
    					a.push(arr[j]);
    				}

    				a.sort((a, b) => a - b);
    				aa = a.length;

    				for (let j = i - 1; j >= 0 && aa > 0; j--) {
    					if (arr[j] > a[aa - 1]) {
    						$$invalidate(8, arr[j + aa] = arr[j], arr);
    						newSteps += aa;
    					} else {
    						$$invalidate(8, arr[j + aa] = a[aa - 1], arr);
    						aa--;
    						j++;
    					}
    				}

    				for (let j = 0; j < aa; j++) $$invalidate(8, arr[j] = a[j], arr);
    				i += a.length - 1;

    				if (step - steps % step < newSteps) {
    					if (await displayEvent(curID)) return;
    					await timer(time * newSteps / step);
    				}

    				steps += newSteps;
    				continue;
    			}

    			for (let j = i; j > 0; j--) {
    				if (curID != sortID) return;

    				if (arr[j] >= arr[j - 1]) {
    					break;
    				}

    				$$invalidate(8, [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]], arr);

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, j, j - 1)) return;
    				}
    			}
    		}

    		sortID++;
    	}

    	async function selectionSort() {
    		let curID = ++sortID;
    		let a = [];

    		for (let i = 0; i < size; i++) {
    			a[arr[i]] = i;
    		}

    		for (let i = 0; i < size; i++) {
    			if (step >= size && arrayOptions != 6) {
    				if (curID != sortID) return;
    				a[arr[i]] = a[i + 1];
    				$$invalidate(8, [arr[a[i + 1]], arr[i]] = [arr[i], arr[a[i + 1]]], arr);

    				if (step - steps % step < size - i - 1) {
    					if (await displayEvent(curID, i)) return;
    				}

    				steps += size - i - 1;
    				continue;
    			}

    			for (let j = i + 1; j < size; j++) {
    				if (curID != sortID) return;

    				if (arr[j] < arr[i]) {
    					$$invalidate(8, [arr[j], arr[i]] = [arr[i], arr[j]], arr);
    					[a[arr[j]], a[arr[i]]] = [a[arr[i]], a[arr[j]]];
    				}

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, j, i)) return;
    				}
    			}
    		}

    		sortID++;
    	}

    	async function bubbleSort() {
    		let curID = ++sortID, last = arr.length, newLast;

    		while (last > 0) {
    			newLast = 0;

    			for (let i = 1; i < last; i++) {
    				if (curID != sortID) return;

    				if (arr[i] < arr[i - 1]) {
    					newLast = i;
    					$$invalidate(8, [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]], arr);
    				}

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, i, i - 1)) return;
    				}
    			}

    			last = newLast;
    		}

    		sortID++;
    	}

    	async function quickSort(l = 0, r = size - 1, curID = ++sortID) {
    		if (l >= r) return;

    		let a = arr.slice(l, r + 1),
    			newSteps = Math.ceil((r - l + 1) * Math.log2(r - l + 1));

    		if (newSteps < step) {
    			a.sort((a, b) => a - b);
    			arr.splice(l, a.length, ...a);

    			if (step - steps % step < newSteps) {
    				await timer(time);
    			}

    			steps += newSteps;
    			return;
    		}

    		let mi = Math.min(...a), ma = Math.max(...a);
    		if (mi == ma) return;
    		let m = (mi + ma) / 2, x = l, mid;

    		for (let i = 0; i < a.length; i++) {
    			if (curID != sortID) return;

    			if (a[i] <= m) {
    				$$invalidate(8, arr[x++] = a[i], arr);
    			}

    			if (++steps % step == 0) {
    				if (await displayEvent(curID, x - 1)) return;
    			}
    		}

    		mid = x - 1;

    		for (let i = 0; i < a.length; i++) {
    			if (curID != sortID) return;

    			if (a[i] > m) {
    				$$invalidate(8, arr[x++] = a[i], arr);
    			}

    			if (++steps % step == 0) {
    				if (await displayEvent(curID, x - 1)) return;
    			}
    		}

    		await quickSort(l, mid, curID);
    		await quickSort(mid + 1, r, curID);
    	}

    	async function quickSortInit() {
    		let curID = ++sortID;
    		await quickSort(0, size - 1, curID);
    		$$invalidate(8, arr);
    		if (curID == sortID) sortID++;
    		console.log(steps);
    	}

    	async function mergeSort(l = 0, r = size - 1, curID = ++sortID) {
    		if (l >= r) return;
    		let newSteps = Math.ceil((r - l + 1) * Math.log2(r - l + 1));

    		if (newSteps < step) {
    			let a = arr.slice(l, r + 1);
    			a.sort((a, b) => a - b);
    			arr.splice(l, a.length, ...a);

    			if (step - steps % step < newSteps) {
    				await timer(time);
    			}

    			steps += newSteps;
    			return;
    		}

    		let mid = Math.floor((l + r) / 2);
    		await mergeSort(l, mid, curID);
    		await mergeSort(mid + 1, r, curID);
    		let a = arr.slice(l, mid + 1), b = arr.slice(mid + 1, r + 1), aa = 0, bb = 0;
    		a[a.length] = b[b.length] = Infinity;

    		for (let i = l; i <= r; i++) {
    			if (curID != sortID) return;

    			if (a[aa] < b[bb]) {
    				$$invalidate(8, arr[i] = a[aa], arr);
    				aa++;
    			} else {
    				$$invalidate(8, arr[i] = b[bb], arr);
    				bb++;
    			}

    			if (++steps % step == 0) {
    				if (await displayEvent(curID, i)) return;
    			}
    		}
    	}

    	async function mergeSortInit() {
    		let curID = ++sortID;
    		await mergeSort(0, size - 1, curID);
    		if (curID == sortID) sortID++;
    	}

    	async function heapSort() {
    		let curID = ++sortID;
    		let depth = Array(size * 2 + 1).fill(0);

    		async function insert(id, val) {
    			if (curID != sortID) return;
    			if (++steps % step == 0) if (await displayEvent(curID, id)) return;
    			let lc = id * 2 + 1, rc = id * 2 + 2;

    			if (depth[id] == 0) {
    				$$invalidate(8, arr[id] = val, arr);
    			} else {
    				if (val > arr[id]) $$invalidate(8, [val, arr[id]] = [arr[id], val], arr);
    				if (depth[lc] <= depth[rc]) await insert(lc, val); else await insert(rc, val);
    			}

    			depth[id] = Math.min(depth[lc], depth[rc]) + 1;
    		}

    		async function pop(id) {
    			if (curID != sortID) return;
    			if (++steps % step == 0) if (await displayEvent(curID, id)) return;
    			let lc = id * 2 + 1, rc = id * 2 + 2;

    			if (depth[lc] == 0 && depth[rc] == 0) {
    				depth[id] = 0;
    				return;
    			}

    			if (!depth[rc] || depth[lc] && arr[lc] > arr[rc]) {
    				$$invalidate(8, arr[id] = arr[lc], arr);
    				await pop(lc);
    			} else if (depth[rc]) {
    				$$invalidate(8, arr[id] = arr[rc], arr);
    				await pop(rc);
    			}

    			depth[id] = Math.min(depth[lc], depth[rc]) + 1;
    		}

    		for (let i = 0; i < size; i++) {
    			if (curID != sortID) return;
    			await insert(0, arr[i]);
    		}

    		for (let i = size - 1; i >= 0; i--) {
    			if (curID != sortID) return;
    			let temp = arr[0];
    			await pop(0);
    			await insert(0, arr[i]);
    			depth[i] = 0;
    			$$invalidate(8, arr[i] = temp, arr);
    		}

    		sortID++;
    	}

    	async function countingSort() {
    		let curID = ++sortID;
    		let a = Array(maxVal + 1).fill(0), x = 0;

    		for (let i = 0; i < size; i++) {
    			if (++steps % step == 0) {
    				if (await displayEvent(curID, i)) return;
    			}

    			a[arr[i]]++;
    		}

    		for (let i = 1; i <= maxVal; i++) {
    			if (curID != sortID) return;

    			for (let j = 0; j < a[i]; j++) {
    				$$invalidate(8, arr[x++] = i, arr);

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, x - 1)) return;
    				}
    			}
    		}

    		sortID++;
    	}

    	async function radixLSD(base) {
    		let curID = ++sortID;

    		for (let bit = 1; bit <= size; bit *= base) {
    			let a = Array.from(Array(base), () => Array()), x = 0;

    			for (let i = 0; i < size; i++) {
    				a[Math.floor(arr[i] / bit) % base].push(arr[i]);
    			}

    			for (let i = 0; i < base; i++) {
    				for (let j = 0; j < a[i].length; j++) {
    					if (curID != sortID) return;
    					$$invalidate(8, arr[x++] = a[i][j], arr);

    					if (++steps % step == 0) {
    						if (await displayEvent(curID, x - 1)) return;
    					}
    				}
    			}
    		}

    		sortID++;
    	}

    	async function radixMSD(l, r, bit, base, curID) {
    		if (bit < 1 || l >= r) return;

    		let a = arr.slice(l, r + 1),
    			b = Array.from(Array(base), () => Array()),
    			m = [],
    			x = l;

    		for (let i = 0; i < a.length; i++) {
    			b[Math.floor(a[i] % (bit * base) / bit)].push(a[i]);
    		}

    		for (let i = 0; i < base; i++) {
    			m[i] = x;

    			for (let j = 0; j < b[i].length; j++) {
    				if (curID != sortID) return;
    				$$invalidate(8, arr[x++] = b[i][j], arr);

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, x - 1)) return;
    				}
    			}
    		}

    		m[base] = r + 1;

    		for (let i = 0; i < base; i++) {
    			await radixMSD(m[i], m[i + 1] - 1, bit / base, base, curID);
    		}
    	}

    	async function radixMSDInit(base) {
    		let bit = 1;
    		while (bit < size) bit *= base;
    		let curID = ++sortID;
    		await radixMSD(0, size - 1, bit, base, curID);
    		if (curID == sortID) sortID++;
    	}

    	async function bucketSort(base) {
    		let curID = ++sortID;
    		let bit = Math.max(...arr) / base + 1;
    		let b = Array.from(Array(base), () => Array()), m = [], x = 0;

    		for (let i = 0; i < arr.length; i++) {
    			b[Math.floor(arr[i] / bit)].push(arr[i]);
    		}

    		for (let i = 0; i < base; i++) {
    			m[i] = x;

    			for (let j = 0; j < b[i].length; j++) {
    				if (curID != sortID) return;
    				$$invalidate(8, arr[x++] = b[i][j], arr);

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, x - 1)) return;
    				}
    			}
    		}

    		await insertionSort();
    		sortID++;
    	}

    	async function cocktailSort() {
    		let curID = ++sortID, last = arr.length, newLast, first = 0, newFirst;

    		while (first < last) {
    			newLast = 0;
    			newFirst = size;

    			for (let i = first + 1; i < last; i++) {
    				if (curID != sortID) return;

    				if (arr[i] < arr[i - 1]) {
    					newLast = i;
    					$$invalidate(8, [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]], arr);
    				}

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, i, i - 1)) return;
    				}
    			}

    			last = newLast;

    			for (let i = last - 2; i >= first; i--) {
    				if (curID != sortID) return;

    				if (arr[i] > arr[i + 1]) {
    					newFirst = i;
    					$$invalidate(8, [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]], arr);
    				}

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, i, i + 1)) return;
    				}
    			}

    			first = newFirst;
    		}

    		sortID++;
    	}

    	async function oddEven() {
    		let curID = ++sortID, done = false;

    		while (!done) {
    			done = 1;

    			for (let i = 1; i < size; i += 2) {
    				if (curID != sortID) return;

    				if (arr[i] < arr[i - 1]) {
    					done = 0;
    					$$invalidate(8, [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]], arr);
    				}

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, i, i + 1)) return;
    				}
    			}

    			for (let i = 2; i < size; i += 2) {
    				if (curID != sortID) return;

    				if (arr[i] < arr[i - 1]) {
    					done = 0;
    					$$invalidate(8, [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]], arr);
    				}

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, i, i + 1)) return;
    				}
    			}
    		}

    		sortID++;
    	}

    	async function selection2() {
    		let curID = ++sortID;

    		for (let i = 0; i < size; i++) {
    			let a = i, b = i;

    			for (let j = i; j <= size - 1 - i; j++) {
    				if (curID != sortID) return;
    				if (arr[j] < arr[a]) a = j;
    				if (arr[j] > arr[b]) b = j;

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, j)) return;
    				}
    			}

    			$$invalidate(8, [arr[i], arr[a]] = [arr[a], arr[i]], arr);
    			if (i + 1 >= size - 1 - i) break;
    			if (b == i) b = a;
    			$$invalidate(8, [arr[size - 1 - i], arr[b]] = [arr[b], arr[size - 1 - i]], arr);

    			if (++steps % step == 0) {
    				playNote(arr[b] / maxVal);
    				await timer(time);
    			}
    		}

    		sortID++;
    	}

    	async function gnome() {
    		let curID = ++sortID;

    		for (let i = 0; i < size; i++) {
    			if (curID != sortID) return;

    			if (i > 0 && arr[i - 1] > arr[i]) {
    				$$invalidate(8, [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]], arr);
    				i -= 2;
    			}

    			if (++steps % step == 0) {
    				if (await displayEvent(curID, Math.max(1, i))) return;
    			}
    		}

    		sortID++;
    	}

    	async function cycle() {
    		let curID = ++sortID;

    		for (let i = 0; i < size; i++) {
    			if (++steps % step == 0) {
    				playNote(arr[i] / maxVal);
    				await timer(time);
    			}

    			for (let p = arr[i], j = arr[arr[i] - 1]; ; j = arr[j - 1]) {
    				if (curID != sortID) return;
    				$$invalidate(8, arr[p - 1] = p, arr);
    				if (p - 1 == i) break;
    				p = j;

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, p - 1)) return;
    				}
    			}
    		}

    		sortID++;
    	}

    	async function shellSort(seq) {
    		let curID = ++sortID;
    		console.log(seq);

    		for (let a of seq) {
    			for (let i = a; i < size; i++) {
    				for (let j = i; j >= a; j -= a) {
    					if (curID != sortID) return;

    					if (arr[j] >= arr[j - a]) {
    						break;
    					}

    					$$invalidate(8, [arr[j], arr[j - a]] = [arr[j - a], arr[j]], arr);

    					if (++steps % step == 0) {
    						if (await displayEvent(curID, j, j - a)) return;
    					}
    				}
    			}
    		}

    		sortID++;
    	}

    	async function shellSort1() {
    		let seq = [];
    		for (let i = 1; 2 ** i - 1 <= size; i++) seq.push(2 ** i - 1);
    		seq.reverse();
    		shellSort(seq);
    	}

    	async function shellSort2() {
    		let seq = [1];
    		for (let i = 1; 4 ** i + 3 * 2 ** (i - 1) + 1 <= size; i++) seq.push(4 ** i + 3 * 2 ** (i - 1) + 1);
    		seq.reverse();
    		shellSort(seq);
    	}

    	async function shellSort3() {
    		let seq = [1];
    		for (let i = 1; i <= size; i *= 2) for (let j = i; j <= size; j *= 3) seq.push(j);
    		seq.sort((a, b) => b - a);
    		shellSort(seq);
    	}

    	async function combSort() {
    		let curID = ++sortID, done = false, a = size;

    		while (!done || a > 1) {
    			done = true;
    			a = Math.max(1, Math.floor(a / 1.3));

    			for (let i = a; i < size; i++) {
    				if (curID != sortID) return;

    				if (arr[i] < arr[i - a]) {
    					done = false;
    					$$invalidate(8, [arr[i], arr[i - a]] = [arr[i - a], arr[i]], arr);
    				}

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, i, i - a)) return;
    				}
    			}
    		}

    		sortID++;
    	}

    	async function shakerSort() {
    		let curID = ++sortID, done = false, a = size;

    		while (!done || a > 1) {
    			done = true;
    			a = Math.max(1, Math.floor(a / 1.3));

    			for (let i = a; i < size; i++) {
    				if (curID != sortID) return;

    				if (arr[i] < arr[i - a]) {
    					done = false;
    					$$invalidate(8, [arr[i], arr[i - a]] = [arr[i - a], arr[i]], arr);
    				}

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, i, i - a)) return;
    				}
    			}

    			for (let i = size - 1 - a; i >= 0; i--) {
    				if (curID != sortID) return;

    				if (arr[i] > arr[i + a]) {
    					done = false;
    					$$invalidate(8, [arr[i], arr[i + a]] = [arr[i + a], arr[i]], arr);
    				}

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, i, i + a)) return;
    				}
    			}
    		}

    		sortID++;
    	}

    	async function timSort(l = 0, r = size - 1, curID = ++sortID) {
    		if (r - l <= 16) {
    			for (let i = l; i < r; i++) {
    				for (let j = i + 1; j > l; j--) {
    					if (curID != sortID) return;

    					if (arr[j] >= arr[j - 1]) {
    						break;
    					}

    					$$invalidate(8, [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]], arr);

    					if (++steps % step == 0) {
    						if (await displayEvent(curID, j, j - 1)) return;
    					}
    				}
    			}

    			return;
    		}

    		let newSteps = Math.ceil((r - l + 1) * Math.log2(r - l + 1));

    		if (newSteps < step) {
    			let a = arr.slice(l, r + 1);
    			a.sort((a, b) => a - b);
    			arr.splice(l, a.length, ...a);

    			if (step - steps % step < newSteps) {
    				await timer(time);
    			}

    			steps += newSteps;
    			return;
    		}

    		let mid = Math.floor((l + r) / 2);
    		await timSort(l, mid, curID);
    		await timSort(mid + 1, r, curID);
    		let a = arr.slice(l, mid + 1), b = arr.slice(mid + 1, r + 1), aa = 0, bb = 0;
    		a[a.length] = b[b.length] = Infinity;

    		for (let i = l; i <= r; i++) {
    			if (curID != sortID) return;

    			if (a[aa] < b[bb]) {
    				$$invalidate(8, arr[i] = a[aa], arr);
    				aa++;
    			} else {
    				$$invalidate(8, arr[i] = b[bb], arr);
    				bb++;
    			}

    			if (++steps % step == 0) {
    				if (await displayEvent(curID, i)) return;
    			}
    		}
    	}

    	async function timSortInit() {
    		let curID = ++sortID;
    		await timSort(0, size - 1, curID);
    		if (curID == sortID) sortID++;
    	}

    	let slowSortSteps = [];

    	async function slowSort(l = 0, r = size - 1, curID = ++sortID) {
    		if (l >= r) return;

    		if (step > slowSortSteps[r - l + 1]) {
    			if (step - steps % step <= slowSortSteps[r - l + 1]) {
    				if (await displayEvent(curID, r, l)) return;
    			}

    			steps += slowSortSteps[r - l + 1];
    			let a = arr.slice(l, r + 1);
    			a.sort((a, b) => a - b);
    			arr.splice(l, r - l + 1, ...a);
    			return;
    		}

    		let mid = Math.floor((l + r) / 2);
    		await slowSort(l, mid, curID);
    		await slowSort(mid + 1, r, curID);

    		if (++steps % step == 0) {
    			if (await displayEvent(curID, mid, r)) return;
    		}

    		if (curID != sortID) return;
    		if (arr[mid] > arr[r]) $$invalidate(8, [arr[mid], arr[r]] = [arr[r], arr[mid]], arr);
    		await slowSort(l, r - 1, curID);
    	}

    	async function slowSortInit() {
    		slowSortSteps[0] = slowSortSteps[1] = 0;

    		for (let i = 2; i <= size; i++) {
    			slowSortSteps[i] = slowSortSteps[i - 1] + slowSortSteps[Math.floor(i / 2)] + slowSortSteps[Math.ceil(i / 2)] + 1;
    		}

    		console.log(slowSortSteps[size]);
    		let curID = ++sortID;
    		await slowSort(0, size - 1, curID);
    		$$invalidate(8, arr);
    		if (curID == sortID) sortID++;
    	}

    	let fact = [1];

    	async function bogoSort() {
    		for (let i = 1; i <= size; i++) fact[i] = fact[i - 1] * i;
    		console.log(fact[size]);
    		let curID = ++sortID;

    		for (let done = false; !done; ) {
    			if (step > size) {
    				if (Math.random() * size * fact[size] <= step) {
    					arr.sort((a, b) => a - b);
    					break;
    				}

    				playNote(arr[0] / maxVal);
    				await timer(time);
    			}

    			for (let i = arr.length - 1; i >= 0; i--) {
    				let j = scale(Math.random(), i + 1);
    				$$invalidate(8, [arr[i], arr[j]] = [arr[j], arr[i]], arr);

    				if (++steps % step == 0) {
    					if (await displayEvent(curID, i, j)) return;
    				}

    				if (curID != sortID) {
    					return;
    				}
    			}

    			done = true;
    			for (let i = 1; i < size; i++) if (arr[i] < arr[i - 1]) done = false;
    		}

    		sortID++;
    	}

    	async function go() {
    		steps = 0;
    		$$invalidate(10, paused = 0);
    		$$invalidate(8, arr = arr.map(Math.abs));

    		switch (sortType) {
    			case 1:
    				$$invalidate(7, speed = calcSpeed(size ** 2));
    				calcTime();
    				insertionSort();
    				break;
    			case 2:
    				$$invalidate(7, speed = calcSpeed(size ** 2));
    				calcTime();
    				selectionSort();
    				break;
    			case 3:
    				$$invalidate(7, speed = calcSpeed(size ** 2));
    				calcTime();
    				bubbleSort();
    				break;
    			case 4:
    				$$invalidate(7, speed = calcSpeed(size * Math.log2(size) * 4));
    				calcTime();
    				quickSortInit();
    				break;
    			case 5:
    				$$invalidate(7, speed = calcSpeed(size * Math.log2(size) * 4));
    				calcTime();
    				mergeSortInit();
    				break;
    			case 6:
    				$$invalidate(7, speed = calcSpeed(size * Math.log2(size) * 4));
    				calcTime();
    				heapSort();
    				break;
    			case 7:
    				$$invalidate(7, speed = calcSpeed(size * 3));
    				calcTime();
    				countingSort();
    				break;
    			case 8:
    				$$invalidate(7, speed = calcSpeed(size * Math.log2(size)));
    				calcTime();
    				radixLSD(2);
    				break;
    			case 9:
    				$$invalidate(7, speed = calcSpeed(size * Math.log2(size)));
    				calcTime();
    				radixMSDInit(4);
    				break;
    			case 10:
    				$$invalidate(7, speed = calcSpeed(size * Math.log2(size)));
    				calcTime();
    				radixLSD(256);
    				break;
    			case 11:
    				$$invalidate(7, speed = calcSpeed(size * Math.log2(size)));
    				calcTime();
    				radixMSDInit(64);
    				break;
    			case 12:
    				$$invalidate(7, speed = calcSpeed(size ** 2 / 16));
    				calcTime();
    				bucketSort(16);
    				break;
    			case 13:
    				$$invalidate(7, speed = calcSpeed(size * Math.max(2, size / 256)));
    				calcTime();
    				bucketSort(256);
    				break;
    			case 14:
    				$$invalidate(7, speed = calcSpeed(size ** 2));
    				calcTime();
    				cocktailSort();
    				break;
    			case 15:
    				$$invalidate(7, speed = calcSpeed(size ** 2));
    				calcTime();
    				oddEven();
    				break;
    			case 16:
    				$$invalidate(7, speed = calcSpeed(size ** 2));
    				calcTime();
    				selection2();
    				break;
    			case 17:
    				$$invalidate(7, speed = calcSpeed(size ** 2));
    				calcTime();
    				gnome();
    				break;
    			case 18:
    				$$invalidate(7, speed = calcSpeed(size * 2));
    				calcTime();
    				cycle();
    				break;
    			case 19:
    				$$invalidate(7, speed = calcSpeed(size ** 1.5));
    				calcTime();
    				shellSort1();
    				break;
    			case 20:
    				$$invalidate(7, speed = calcSpeed(size ** 1.5));
    				calcTime();
    				shellSort2();
    				break;
    			case 21:
    				$$invalidate(7, speed = calcSpeed(size ** 1.5));
    				calcTime();
    				shellSort3();
    				break;
    			case 22:
    				$$invalidate(7, speed = calcSpeed(size ** 1.5));
    				calcTime();
    				combSort();
    				break;
    			case 23:
    				$$invalidate(7, speed = calcSpeed(size ** 1.5));
    				calcTime();
    				shakerSort();
    				break;
    			case 24:
    				$$invalidate(7, speed = calcSpeed(size * Math.log2(size)));
    				calcTime();
    				timSortInit();
    				break;
    			case 25:
    				$$invalidate(7, speed = calcSpeed(size * Math.log2(size)));
    				calcTime();
    				slowSortInit();
    				break;
    			case 26:
    				$$invalidate(7, speed = calcSpeed(size * Math.log2(size) * 100));
    				calcTime();
    				bogoSort();
    				break;
    		}

    		let curID = sortID, nextSpeedup = 30000;

    		while (curID == sortID) {
    			await timer(nextSpeedup);
    			if (curID != sortID) break;
    			if (paused == 1) continue;
    			$$invalidate(11, speedup = "x2");
    			$$invalidate(7, speed *= 2);
    			calcTime();
    			nextSpeedup *= nextSpeedup < 5000 ? 0.95 : 0.8;
    		}

    		$$invalidate(11, speedup = "");
    	}

    	function calcSpeed(ops) {
    		return ops / ((2 + Math.log(size) / 2) * (1 + Math.log(ops / size)));
    	}

    	function calcTime() {
    		time = Math.max(MIN_INTERVAL, 1000 / (speed * speedMult));
    		step = Math.ceil(time / 1000 * speed * speedMult);
    	}

    	let img;
    	const audioCtx = new AudioContext();

    	function playNote(val) {
    		if (audioType == 0) return;
    		val = Math.abs(val);
    		const oscillator = new OscillatorNode(audioCtx);
    		const gainNode = new GainNode(audioCtx);
    		let frequency, duration;

    		switch (audioType) {
    			case 1:
    				frequency = val * 400 + 200;
    				duration = 50;
    				oscillator.type = "square";
    				break;
    			case 2:
    				frequency = scaleExp(val, 50) * 80;
    				duration = 5;
    				oscillator.type = "square";
    				break;
    			case 3:
    				frequency = scaleExp(val, 40) * 100;
    				duration = 50;
    				oscillator.type = "triangle";
    				break;
    			case 4:
    				frequency = scaleExp(val, 40) * 100;
    				duration = 500;
    				oscillator.type = "sine";
    				break;
    		}

    		oscillator.frequency.value = frequency; // value in hertz
    		gainNode.gain.value = 0.005;
    		oscillator.connect(gainNode).connect(audioCtx.destination);
    		oscillator.start();

    		setTimeout(
    			function () {
    				oscillator.stop();
    			},
    			duration
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function img_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			img = $$value;
    			$$invalidate(12, img);
    		});
    	}

    	function input0_change_input_handler() {
    		speedAdjust = to_number(this.value);
    		$$invalidate(1, speedAdjust);
    	}

    	function select0_change_handler() {
    		displayType = select_value(this);
    		$$invalidate(5, displayType);
    		$$invalidate(16, displayOptions);
    	}

    	function select1_change_handler() {
    		audioType = select_value(this);
    		$$invalidate(6, audioType);
    		$$invalidate(17, audioOptions);
    	}

    	function input1_input_handler() {
    		size = to_number(this.value);
    		$$invalidate(0, size);
    	}

    	function select2_change_handler() {
    		arrayType = select_value(this);
    		$$invalidate(2, arrayType);
    		$$invalidate(14, arrayOptions);
    	}

    	function input_change_input_handler() {
    		arrayAdjust = to_number(this.value);
    		$$invalidate(3, arrayAdjust);
    	}

    	const input_handler = e => updArr(e.target.value);
    	const click_handler = () => $$invalidate(10, paused = 0);
    	const click_handler_1 = () => $$invalidate(10, paused = 1);
    	const click_handler_2 = option => $$invalidate(4, sortType = option.id);

    	$$self.$capture_state = () => ({
    		Canvas,
    		Layer,
    		t,
    		fade,
    		fly,
    		Bar,
    		scale,
    		scaleExp,
    		arrayOptions,
    		sortOptions,
    		displayOptions,
    		audioOptions,
    		MIN_INTERVAL,
    		MAX_VALUE,
    		timer,
    		width,
    		height,
    		size,
    		speedAdjust,
    		algorithm,
    		arrayType,
    		arrayAdjust,
    		sortType,
    		displayType,
    		audioType,
    		speed,
    		arr,
    		maxVal,
    		updArr,
    		sortID,
    		step,
    		paused,
    		time,
    		speedup,
    		steps,
    		displayEvent,
    		insertionSort,
    		selectionSort,
    		bubbleSort,
    		quickSort,
    		quickSortInit,
    		mergeSort,
    		mergeSortInit,
    		heapSort,
    		countingSort,
    		radixLSD,
    		radixMSD,
    		radixMSDInit,
    		bucketSort,
    		cocktailSort,
    		oddEven,
    		selection2,
    		gnome,
    		cycle,
    		shellSort,
    		shellSort1,
    		shellSort2,
    		shellSort3,
    		combSort,
    		shakerSort,
    		timSort,
    		timSortInit,
    		slowSortSteps,
    		slowSort,
    		slowSortInit,
    		fact,
    		bogoSort,
    		go,
    		calcSpeed,
    		calcTime,
    		img,
    		audioCtx,
    		playNote,
    		speedMult
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('speedAdjust' in $$props) $$invalidate(1, speedAdjust = $$props.speedAdjust);
    		if ('algorithm' in $$props) algorithm = $$props.algorithm;
    		if ('arrayType' in $$props) $$invalidate(2, arrayType = $$props.arrayType);
    		if ('arrayAdjust' in $$props) $$invalidate(3, arrayAdjust = $$props.arrayAdjust);
    		if ('sortType' in $$props) $$invalidate(4, sortType = $$props.sortType);
    		if ('displayType' in $$props) $$invalidate(5, displayType = $$props.displayType);
    		if ('audioType' in $$props) $$invalidate(6, audioType = $$props.audioType);
    		if ('speed' in $$props) $$invalidate(7, speed = $$props.speed);
    		if ('arr' in $$props) $$invalidate(8, arr = $$props.arr);
    		if ('maxVal' in $$props) $$invalidate(9, maxVal = $$props.maxVal);
    		if ('sortID' in $$props) sortID = $$props.sortID;
    		if ('step' in $$props) step = $$props.step;
    		if ('paused' in $$props) $$invalidate(10, paused = $$props.paused);
    		if ('time' in $$props) time = $$props.time;
    		if ('speedup' in $$props) $$invalidate(11, speedup = $$props.speedup);
    		if ('steps' in $$props) steps = $$props.steps;
    		if ('slowSortSteps' in $$props) slowSortSteps = $$props.slowSortSteps;
    		if ('fact' in $$props) fact = $$props.fact;
    		if ('img' in $$props) $$invalidate(12, img = $$props.img);
    		if ('speedMult' in $$props) $$invalidate(13, speedMult = $$props.speedMult);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*speedAdjust*/ 2) {
    			$$invalidate(13, speedMult = scaleExp(speedAdjust, 100 ** 2) / 100);
    		}

    		if ($$self.$$.dirty[0] & /*speedAdjust*/ 2) {
    			speedAdjust && calcTime();
    		}

    		if ($$self.$$.dirty[0] & /*size, arrayType, arrayAdjust*/ 13) {
    			size && arrayType && arrayAdjust && updArr();
    		}
    	};

    	return [
    		size,
    		speedAdjust,
    		arrayType,
    		arrayAdjust,
    		sortType,
    		displayType,
    		audioType,
    		speed,
    		arr,
    		maxVal,
    		paused,
    		speedup,
    		img,
    		speedMult,
    		arrayOptions,
    		sortOptions,
    		displayOptions,
    		audioOptions,
    		width,
    		height,
    		updArr,
    		go,
    		img_1_binding,
    		input0_change_input_handler,
    		select0_change_handler,
    		select1_change_handler,
    		input1_input_handler,
    		select2_change_handler,
    		input_change_input_handler,
    		input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
