import {D, W, getAttribute, getChildFirst, getChildren, getNext, getParent, getParentForm, getPrev, getText, hasClass, hasParent, letClass, letClasses, letElement, setClass, setChildLast, setClasses, setElement, setNext, setPrev, setText} from '@taufik-nurrohman/document';
import {delay} from '@taufik-nurrohman/tick';
import {fromStates} from '@taufik-nurrohman/from';
import {hasValue} from '@taufik-nurrohman/has';
import {hook} from '@taufik-nurrohman/hook';
import {isArray, isInstance, isNumber, isSet, isString} from '@taufik-nurrohman/is';
import {offEvent, offEvents, offEventDefault, offEventPropagation, onEvent, onEvents} from '@taufik-nurrohman/event';
import {toArrayKey, toCaseLower, toCount, toObjectCount, toObjectKeys} from '@taufik-nurrohman/to';
import {toPattern} from '@taufik-nurrohman/pattern';

let name = 'TP';

const KEY_A = 'a';
const KEY_ARROW_LEFT = 'ArrowLeft';
const KEY_ARROW_RIGHT = 'ArrowRight';
const KEY_BEGIN = 'Home';
const KEY_DELETE_LEFT = 'Backspace';
const KEY_DELETE_RIGHT = 'Delete';
const KEY_END = 'End';
const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';

function TP(source, state = {}) {

    const $ = this;

    if (!source) {
        return $;
    }

    // Already instantiated, skip!
    if (source[name]) {
        return source[name];
    }

    // Return new instance if `TP` was called without the `new` operator
    if (!isInstance($, TP)) {
        return new TP(source, state);
    }

    let sourceIsDisabled = () => source.disabled,
        sourceIsReadOnly = () => source.readOnly,
        thePlaceholder = getAttribute(source, 'placeholder'),
        theTabIndex = getAttribute(source, 'tabindex');

    let {hooks, fire} = hook($);

    $.state = state = fromStates({}, TP.state, isString(state) ? {
        join: state
    } : (state || {}));

    $.source = source;

    // Store current instance to `TP.instances`
    TP.instances[source.id || source.name || toObjectCount(TP.instances)] = $;

    // Mark current DOM as active tag picker to prevent duplicate instance
    source[name] = $;

    let classNameB = state['class'],
        classNameE = classNameB + '__',
        classNameM = classNameB + '--',
        form = getParentForm(source), // Capture the closest `<form>` element
        self = setElement('div', {
            'class': classNameB,
            'tabindex': sourceIsDisabled() ? false : -1
        }),
        text = setElement('span', {
            'class': classNameE + 'tag ' + classNameE + 'input'
        }),
        textCopy = setElement('input', {
            'class': classNameE + 'copy',
            'tabindex': -1,
            'type': 'text'
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

    let _keyIsCtrl,
        _keyIsShift,
        _keyIsTab;

    function getCharBeforeCaret(container) {
        let range, selection = W.getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0).cloneRange();
            range.collapse(true);
            range.setStart(container, 0);
            return (range + "").slice(-1);
        }
    }

    function getCurrentTags() {
        return currentTags;
    }

    function getTag(tag, fireHooks) {
        let index = toArrayKey(tag, $.tags);
        fireHooks && fire('get.tag', [tag, index]);
        return isNumber(index) ? tag : null;
    }

    function setCurrentTags() {
        currentTags = {}; // Reset!
        let i, items = getChildren(textOutput),
            j = toCount(items) - 1; // Minus 1 to skip the tag editor element
        for (i = 0; i < j; ++i) {
            if (hasClass(items[i], classNameE + 'tag--selected')) {
                currentTags[i] = items[i];
            }
        }
    }

    function setTag(tag, index) {
        if (isNumber(index)) {
            index = index < 0 ? 0 : index;
            $.tags.splice(index, 0, tag);
        } else {
            $.tags.push(tag);
        }
        source.value = $.tags.join(state.join);
    }

    function setTagElement(tag, index) {
        let element = setElement('span', {
            'class': classNameE + 'tag',
            'tabindex': sourceIsDisabled() || sourceIsReadOnly() ? false : 0,
            'title': tag
        });
        let x = setElement('a', {
            'class': classNameE + 'tag-x',
            'href': "",
            'tabindex': -1,
            'target': '_top'
        });
        onEvent('click', x, onClickTagX);
        setChildLast(element, x);
        onEvent('click', element, onClickTag);
        onEvents(['blur', 'focus'], element, onBlurFocusTag);
        if (hasParent(textOutput)) {
            if (isNumber(index) && $.tags[index]) {
                setPrev(getChildren(textOutput, index), element);
            } else {
                setPrev(text, element);
            }
        }
    }

    function setTags(values) {
        values = values ? values.split(state.join) : [];
        // Remove all tag(s) …
        if (hasParent(self)) {
            let theTagPrev,
                theTagPrevIndex,
                theTagPrevTitle;
            while (theTagPrev = getPrev(text)) {
                letTagElement(theTagPrevTitle = theTagPrev.title);
                if (!hasValue(theTagPrevTitle, values)) {
                    theTagPrevIndex = toArrayKey(theTagPrevTitle, $.tags);
                    fire('change', [theTagPrevTitle, theTagPrevIndex]);
                    fire('let.tag', [theTagPrevTitle, theTagPrevIndex]);
                }
            }
        }
        $.tags = [];
        source.value = "";
        // … then add tag(s)
        for (let i = 0, theTagsMax = state.max, value; i < theTagsMax; ++i) {
            if (!values[i]) {
                break;
            }
            if ("" !== (value = doValidTag(values[i]))) {
                setTagElement(value), setTag(value);
                fire('change', [value, i]);
                fire('set.tag', [value, i]);
            }
        }
    }

    function letTag(tag) {
        let index = toArrayKey(tag, $.tags);
        if (isNumber(index) && index >= 0) {
            $.tags.splice(index, 1);
            source.value = $.tags.join(state.join);
        }
    }

    function letTagElement(tag) {
        let index = toArrayKey(tag, $.tags), element;
        if (isNumber(index) && index >= 0 && (element = getChildren(textOutput, index))) {
            offEvent('click', element, onClickTag);
            offEvents(['blur', 'focus'], element, onBlurFocusTag);
            let x = getChildFirst(element);
            if (x) {
                offEvent('click', x, onClickTagX);
                letElement(x);
            }
            letElement(element);
        }
    }

    function letTextCopy(selectTextInput) {
        letElement(textCopy);
        if (selectTextInput) {
            setValue("", 1);
        }
    }

    function setTextCopy(selectTextCopy) {
        setChildLast(self, textCopy);
        textCopy.value = $.tags.join(state.join);
        if (selectTextCopy) {
            textCopy.focus();
            textCopy.select();
        }
    }

    function setValue(value, fireFocus) {
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
    } setValue("");

    function doBlurTags(exceptThisTag) {
        doToTags(exceptThisTag, function() {
            letClass(this, classNameE + 'tag--selected');
        });
    }

    function doFocusTags(exceptThisTag) {
        doToTags(exceptThisTag, function() {
            setClass(this, classNameE + 'tag--selected');
        });
    }

    function doInput() {
        if (sourceIsDisabled() || sourceIsReadOnly()) {
            return;
        }
        let tag = doValidTagChar(getText(textInput)).trim(),
            pattern = state.pattern;
        if (pattern && tag) {
            if (!toPattern(pattern, "").test(tag)) {
                fire('not.tag', [tag, -1]);
                setValue(tag, 1);
                return;
            }
        }
        setValue("");
        if (tag = doValidTag(tag)) {
            if (!getTag(tag)) {
                setTagElement(tag), setTag(tag);
                let index = toCount($.tags);
                fire('change', [tag, index]);
                fire('set.tag', [tag, index]);
            } else {
                fire('has.tag', [tag, toArrayKey(tag, $.tags)]);
            }
        }
    }

    function doSubmitTry() {
        onSubmitForm() && form && form.dispatchEvent(new Event('submit', {
            cancelable: true
        }));
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

    function doValidTag(v) {
        return doValidTagChar($.f(v)).trim();
    }

    function doValidTagChar(v) {
        v = v || "";
        state.escape.forEach(char => {
            v = v.split(char).join("");
        });
        return v;
    }

    function onBlurFocusTextCopy(e) {
        let type = e.type;
        if ('blur' === type) {
            doBlurTags();
            letClasses(self, [classNameM + 'focus', classNameM + 'focus-self']);
        } else {
            setClasses(self, [classNameM + 'focus', classNameM + 'focus-self']);
        }
    }

    function onBlurFocusTag(e) {
        if (sourceIsReadOnly()) {
            return;
        }
        currentTags = {}; // Reset!
        let t = this,
            type = e.type,
            tag = t.title,
            tags = $.tags,
            index = toArrayKey(tag, tags),
            classNameTagM = classNameE + 'tag--';
        if ('blur' === type) {
            if (
                !_keyIsCtrl && !_keyIsShift ||
                _keyIsShift && _keyIsTab // Do not do multiple selection on Shift+Tab
            ) {
                doBlurTags(t);
                letClass(t, classNameTagM + 'selected');
                letClasses(self, [classNameM + 'focus', classNameM + 'focus-tag']);
            }
        } else {
            if (_keyIsShift) {
                // TODO: Select until the previous focus
            }
            setClass(t, classNameTagM + 'selected');
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
        letClass(self, classNameM + 'focus-tag');
        if ('blur' === type) {
            letClass(text, classNameTextM + 'focus');
            letClasses(self, [classNameM + 'focus', classNameM + 'focus-input']);
            doInput();
        } else {
            setClass(text, classNameTextM + 'focus');
            setClasses(self, [classNameM + 'focus', classNameM + 'focus-input']);
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

    function onClickTagX(e) {
        if (!sourceIsDisabled() && !sourceIsReadOnly()) {
            let t = this,
                tag = getParent(t).title,
                index = toArrayKey(tag, $.tags);
            letTagElement(tag), letTag(tag), setValue("", 1);
            fire('change', [tag, index]);
            fire('click.tag', [tag, index]);
            fire('let.tag', [tag, index]);
        }
        offEventDefault(e);
    }

    function onCopyCutPasteTextCopy(e) {
        let type = e.type;
        if ('copy' === type) {
            delay(() => letTextCopy(1))();
        } else if ('cut' === type) {
            !sourceIsReadOnly() && setTags("");
            delay(() => letTextCopy(1))();
        } else if ('paste' === type) {
            delay(() => {
                !sourceIsReadOnly() && setTags(textCopy.value);
                letTextCopy(1);
            })();
        }
        delay(() => {
            let tags = $.tags;
            fire(type, [tags, toCount(tags)]);
        }, 1)();
    }

    function onBlurSelf() {
        doBlurTags(), letClass(self, classNameM + 'focus-self');
    }

    function onFocusSource() {
        textInput.focus();
    }

    function onKeyDownSelf(e) {
        if (sourceIsDisabled() || sourceIsReadOnly()) {
            return;
        }
        let tags = $.tags,
            key = e.key,
            keyIsCtrl = _keyIsCtrl = e.ctrlKey,
            keyIsShift = _keyIsShift = e.shiftKey,
            classNameTagM = classNameE + 'tag--';
        _keyIsTab = KEY_TAB === key;
        let theTag,
            theTagIndex,
            theTagNext,
            theTagPrev,
            theTagTitle,
            theTags;
        if (!keyIsCtrl) {
            // Remove tag(s) with `Backspace` or `Delete` key
            if (!keyIsShift && (KEY_DELETE_LEFT === key || KEY_DELETE_RIGHT === key)) {
                setCurrentTags();
                theTags = getCurrentTags();
                let isBackspace = KEY_DELETE_LEFT === key;
                for (theTagIndex in theTags) {
                    theTag = theTags[theTagIndex];
                    letTagElement(theTagTitle = theTag.title), letTag(theTagTitle);
                }
                currentTagIndex = +(toObjectKeys(theTags)[0] || 0);
                if (theTag = getChildren(textOutput, isBackspace ? currentTagIndex - 1 : currentTagIndex)) {
                    if (text === theTag) {
                        setValue("", 1);
                    } else {
                        theTag.focus();
                    }
                } else {
                    setValue("", 1);
                }
                offEventDefault(e);
                return;
            }
            // Focus to the first tag
            if (KEY_BEGIN === key) {
                if (theTag = getChildren(textOutput, 0)) {
                    theTag.focus(), offEventDefault(e);
                }
                return;
            }
            // Focus to the last tag
            if (KEY_END === key) {
                if (theTag = getChildren(textOutput, toCount($.tags) - 1)) {
                    theTag.focus(), offEventDefault(e);
                    return;
                }
            }
            // Focus to the previous tag
            if (KEY_ARROW_LEFT === key) {
                if (theTag = getChildren(textOutput, currentTagIndex - 1)) {
                    let theTagWasFocus = hasClass(theTag, classNameTagM + 'selected');
                    theTag.focus(), offEventDefault(e);
                    if (keyIsShift) {
                        theTagNext = getNext(theTag);
                        if (theTagWasFocus) {
                            letClass(theTagNext, classNameTagM + 'selected');
                        }
                        return;
                    }
                    doBlurTags(theTag);
                    return;
                }
                if (!keyIsShift) {
                    doBlurTags(getChildren(textOutput, 0));
                    return;
                }
            }
            // Focus to the next tag or to the tag editor
            if (KEY_ARROW_RIGHT === key) {
                if (theTag = getChildren(textOutput, currentTagIndex + 1)) {
                    let theTagWasFocus = hasClass(theTag, classNameTagM + 'selected');
                    (text === theTag && !keyIsShift ? setValue("", 1) : theTag.focus()), offEventDefault(e);
                    if (keyIsShift) {
                        theTagPrev = getPrev(theTag);
                        if (theTagWasFocus) {
                            letClass(theTagPrev, classNameTagM + 'selected');
                        }
                        return;
                    }
                    doBlurTags(theTag);
                    return;
                }
            }
        }
        // Select all tag(s) with `Ctrl+A` key
        if (KEY_A === key) {
            setTextCopy(1);
            doFocusTags(), setCurrentTags(), offEventDefault(e);
        }
    }

    function onKeyDownText(e) {
        offEventPropagation(e);
        if (sourceIsReadOnly() && KEY_TAB !== e.key) {
            offEventDefault(e);
        }
        let escapes = state.escape,
            t = this,
            theTag,
            theTagLast = getPrev(text),
            theTagsCount = toCount($.tags),
            theTagsMax = state.max,
            theValue = doValidTag(getText(textInput)),
            key = e.key,
            keyIsCtrl = _keyIsCtrl = e.ctrlKey,
            keyIsEnter = KEY_ENTER === key,
            keyIsShift = _keyIsShift = e.shiftKey,
            keyIsTab = _keyIsTab = KEY_TAB === key;
        if (keyIsEnter) {
            key = '\n';
        }
        if (keyIsTab) {
            key = '\t';
        }
        delay(() => {
            let theValueAfter = doValidTag(getText(textInput));
            setText(textInputHint, theValueAfter ? "" : thePlaceholder);
            // Try to add support for browser(s) without `KeyboardEvent.prototype.key` feature
            if (hasValue(getCharBeforeCaret(textInput), escapes)) {
                if (theTagsCount < theTagsMax) {
                    // Add the tag name found in the tag editor
                    doInput();
                } else {
                    setValue("");
                    fire('max.tags', [theTagsMax]);
                }
                offEventDefault(e);
            }
        })();
        // Focus to the first tag
        if ("" === theValue && KEY_BEGIN === key) {
            if (theTag = getChildren(textOutput, 0)) {
                theTag.focus(), offEventDefault(e);
                return;
            }
        }
        // Focus to the last tag
        if ("" === theValue && KEY_END === key) {
            if (theTag = getChildren(textOutput, toCount($.tags) - 1)) {
                theTag.focus(), offEventDefault(e);
                return;
            }
        }
        // Select all tag(s) with `Ctrl+A` key
        if (keyIsCtrl && "" === theValue && KEY_A === key) {
            setTextCopy(1);
            doFocusTags(), setCurrentTags(), offEventDefault(e);
            return;
        }
        if (hasValue(key, escapes)) {
            if (theTagsCount < theTagsMax) {
                // Add the tag name found in the tag editor
                doInput();
            } else {
                setValue("");
                fire('max.tags', [theTagsMax]);
            }
            offEventDefault(e);
            return;
        }
        // Skip `Tab` key
        if (keyIsTab) {
            return; // :)
        }
        // Submit the closest `<form>` element with `Enter` key
        if (!keyIsCtrl && keyIsEnter) {
            doSubmitTry(), offEventDefault(e);
            return;
        }
        if (theTagLast && "" === theValue && !sourceIsReadOnly()) {
            if (KEY_DELETE_LEFT === key) {
                theTag = $.tags[theTagsCount - 1];
                letTagElement(theTag), letTag(theTag);
                fire('change', [theTag, theTagsCount - 1]);
                fire('let.tag', [theTag, theTagsCount - 1]);
                offEventDefault(e);
                return;
            }
            if (KEY_ARROW_LEFT === key) {
                theTagLast.focus(); // Focus to the last tag
                return;
            }
        }
    }

    function onKeyUpSelf() {
        _keyIsCtrl = _keyIsShift = false;
    }

    function onPasteText() {
        delay(() => {
            if (!sourceIsDisabled() && !sourceIsReadOnly()) {
                getText(textInput).split(state.join).forEach(v => {
                    if (!hasValue(v, $.tags)) {
                        setTagElement(v), setTag(v);
                    }
                });
            }
            setValue("");
        })();
    }

    function onSubmitForm(e) {
        if (sourceIsDisabled()) {
            return;
        }
        let theTagsMin = state.min;
        doInput(); // Force to add the tag name found in the tag editor
        if (theTagsMin > 0 && toCount($.tags) < theTagsMin) {
            setValue("", 1);
            fire('min.tags', [theTagsMin]);
            offEventDefault(e);
            return;
        }
        // Do normal `submit` event
        return 1;
    }

    setChildLast(self, textOutput);
    setChildLast(text, textInput);
    setChildLast(text, textInputHint);
    setChildLast(textOutput, text);
    setClass(source, classNameE + 'source');
    setNext(source, self);

    setElement(source, {
        'tabindex': -1
    });

    onEvent('blur', self, onBlurSelf);
    onEvent('click', self, onClickSelf);
    onEvent('focus', source, onFocusSource);
    onEvent('keydown', self, onKeyDownSelf);
    onEvent('keydown', textInput, onKeyDownText);
    onEvent('keyup', self, onKeyUpSelf);
    onEvent('paste', textInput, onPasteText);
    onEvents(['blur', 'focus'], self, onBlurFocusSelf);
    onEvents(['blur', 'focus'], textCopy, onBlurFocusTextCopy);
    onEvents(['blur', 'focus'], textInput, onBlurFocusText);
    onEvents(['copy', 'cut', 'paste'], textCopy, onCopyCutPasteTextCopy);

    form && onEvent('submit', form, onSubmitForm);

    $.blur = () => ((!sourceIsDisabled() && textInput.blur()), $);

    $.click = () => (self.click(), onClickSelf(), $);

    // Default filter for the tag name
    $.f = v => toCaseLower(v || "").replace(/[^ a-z\d-]/g, "").trim();

    $.focus = () => {
        if (!sourceIsDisabled()) {
            setValue(getText(textInput), 1);
        }
        return $;
    };

    $.get = tag => sourceIsDisabled() ? null : getTag(tag, 1);

    $.input = textInput;

    $.let = tag => {
        if (!sourceIsDisabled() && !sourceIsReadOnly()) {
            let theTagsMin = state.min;
            if (!tag) {
                setTags("");
            } else if (isArray(tag)) {
                tag.forEach(v => {
                    if (theTagsMin > 0 && toCount($.tags) < theTagsMin) {
                        fire('min.tags', [theTagsMin]);
                        return $;
                    }
                    letTagElement(v), letTag(v);
                });
            } else {
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
        offEvent('blur', self, onBlurSelf);
        offEvent('click', self, onClickSelf);
        offEvent('focus', source, onFocusSource);
        offEvent('keydown', self, onKeyDownSelf);
        offEvent('keydown', textInput, onKeyDownText);
        offEvent('keyup', self, onKeyUpSelf);
        offEvent('paste', textInput, onPasteText);
        offEvents(['blur', 'focus'], self, onBlurFocusSelf);
        offEvents(['blur', 'focus'], textCopy, onBlurFocusTextCopy);
        offEvents(['blur', 'focus'], textInput, onBlurFocusText);
        offEvents(['copy', 'cut', 'paste'], textCopy, onCopyCutPasteTextCopy);
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
    'escape': [','],
    'join': ', ',
    'max': 9999,
    'min': 0,
    'pattern': null
};

TP.version = '3.4.13';

export default TP;