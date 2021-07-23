import {D, W, getAttribute, getChildFirst, getChildren, getNext, getParent, getParentForm, getPrev, getText, hasClass, hasParent, letClass, letClasses, letElement, setClass, setChildLast, setClasses, setElement, setNext, setPrev, setText} from '@taufik-nurrohman/document';
import {offEvent, offEvents, offEventDefault, offEventPropagation, onEvent, onEvents} from '@taufik-nurrohman/event';
import {fromStates} from '@taufik-nurrohman/from';
import {hasValue} from '@taufik-nurrohman/has';
import {hook} from '@taufik-nurrohman/hook';
import {isArray, isInstance, isNumber, isSet, isString} from '@taufik-nurrohman/is';
import {toPattern} from '@taufik-nurrohman/pattern';
import {toArrayKey, toCaseLower, toCount, toObjectCount, toObjectKeys} from '@taufik-nurrohman/to';

let delay = W.setTimeout,
    name = 'TP';

const KEY_A = ['a', 65];
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
        return;
    }

    // Return new instance if `TP` was called without the `new` operator
    if (!isInstance($, TP)) {
        return new TP(source, state);
    }

    let sourceIsDisabled = () => source.disabled,
        sourceIsReadOnly = () => source.readOnly,
        thePlaceholder = getAttribute(source, 'placeholder'),
        theTabIndex = getAttribute(source, 'tabindex');

    let {fire} = hook($);

    $.state = state = fromStates(TP.state, isString(state) ? {
        join: state
    } : (state || {}));

    $.source = source;

    // Store current instance to `TP.instances`
    TP.instances[source.id || source.name || toObjectCount(TP.instances)] = $;

    // Mark current DOM as active tag picker to prevent duplicate instance
    source[name] = 1;

    let classNameB = state['class'],
        classNameE = classNameB + '__',
        classNameM = classNameB + '--',
        form = getParentForm(source), // Capture the closest `<form>` element
        self = setElement('span', {
            'class': classNameB,
            'tabindex': sourceIsDisabled() ? false : '-1'
        }),
        text = setElement('span', {
            'class': classNameE + 'tag ' + classNameE + 'text'
        }),
        textInput = setElement('span', {
            'contenteditable': sourceIsDisabled() ? false : 'true',
            'spellcheck': 'false',
            'style': 'white-space:pre;'
        }),
        textInputHint = setElement('span'),
        textOutput = setElement('span', {
            'class': classNameE + 'tags'
        });

    let currentTagIndex = 0,
        currentTags = {};

    function getCurrentTags() {
        return currentTags;
    }

    function setCurrentTags() {
        currentTags = {}; // Reset!
        let i, items = getChildren(textOutput),
            j = toCount(items) - 1; // Minus 1 to skip the tag editor element
        for (i = 0; i < j; ++i) {
            if (hasClass(items[i], classNameE + 'tag--focus')) {
                currentTags[i] = items[i];
            }
        }
    }

    function n(v) {
        return $.f(v).replace(toPattern('(' + state.escape.join('|').replace(/\\/g, '\\\\') + ')+'), "").trim();
    }

    function doBlurTags(exceptThisTag) {
        doToTags(exceptThisTag, function(index) {
            letClass(this, classNameE + 'tag--focus');
        });
    }

    function doFocusTags(exceptThisTag) {
        doToTags(exceptThisTag, function(index) {
            setClass(this, classNameE + 'tag--focus');
        });
    }

    function doToTags(exceptThisTag, then) {
        let i, items = getChildren(textOutput),
            j = toCount(items) - 1; // Minus 1 to skip the tag editor element
        for (i = 0; i < j; ++i) {
            if (exceptThisTag === items[i]) {
                continue;
            }
            then.call(items[i], i);
        }
    }

    function onBlurFocusTag(e) {
        currentTags = {}; // Reset!
        let t = this,
            type = e.type,
            tag = t.title,
            tags = $.tags,
            index = toArrayKey(tag, tags),
            classNameTagM = classNameE + 'tag--';
        if ('blur' === type) {
            letClass(t, classNameTagM + 'focus');
            letClasses(self, [classNameM + 'focus', classNameM + 'focus-tag']);
        } else {
            setClass(t, classNameTagM + 'focus');
            setClasses(self, [classNameM + 'focus', classNameM + 'focus-tag']);
            currentTagIndex = index;
            currentTags[index] = t;
        }
        fire(type + '.tag', [tag, index]);
    }

    function onBlurFocusText(e) {
        let tags = $.tags,
            type = e.type,
            classNameTextM = classNameE + 'text--';
        if ('blur' === type) {
            letClass(text, classNameTextM + 'focus');
            letClasses(self, [classNameM + 'focus', classNameM + 'focus-text']);
            onInput();
        } else {
            setClass(text, classNameTextM + 'focus');
            setClasses(self, [classNameM + 'focus', classNameM + 'focus-text']);
            doBlurTags(text);
        }
        fire(type, [tags, toCount(tags)]);
    }

    function onBlurFocusSelf(e) {
        let type = e.type;
        if ('blur' === type) {
            letClass(self, classNameM + 'focus');
        } else {
            setClass(self, classNameM + 'focus');
        }
    }

    function onClickSelf(e) {
        if (e && self === e.target) {
            textInput.focus();
        }
        let tags = $.tags;
        fire('click', [tags, toCount(tags)]);
    }

    function onClickTag() {
        let t = this,
            tag = t.title,
            tags = $.tags;
        fire('click.tag', [tag, toArrayKey(tag, tags)]);
    }

    function onInput() {
        if (sourceIsDisabled() || sourceIsReadOnly()) {
            return setInput("");
        }
        let tag = n(getText(textInput)),
            index;
        if (tag) {
            if (!getTag(tag)) {
                setTagElement(tag), setTag(tag);
                index = toCount($.tags);
                fire('change', [tag, index]);
                fire('set.tag', [tag, index]);
            } else {
                fire('has.tag', [tag, toArrayKey(tag, $.tags)]);
            }
            setInput("");
        }
    }

    function onBlurSelf() {
        letClass(self, classNameM + 'focus-self');
    }

    function onKeyDownInput(e) {
        offEventPropagation(e);
        let escape = state.escape,
            key = e.key, // Modern browser(s)
            keyCode = e.keyCode, // Legacy browser(s)
            keyIsCtrl = e.ctrlKey,
            keyIsEnter = KEY_ENTER[0] === key || KEY_ENTER[1] === keyCode,
            keyIsShift = e.shiftKey,
            keyIsTab = KEY_TAB[0] === key || KEY_TAB[1] === keyCode,
            t = this,
            tag,
            theTagLast = getPrev(text),
            theTagsCount = toCount($.tags),
            theTagsMax = state.max,
            theValueLast = n(getText(textInput)); // Last value before delay
        // Set preferred key name
        if (keyIsEnter) {
            key = '\n';
        } else if (keyIsTab) {
            key = '\t';
        }
        // Skip `Tab` key
        if (keyIsTab) {
            // :)
        // Select all tag(s) with `Ctrl+A` key
        } else if (keyIsCtrl && "" === theValueLast && (KEY_A[0] === key || KEY_A[1] === keyCode)) {
            self.focus(), onFocusSelf(e), offEventDefault(e);
        } else if (sourceIsDisabled() || sourceIsReadOnly()) {
            // Submit the closest `<form>` element with `Enter` key
            if (keyIsEnter && sourceIsReadOnly()) {
                doSubmitTry();
            }
            offEventDefault(e);
        } else if (hasValue(key, escape) || hasValue(keyCode, escape)) {
            if (theTagsCount < theTagsMax) {
                // Add the tag name found in the tag editor
                onInput();
            } else {
                setInput("");
                fire('max.tags', [theTagsMax]);
            }
            offEventDefault(e);
        // Submit the closest `<form>` element with `Enter` key
        } else if (keyIsEnter) {
            doSubmitTry(), offEventDefault(e);
        } else {
            delay(() => {
                let theText = getText(textInput) || "",
                    value = n(theText);
                // Last try for buggy key detection on mobile device(s)
                // Check for the last typed key in the tag editor
                if (hasValue(theText.slice(-1), escape)) {
                    if (theTagsCount < theTagsMax) {
                        // Add the tag name found in the tag editor
                        onInput();
                    } else {
                        setInput("");
                        fire('max.tags', [theTagsMax]);
                    }
                    offEventDefault(e);
                // Escape character only, delete!
                } else if ("" === value && !keyIsCtrl && !keyIsShift) {
                    if (
                        "" === theValueLast &&
                        (
                            KEY_DELETE_LEFT[0] === key ||
                            KEY_DELETE_LEFT[0] === keyCode
                        )
                    ) {
                        letClass(self, classNameM + 'focus-tag');
                        tag = $.tags[theTagsCount - 1];
                        letTagElement(tag), letTag(tag);
                        if (theTagLast) {
                            fire('change', [tag, theTagsCount - 1]);
                            fire('let.tag', [tag, theTagsCount - 1]);
                        }
                    } else if (
                        KEY_ARROW_LEFT[0] === key ||
                        KEY_ARROW_LEFT[1] === keyCode
                    ) {
                        // Focus to the last tag
                        theTagLast && theTagLast.focus();
                    }
                }
                setText(textInputHint, value ? "" : thePlaceholder);
            }, 0);
        }
    }

    function onKeyDownSelf(e) {
        let tags = $.tags,
            key = e.key, // Modern browser(s)
            keyCode = e.keyCode, // Legacy browser(s)
            keyIsCtrl = e.ctrlKey,
            keyIsShift = e.shiftKey;
        if (sourceIsReadOnly()) {
            return;
        }
        let classNameTagM = classNameE + 'tag--';
        let theTag, theTagNext, theTagPrev, theTags, theTagIndex;
        if (!keyIsCtrl) {
            // Remove tag(s) with `Backspace` or `Delete` key
            if (!keyIsShift && (
                KEY_DELETE_LEFT[0] === key ||
                KEY_DELETE_LEFT[1] === keyCode ||
                KEY_DELETE_RIGHT[0] === key ||
                KEY_DELETE_RIGHT[1] === keyCode
            )) {
                setCurrentTags();
                theTags = getCurrentTags();
                let isBackspace = KEY_DELETE_LEFT[0] === key || KEY_DELETE_LEFT[1] === keyCode,
                    theTagTitle;
                for (theTagIndex in theTags) {
                    theTag = theTags[theTagIndex];
                    letTagElement(theTagTitle = theTag.title), letTag(theTagTitle);
                }
                currentTagIndex = toObjectKeys(theTags);
                currentTagIndex = +(currentTagIndex[0] || 0);
                if (theTag = getChildren(textOutput, isBackspace ? currentTagIndex - 1 : currentTagIndex)) {
                    if (text === theTag) {
                        setInput("", 1);
                    } else {
                        theTag.focus();
                    }
                } else {
                    setInput("", 1);
                }
                offEventDefault(e);
            // Focus to the previous tag
            } else if (KEY_ARROW_LEFT[0] === key || KEY_ARROW_LEFT[1] === keyCode) {
                if (theTag = getChildren(textOutput, currentTagIndex - 1)) {
                    let theTagWasFocus = hasClass(theTag, classNameTagM + 'focus');
                    theTag.focus(), offEventDefault(e);
                    if (keyIsShift) {
                        setClass(theTagNext = getNext(theTag), classNameTagM + 'focus');
                        if (theTagWasFocus) {
                            letClass(theTagNext, classNameTagM + 'focus');
                        }
                    } else {
                        doBlurTags(theTag);
                    }
                } else if (!keyIsShift) {
                    doBlurTags(getChildren(textOutput, 0));
                }
            // Focus to the next tag or to the tag editor
            } else if (KEY_ARROW_RIGHT[0] === key || KEY_ARROW_RIGHT[1] === keyCode) {
                if (theTag = getChildren(textOutput, currentTagIndex + 1)) {
                    let theTagWasFocus = hasClass(theTag, classNameTagM + 'focus');
                    (text === theTag && !keyIsShift ? setInput("", 1) : theTag.focus()), offEventDefault(e);
                    if (keyIsShift) {
                        setClass(theTagPrev = getPrev(theTag), classNameTagM + 'focus');
                        if (theTagWasFocus) {
                            letClass(theTagPrev, classNameTagM + 'focus');
                        }
                    } else {
                        doBlurTags(theTag);
                    }
                }
            }
        } else {
            // Select all tag(s) with `Ctrl+A` key
            if (KEY_A[0] === key || KEY_A[1] === keyCode) {
                self.focus(), doFocusTags(), setCurrentTags(), offEventDefault(e);
            }
        }
        // if (!sourceIsReadOnly() && !keyIsCtrl && key && 1 === toCount(key)) {
        //     // Typing a single character should delete the entire tag(s)
        //     setTags(""), setInput(key, 1), offEventDefault(e);
        // } else if (!keyIsCtrl && !keyIsShift) {
        //     if (
        //         KEY_DELETE_LEFT[0] === key ||
        //         KEY_DELETE_LEFT[1] === keyCode ||
        //         KEY_DELETE_RIGHT[0] === key ||
        //         KEY_DELETE_RIGHT[1] === keyCode
        //     ) {
        //         setTags(""), setInput("", 1), offEventDefault(e);
        //     } else if (
        //         KEY_ARROW_RIGHT[0] === key ||
        //         KEY_ARROW_RIGHT[1] === keyCode
        //     ) {
        //         setInput("", 1), offEventDefault(e);
        //     }
        // }
    }

    function setTags(values) {
        // Remove …
        if (hasParent(self)) {
            let prev;
            while (prev = getPrev(text)) {
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
            offEventDefault(e);
            return;
        }
        // Do normal `submit` event
        return 1;
    }

    function onPasteInput() {
        delay(() => {
            if (!sourceIsDisabled() && !sourceIsReadOnly()) {
                setTags(getText(textInput));
            }
            setInput("");
        }, 0);
    }

    function onFocusSelf(e) {
        let key = e.key,
            keyCode = e.keyCode,
            keyIsCtrl = e.ctrlKey;
        if (keyIsCtrl && (KEY_A[0] === key || KEY_A[1] === keyCode)) {
        }
        setClass(self, classNameM + 'focus-self');
    }

    function onFocusSource() {
        textInput.focus();
    }

    function onClickTagX(e) {
        if (!sourceIsDisabled() && !sourceIsReadOnly()) {
            let t = this,
                tag = getParent(t).title,
                index = toArrayKey(tag, $.tags);
            letTagElement(tag), letTag(tag), setInput("", 1);
            fire('change', [tag, index]);
            fire('click.tag', [tag, index]);
            fire('let.tag', [tag, index]);
        }
        offEventDefault(e);
    }

    function onKeyDownTag(e) {
        // offEventPropagation(e);
        // let key = e.key, // Modern browser(s)
        //     keyCode = e.keyCode, // Legacy browser(s)
        //     keyIsCtrl = e.ctrlKey,
        //     keyIsEnter = KEY_ENTER[0] === key || KEY_ENTER[1] === keyCode,
        //     keyIsShift = e.shiftKey,
        //     keyIsTab = KEY_TAB[0] === key || KEY_TAB[1] === keyCode,
        //     t = this,
        //     theTagNext = getNext(t),
        //     theTagPrev = getPrev(t);
        // if (!sourceIsReadOnly() && !keyIsCtrl && key && 1 === toCount(key)) {
        //     // Typing a single character should delete the tag
        //     let tag = t.title,
        //         index = toArrayKey(tag, $.tags);
        //     letTagElement(tag), letTag(tag), setInput(key, 1), offEventDefault(e);
        //     fire('change', [tag, index]);
        //     fire('let.tag', [tag, index]);
        // } else if (!keyIsCtrl && !keyIsShift) {
        //     // Focus to the previous tag
        //     if (
        //         !sourceIsReadOnly() && (
        //             KEY_ARROW_LEFT[0] === key ||
        //             KEY_ARROW_LEFT[1] === keyCode
        //         )
        //     ) {
        //         theTagPrev && (theTagPrev.focus(), offEventDefault(e));
        //     // Focus to the next tag or to the tag input
        //     } else if (
        //         !sourceIsReadOnly() && (
        //             KEY_ARROW_RIGHT[0] === key ||
        //             KEY_ARROW_RIGHT[1] === keyCode
        //         )
        //     ) {
        //         theTagNext && theTagNext !== text ? theTagNext.focus() : setInput("", 1);
        //         offEventDefault(e);
        //     // Remove tag with `Backspace` or `Delete` key
        //     } else if (
        //         KEY_DELETE_LEFT[0] === key ||
        //         KEY_DELETE_LEFT[1] === keyCode ||
        //         KEY_DELETE_RIGHT[0] === key ||
        //         KEY_DELETE_RIGHT[1] === keyCode
        //     ) {
        //         if (!sourceIsReadOnly()) {
        //             let tag = t.title,
        //                 index = toArrayKey(tag, $.tags);
        //             letClass(self, 'focus.tag');
        //             letTagElement(tag), letTag(tag);
        //             // Focus to the previous tag or to the tag input after remove
        //             if (
        //                 KEY_DELETE_LEFT[0] === key ||
        //                 KEY_DELETE_LEFT[1] === keyCode
        //             ) {
        //                 theTagPrev ? theTagPrev.focus() : setInput("", 1);
        //             // Focus to the next tag or to the tag input after remove
        //             } else /* if (
        //                 KEY_DELETE_RIGHT[0] === key ||
        //                 KEY_DELETE_RIGHT[1] === keyCode
        //             ) */ {
        //                 theTagNext && theTagNext !== text ? theTagNext.focus() : setInput("", 1);
        //             }
        //             fire('change', [tag, index]);
        //             fire('let.tag', [tag, index]);
        //         }
        //         offEventDefault(e);
        //     }
        // } else if (keyIsCtrl) {
        //     // Select all tag(s) with `Ctrl+A` key
        //     if (KEY_A[0] === key || KEY_A[1] === keyCode) {
        //         self.focus(), onFocusSelf(e), offEventDefault(e);
        //     }
        // }
    }

    function setInput(value, fireFocus) {
        setText(textInput, value);
        setText(textInputHint, value ? "" : thePlaceholder);
        if (fireFocus) {
            textInput.focus();
            // Move caret to the end!
            let range = D.createRange(),
                selection = W.getSelection();
            range.selectNodeContents(textInput);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    } setInput("");

    function getTag(tag, fireHooks) {
        let index = toArrayKey(tag, $.tags);
        fireHooks && fire('get.tag', [tag, index]);
        return isNumber(index) ? tag : null;
    }

    function letTag(tag) {
        let index = toArrayKey(tag, $.tags);
        if (isNumber(index) && index >= 0) {
            $.tags.splice(index, 1);
            source.value = $.tags.join(state.join);
            return true;
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
            'class': classNameE + 'tag',
            'tabindex': sourceIsDisabled() ? false : '0',
            'title': tag
        });
        let x = setElement('a', {
            'class': classNameE + 'tag-x',
            'href': "",
            'tabindex': '-1',
            'target': '_top'
        });
        onEvent('click', x, onClickTagX);
        setChildLast(element, x);
        onEvent('click', element, onClickTag);
        onEvents(['blur', 'focus'], element, onBlurFocusTag);
        // onEvent('keydown', element, onKeyDownTag);
        if (hasParent(textOutput)) {
            if (isNumber(index) && $.tags[index]) {
                setPrev(getChildren(textOutput, index), element);
            } else {
                setPrev(text, element);
            }
        }
    }

    function letTagElement(tag) {
        let index = toArrayKey(tag, $.tags), element;
        if (isNumber(index) && index >= 0 && (element = getChildren(textOutput, index))) {
            offEvent('click', element, onClickTag);
            offEvents(['blur', 'focus'], element, onBlurFocusTag);
            // offEvent('keydown', element, onKeyDownTag);
            let x = getChildFirst(element);
            if (x) {
                offEvent('click', x, onClickTagX);
                letElement(x);
            }
            letElement(element);
        }
    }

    function doSubmitTry() {
        onSubmitForm() && form && form.dispatchEvent(new Event('submit', {
            cancelable: true
        }));
    }

    setChildLast(self, textOutput);
    setChildLast(textOutput, text);
    setChildLast(text, textInput);
    setChildLast(text, textInputHint);
    setClass(source, classNameE + 'source');
    setNext(source, self);

    setElement(source, {
        'tabindex': '-1'
    });

    onEvents(['blur', 'focus'], textInput, onBlurFocusText);
    onEvent('blur', self, onBlurSelf);
    onEvent('click', self, onClickSelf);
    onEvents(['blur', 'focus'], self, onBlurFocusSelf);
    onEvent('focus', self, onFocusSelf);
    onEvent('focus', source, onFocusSource);
    onEvent('keydown', textInput, onKeyDownInput);
    onEvent('keydown', self, onKeyDownSelf);
    onEvent('paste', textInput, onPasteInput);

    form && onEvent('submit', form, onSubmitForm);

    // $.blur = () => ((!sourceIsDisabled() && (textInput.blur(), onBlurInput())), $);

    $.click = () => (self.click(), onClickSelf(), $);

    // Default filter for the tag name
    $.f = text => toCaseLower(text || "").replace(/[^ a-z\d-]/g, "");

    // $.focus = () => {
    //     if (!sourceIsDisabled()) {
    //         textInput.focus();
    //         onFocusInput();
    //     }
    //     return $;
    // };

    $.get = tag => sourceIsDisabled() ? null : getTag(tag, 1);

    $.input = textInput;

    $.let = tag => {
        if (!sourceIsDisabled() && !sourceIsReadOnly()) {
            if (!tag) {
                setTags("");
            } else {
                let theTagsMin = state.min;
                onInput();
                if (theTagsMin > 0 && toCount($.tags) < theTagsMin) {
                    fire('min.tags', [theTagsMin]);
                    return $;
                }
                letTagElement(tag), letTag(tag);
            }
        }
        return $;
    };

    $.pop = () => {
        if (!source[name]) {
            return $; // Already ejected!
        }
        delete source[name];
        let tags = $.tags;
        letClass(source, classNameE + 'source');
        offEvents(['blur', 'focus'], textInput, onBlurFocusText);
        offEvent('blur', self, onBlurSelf);
        offEvent('click', self, onClickSelf);
        offEvents(['blur', 'focus'], self, onBlurFocusSelf);
        offEvent('focus', self, onFocusSelf);
        offEvent('focus', source, onFocusSource);
        offEvent('keydown', textInput, onKeyDownInput);
        offEvent('keydown', self, onKeyDownSelf);
        offEvent('paste', textInput, onPasteInput);
        form && offEvent('submit', form, onSubmitForm);
        tags.forEach(letTagElement);
        setElement(source, {
            'tabindex': theTabIndex
        });
        return letElement(self), fire('pop', [tags]);
    };

    $.self = self;

    $.set = (tag, index) => {
        if (!tag) {
            return $;
        }
        if (!sourceIsDisabled() && !sourceIsReadOnly()) {
            if (isArray(tag)) {
                setTags(tag.join(state.join));
            } else {
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
        }
        return $;
    };

    $.source = $.output = source;
    $.state = state;

    $.tags = [];

    setTags(source.value); // Fill value(s)

    return $;

}

TP.instances = {};

TP.state = {
    'class': 'tag-picker',
    'escape': [',', 188],
    'join': ', ',
    'max': 9999,
    'min': 0
};

TP.version = '3.3.0';

export default TP;
