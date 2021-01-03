import {W, getAttribute, getChildFirst, getChildren, getNext, getParent, getParentForm, getPrev, getText, hasParent, letClass, letClasses, letElement, setClass, setChildLast, setClasses, setElement, setNext, setPrev, setText} from '@taufik-nurrohman/document';
import {eventPreventDefault, off as offEvent, on as onEvent} from '@taufik-nurrohman/event';
import {fromStates} from '@taufik-nurrohman/from';
import {hasValue} from '@taufik-nurrohman/has';
import {fire as fireHook, hooks, off as offHook, on as onHook} from '@taufik-nurrohman/hook';
import {isInstance, isNumber, isSet, isString} from '@taufik-nurrohman/is';
import {toPattern} from '@taufik-nurrohman/pattern';
import {toArrayKey, toCaseLower, toCount, toObjectCount} from '@taufik-nurrohman/to';

let delay = W.setTimeout,
    name = '%(rollup.output.name)';

const KEY_ARROW_LEFT = ['ArrowLeft', 37];
const KEY_ARROW_RIGHT = ['ArrowRight', 39];
const KEY_DELETE_LEFT = ['Backspace', 8];
const KEY_DELETE_RIGHT = ['Delete', 46];
const KEY_ENTER = ['Enter', 13];
const KEY_TAB = ['Tab', 9];

function TP(source, state = {}) {

    if (!source) return;

    const $ = this;

    // Already instantiated, skip!
    if (source[name]) {
        return $;
    }

    // Return new instance if `TP` was called without the `new` operator
    if (!isInstance($, TP)) {
        return new TP(source, state);
    }

    let sourceIsDisabled = () => source.disabled,
        sourceIsReadOnly = () => source.readOnly,
        thePlaceholder = getAttribute(source, 'placeholder'),
        theTabIndex = getAttribute(source, 'tabindex');

    $.state = state = fromStates(TP.state, isString(state) ? {
        join: state
    } : (state || {}));

    $.source = source;

    let fire = fireHook.bind($),
        off = offHook.bind($),
        on = onHook.bind($);

    // Store current instance to `TP.instances`
    TP.instances[source.id || source.name || toObjectCount(TP.instances)] = $;

    // Mark current DOM as active tag picker to prevent duplicate instance
    source[name] = 1;

    let editor = setElement('span', {
            'class': 'editor tag'
        }),
        editorInput = setElement('span', {
            'contenteditable': sourceIsDisabled() ? false : 'true',
            'spellcheck': 'false',
            'style': 'white-space:pre;'
        }),
        editorInputPlaceholder = setElement('span'),
        form = getParentForm(source), // Capture the closest `<form>` element
        tags = setElement('span', {
            'class': 'tags'
        }),
        view = setElement('span', {
            'class': state['class']
        });

    function n(text) {
        return $.f(text).replace(toPattern('(' + state.escape.join('|').replace(/\\/g, '\\\\') + ')+'), "").trim();
    }

    function onInput() {
        if (sourceIsDisabled() || sourceIsReadOnly()) {
            return setInput("");
        }
        let tag = n(getText(editorInput)),
            tags = $.tags, index;
        if (tag) {
            if (!getTag(tag)) {
                setTagElement(tag), setTag(tag);
                index = toCount(tags);
                fire('change', [tag, index]);
                fire('set.tag', [tag, index]);
            } else {
                fire('has.tag', [tag, toArrayKey(tag, tags)]);
            }
            setInput("");
        }
    }

    function onBlurInput() {
        onInput();
        letClasses(view, ['focus', 'focus.input']);
        fire('blur', [$.tags, toCount($.tags)]);
    }

    function onClickInput() {
        fire('click', [$.tags]);
    }

    function onFocusInput() {
        setClass(view, 'focus');
        setClass(view, 'focus.input');
        fire('focus', [$.tags]);
    }

    function onKeyDownInput(e) {
        let escape = state.escape,
            key = e.key, // Modern browser(s)
            keyCode = e.keyCode, // Legacy browser(s)
            keyIsCtrl = e.ctrlKey,
            keyIsEnter = KEY_ENTER[0] === key || KEY_ENTER[1] === keyCode,
            keyIsShift = e.shiftKey,
            keyIsTab = KEY_TAB[0] === key || KEY_TAB[1] === keyCode,
            t = this,
            tag,
            theTagLast = getPrev(editor),
            theTagsLength = toCount($.tags),
            theTagsMax = state.max,
            theValueLast = n(getText(editorInput)); // Last value before delay
        // Set preferred key name
        if (keyIsEnter) {
            key = '\n';
        } else if (keyIsTab) {
            key = '\t';
        }
        // Skip `Tab` key
        if (keyIsTab) {
            // :)
        } else if (sourceIsDisabled() || sourceIsReadOnly()) {
            // Submit the closest `<form>` element with `Enter` key
            if (keyIsEnter && sourceIsReadOnly()) {
                doSubmitTry();
            }
            eventPreventDefault(e);
        } else if (hasValue(key, escape) || hasValue(keyCode, escape)) {
            if (theTagsLength < theTagsMax) {
                // Add the tag name found in the tag editor
                onInput();
            } else {
                setInput("");
                fire('max.tags', [theTagsMax]);
            }
            eventPreventDefault(e);
        // Submit the closest `<form>` element with `Enter` key
        } else if (keyIsEnter) {
            doSubmitTry(), eventPreventDefault(e);
        } else {
            delay(() => {
                let text = getText(editorInput) || "",
                    value = n(text);
                // Last try for buggy key detection on mobile device(s)
                // Check for the last typed key in the tag editor
                if (hasValue(text.slice(-1), escape)) {
                    if (theTagsLength < theTagsMax) {
                        // Add the tag name found in the tag editor
                        onInput();
                    } else {
                        setInput("");
                        fire('max.tags', [theTagsMax]);
                    }
                    eventPreventDefault(e);
                // Escape character only, delete!
                } else if ("" === value && !keyIsCtrl && !keyIsShift) {
                    if (
                        "" === theValueLast &&
                        (
                            KEY_DELETE_LEFT[0] === key ||
                            KEY_DELETE_LEFT[0] === keyCode
                        )
                    ) {
                        letClass(view, 'focus.tag');
                        tag = $.tags[theTagsLength - 1];
                        letTagElement(tag), letTag(tag);
                        if (theTagLast) {
                            fire('change', [tag, theTagsLength - 1]);
                            fire('let.tag', [tag, theTagsLength - 1]);
                        }
                    } else if (
                        KEY_ARROW_LEFT[0] === key ||
                        KEY_ARROW_LEFT[1] === keyCode
                    ) {
                        // Focus to the last tag
                        theTagLast && theTagLast.focus();
                    }
                }
                setText(editorInputPlaceholder, value ? "" : thePlaceholder);
            }, 0);
        }
    }

    function setTags(values) {
        // Remove …
        if (hasParent(view)) {
            let prev;
            while (prev = getPrev(editor)) {
                letTagElement(prev.title);
            }
        }
        $.tags = [];
        source.value = "";
        // … then add tag(s)
        values = values ? values.split(state.join) : [];
        for (let i = 0, theTagsMax = state.max, value; i < theTagsMax; ++i) {
            if (!values[i]) {
                break;
            }
            if ("" !== (value = n(values[i]))) {
                if (getTag(value)) {
                    continue;
                }
                setTagElement(value), setTag(value);
                fire('change', [value, i]);
                fire('set.tag', [value, i]);
            }
        }
    }

    function onSubmitForm(e) {
        if (sourceIsDisabled()) {
            return;
        }
        let theTagsMin = state.min;
        onInput(); // Force to add the tag name found in the tag editor
        if (theTagsMin > 0 && toCount($.tags) < theTagsMin) {
            setInput("", 1);
            fire('min.tags', [theTagsMin]);
            eventPreventDefault(e);
            return;
        }
        // Do normal `submit` event
        return 1;
    }

    function onPasteInput() {
        delay(() => {
            if (!sourceIsDisabled() && !sourceIsReadOnly()) {
                setTags(getText(editorInput));
            }
            setInput("");
        }, 0);
    }

    function onClickView(e) {
        if (e && view === e.target) {
            editorInput.focus(), onClickInput();
        }
    }

    function onFocusSource() {
        editorInput.focus();
    }

    function onBlurTag() {
        let t = this,
            tag = t.title,
            tags = $.tags;
        letClasses(view, ['focus', 'focus.tag']);
        fire('blur.tag', [tag, toArrayKey(tag, tags)]);
    }

    function onClickTag() {
        let t = this,
            tag = t.title,
            tags = $.tags;
        fire('click.tag', [tag, toArrayKey(tag, tags)]);
    }

    function onFocusTag() {
        let t = this,
            tag = t.title,
            tags = $.tags;
        setClasses(view, ['focus', 'focus.tag']);
        fire('focus.tag', [tag, toArrayKey(tag, tags)]);
    }

    function onClickTagX(e) {
        if (!sourceIsDisabled() && !sourceIsReadOnly()) {
            let t = this,
                tag = getParent(t).title,
                tags = $.tags,
                index = toArrayKey(tag, tags);
            letTagElement(tag), letTag(tag), setInput("", 1);
            fire('change', [tag, index]);
            fire('click.tag', [tag, index]);
            fire('let.tag', [tag, index]);
        }
        eventPreventDefault(e);
    }

    function onKeyDownTag(e) {
        let key = e.key, // Modern browser(s)
            keyCode = e.keyCode, // Legacy browser(s)
            keyIsCtrl = e.ctrlKey,
            keyIsEnter = KEY_ENTER[0] === key || KEY_ENTER[1] === keyCode,
            keyIsShift = e.shiftKey,
            keyIsTab = KEY_TAB[0] === key || KEY_TAB[1] === keyCode,
            t = this,
            theTagNext = getNext(t),
            theTagPrev = getPrev(t);
        if (!keyIsCtrl && !keyIsShift) {
            // Focus to the previous tag
            if (
                !sourceIsReadOnly() && (
                    KEY_ARROW_LEFT[0] === key ||
                    KEY_ARROW_LEFT[1] === keyCode
                )
            ) {
                theTagPrev && (theTagPrev.focus(), eventPreventDefault(e));
            // Focus to the next tag or to the tag input
            } else if (
                !sourceIsReadOnly() && (
                    KEY_ARROW_RIGHT[0] === key ||
                    KEY_ARROW_RIGHT[1] === keyCode
                )
            ) {
                theTagNext && theTagNext !== editor ? theTagNext.focus() : setInput("", 1);
                eventPreventDefault(e);
            // Remove tag with `Backspace` or `Delete` key
            } else if (
                KEY_DELETE_LEFT[0] === key ||
                KEY_DELETE_LEFT[1] === keyCode ||
                KEY_DELETE_RIGHT[0] === key ||
                KEY_DELETE_RIGHT[1] === keyCode
            ) {
                if (!sourceIsReadOnly()) {
                    let tag = t.title,
                        tags = $.tags,
                        index = toArrayKey(tag, tags);
                    letClass(view, 'focus.tag');
                    letTagElement(tag), letTag(tag);
                    // Focus to the previous tag or to the tag input after remove
                    if (
                        KEY_DELETE_LEFT[0] === key ||
                        KEY_DELETE_LEFT[1] === keyCode
                    ) {
                        theTagPrev ? theTagPrev.focus() : setInput("", 1);
                    // Focus to the next tag or to the tag input after remove
                    } else /* if (
                        KEY_DELETE_RIGHT[0] === key ||
                        KEY_DELETE_RIGHT[1] === keyCode
                    ) */ {
                        theTagNext && theTagNext !== editor ? theTagNext.focus() : setInput("", 1);
                    }
                    fire('change', [tag, index]);
                    fire('let.tag', [tag, index]);
                }
                eventPreventDefault(e);
            }
        }
    }

    function setInput(value, fireFocus) {
        setText(editorInput, value);
        setText(editorInputPlaceholder, value ? "" : thePlaceholder);
        fireFocus && editorInput.focus();
    } setInput("");

    function getTag(tag, fireHook) {
        let tags = $.tags,
            index = toArrayKey(tag, tags);
        fireHook && fire('get.tag', [tag, index]);
        return isNumber(index) ? tag : null;
    }

    function letTag(tag) {
        let tags = $.tags,
            index = toArrayKey(tag, tags);
        if (isNumber(index) && index >= 0) {
            source.value = tags.join(state.join);
            return $.tags.splice(index, 1), true;
        }
        return false;
    }

    function setTag(tag, index) {
        if (isNumber(index)) {
            index = index < 0 ? 0 : index;
            $.tags.splice(index, 0, tag);
        } else {
            $.tags.push(tag);
        }
        // Update value
        source.value = $.tags.join(state.join);
    }

    function setTagElement(tag, index) {
        let element = setElement('span', {
            'class': 'tag',
            'tabindex': sourceIsDisabled() ? false : '0',
            'title': tag
        });
        if (state.x) {
            let x = setElement('a', {
                'href': "",
                'tabindex': '-1',
                'target': '_top'
            });
            onEvent('click', x, onClickTagX);
            setChildLast(element, x);
        }
        onEvent('blur', element, onBlurTag);
        onEvent('click', element, onClickTag);
        onEvent('focus', element, onFocusTag);
        onEvent('keydown', element, onKeyDownTag);
        if (hasParent(tags)) {
            if (isNumber(index) && $.tags[index]) {
                setPrev(getChildren(tags, index), element);
            } else {
                setPrev(editor, element);
            }
        }
    }

    function letTagElement(tag) {
        let index = toArrayKey(tag, $.tags), element;
        if (isNumber(index) && index >= 0 && (element = getChildren(tags, index))) {
            offEvent('blur', element, onBlurTag);
            offEvent('click', element, onClickTag);
            offEvent('focus', element, onFocusTag);
            offEvent('keydown', element, onKeyDownTag);
            if (state.x) {
                let x = getChildFirst(element);
                if (x) {
                    offEvent('click', x, onClickTagX);
                    letElement(x);
                }
            }
            letElement(element);
        }
    }

    function doSubmitTry() {
        onSubmitForm() && form && form.submit();
    }

    setChildLast(view, tags);
    setChildLast(tags, editor);
    setChildLast(editor, editorInput);
    setChildLast(editor, editorInputPlaceholder);
    setClass(source, state['class'] + '-source');
    setNext(source, view);

    setElement(source, {
        'tabindex': '-1'
    });

    onEvent('blur', editorInput, onBlurInput);
    onEvent('click', editorInput, onClickInput);
    onEvent('click', view, onClickView);
    onEvent('focus', editorInput, onFocusInput);
    onEvent('focus', source, onFocusSource);
    onEvent('keydown', editorInput, onKeyDownInput);
    onEvent('paste', editorInput, onPasteInput);

    form && onEvent('submit', form, onSubmitForm);

    $.blur = () => (!sourceIsDisabled() && (editorInput.blur(), onBlurInput())), $;

    $.click = () => view.click(), onClickView(), $;

    // Default filter for the tag name
    $.f = text => toCaseLower(text || "").replace(/[^ a-z\d-]/g, "");

    $.fire = fire;

    $.focus = () => {
        if (!sourceIsDisabled()) {
            editorInput.focus();
            onFocusInput();
        }
        return $;
    };

    $.get = tag => sourceIsDisabled() ? null : getTag(tag, 1);

    $.hooks = hooks;
    $.input = editorInput;

    $.let = tag => {
        if (!sourceIsDisabled() && !sourceIsReadOnly()) {
            let theTagsMin = state.min;
            onInput();
            if (theTagsMin > 0 && toCount($.tags) < theTagsMin) {
                fire('min.tags', [theTagsMin]);
                return $;
            }
            letTagElement(tag), letTag(tag);
        }
        return $;
    };

    $.off = off;
    $.on = on;

    $.pop = () => {
        if (!source[name]) {
            return $; // Already ejected!
        }
        delete source[name];
        let tags = $.tags;
        letClass(source, state['class'] + '-source');
        offEvent('blur', editorInput, onBlurInput);
        offEvent('click', editorInput, onClickInput);
        offEvent('click', view, onClickView);
        offEvent('focus', editorInput, onFocusInput);
        offEvent('focus', source, onFocusSource);
        offEvent('keydown', editorInput, onKeyDownInput);
        offEvent('paste', editorInput, onPasteInput);
        form && offEvent('submit', form, onSubmitForm);
        tags.forEach(letTagElement);
        setElement(source, {
            'tabindex': theTabIndex
        });
        return letElement(view), fire('pop', [tags]);
    };

    $.self = $.view = view;

    $.set = (tag, index) => {
        if (!sourceIsDisabled() && !sourceIsReadOnly()) {
            let tags = $.tags,
                theTagsMax = state.max;
            if (!getTag(tag)) {
                if (toCount(tags) < theTagsMax) {
                    setTagElement(tag, index), setTag(tag, index);
                } else {
                    fire('max.tags', [theTagsMax]);
                }
            } else {
                fire('has.tag', [tag, toArrayKey(tag, tags)]);
            }
        }
        return $;
    };

    $.source = $.output = source;
    $.state = state;

    $.tags = [];

    setTags(source.value); // Fill value(s)

    $.value = values => (!sourceIsDisabled() && !sourceIsReadOnly() && setTags(values)), $;

    return $;

}

TP.instances = {};

TP.state = {
    'class': 'tag-picker',
    'escape': [',', 188],
    'join': ', ',
    'max': 9999,
    'min': 0,
    'x': false
};

TP.version = '%(version)';

export default TP;
