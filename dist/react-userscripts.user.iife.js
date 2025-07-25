// ==UserScript==
// @name     React Userscripts
// @namespace https://github.com/siefkenj/react-userscripts
// @version  1.1
// @description A sample userscript built using react
// @include https://*.google.com*
// @grant    none
// ==/UserScript==


(function(React2, client2, jsxRuntime2) {
  "use strict";
  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e) {
      for (const k in e) {
        if (k !== "default") {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }
  const React__namespace = /* @__PURE__ */ _interopNamespaceDefault(React2);
  function setRef(ref, value) {
    if (typeof ref === "function") {
      return ref(value);
    } else if (ref !== null && ref !== void 0) {
      ref.current = value;
    }
  }
  function composeRefs(...refs) {
    return (node) => {
      let hasCleanup = false;
      const cleanups = refs.map((ref) => {
        const cleanup = setRef(ref, node);
        if (!hasCleanup && typeof cleanup == "function") {
          hasCleanup = true;
        }
        return cleanup;
      });
      if (hasCleanup) {
        return () => {
          for (let i = 0; i < cleanups.length; i++) {
            const cleanup = cleanups[i];
            if (typeof cleanup == "function") {
              cleanup();
            } else {
              setRef(refs[i], null);
            }
          }
        };
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function createSlot(ownerName) {
    const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
    const Slot2 = React__namespace.forwardRef((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      const childrenArray = React__namespace.Children.toArray(children);
      const slottable = childrenArray.find(isSlottable);
      if (slottable) {
        const newElement = slottable.props.children;
        const newChildren = childrenArray.map((child) => {
          if (child === slottable) {
            if (React__namespace.Children.count(newElement) > 1)
              return React__namespace.Children.only(null);
            return React__namespace.isValidElement(newElement) ? newElement.props.children : null;
          } else {
            return child;
          }
        });
        return /* @__PURE__ */ jsxRuntime2.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: React__namespace.isValidElement(newElement) ? React__namespace.cloneElement(newElement, void 0, newChildren) : null });
      }
      return /* @__PURE__ */ jsxRuntime2.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
    });
    Slot2.displayName = `${ownerName}.Slot`;
    return Slot2;
  }
  var Slot = /* @__PURE__ */ createSlot("Slot");
  // @__NO_SIDE_EFFECTS__
  function createSlotClone(ownerName) {
    const SlotClone = React__namespace.forwardRef((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      if (React__namespace.isValidElement(children)) {
        const childrenRef = getElementRef(children);
        const props2 = mergeProps(slotProps, children.props);
        if (children.type !== React__namespace.Fragment) {
          props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
        }
        return React__namespace.cloneElement(children, props2);
      }
      return React__namespace.Children.count(children) > 1 ? React__namespace.Children.only(null) : null;
    });
    SlotClone.displayName = `${ownerName}.SlotClone`;
    return SlotClone;
  }
  var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
  function isSlottable(child) {
    return React__namespace.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
  }
  function mergeProps(slotProps, childProps) {
    const overrideProps = { ...childProps };
    for (const propName in childProps) {
      const slotPropValue = slotProps[propName];
      const childPropValue = childProps[propName];
      const isHandler = /^on[A-Z]/.test(propName);
      if (isHandler) {
        if (slotPropValue && childPropValue) {
          overrideProps[propName] = (...args) => {
            const result = childPropValue(...args);
            slotPropValue(...args);
            return result;
          };
        } else if (slotPropValue) {
          overrideProps[propName] = slotPropValue;
        }
      } else if (propName === "style") {
        overrideProps[propName] = { ...slotPropValue, ...childPropValue };
      } else if (propName === "className") {
        overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
      }
    }
    return { ...slotProps, ...overrideProps };
  }
  function getElementRef(element) {
    var _a, _b;
    let getter = (_a = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.ref;
    }
    getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.props.ref;
    }
    return element.props.ref || element.ref;
  }
  function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e)
      n += e;
    else if ("object" == typeof e)
      if (Array.isArray(e)) {
        var o = e.length;
        for (t = 0; t < o; t++)
          e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
      } else
        for (f in e)
          e[f] && (n && (n += " "), n += f);
    return n;
  }
  function clsx() {
    for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++)
      (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
  }
  const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
  const cx = clsx;
  const cva = (base, config) => (props) => {
    var _config_compoundVariants;
    if ((config === null || config === void 0 ? void 0 : config.variants) == null)
      return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
    const { variants, defaultVariants } = config;
    const getVariantClassNames = Object.keys(variants).map((variant) => {
      const variantProp = props === null || props === void 0 ? void 0 : props[variant];
      const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
      if (variantProp === null)
        return null;
      const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
      return variants[variant][variantKey];
    });
    const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
      let [key, value] = param;
      if (value === void 0) {
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});
    const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
      let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
      return Object.entries(compoundVariantOptions).every((param2) => {
        let [key, value] = param2;
        return Array.isArray(value) ? value.includes({
          ...defaultVariants,
          ...propsWithoutUndefined
        }[key]) : {
          ...defaultVariants,
          ...propsWithoutUndefined
        }[key] === value;
      }) ? [
        ...acc,
        cvClass,
        cvClassName
      ] : acc;
    }, []);
    return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  };
  const CLASS_PART_SEPARATOR = "-";
  const createClassGroupUtils = (config) => {
    const classMap = createClassMap(config);
    const {
      conflictingClassGroups,
      conflictingClassGroupModifiers
    } = config;
    const getClassGroupId = (className) => {
      const classParts = className.split(CLASS_PART_SEPARATOR);
      if (classParts[0] === "" && classParts.length !== 1) {
        classParts.shift();
      }
      return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
    };
    const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
      const conflicts = conflictingClassGroups[classGroupId] || [];
      if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
        return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
      }
      return conflicts;
    };
    return {
      getClassGroupId,
      getConflictingClassGroupIds
    };
  };
  const getGroupRecursive = (classParts, classPartObject) => {
    var _a;
    if (classParts.length === 0) {
      return classPartObject.classGroupId;
    }
    const currentClassPart = classParts[0];
    const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
    const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : void 0;
    if (classGroupFromNextClassPart) {
      return classGroupFromNextClassPart;
    }
    if (classPartObject.validators.length === 0) {
      return void 0;
    }
    const classRest = classParts.join(CLASS_PART_SEPARATOR);
    return (_a = classPartObject.validators.find(({
      validator
    }) => validator(classRest))) == null ? void 0 : _a.classGroupId;
  };
  const arbitraryPropertyRegex = /^\[(.+)\]$/;
  const getGroupIdForArbitraryProperty = (className) => {
    if (arbitraryPropertyRegex.test(className)) {
      const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
      const property = arbitraryPropertyClassName == null ? void 0 : arbitraryPropertyClassName.substring(0, arbitraryPropertyClassName.indexOf(":"));
      if (property) {
        return "arbitrary.." + property;
      }
    }
  };
  const createClassMap = (config) => {
    const {
      theme,
      classGroups
    } = config;
    const classMap = {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    };
    for (const classGroupId in classGroups) {
      processClassesRecursively(classGroups[classGroupId], classMap, classGroupId, theme);
    }
    return classMap;
  };
  const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
    classGroup.forEach((classDefinition) => {
      if (typeof classDefinition === "string") {
        const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
        classPartObjectToEdit.classGroupId = classGroupId;
        return;
      }
      if (typeof classDefinition === "function") {
        if (isThemeGetter(classDefinition)) {
          processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
          return;
        }
        classPartObject.validators.push({
          validator: classDefinition,
          classGroupId
        });
        return;
      }
      Object.entries(classDefinition).forEach(([key, classGroup2]) => {
        processClassesRecursively(classGroup2, getPart(classPartObject, key), classGroupId, theme);
      });
    });
  };
  const getPart = (classPartObject, path) => {
    let currentClassPartObject = classPartObject;
    path.split(CLASS_PART_SEPARATOR).forEach((pathPart) => {
      if (!currentClassPartObject.nextPart.has(pathPart)) {
        currentClassPartObject.nextPart.set(pathPart, {
          nextPart: /* @__PURE__ */ new Map(),
          validators: []
        });
      }
      currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
    });
    return currentClassPartObject;
  };
  const isThemeGetter = (func) => func.isThemeGetter;
  const createLruCache = (maxCacheSize) => {
    if (maxCacheSize < 1) {
      return {
        get: () => void 0,
        set: () => {
        }
      };
    }
    let cacheSize = 0;
    let cache = /* @__PURE__ */ new Map();
    let previousCache = /* @__PURE__ */ new Map();
    const update = (key, value) => {
      cache.set(key, value);
      cacheSize++;
      if (cacheSize > maxCacheSize) {
        cacheSize = 0;
        previousCache = cache;
        cache = /* @__PURE__ */ new Map();
      }
    };
    return {
      get(key) {
        let value = cache.get(key);
        if (value !== void 0) {
          return value;
        }
        if ((value = previousCache.get(key)) !== void 0) {
          update(key, value);
          return value;
        }
      },
      set(key, value) {
        if (cache.has(key)) {
          cache.set(key, value);
        } else {
          update(key, value);
        }
      }
    };
  };
  const IMPORTANT_MODIFIER = "!";
  const MODIFIER_SEPARATOR = ":";
  const MODIFIER_SEPARATOR_LENGTH = MODIFIER_SEPARATOR.length;
  const createParseClassName = (config) => {
    const {
      prefix,
      experimentalParseClassName
    } = config;
    let parseClassName = (className) => {
      const modifiers = [];
      let bracketDepth = 0;
      let parenDepth = 0;
      let modifierStart = 0;
      let postfixModifierPosition;
      for (let index = 0; index < className.length; index++) {
        let currentCharacter = className[index];
        if (bracketDepth === 0 && parenDepth === 0) {
          if (currentCharacter === MODIFIER_SEPARATOR) {
            modifiers.push(className.slice(modifierStart, index));
            modifierStart = index + MODIFIER_SEPARATOR_LENGTH;
            continue;
          }
          if (currentCharacter === "/") {
            postfixModifierPosition = index;
            continue;
          }
        }
        if (currentCharacter === "[") {
          bracketDepth++;
        } else if (currentCharacter === "]") {
          bracketDepth--;
        } else if (currentCharacter === "(") {
          parenDepth++;
        } else if (currentCharacter === ")") {
          parenDepth--;
        }
      }
      const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
      const baseClassName = stripImportantModifier(baseClassNameWithImportantModifier);
      const hasImportantModifier = baseClassName !== baseClassNameWithImportantModifier;
      const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
      return {
        modifiers,
        hasImportantModifier,
        baseClassName,
        maybePostfixModifierPosition
      };
    };
    if (prefix) {
      const fullPrefix = prefix + MODIFIER_SEPARATOR;
      const parseClassNameOriginal = parseClassName;
      parseClassName = (className) => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.substring(fullPrefix.length)) : {
        isExternal: true,
        modifiers: [],
        hasImportantModifier: false,
        baseClassName: className,
        maybePostfixModifierPosition: void 0
      };
    }
    if (experimentalParseClassName) {
      const parseClassNameOriginal = parseClassName;
      parseClassName = (className) => experimentalParseClassName({
        className,
        parseClassName: parseClassNameOriginal
      });
    }
    return parseClassName;
  };
  const stripImportantModifier = (baseClassName) => {
    if (baseClassName.endsWith(IMPORTANT_MODIFIER)) {
      return baseClassName.substring(0, baseClassName.length - 1);
    }
    if (baseClassName.startsWith(IMPORTANT_MODIFIER)) {
      return baseClassName.substring(1);
    }
    return baseClassName;
  };
  const createSortModifiers = (config) => {
    const orderSensitiveModifiers = Object.fromEntries(config.orderSensitiveModifiers.map((modifier) => [modifier, true]));
    const sortModifiers = (modifiers) => {
      if (modifiers.length <= 1) {
        return modifiers;
      }
      const sortedModifiers = [];
      let unsortedModifiers = [];
      modifiers.forEach((modifier) => {
        const isPositionSensitive = modifier[0] === "[" || orderSensitiveModifiers[modifier];
        if (isPositionSensitive) {
          sortedModifiers.push(...unsortedModifiers.sort(), modifier);
          unsortedModifiers = [];
        } else {
          unsortedModifiers.push(modifier);
        }
      });
      sortedModifiers.push(...unsortedModifiers.sort());
      return sortedModifiers;
    };
    return sortModifiers;
  };
  const createConfigUtils = (config) => ({
    cache: createLruCache(config.cacheSize),
    parseClassName: createParseClassName(config),
    sortModifiers: createSortModifiers(config),
    ...createClassGroupUtils(config)
  });
  const SPLIT_CLASSES_REGEX = /\s+/;
  const mergeClassList = (classList, configUtils) => {
    const {
      parseClassName,
      getClassGroupId,
      getConflictingClassGroupIds,
      sortModifiers
    } = configUtils;
    const classGroupsInConflict = [];
    const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
    let result = "";
    for (let index = classNames.length - 1; index >= 0; index -= 1) {
      const originalClassName = classNames[index];
      const {
        isExternal,
        modifiers,
        hasImportantModifier,
        baseClassName,
        maybePostfixModifierPosition
      } = parseClassName(originalClassName);
      if (isExternal) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      let hasPostfixModifier = !!maybePostfixModifierPosition;
      let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
      if (!classGroupId) {
        if (!hasPostfixModifier) {
          result = originalClassName + (result.length > 0 ? " " + result : result);
          continue;
        }
        classGroupId = getClassGroupId(baseClassName);
        if (!classGroupId) {
          result = originalClassName + (result.length > 0 ? " " + result : result);
          continue;
        }
        hasPostfixModifier = false;
      }
      const variantModifier = sortModifiers(modifiers).join(":");
      const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
      const classId = modifierId + classGroupId;
      if (classGroupsInConflict.includes(classId)) {
        continue;
      }
      classGroupsInConflict.push(classId);
      const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
      for (let i = 0; i < conflictGroups.length; ++i) {
        const group = conflictGroups[i];
        classGroupsInConflict.push(modifierId + group);
      }
      result = originalClassName + (result.length > 0 ? " " + result : result);
    }
    return result;
  };
  function twJoin() {
    let index = 0;
    let argument;
    let resolvedValue;
    let string = "";
    while (index < arguments.length) {
      if (argument = arguments[index++]) {
        if (resolvedValue = toValue(argument)) {
          string && (string += " ");
          string += resolvedValue;
        }
      }
    }
    return string;
  }
  const toValue = (mix) => {
    if (typeof mix === "string") {
      return mix;
    }
    let resolvedValue;
    let string = "";
    for (let k = 0; k < mix.length; k++) {
      if (mix[k]) {
        if (resolvedValue = toValue(mix[k])) {
          string && (string += " ");
          string += resolvedValue;
        }
      }
    }
    return string;
  };
  function createTailwindMerge(createConfigFirst, ...createConfigRest) {
    let configUtils;
    let cacheGet;
    let cacheSet;
    let functionToCall = initTailwindMerge;
    function initTailwindMerge(classList) {
      const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
      configUtils = createConfigUtils(config);
      cacheGet = configUtils.cache.get;
      cacheSet = configUtils.cache.set;
      functionToCall = tailwindMerge;
      return tailwindMerge(classList);
    }
    function tailwindMerge(classList) {
      const cachedResult = cacheGet(classList);
      if (cachedResult) {
        return cachedResult;
      }
      const result = mergeClassList(classList, configUtils);
      cacheSet(classList, result);
      return result;
    }
    return function callTailwindMerge() {
      return functionToCall(twJoin.apply(null, arguments));
    };
  }
  const fromTheme = (key) => {
    const themeGetter = (theme) => theme[key] || [];
    themeGetter.isThemeGetter = true;
    return themeGetter;
  };
  const arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
  const arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
  const fractionRegex = /^\d+\/\d+$/;
  const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
  const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
  const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
  const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
  const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
  const isFraction = (value) => fractionRegex.test(value);
  const isNumber = (value) => !!value && !Number.isNaN(Number(value));
  const isInteger = (value) => !!value && Number.isInteger(Number(value));
  const isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
  const isTshirtSize = (value) => tshirtUnitRegex.test(value);
  const isAny = () => true;
  const isLengthOnly = (value) => (
    // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
    // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
    // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
    lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
  );
  const isNever = () => false;
  const isShadow = (value) => shadowRegex.test(value);
  const isImage = (value) => imageRegex.test(value);
  const isAnyNonArbitrary = (value) => !isArbitraryValue(value) && !isArbitraryVariable(value);
  const isArbitrarySize = (value) => getIsArbitraryValue(value, isLabelSize, isNever);
  const isArbitraryValue = (value) => arbitraryValueRegex.test(value);
  const isArbitraryLength = (value) => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
  const isArbitraryNumber = (value) => getIsArbitraryValue(value, isLabelNumber, isNumber);
  const isArbitraryPosition = (value) => getIsArbitraryValue(value, isLabelPosition, isNever);
  const isArbitraryImage = (value) => getIsArbitraryValue(value, isLabelImage, isImage);
  const isArbitraryShadow = (value) => getIsArbitraryValue(value, isLabelShadow, isShadow);
  const isArbitraryVariable = (value) => arbitraryVariableRegex.test(value);
  const isArbitraryVariableLength = (value) => getIsArbitraryVariable(value, isLabelLength);
  const isArbitraryVariableFamilyName = (value) => getIsArbitraryVariable(value, isLabelFamilyName);
  const isArbitraryVariablePosition = (value) => getIsArbitraryVariable(value, isLabelPosition);
  const isArbitraryVariableSize = (value) => getIsArbitraryVariable(value, isLabelSize);
  const isArbitraryVariableImage = (value) => getIsArbitraryVariable(value, isLabelImage);
  const isArbitraryVariableShadow = (value) => getIsArbitraryVariable(value, isLabelShadow, true);
  const getIsArbitraryValue = (value, testLabel, testValue) => {
    const result = arbitraryValueRegex.exec(value);
    if (result) {
      if (result[1]) {
        return testLabel(result[1]);
      }
      return testValue(result[2]);
    }
    return false;
  };
  const getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
    const result = arbitraryVariableRegex.exec(value);
    if (result) {
      if (result[1]) {
        return testLabel(result[1]);
      }
      return shouldMatchNoLabel;
    }
    return false;
  };
  const isLabelPosition = (label) => label === "position" || label === "percentage";
  const isLabelImage = (label) => label === "image" || label === "url";
  const isLabelSize = (label) => label === "length" || label === "size" || label === "bg-size";
  const isLabelLength = (label) => label === "length";
  const isLabelNumber = (label) => label === "number";
  const isLabelFamilyName = (label) => label === "family-name";
  const isLabelShadow = (label) => label === "shadow";
  const getDefaultConfig = () => {
    const themeColor = fromTheme("color");
    const themeFont = fromTheme("font");
    const themeText = fromTheme("text");
    const themeFontWeight = fromTheme("font-weight");
    const themeTracking = fromTheme("tracking");
    const themeLeading = fromTheme("leading");
    const themeBreakpoint = fromTheme("breakpoint");
    const themeContainer = fromTheme("container");
    const themeSpacing = fromTheme("spacing");
    const themeRadius = fromTheme("radius");
    const themeShadow = fromTheme("shadow");
    const themeInsetShadow = fromTheme("inset-shadow");
    const themeTextShadow = fromTheme("text-shadow");
    const themeDropShadow = fromTheme("drop-shadow");
    const themeBlur = fromTheme("blur");
    const themePerspective = fromTheme("perspective");
    const themeAspect = fromTheme("aspect");
    const themeEase = fromTheme("ease");
    const themeAnimate = fromTheme("animate");
    const scaleBreak = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
    const scalePosition = () => [
      "center",
      "top",
      "bottom",
      "left",
      "right",
      "top-left",
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      "left-top",
      "top-right",
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      "right-top",
      "bottom-right",
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      "right-bottom",
      "bottom-left",
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      "left-bottom"
    ];
    const scalePositionWithArbitrary = () => [...scalePosition(), isArbitraryVariable, isArbitraryValue];
    const scaleOverflow = () => ["auto", "hidden", "clip", "visible", "scroll"];
    const scaleOverscroll = () => ["auto", "contain", "none"];
    const scaleUnambiguousSpacing = () => [isArbitraryVariable, isArbitraryValue, themeSpacing];
    const scaleInset = () => [isFraction, "full", "auto", ...scaleUnambiguousSpacing()];
    const scaleGridTemplateColsRows = () => [isInteger, "none", "subgrid", isArbitraryVariable, isArbitraryValue];
    const scaleGridColRowStartAndEnd = () => ["auto", {
      span: ["full", isInteger, isArbitraryVariable, isArbitraryValue]
    }, isInteger, isArbitraryVariable, isArbitraryValue];
    const scaleGridColRowStartOrEnd = () => [isInteger, "auto", isArbitraryVariable, isArbitraryValue];
    const scaleGridAutoColsRows = () => ["auto", "min", "max", "fr", isArbitraryVariable, isArbitraryValue];
    const scaleAlignPrimaryAxis = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"];
    const scaleAlignSecondaryAxis = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"];
    const scaleMargin = () => ["auto", ...scaleUnambiguousSpacing()];
    const scaleSizing = () => [isFraction, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...scaleUnambiguousSpacing()];
    const scaleColor = () => [themeColor, isArbitraryVariable, isArbitraryValue];
    const scaleBgPosition = () => [...scalePosition(), isArbitraryVariablePosition, isArbitraryPosition, {
      position: [isArbitraryVariable, isArbitraryValue]
    }];
    const scaleBgRepeat = () => ["no-repeat", {
      repeat: ["", "x", "y", "space", "round"]
    }];
    const scaleBgSize = () => ["auto", "cover", "contain", isArbitraryVariableSize, isArbitrarySize, {
      size: [isArbitraryVariable, isArbitraryValue]
    }];
    const scaleGradientStopPosition = () => [isPercent, isArbitraryVariableLength, isArbitraryLength];
    const scaleRadius = () => [
      // Deprecated since Tailwind CSS v4.0.0
      "",
      "none",
      "full",
      themeRadius,
      isArbitraryVariable,
      isArbitraryValue
    ];
    const scaleBorderWidth = () => ["", isNumber, isArbitraryVariableLength, isArbitraryLength];
    const scaleLineStyle = () => ["solid", "dashed", "dotted", "double"];
    const scaleBlendMode = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
    const scaleMaskImagePosition = () => [isNumber, isPercent, isArbitraryVariablePosition, isArbitraryPosition];
    const scaleBlur = () => [
      // Deprecated since Tailwind CSS v4.0.0
      "",
      "none",
      themeBlur,
      isArbitraryVariable,
      isArbitraryValue
    ];
    const scaleRotate = () => ["none", isNumber, isArbitraryVariable, isArbitraryValue];
    const scaleScale = () => ["none", isNumber, isArbitraryVariable, isArbitraryValue];
    const scaleSkew = () => [isNumber, isArbitraryVariable, isArbitraryValue];
    const scaleTranslate = () => [isFraction, "full", ...scaleUnambiguousSpacing()];
    return {
      cacheSize: 500,
      theme: {
        animate: ["spin", "ping", "pulse", "bounce"],
        aspect: ["video"],
        blur: [isTshirtSize],
        breakpoint: [isTshirtSize],
        color: [isAny],
        container: [isTshirtSize],
        "drop-shadow": [isTshirtSize],
        ease: ["in", "out", "in-out"],
        font: [isAnyNonArbitrary],
        "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
        "inset-shadow": [isTshirtSize],
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
        perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
        radius: [isTshirtSize],
        shadow: [isTshirtSize],
        spacing: ["px", isNumber],
        text: [isTshirtSize],
        "text-shadow": [isTshirtSize],
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
      },
      classGroups: {
        // --------------
        // --- Layout ---
        // --------------
        /**
         * Aspect Ratio
         * @see https://tailwindcss.com/docs/aspect-ratio
         */
        aspect: [{
          aspect: ["auto", "square", isFraction, isArbitraryValue, isArbitraryVariable, themeAspect]
        }],
        /**
         * Container
         * @see https://tailwindcss.com/docs/container
         * @deprecated since Tailwind CSS v4.0.0
         */
        container: ["container"],
        /**
         * Columns
         * @see https://tailwindcss.com/docs/columns
         */
        columns: [{
          columns: [isNumber, isArbitraryValue, isArbitraryVariable, themeContainer]
        }],
        /**
         * Break After
         * @see https://tailwindcss.com/docs/break-after
         */
        "break-after": [{
          "break-after": scaleBreak()
        }],
        /**
         * Break Before
         * @see https://tailwindcss.com/docs/break-before
         */
        "break-before": [{
          "break-before": scaleBreak()
        }],
        /**
         * Break Inside
         * @see https://tailwindcss.com/docs/break-inside
         */
        "break-inside": [{
          "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
        }],
        /**
         * Box Decoration Break
         * @see https://tailwindcss.com/docs/box-decoration-break
         */
        "box-decoration": [{
          "box-decoration": ["slice", "clone"]
        }],
        /**
         * Box Sizing
         * @see https://tailwindcss.com/docs/box-sizing
         */
        box: [{
          box: ["border", "content"]
        }],
        /**
         * Display
         * @see https://tailwindcss.com/docs/display
         */
        display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
        /**
         * Screen Reader Only
         * @see https://tailwindcss.com/docs/display#screen-reader-only
         */
        sr: ["sr-only", "not-sr-only"],
        /**
         * Floats
         * @see https://tailwindcss.com/docs/float
         */
        float: [{
          float: ["right", "left", "none", "start", "end"]
        }],
        /**
         * Clear
         * @see https://tailwindcss.com/docs/clear
         */
        clear: [{
          clear: ["left", "right", "both", "none", "start", "end"]
        }],
        /**
         * Isolation
         * @see https://tailwindcss.com/docs/isolation
         */
        isolation: ["isolate", "isolation-auto"],
        /**
         * Object Fit
         * @see https://tailwindcss.com/docs/object-fit
         */
        "object-fit": [{
          object: ["contain", "cover", "fill", "none", "scale-down"]
        }],
        /**
         * Object Position
         * @see https://tailwindcss.com/docs/object-position
         */
        "object-position": [{
          object: scalePositionWithArbitrary()
        }],
        /**
         * Overflow
         * @see https://tailwindcss.com/docs/overflow
         */
        overflow: [{
          overflow: scaleOverflow()
        }],
        /**
         * Overflow X
         * @see https://tailwindcss.com/docs/overflow
         */
        "overflow-x": [{
          "overflow-x": scaleOverflow()
        }],
        /**
         * Overflow Y
         * @see https://tailwindcss.com/docs/overflow
         */
        "overflow-y": [{
          "overflow-y": scaleOverflow()
        }],
        /**
         * Overscroll Behavior
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        overscroll: [{
          overscroll: scaleOverscroll()
        }],
        /**
         * Overscroll Behavior X
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        "overscroll-x": [{
          "overscroll-x": scaleOverscroll()
        }],
        /**
         * Overscroll Behavior Y
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        "overscroll-y": [{
          "overscroll-y": scaleOverscroll()
        }],
        /**
         * Position
         * @see https://tailwindcss.com/docs/position
         */
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        /**
         * Top / Right / Bottom / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        inset: [{
          inset: scaleInset()
        }],
        /**
         * Right / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        "inset-x": [{
          "inset-x": scaleInset()
        }],
        /**
         * Top / Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        "inset-y": [{
          "inset-y": scaleInset()
        }],
        /**
         * Start
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        start: [{
          start: scaleInset()
        }],
        /**
         * End
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        end: [{
          end: scaleInset()
        }],
        /**
         * Top
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        top: [{
          top: scaleInset()
        }],
        /**
         * Right
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        right: [{
          right: scaleInset()
        }],
        /**
         * Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        bottom: [{
          bottom: scaleInset()
        }],
        /**
         * Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        left: [{
          left: scaleInset()
        }],
        /**
         * Visibility
         * @see https://tailwindcss.com/docs/visibility
         */
        visibility: ["visible", "invisible", "collapse"],
        /**
         * Z-Index
         * @see https://tailwindcss.com/docs/z-index
         */
        z: [{
          z: [isInteger, "auto", isArbitraryVariable, isArbitraryValue]
        }],
        // ------------------------
        // --- Flexbox and Grid ---
        // ------------------------
        /**
         * Flex Basis
         * @see https://tailwindcss.com/docs/flex-basis
         */
        basis: [{
          basis: [isFraction, "full", "auto", themeContainer, ...scaleUnambiguousSpacing()]
        }],
        /**
         * Flex Direction
         * @see https://tailwindcss.com/docs/flex-direction
         */
        "flex-direction": [{
          flex: ["row", "row-reverse", "col", "col-reverse"]
        }],
        /**
         * Flex Wrap
         * @see https://tailwindcss.com/docs/flex-wrap
         */
        "flex-wrap": [{
          flex: ["nowrap", "wrap", "wrap-reverse"]
        }],
        /**
         * Flex
         * @see https://tailwindcss.com/docs/flex
         */
        flex: [{
          flex: [isNumber, isFraction, "auto", "initial", "none", isArbitraryValue]
        }],
        /**
         * Flex Grow
         * @see https://tailwindcss.com/docs/flex-grow
         */
        grow: [{
          grow: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Flex Shrink
         * @see https://tailwindcss.com/docs/flex-shrink
         */
        shrink: [{
          shrink: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Order
         * @see https://tailwindcss.com/docs/order
         */
        order: [{
          order: [isInteger, "first", "last", "none", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Grid Template Columns
         * @see https://tailwindcss.com/docs/grid-template-columns
         */
        "grid-cols": [{
          "grid-cols": scaleGridTemplateColsRows()
        }],
        /**
         * Grid Column Start / End
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-start-end": [{
          col: scaleGridColRowStartAndEnd()
        }],
        /**
         * Grid Column Start
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-start": [{
          "col-start": scaleGridColRowStartOrEnd()
        }],
        /**
         * Grid Column End
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-end": [{
          "col-end": scaleGridColRowStartOrEnd()
        }],
        /**
         * Grid Template Rows
         * @see https://tailwindcss.com/docs/grid-template-rows
         */
        "grid-rows": [{
          "grid-rows": scaleGridTemplateColsRows()
        }],
        /**
         * Grid Row Start / End
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-start-end": [{
          row: scaleGridColRowStartAndEnd()
        }],
        /**
         * Grid Row Start
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-start": [{
          "row-start": scaleGridColRowStartOrEnd()
        }],
        /**
         * Grid Row End
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-end": [{
          "row-end": scaleGridColRowStartOrEnd()
        }],
        /**
         * Grid Auto Flow
         * @see https://tailwindcss.com/docs/grid-auto-flow
         */
        "grid-flow": [{
          "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
        }],
        /**
         * Grid Auto Columns
         * @see https://tailwindcss.com/docs/grid-auto-columns
         */
        "auto-cols": [{
          "auto-cols": scaleGridAutoColsRows()
        }],
        /**
         * Grid Auto Rows
         * @see https://tailwindcss.com/docs/grid-auto-rows
         */
        "auto-rows": [{
          "auto-rows": scaleGridAutoColsRows()
        }],
        /**
         * Gap
         * @see https://tailwindcss.com/docs/gap
         */
        gap: [{
          gap: scaleUnambiguousSpacing()
        }],
        /**
         * Gap X
         * @see https://tailwindcss.com/docs/gap
         */
        "gap-x": [{
          "gap-x": scaleUnambiguousSpacing()
        }],
        /**
         * Gap Y
         * @see https://tailwindcss.com/docs/gap
         */
        "gap-y": [{
          "gap-y": scaleUnambiguousSpacing()
        }],
        /**
         * Justify Content
         * @see https://tailwindcss.com/docs/justify-content
         */
        "justify-content": [{
          justify: [...scaleAlignPrimaryAxis(), "normal"]
        }],
        /**
         * Justify Items
         * @see https://tailwindcss.com/docs/justify-items
         */
        "justify-items": [{
          "justify-items": [...scaleAlignSecondaryAxis(), "normal"]
        }],
        /**
         * Justify Self
         * @see https://tailwindcss.com/docs/justify-self
         */
        "justify-self": [{
          "justify-self": ["auto", ...scaleAlignSecondaryAxis()]
        }],
        /**
         * Align Content
         * @see https://tailwindcss.com/docs/align-content
         */
        "align-content": [{
          content: ["normal", ...scaleAlignPrimaryAxis()]
        }],
        /**
         * Align Items
         * @see https://tailwindcss.com/docs/align-items
         */
        "align-items": [{
          items: [...scaleAlignSecondaryAxis(), {
            baseline: ["", "last"]
          }]
        }],
        /**
         * Align Self
         * @see https://tailwindcss.com/docs/align-self
         */
        "align-self": [{
          self: ["auto", ...scaleAlignSecondaryAxis(), {
            baseline: ["", "last"]
          }]
        }],
        /**
         * Place Content
         * @see https://tailwindcss.com/docs/place-content
         */
        "place-content": [{
          "place-content": scaleAlignPrimaryAxis()
        }],
        /**
         * Place Items
         * @see https://tailwindcss.com/docs/place-items
         */
        "place-items": [{
          "place-items": [...scaleAlignSecondaryAxis(), "baseline"]
        }],
        /**
         * Place Self
         * @see https://tailwindcss.com/docs/place-self
         */
        "place-self": [{
          "place-self": ["auto", ...scaleAlignSecondaryAxis()]
        }],
        // Spacing
        /**
         * Padding
         * @see https://tailwindcss.com/docs/padding
         */
        p: [{
          p: scaleUnambiguousSpacing()
        }],
        /**
         * Padding X
         * @see https://tailwindcss.com/docs/padding
         */
        px: [{
          px: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Y
         * @see https://tailwindcss.com/docs/padding
         */
        py: [{
          py: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Start
         * @see https://tailwindcss.com/docs/padding
         */
        ps: [{
          ps: scaleUnambiguousSpacing()
        }],
        /**
         * Padding End
         * @see https://tailwindcss.com/docs/padding
         */
        pe: [{
          pe: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Top
         * @see https://tailwindcss.com/docs/padding
         */
        pt: [{
          pt: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Right
         * @see https://tailwindcss.com/docs/padding
         */
        pr: [{
          pr: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Bottom
         * @see https://tailwindcss.com/docs/padding
         */
        pb: [{
          pb: scaleUnambiguousSpacing()
        }],
        /**
         * Padding Left
         * @see https://tailwindcss.com/docs/padding
         */
        pl: [{
          pl: scaleUnambiguousSpacing()
        }],
        /**
         * Margin
         * @see https://tailwindcss.com/docs/margin
         */
        m: [{
          m: scaleMargin()
        }],
        /**
         * Margin X
         * @see https://tailwindcss.com/docs/margin
         */
        mx: [{
          mx: scaleMargin()
        }],
        /**
         * Margin Y
         * @see https://tailwindcss.com/docs/margin
         */
        my: [{
          my: scaleMargin()
        }],
        /**
         * Margin Start
         * @see https://tailwindcss.com/docs/margin
         */
        ms: [{
          ms: scaleMargin()
        }],
        /**
         * Margin End
         * @see https://tailwindcss.com/docs/margin
         */
        me: [{
          me: scaleMargin()
        }],
        /**
         * Margin Top
         * @see https://tailwindcss.com/docs/margin
         */
        mt: [{
          mt: scaleMargin()
        }],
        /**
         * Margin Right
         * @see https://tailwindcss.com/docs/margin
         */
        mr: [{
          mr: scaleMargin()
        }],
        /**
         * Margin Bottom
         * @see https://tailwindcss.com/docs/margin
         */
        mb: [{
          mb: scaleMargin()
        }],
        /**
         * Margin Left
         * @see https://tailwindcss.com/docs/margin
         */
        ml: [{
          ml: scaleMargin()
        }],
        /**
         * Space Between X
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        "space-x": [{
          "space-x": scaleUnambiguousSpacing()
        }],
        /**
         * Space Between X Reverse
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        "space-x-reverse": ["space-x-reverse"],
        /**
         * Space Between Y
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        "space-y": [{
          "space-y": scaleUnambiguousSpacing()
        }],
        /**
         * Space Between Y Reverse
         * @see https://tailwindcss.com/docs/margin#adding-space-between-children
         */
        "space-y-reverse": ["space-y-reverse"],
        // --------------
        // --- Sizing ---
        // --------------
        /**
         * Size
         * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
         */
        size: [{
          size: scaleSizing()
        }],
        /**
         * Width
         * @see https://tailwindcss.com/docs/width
         */
        w: [{
          w: [themeContainer, "screen", ...scaleSizing()]
        }],
        /**
         * Min-Width
         * @see https://tailwindcss.com/docs/min-width
         */
        "min-w": [{
          "min-w": [
            themeContainer,
            "screen",
            /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            "none",
            ...scaleSizing()
          ]
        }],
        /**
         * Max-Width
         * @see https://tailwindcss.com/docs/max-width
         */
        "max-w": [{
          "max-w": [
            themeContainer,
            "screen",
            "none",
            /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            "prose",
            /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            {
              screen: [themeBreakpoint]
            },
            ...scaleSizing()
          ]
        }],
        /**
         * Height
         * @see https://tailwindcss.com/docs/height
         */
        h: [{
          h: ["screen", "lh", ...scaleSizing()]
        }],
        /**
         * Min-Height
         * @see https://tailwindcss.com/docs/min-height
         */
        "min-h": [{
          "min-h": ["screen", "lh", "none", ...scaleSizing()]
        }],
        /**
         * Max-Height
         * @see https://tailwindcss.com/docs/max-height
         */
        "max-h": [{
          "max-h": ["screen", "lh", ...scaleSizing()]
        }],
        // ------------------
        // --- Typography ---
        // ------------------
        /**
         * Font Size
         * @see https://tailwindcss.com/docs/font-size
         */
        "font-size": [{
          text: ["base", themeText, isArbitraryVariableLength, isArbitraryLength]
        }],
        /**
         * Font Smoothing
         * @see https://tailwindcss.com/docs/font-smoothing
         */
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        /**
         * Font Style
         * @see https://tailwindcss.com/docs/font-style
         */
        "font-style": ["italic", "not-italic"],
        /**
         * Font Weight
         * @see https://tailwindcss.com/docs/font-weight
         */
        "font-weight": [{
          font: [themeFontWeight, isArbitraryVariable, isArbitraryNumber]
        }],
        /**
         * Font Stretch
         * @see https://tailwindcss.com/docs/font-stretch
         */
        "font-stretch": [{
          "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", isPercent, isArbitraryValue]
        }],
        /**
         * Font Family
         * @see https://tailwindcss.com/docs/font-family
         */
        "font-family": [{
          font: [isArbitraryVariableFamilyName, isArbitraryValue, themeFont]
        }],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-normal": ["normal-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-ordinal": ["ordinal"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-slashed-zero": ["slashed-zero"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        /**
         * Letter Spacing
         * @see https://tailwindcss.com/docs/letter-spacing
         */
        tracking: [{
          tracking: [themeTracking, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Line Clamp
         * @see https://tailwindcss.com/docs/line-clamp
         */
        "line-clamp": [{
          "line-clamp": [isNumber, "none", isArbitraryVariable, isArbitraryNumber]
        }],
        /**
         * Line Height
         * @see https://tailwindcss.com/docs/line-height
         */
        leading: [{
          leading: [
            /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            themeLeading,
            ...scaleUnambiguousSpacing()
          ]
        }],
        /**
         * List Style Image
         * @see https://tailwindcss.com/docs/list-style-image
         */
        "list-image": [{
          "list-image": ["none", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * List Style Position
         * @see https://tailwindcss.com/docs/list-style-position
         */
        "list-style-position": [{
          list: ["inside", "outside"]
        }],
        /**
         * List Style Type
         * @see https://tailwindcss.com/docs/list-style-type
         */
        "list-style-type": [{
          list: ["disc", "decimal", "none", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Text Alignment
         * @see https://tailwindcss.com/docs/text-align
         */
        "text-alignment": [{
          text: ["left", "center", "right", "justify", "start", "end"]
        }],
        /**
         * Placeholder Color
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://v3.tailwindcss.com/docs/placeholder-color
         */
        "placeholder-color": [{
          placeholder: scaleColor()
        }],
        /**
         * Text Color
         * @see https://tailwindcss.com/docs/text-color
         */
        "text-color": [{
          text: scaleColor()
        }],
        /**
         * Text Decoration
         * @see https://tailwindcss.com/docs/text-decoration
         */
        "text-decoration": ["underline", "overline", "line-through", "no-underline"],
        /**
         * Text Decoration Style
         * @see https://tailwindcss.com/docs/text-decoration-style
         */
        "text-decoration-style": [{
          decoration: [...scaleLineStyle(), "wavy"]
        }],
        /**
         * Text Decoration Thickness
         * @see https://tailwindcss.com/docs/text-decoration-thickness
         */
        "text-decoration-thickness": [{
          decoration: [isNumber, "from-font", "auto", isArbitraryVariable, isArbitraryLength]
        }],
        /**
         * Text Decoration Color
         * @see https://tailwindcss.com/docs/text-decoration-color
         */
        "text-decoration-color": [{
          decoration: scaleColor()
        }],
        /**
         * Text Underline Offset
         * @see https://tailwindcss.com/docs/text-underline-offset
         */
        "underline-offset": [{
          "underline-offset": [isNumber, "auto", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Text Transform
         * @see https://tailwindcss.com/docs/text-transform
         */
        "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
        /**
         * Text Overflow
         * @see https://tailwindcss.com/docs/text-overflow
         */
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        /**
         * Text Wrap
         * @see https://tailwindcss.com/docs/text-wrap
         */
        "text-wrap": [{
          text: ["wrap", "nowrap", "balance", "pretty"]
        }],
        /**
         * Text Indent
         * @see https://tailwindcss.com/docs/text-indent
         */
        indent: [{
          indent: scaleUnambiguousSpacing()
        }],
        /**
         * Vertical Alignment
         * @see https://tailwindcss.com/docs/vertical-align
         */
        "vertical-align": [{
          align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Whitespace
         * @see https://tailwindcss.com/docs/whitespace
         */
        whitespace: [{
          whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
        }],
        /**
         * Word Break
         * @see https://tailwindcss.com/docs/word-break
         */
        break: [{
          break: ["normal", "words", "all", "keep"]
        }],
        /**
         * Overflow Wrap
         * @see https://tailwindcss.com/docs/overflow-wrap
         */
        wrap: [{
          wrap: ["break-word", "anywhere", "normal"]
        }],
        /**
         * Hyphens
         * @see https://tailwindcss.com/docs/hyphens
         */
        hyphens: [{
          hyphens: ["none", "manual", "auto"]
        }],
        /**
         * Content
         * @see https://tailwindcss.com/docs/content
         */
        content: [{
          content: ["none", isArbitraryVariable, isArbitraryValue]
        }],
        // -------------------
        // --- Backgrounds ---
        // -------------------
        /**
         * Background Attachment
         * @see https://tailwindcss.com/docs/background-attachment
         */
        "bg-attachment": [{
          bg: ["fixed", "local", "scroll"]
        }],
        /**
         * Background Clip
         * @see https://tailwindcss.com/docs/background-clip
         */
        "bg-clip": [{
          "bg-clip": ["border", "padding", "content", "text"]
        }],
        /**
         * Background Origin
         * @see https://tailwindcss.com/docs/background-origin
         */
        "bg-origin": [{
          "bg-origin": ["border", "padding", "content"]
        }],
        /**
         * Background Position
         * @see https://tailwindcss.com/docs/background-position
         */
        "bg-position": [{
          bg: scaleBgPosition()
        }],
        /**
         * Background Repeat
         * @see https://tailwindcss.com/docs/background-repeat
         */
        "bg-repeat": [{
          bg: scaleBgRepeat()
        }],
        /**
         * Background Size
         * @see https://tailwindcss.com/docs/background-size
         */
        "bg-size": [{
          bg: scaleBgSize()
        }],
        /**
         * Background Image
         * @see https://tailwindcss.com/docs/background-image
         */
        "bg-image": [{
          bg: ["none", {
            linear: [{
              to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
            }, isInteger, isArbitraryVariable, isArbitraryValue],
            radial: ["", isArbitraryVariable, isArbitraryValue],
            conic: [isInteger, isArbitraryVariable, isArbitraryValue]
          }, isArbitraryVariableImage, isArbitraryImage]
        }],
        /**
         * Background Color
         * @see https://tailwindcss.com/docs/background-color
         */
        "bg-color": [{
          bg: scaleColor()
        }],
        /**
         * Gradient Color Stops From Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-from-pos": [{
          from: scaleGradientStopPosition()
        }],
        /**
         * Gradient Color Stops Via Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-via-pos": [{
          via: scaleGradientStopPosition()
        }],
        /**
         * Gradient Color Stops To Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-to-pos": [{
          to: scaleGradientStopPosition()
        }],
        /**
         * Gradient Color Stops From
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-from": [{
          from: scaleColor()
        }],
        /**
         * Gradient Color Stops Via
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-via": [{
          via: scaleColor()
        }],
        /**
         * Gradient Color Stops To
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-to": [{
          to: scaleColor()
        }],
        // ---------------
        // --- Borders ---
        // ---------------
        /**
         * Border Radius
         * @see https://tailwindcss.com/docs/border-radius
         */
        rounded: [{
          rounded: scaleRadius()
        }],
        /**
         * Border Radius Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-s": [{
          "rounded-s": scaleRadius()
        }],
        /**
         * Border Radius End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-e": [{
          "rounded-e": scaleRadius()
        }],
        /**
         * Border Radius Top
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-t": [{
          "rounded-t": scaleRadius()
        }],
        /**
         * Border Radius Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-r": [{
          "rounded-r": scaleRadius()
        }],
        /**
         * Border Radius Bottom
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-b": [{
          "rounded-b": scaleRadius()
        }],
        /**
         * Border Radius Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-l": [{
          "rounded-l": scaleRadius()
        }],
        /**
         * Border Radius Start Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-ss": [{
          "rounded-ss": scaleRadius()
        }],
        /**
         * Border Radius Start End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-se": [{
          "rounded-se": scaleRadius()
        }],
        /**
         * Border Radius End End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-ee": [{
          "rounded-ee": scaleRadius()
        }],
        /**
         * Border Radius End Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-es": [{
          "rounded-es": scaleRadius()
        }],
        /**
         * Border Radius Top Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-tl": [{
          "rounded-tl": scaleRadius()
        }],
        /**
         * Border Radius Top Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-tr": [{
          "rounded-tr": scaleRadius()
        }],
        /**
         * Border Radius Bottom Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-br": [{
          "rounded-br": scaleRadius()
        }],
        /**
         * Border Radius Bottom Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-bl": [{
          "rounded-bl": scaleRadius()
        }],
        /**
         * Border Width
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w": [{
          border: scaleBorderWidth()
        }],
        /**
         * Border Width X
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-x": [{
          "border-x": scaleBorderWidth()
        }],
        /**
         * Border Width Y
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-y": [{
          "border-y": scaleBorderWidth()
        }],
        /**
         * Border Width Start
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-s": [{
          "border-s": scaleBorderWidth()
        }],
        /**
         * Border Width End
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-e": [{
          "border-e": scaleBorderWidth()
        }],
        /**
         * Border Width Top
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-t": [{
          "border-t": scaleBorderWidth()
        }],
        /**
         * Border Width Right
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-r": [{
          "border-r": scaleBorderWidth()
        }],
        /**
         * Border Width Bottom
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-b": [{
          "border-b": scaleBorderWidth()
        }],
        /**
         * Border Width Left
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-l": [{
          "border-l": scaleBorderWidth()
        }],
        /**
         * Divide Width X
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        "divide-x": [{
          "divide-x": scaleBorderWidth()
        }],
        /**
         * Divide Width X Reverse
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        "divide-x-reverse": ["divide-x-reverse"],
        /**
         * Divide Width Y
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        "divide-y": [{
          "divide-y": scaleBorderWidth()
        }],
        /**
         * Divide Width Y Reverse
         * @see https://tailwindcss.com/docs/border-width#between-children
         */
        "divide-y-reverse": ["divide-y-reverse"],
        /**
         * Border Style
         * @see https://tailwindcss.com/docs/border-style
         */
        "border-style": [{
          border: [...scaleLineStyle(), "hidden", "none"]
        }],
        /**
         * Divide Style
         * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
         */
        "divide-style": [{
          divide: [...scaleLineStyle(), "hidden", "none"]
        }],
        /**
         * Border Color
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color": [{
          border: scaleColor()
        }],
        /**
         * Border Color X
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-x": [{
          "border-x": scaleColor()
        }],
        /**
         * Border Color Y
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-y": [{
          "border-y": scaleColor()
        }],
        /**
         * Border Color S
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-s": [{
          "border-s": scaleColor()
        }],
        /**
         * Border Color E
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-e": [{
          "border-e": scaleColor()
        }],
        /**
         * Border Color Top
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-t": [{
          "border-t": scaleColor()
        }],
        /**
         * Border Color Right
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-r": [{
          "border-r": scaleColor()
        }],
        /**
         * Border Color Bottom
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-b": [{
          "border-b": scaleColor()
        }],
        /**
         * Border Color Left
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-l": [{
          "border-l": scaleColor()
        }],
        /**
         * Divide Color
         * @see https://tailwindcss.com/docs/divide-color
         */
        "divide-color": [{
          divide: scaleColor()
        }],
        /**
         * Outline Style
         * @see https://tailwindcss.com/docs/outline-style
         */
        "outline-style": [{
          outline: [...scaleLineStyle(), "none", "hidden"]
        }],
        /**
         * Outline Offset
         * @see https://tailwindcss.com/docs/outline-offset
         */
        "outline-offset": [{
          "outline-offset": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Outline Width
         * @see https://tailwindcss.com/docs/outline-width
         */
        "outline-w": [{
          outline: ["", isNumber, isArbitraryVariableLength, isArbitraryLength]
        }],
        /**
         * Outline Color
         * @see https://tailwindcss.com/docs/outline-color
         */
        "outline-color": [{
          outline: scaleColor()
        }],
        // ---------------
        // --- Effects ---
        // ---------------
        /**
         * Box Shadow
         * @see https://tailwindcss.com/docs/box-shadow
         */
        shadow: [{
          shadow: [
            // Deprecated since Tailwind CSS v4.0.0
            "",
            "none",
            themeShadow,
            isArbitraryVariableShadow,
            isArbitraryShadow
          ]
        }],
        /**
         * Box Shadow Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
         */
        "shadow-color": [{
          shadow: scaleColor()
        }],
        /**
         * Inset Box Shadow
         * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
         */
        "inset-shadow": [{
          "inset-shadow": ["none", themeInsetShadow, isArbitraryVariableShadow, isArbitraryShadow]
        }],
        /**
         * Inset Box Shadow Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
         */
        "inset-shadow-color": [{
          "inset-shadow": scaleColor()
        }],
        /**
         * Ring Width
         * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
         */
        "ring-w": [{
          ring: scaleBorderWidth()
        }],
        /**
         * Ring Width Inset
         * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
         * @deprecated since Tailwind CSS v4.0.0
         * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
         */
        "ring-w-inset": ["ring-inset"],
        /**
         * Ring Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
         */
        "ring-color": [{
          ring: scaleColor()
        }],
        /**
         * Ring Offset Width
         * @see https://v3.tailwindcss.com/docs/ring-offset-width
         * @deprecated since Tailwind CSS v4.0.0
         * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
         */
        "ring-offset-w": [{
          "ring-offset": [isNumber, isArbitraryLength]
        }],
        /**
         * Ring Offset Color
         * @see https://v3.tailwindcss.com/docs/ring-offset-color
         * @deprecated since Tailwind CSS v4.0.0
         * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
         */
        "ring-offset-color": [{
          "ring-offset": scaleColor()
        }],
        /**
         * Inset Ring Width
         * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
         */
        "inset-ring-w": [{
          "inset-ring": scaleBorderWidth()
        }],
        /**
         * Inset Ring Color
         * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
         */
        "inset-ring-color": [{
          "inset-ring": scaleColor()
        }],
        /**
         * Text Shadow
         * @see https://tailwindcss.com/docs/text-shadow
         */
        "text-shadow": [{
          "text-shadow": ["none", themeTextShadow, isArbitraryVariableShadow, isArbitraryShadow]
        }],
        /**
         * Text Shadow Color
         * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
         */
        "text-shadow-color": [{
          "text-shadow": scaleColor()
        }],
        /**
         * Opacity
         * @see https://tailwindcss.com/docs/opacity
         */
        opacity: [{
          opacity: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Mix Blend Mode
         * @see https://tailwindcss.com/docs/mix-blend-mode
         */
        "mix-blend": [{
          "mix-blend": [...scaleBlendMode(), "plus-darker", "plus-lighter"]
        }],
        /**
         * Background Blend Mode
         * @see https://tailwindcss.com/docs/background-blend-mode
         */
        "bg-blend": [{
          "bg-blend": scaleBlendMode()
        }],
        /**
         * Mask Clip
         * @see https://tailwindcss.com/docs/mask-clip
         */
        "mask-clip": [{
          "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
        }, "mask-no-clip"],
        /**
         * Mask Composite
         * @see https://tailwindcss.com/docs/mask-composite
         */
        "mask-composite": [{
          mask: ["add", "subtract", "intersect", "exclude"]
        }],
        /**
         * Mask Image
         * @see https://tailwindcss.com/docs/mask-image
         */
        "mask-image-linear-pos": [{
          "mask-linear": [isNumber]
        }],
        "mask-image-linear-from-pos": [{
          "mask-linear-from": scaleMaskImagePosition()
        }],
        "mask-image-linear-to-pos": [{
          "mask-linear-to": scaleMaskImagePosition()
        }],
        "mask-image-linear-from-color": [{
          "mask-linear-from": scaleColor()
        }],
        "mask-image-linear-to-color": [{
          "mask-linear-to": scaleColor()
        }],
        "mask-image-t-from-pos": [{
          "mask-t-from": scaleMaskImagePosition()
        }],
        "mask-image-t-to-pos": [{
          "mask-t-to": scaleMaskImagePosition()
        }],
        "mask-image-t-from-color": [{
          "mask-t-from": scaleColor()
        }],
        "mask-image-t-to-color": [{
          "mask-t-to": scaleColor()
        }],
        "mask-image-r-from-pos": [{
          "mask-r-from": scaleMaskImagePosition()
        }],
        "mask-image-r-to-pos": [{
          "mask-r-to": scaleMaskImagePosition()
        }],
        "mask-image-r-from-color": [{
          "mask-r-from": scaleColor()
        }],
        "mask-image-r-to-color": [{
          "mask-r-to": scaleColor()
        }],
        "mask-image-b-from-pos": [{
          "mask-b-from": scaleMaskImagePosition()
        }],
        "mask-image-b-to-pos": [{
          "mask-b-to": scaleMaskImagePosition()
        }],
        "mask-image-b-from-color": [{
          "mask-b-from": scaleColor()
        }],
        "mask-image-b-to-color": [{
          "mask-b-to": scaleColor()
        }],
        "mask-image-l-from-pos": [{
          "mask-l-from": scaleMaskImagePosition()
        }],
        "mask-image-l-to-pos": [{
          "mask-l-to": scaleMaskImagePosition()
        }],
        "mask-image-l-from-color": [{
          "mask-l-from": scaleColor()
        }],
        "mask-image-l-to-color": [{
          "mask-l-to": scaleColor()
        }],
        "mask-image-x-from-pos": [{
          "mask-x-from": scaleMaskImagePosition()
        }],
        "mask-image-x-to-pos": [{
          "mask-x-to": scaleMaskImagePosition()
        }],
        "mask-image-x-from-color": [{
          "mask-x-from": scaleColor()
        }],
        "mask-image-x-to-color": [{
          "mask-x-to": scaleColor()
        }],
        "mask-image-y-from-pos": [{
          "mask-y-from": scaleMaskImagePosition()
        }],
        "mask-image-y-to-pos": [{
          "mask-y-to": scaleMaskImagePosition()
        }],
        "mask-image-y-from-color": [{
          "mask-y-from": scaleColor()
        }],
        "mask-image-y-to-color": [{
          "mask-y-to": scaleColor()
        }],
        "mask-image-radial": [{
          "mask-radial": [isArbitraryVariable, isArbitraryValue]
        }],
        "mask-image-radial-from-pos": [{
          "mask-radial-from": scaleMaskImagePosition()
        }],
        "mask-image-radial-to-pos": [{
          "mask-radial-to": scaleMaskImagePosition()
        }],
        "mask-image-radial-from-color": [{
          "mask-radial-from": scaleColor()
        }],
        "mask-image-radial-to-color": [{
          "mask-radial-to": scaleColor()
        }],
        "mask-image-radial-shape": [{
          "mask-radial": ["circle", "ellipse"]
        }],
        "mask-image-radial-size": [{
          "mask-radial": [{
            closest: ["side", "corner"],
            farthest: ["side", "corner"]
          }]
        }],
        "mask-image-radial-pos": [{
          "mask-radial-at": scalePosition()
        }],
        "mask-image-conic-pos": [{
          "mask-conic": [isNumber]
        }],
        "mask-image-conic-from-pos": [{
          "mask-conic-from": scaleMaskImagePosition()
        }],
        "mask-image-conic-to-pos": [{
          "mask-conic-to": scaleMaskImagePosition()
        }],
        "mask-image-conic-from-color": [{
          "mask-conic-from": scaleColor()
        }],
        "mask-image-conic-to-color": [{
          "mask-conic-to": scaleColor()
        }],
        /**
         * Mask Mode
         * @see https://tailwindcss.com/docs/mask-mode
         */
        "mask-mode": [{
          mask: ["alpha", "luminance", "match"]
        }],
        /**
         * Mask Origin
         * @see https://tailwindcss.com/docs/mask-origin
         */
        "mask-origin": [{
          "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
        }],
        /**
         * Mask Position
         * @see https://tailwindcss.com/docs/mask-position
         */
        "mask-position": [{
          mask: scaleBgPosition()
        }],
        /**
         * Mask Repeat
         * @see https://tailwindcss.com/docs/mask-repeat
         */
        "mask-repeat": [{
          mask: scaleBgRepeat()
        }],
        /**
         * Mask Size
         * @see https://tailwindcss.com/docs/mask-size
         */
        "mask-size": [{
          mask: scaleBgSize()
        }],
        /**
         * Mask Type
         * @see https://tailwindcss.com/docs/mask-type
         */
        "mask-type": [{
          "mask-type": ["alpha", "luminance"]
        }],
        /**
         * Mask Image
         * @see https://tailwindcss.com/docs/mask-image
         */
        "mask-image": [{
          mask: ["none", isArbitraryVariable, isArbitraryValue]
        }],
        // ---------------
        // --- Filters ---
        // ---------------
        /**
         * Filter
         * @see https://tailwindcss.com/docs/filter
         */
        filter: [{
          filter: [
            // Deprecated since Tailwind CSS v3.0.0
            "",
            "none",
            isArbitraryVariable,
            isArbitraryValue
          ]
        }],
        /**
         * Blur
         * @see https://tailwindcss.com/docs/blur
         */
        blur: [{
          blur: scaleBlur()
        }],
        /**
         * Brightness
         * @see https://tailwindcss.com/docs/brightness
         */
        brightness: [{
          brightness: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Contrast
         * @see https://tailwindcss.com/docs/contrast
         */
        contrast: [{
          contrast: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Drop Shadow
         * @see https://tailwindcss.com/docs/drop-shadow
         */
        "drop-shadow": [{
          "drop-shadow": [
            // Deprecated since Tailwind CSS v4.0.0
            "",
            "none",
            themeDropShadow,
            isArbitraryVariableShadow,
            isArbitraryShadow
          ]
        }],
        /**
         * Drop Shadow Color
         * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
         */
        "drop-shadow-color": [{
          "drop-shadow": scaleColor()
        }],
        /**
         * Grayscale
         * @see https://tailwindcss.com/docs/grayscale
         */
        grayscale: [{
          grayscale: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Hue Rotate
         * @see https://tailwindcss.com/docs/hue-rotate
         */
        "hue-rotate": [{
          "hue-rotate": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Invert
         * @see https://tailwindcss.com/docs/invert
         */
        invert: [{
          invert: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Saturate
         * @see https://tailwindcss.com/docs/saturate
         */
        saturate: [{
          saturate: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Sepia
         * @see https://tailwindcss.com/docs/sepia
         */
        sepia: [{
          sepia: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Filter
         * @see https://tailwindcss.com/docs/backdrop-filter
         */
        "backdrop-filter": [{
          "backdrop-filter": [
            // Deprecated since Tailwind CSS v3.0.0
            "",
            "none",
            isArbitraryVariable,
            isArbitraryValue
          ]
        }],
        /**
         * Backdrop Blur
         * @see https://tailwindcss.com/docs/backdrop-blur
         */
        "backdrop-blur": [{
          "backdrop-blur": scaleBlur()
        }],
        /**
         * Backdrop Brightness
         * @see https://tailwindcss.com/docs/backdrop-brightness
         */
        "backdrop-brightness": [{
          "backdrop-brightness": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Contrast
         * @see https://tailwindcss.com/docs/backdrop-contrast
         */
        "backdrop-contrast": [{
          "backdrop-contrast": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Grayscale
         * @see https://tailwindcss.com/docs/backdrop-grayscale
         */
        "backdrop-grayscale": [{
          "backdrop-grayscale": ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Hue Rotate
         * @see https://tailwindcss.com/docs/backdrop-hue-rotate
         */
        "backdrop-hue-rotate": [{
          "backdrop-hue-rotate": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Invert
         * @see https://tailwindcss.com/docs/backdrop-invert
         */
        "backdrop-invert": [{
          "backdrop-invert": ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Opacity
         * @see https://tailwindcss.com/docs/backdrop-opacity
         */
        "backdrop-opacity": [{
          "backdrop-opacity": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Saturate
         * @see https://tailwindcss.com/docs/backdrop-saturate
         */
        "backdrop-saturate": [{
          "backdrop-saturate": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Backdrop Sepia
         * @see https://tailwindcss.com/docs/backdrop-sepia
         */
        "backdrop-sepia": [{
          "backdrop-sepia": ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        // --------------
        // --- Tables ---
        // --------------
        /**
         * Border Collapse
         * @see https://tailwindcss.com/docs/border-collapse
         */
        "border-collapse": [{
          border: ["collapse", "separate"]
        }],
        /**
         * Border Spacing
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing": [{
          "border-spacing": scaleUnambiguousSpacing()
        }],
        /**
         * Border Spacing X
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing-x": [{
          "border-spacing-x": scaleUnambiguousSpacing()
        }],
        /**
         * Border Spacing Y
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing-y": [{
          "border-spacing-y": scaleUnambiguousSpacing()
        }],
        /**
         * Table Layout
         * @see https://tailwindcss.com/docs/table-layout
         */
        "table-layout": [{
          table: ["auto", "fixed"]
        }],
        /**
         * Caption Side
         * @see https://tailwindcss.com/docs/caption-side
         */
        caption: [{
          caption: ["top", "bottom"]
        }],
        // ---------------------------------
        // --- Transitions and Animation ---
        // ---------------------------------
        /**
         * Transition Property
         * @see https://tailwindcss.com/docs/transition-property
         */
        transition: [{
          transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Transition Behavior
         * @see https://tailwindcss.com/docs/transition-behavior
         */
        "transition-behavior": [{
          transition: ["normal", "discrete"]
        }],
        /**
         * Transition Duration
         * @see https://tailwindcss.com/docs/transition-duration
         */
        duration: [{
          duration: [isNumber, "initial", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Transition Timing Function
         * @see https://tailwindcss.com/docs/transition-timing-function
         */
        ease: [{
          ease: ["linear", "initial", themeEase, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Transition Delay
         * @see https://tailwindcss.com/docs/transition-delay
         */
        delay: [{
          delay: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Animation
         * @see https://tailwindcss.com/docs/animation
         */
        animate: [{
          animate: ["none", themeAnimate, isArbitraryVariable, isArbitraryValue]
        }],
        // ------------------
        // --- Transforms ---
        // ------------------
        /**
         * Backface Visibility
         * @see https://tailwindcss.com/docs/backface-visibility
         */
        backface: [{
          backface: ["hidden", "visible"]
        }],
        /**
         * Perspective
         * @see https://tailwindcss.com/docs/perspective
         */
        perspective: [{
          perspective: [themePerspective, isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Perspective Origin
         * @see https://tailwindcss.com/docs/perspective-origin
         */
        "perspective-origin": [{
          "perspective-origin": scalePositionWithArbitrary()
        }],
        /**
         * Rotate
         * @see https://tailwindcss.com/docs/rotate
         */
        rotate: [{
          rotate: scaleRotate()
        }],
        /**
         * Rotate X
         * @see https://tailwindcss.com/docs/rotate
         */
        "rotate-x": [{
          "rotate-x": scaleRotate()
        }],
        /**
         * Rotate Y
         * @see https://tailwindcss.com/docs/rotate
         */
        "rotate-y": [{
          "rotate-y": scaleRotate()
        }],
        /**
         * Rotate Z
         * @see https://tailwindcss.com/docs/rotate
         */
        "rotate-z": [{
          "rotate-z": scaleRotate()
        }],
        /**
         * Scale
         * @see https://tailwindcss.com/docs/scale
         */
        scale: [{
          scale: scaleScale()
        }],
        /**
         * Scale X
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-x": [{
          "scale-x": scaleScale()
        }],
        /**
         * Scale Y
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-y": [{
          "scale-y": scaleScale()
        }],
        /**
         * Scale Z
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-z": [{
          "scale-z": scaleScale()
        }],
        /**
         * Scale 3D
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-3d": ["scale-3d"],
        /**
         * Skew
         * @see https://tailwindcss.com/docs/skew
         */
        skew: [{
          skew: scaleSkew()
        }],
        /**
         * Skew X
         * @see https://tailwindcss.com/docs/skew
         */
        "skew-x": [{
          "skew-x": scaleSkew()
        }],
        /**
         * Skew Y
         * @see https://tailwindcss.com/docs/skew
         */
        "skew-y": [{
          "skew-y": scaleSkew()
        }],
        /**
         * Transform
         * @see https://tailwindcss.com/docs/transform
         */
        transform: [{
          transform: [isArbitraryVariable, isArbitraryValue, "", "none", "gpu", "cpu"]
        }],
        /**
         * Transform Origin
         * @see https://tailwindcss.com/docs/transform-origin
         */
        "transform-origin": [{
          origin: scalePositionWithArbitrary()
        }],
        /**
         * Transform Style
         * @see https://tailwindcss.com/docs/transform-style
         */
        "transform-style": [{
          transform: ["3d", "flat"]
        }],
        /**
         * Translate
         * @see https://tailwindcss.com/docs/translate
         */
        translate: [{
          translate: scaleTranslate()
        }],
        /**
         * Translate X
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-x": [{
          "translate-x": scaleTranslate()
        }],
        /**
         * Translate Y
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-y": [{
          "translate-y": scaleTranslate()
        }],
        /**
         * Translate Z
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-z": [{
          "translate-z": scaleTranslate()
        }],
        /**
         * Translate None
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-none": ["translate-none"],
        // ---------------------
        // --- Interactivity ---
        // ---------------------
        /**
         * Accent Color
         * @see https://tailwindcss.com/docs/accent-color
         */
        accent: [{
          accent: scaleColor()
        }],
        /**
         * Appearance
         * @see https://tailwindcss.com/docs/appearance
         */
        appearance: [{
          appearance: ["none", "auto"]
        }],
        /**
         * Caret Color
         * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
         */
        "caret-color": [{
          caret: scaleColor()
        }],
        /**
         * Color Scheme
         * @see https://tailwindcss.com/docs/color-scheme
         */
        "color-scheme": [{
          scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
        }],
        /**
         * Cursor
         * @see https://tailwindcss.com/docs/cursor
         */
        cursor: [{
          cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryVariable, isArbitraryValue]
        }],
        /**
         * Field Sizing
         * @see https://tailwindcss.com/docs/field-sizing
         */
        "field-sizing": [{
          "field-sizing": ["fixed", "content"]
        }],
        /**
         * Pointer Events
         * @see https://tailwindcss.com/docs/pointer-events
         */
        "pointer-events": [{
          "pointer-events": ["auto", "none"]
        }],
        /**
         * Resize
         * @see https://tailwindcss.com/docs/resize
         */
        resize: [{
          resize: ["none", "", "y", "x"]
        }],
        /**
         * Scroll Behavior
         * @see https://tailwindcss.com/docs/scroll-behavior
         */
        "scroll-behavior": [{
          scroll: ["auto", "smooth"]
        }],
        /**
         * Scroll Margin
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-m": [{
          "scroll-m": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin X
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mx": [{
          "scroll-mx": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Y
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-my": [{
          "scroll-my": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Start
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-ms": [{
          "scroll-ms": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin End
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-me": [{
          "scroll-me": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Top
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mt": [{
          "scroll-mt": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Right
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mr": [{
          "scroll-mr": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Bottom
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mb": [{
          "scroll-mb": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Margin Left
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-ml": [{
          "scroll-ml": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-p": [{
          "scroll-p": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding X
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-px": [{
          "scroll-px": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Y
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-py": [{
          "scroll-py": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Start
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-ps": [{
          "scroll-ps": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding End
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pe": [{
          "scroll-pe": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Top
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pt": [{
          "scroll-pt": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Right
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pr": [{
          "scroll-pr": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Bottom
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pb": [{
          "scroll-pb": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Padding Left
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pl": [{
          "scroll-pl": scaleUnambiguousSpacing()
        }],
        /**
         * Scroll Snap Align
         * @see https://tailwindcss.com/docs/scroll-snap-align
         */
        "snap-align": [{
          snap: ["start", "end", "center", "align-none"]
        }],
        /**
         * Scroll Snap Stop
         * @see https://tailwindcss.com/docs/scroll-snap-stop
         */
        "snap-stop": [{
          snap: ["normal", "always"]
        }],
        /**
         * Scroll Snap Type
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        "snap-type": [{
          snap: ["none", "x", "y", "both"]
        }],
        /**
         * Scroll Snap Type Strictness
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        "snap-strictness": [{
          snap: ["mandatory", "proximity"]
        }],
        /**
         * Touch Action
         * @see https://tailwindcss.com/docs/touch-action
         */
        touch: [{
          touch: ["auto", "none", "manipulation"]
        }],
        /**
         * Touch Action X
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-x": [{
          "touch-pan": ["x", "left", "right"]
        }],
        /**
         * Touch Action Y
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-y": [{
          "touch-pan": ["y", "up", "down"]
        }],
        /**
         * Touch Action Pinch Zoom
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-pz": ["touch-pinch-zoom"],
        /**
         * User Select
         * @see https://tailwindcss.com/docs/user-select
         */
        select: [{
          select: ["none", "text", "all", "auto"]
        }],
        /**
         * Will Change
         * @see https://tailwindcss.com/docs/will-change
         */
        "will-change": [{
          "will-change": ["auto", "scroll", "contents", "transform", isArbitraryVariable, isArbitraryValue]
        }],
        // -----------
        // --- SVG ---
        // -----------
        /**
         * Fill
         * @see https://tailwindcss.com/docs/fill
         */
        fill: [{
          fill: ["none", ...scaleColor()]
        }],
        /**
         * Stroke Width
         * @see https://tailwindcss.com/docs/stroke-width
         */
        "stroke-w": [{
          stroke: [isNumber, isArbitraryVariableLength, isArbitraryLength, isArbitraryNumber]
        }],
        /**
         * Stroke
         * @see https://tailwindcss.com/docs/stroke
         */
        stroke: [{
          stroke: ["none", ...scaleColor()]
        }],
        // ---------------------
        // --- Accessibility ---
        // ---------------------
        /**
         * Forced Color Adjust
         * @see https://tailwindcss.com/docs/forced-color-adjust
         */
        "forced-color-adjust": [{
          "forced-color-adjust": ["auto", "none"]
        }]
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        translate: ["translate-x", "translate-y", "translate-none"],
        "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
        "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"]
      },
      conflictingClassGroupModifiers: {
        "font-size": ["leading"]
      },
      orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
    };
  };
  const twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);
  function cn(...inputs) {
    return twMerge(clsx(inputs));
  }
  const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
      variants: {
        variant: {
          default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
          destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
          outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
          secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
          link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
          default: "h-9 px-4 py-2 has-[>svg]:px-3",
          sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
          lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
          icon: "size-9"
        }
      },
      defaultVariants: {
        variant: "default",
        size: "default"
      }
    }
  );
  function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
  }) {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ React__namespace.createElement(
      Comp,
      {
        "data-slot": "button",
        className: cn(buttonVariants({ variant, size, className })),
        ...props
      }
    );
  }
  function App() {
    return /* @__PURE__ */ React2.createElement("div", { className: "flex min-h-screen flex-col items-center justify-center gap-4 p-8" }, /* @__PURE__ */ React2.createElement("h1", { className: "text-4xl font-bold text-foreground mb-8" }, "React Userscript com shadcn/ui"), /* @__PURE__ */ React2.createElement("div", { className: "flex flex-wrap gap-4 items-center justify-center" }, /* @__PURE__ */ React2.createElement(Button, { variant: "default" }, "Botão Padrão"), /* @__PURE__ */ React2.createElement(Button, { variant: "secondary" }, "Botão Secundário"), /* @__PURE__ */ React2.createElement(Button, { variant: "outline" }, "Botão Outline"), /* @__PURE__ */ React2.createElement(Button, { variant: "destructive" }, "Botão Destrutivo"), /* @__PURE__ */ React2.createElement(Button, { variant: "ghost" }, "Botão Ghost"), /* @__PURE__ */ React2.createElement(Button, { variant: "link" }, "Botão Link")), /* @__PURE__ */ React2.createElement("div", { className: "flex gap-4 items-center justify-center mt-4" }, /* @__PURE__ */ React2.createElement(Button, { size: "sm" }, "Pequeno"), /* @__PURE__ */ React2.createElement(Button, { size: "default" }, "Padrão"), /* @__PURE__ */ React2.createElement(Button, { size: "lg" }, "Grande")), /* @__PURE__ */ React2.createElement("p", { className: "text-muted-foreground text-center max-w-md mt-8" }, "Este é um exemplo de React userscript usando shadcn/ui. Os componentes estão funcionando corretamente com Tailwind CSS."));
  }
  function log(...args) {
    console.log(
      "%cUserscript (React Mode):",
      "color: purple; font-weight: bold",
      ...args
    );
  }
  function addLocationChangeCallback(callback) {
    window.setTimeout(callback, 0);
    let oldHref = window.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver((mutations) => {
      if (mutations.some(() => oldHref !== document.location.href)) {
        oldHref = document.location.href;
        callback();
      }
    });
    observer.observe(body, { childList: true, subtree: true });
    return observer;
  }
  async function awaitElement(selector) {
    const MAX_TRIES = 60;
    let tries = 0;
    return new Promise((resolve, reject) => {
      function probe() {
        tries++;
        return document.querySelector(selector);
      }
      function delayedProbe() {
        if (tries >= MAX_TRIES) {
          log("Can't find element with selector", selector);
          reject();
          return;
        }
        const elm = probe();
        if (elm) {
          resolve(elm);
          return;
        }
        window.setTimeout(delayedProbe, 250);
      }
      delayedProbe();
    });
  }
  log("React script has successfully started");
  async function main() {
    const body = await awaitElement("body > div");
    const container = document.createElement("div");
    body.appendChild(container);
    const root = client2.createRoot(container);
    root.render(/* @__PURE__ */ React2.createElement(App, null));
  }
  addLocationChangeCallback(() => {
    main().catch((e) => {
      log(e);
    });
  });
})(React, client, jsxRuntime);
;
(function(){
                    const el = document.createElement("style");
                    el.innerText = "body {\r\n  margin: 0;\r\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\",\r\n    \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\",\r\n    sans-serif;\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n\r\ncode {\r\n  font-family: source-code-pro, Menlo, Monaco, Consolas, \"Courier New\",\r\n    monospace;\r\n}\r\n@layer theme, base, components, utilities;\n\n@layer theme {\n  @theme default {\n    --font-sans:\n      ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\",\n      \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n    --font-serif: ui-serif, Georgia, Cambria, \"Times New Roman\", Times, serif;\n    --font-mono:\n      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\",\n      \"Courier New\", monospace;\n\n    --color-red-50: oklch(97.1% 0.013 17.38);\n    --color-red-100: oklch(93.6% 0.032 17.717);\n    --color-red-200: oklch(88.5% 0.062 18.334);\n    --color-red-300: oklch(80.8% 0.114 19.571);\n    --color-red-400: oklch(70.4% 0.191 22.216);\n    --color-red-500: oklch(63.7% 0.237 25.331);\n    --color-red-600: oklch(57.7% 0.245 27.325);\n    --color-red-700: oklch(50.5% 0.213 27.518);\n    --color-red-800: oklch(44.4% 0.177 26.899);\n    --color-red-900: oklch(39.6% 0.141 25.723);\n    --color-red-950: oklch(25.8% 0.092 26.042);\n\n    --color-orange-50: oklch(98% 0.016 73.684);\n    --color-orange-100: oklch(95.4% 0.038 75.164);\n    --color-orange-200: oklch(90.1% 0.076 70.697);\n    --color-orange-300: oklch(83.7% 0.128 66.29);\n    --color-orange-400: oklch(75% 0.183 55.934);\n    --color-orange-500: oklch(70.5% 0.213 47.604);\n    --color-orange-600: oklch(64.6% 0.222 41.116);\n    --color-orange-700: oklch(55.3% 0.195 38.402);\n    --color-orange-800: oklch(47% 0.157 37.304);\n    --color-orange-900: oklch(40.8% 0.123 38.172);\n    --color-orange-950: oklch(26.6% 0.079 36.259);\n\n    --color-amber-50: oklch(98.7% 0.022 95.277);\n    --color-amber-100: oklch(96.2% 0.059 95.617);\n    --color-amber-200: oklch(92.4% 0.12 95.746);\n    --color-amber-300: oklch(87.9% 0.169 91.605);\n    --color-amber-400: oklch(82.8% 0.189 84.429);\n    --color-amber-500: oklch(76.9% 0.188 70.08);\n    --color-amber-600: oklch(66.6% 0.179 58.318);\n    --color-amber-700: oklch(55.5% 0.163 48.998);\n    --color-amber-800: oklch(47.3% 0.137 46.201);\n    --color-amber-900: oklch(41.4% 0.112 45.904);\n    --color-amber-950: oklch(27.9% 0.077 45.635);\n\n    --color-yellow-50: oklch(98.7% 0.026 102.212);\n    --color-yellow-100: oklch(97.3% 0.071 103.193);\n    --color-yellow-200: oklch(94.5% 0.129 101.54);\n    --color-yellow-300: oklch(90.5% 0.182 98.111);\n    --color-yellow-400: oklch(85.2% 0.199 91.936);\n    --color-yellow-500: oklch(79.5% 0.184 86.047);\n    --color-yellow-600: oklch(68.1% 0.162 75.834);\n    --color-yellow-700: oklch(55.4% 0.135 66.442);\n    --color-yellow-800: oklch(47.6% 0.114 61.907);\n    --color-yellow-900: oklch(42.1% 0.095 57.708);\n    --color-yellow-950: oklch(28.6% 0.066 53.813);\n\n    --color-lime-50: oklch(98.6% 0.031 120.757);\n    --color-lime-100: oklch(96.7% 0.067 122.328);\n    --color-lime-200: oklch(93.8% 0.127 124.321);\n    --color-lime-300: oklch(89.7% 0.196 126.665);\n    --color-lime-400: oklch(84.1% 0.238 128.85);\n    --color-lime-500: oklch(76.8% 0.233 130.85);\n    --color-lime-600: oklch(64.8% 0.2 131.684);\n    --color-lime-700: oklch(53.2% 0.157 131.589);\n    --color-lime-800: oklch(45.3% 0.124 130.933);\n    --color-lime-900: oklch(40.5% 0.101 131.063);\n    --color-lime-950: oklch(27.4% 0.072 132.109);\n\n    --color-green-50: oklch(98.2% 0.018 155.826);\n    --color-green-100: oklch(96.2% 0.044 156.743);\n    --color-green-200: oklch(92.5% 0.084 155.995);\n    --color-green-300: oklch(87.1% 0.15 154.449);\n    --color-green-400: oklch(79.2% 0.209 151.711);\n    --color-green-500: oklch(72.3% 0.219 149.579);\n    --color-green-600: oklch(62.7% 0.194 149.214);\n    --color-green-700: oklch(52.7% 0.154 150.069);\n    --color-green-800: oklch(44.8% 0.119 151.328);\n    --color-green-900: oklch(39.3% 0.095 152.535);\n    --color-green-950: oklch(26.6% 0.065 152.934);\n\n    --color-emerald-50: oklch(97.9% 0.021 166.113);\n    --color-emerald-100: oklch(95% 0.052 163.051);\n    --color-emerald-200: oklch(90.5% 0.093 164.15);\n    --color-emerald-300: oklch(84.5% 0.143 164.978);\n    --color-emerald-400: oklch(76.5% 0.177 163.223);\n    --color-emerald-500: oklch(69.6% 0.17 162.48);\n    --color-emerald-600: oklch(59.6% 0.145 163.225);\n    --color-emerald-700: oklch(50.8% 0.118 165.612);\n    --color-emerald-800: oklch(43.2% 0.095 166.913);\n    --color-emerald-900: oklch(37.8% 0.077 168.94);\n    --color-emerald-950: oklch(26.2% 0.051 172.552);\n\n    --color-teal-50: oklch(98.4% 0.014 180.72);\n    --color-teal-100: oklch(95.3% 0.051 180.801);\n    --color-teal-200: oklch(91% 0.096 180.426);\n    --color-teal-300: oklch(85.5% 0.138 181.071);\n    --color-teal-400: oklch(77.7% 0.152 181.912);\n    --color-teal-500: oklch(70.4% 0.14 182.503);\n    --color-teal-600: oklch(60% 0.118 184.704);\n    --color-teal-700: oklch(51.1% 0.096 186.391);\n    --color-teal-800: oklch(43.7% 0.078 188.216);\n    --color-teal-900: oklch(38.6% 0.063 188.416);\n    --color-teal-950: oklch(27.7% 0.046 192.524);\n\n    --color-cyan-50: oklch(98.4% 0.019 200.873);\n    --color-cyan-100: oklch(95.6% 0.045 203.388);\n    --color-cyan-200: oklch(91.7% 0.08 205.041);\n    --color-cyan-300: oklch(86.5% 0.127 207.078);\n    --color-cyan-400: oklch(78.9% 0.154 211.53);\n    --color-cyan-500: oklch(71.5% 0.143 215.221);\n    --color-cyan-600: oklch(60.9% 0.126 221.723);\n    --color-cyan-700: oklch(52% 0.105 223.128);\n    --color-cyan-800: oklch(45% 0.085 224.283);\n    --color-cyan-900: oklch(39.8% 0.07 227.392);\n    --color-cyan-950: oklch(30.2% 0.056 229.695);\n\n    --color-sky-50: oklch(97.7% 0.013 236.62);\n    --color-sky-100: oklch(95.1% 0.026 236.824);\n    --color-sky-200: oklch(90.1% 0.058 230.902);\n    --color-sky-300: oklch(82.8% 0.111 230.318);\n    --color-sky-400: oklch(74.6% 0.16 232.661);\n    --color-sky-500: oklch(68.5% 0.169 237.323);\n    --color-sky-600: oklch(58.8% 0.158 241.966);\n    --color-sky-700: oklch(50% 0.134 242.749);\n    --color-sky-800: oklch(44.3% 0.11 240.79);\n    --color-sky-900: oklch(39.1% 0.09 240.876);\n    --color-sky-950: oklch(29.3% 0.066 243.157);\n\n    --color-blue-50: oklch(97% 0.014 254.604);\n    --color-blue-100: oklch(93.2% 0.032 255.585);\n    --color-blue-200: oklch(88.2% 0.059 254.128);\n    --color-blue-300: oklch(80.9% 0.105 251.813);\n    --color-blue-400: oklch(70.7% 0.165 254.624);\n    --color-blue-500: oklch(62.3% 0.214 259.815);\n    --color-blue-600: oklch(54.6% 0.245 262.881);\n    --color-blue-700: oklch(48.8% 0.243 264.376);\n    --color-blue-800: oklch(42.4% 0.199 265.638);\n    --color-blue-900: oklch(37.9% 0.146 265.522);\n    --color-blue-950: oklch(28.2% 0.091 267.935);\n\n    --color-indigo-50: oklch(96.2% 0.018 272.314);\n    --color-indigo-100: oklch(93% 0.034 272.788);\n    --color-indigo-200: oklch(87% 0.065 274.039);\n    --color-indigo-300: oklch(78.5% 0.115 274.713);\n    --color-indigo-400: oklch(67.3% 0.182 276.935);\n    --color-indigo-500: oklch(58.5% 0.233 277.117);\n    --color-indigo-600: oklch(51.1% 0.262 276.966);\n    --color-indigo-700: oklch(45.7% 0.24 277.023);\n    --color-indigo-800: oklch(39.8% 0.195 277.366);\n    --color-indigo-900: oklch(35.9% 0.144 278.697);\n    --color-indigo-950: oklch(25.7% 0.09 281.288);\n\n    --color-violet-50: oklch(96.9% 0.016 293.756);\n    --color-violet-100: oklch(94.3% 0.029 294.588);\n    --color-violet-200: oklch(89.4% 0.057 293.283);\n    --color-violet-300: oklch(81.1% 0.111 293.571);\n    --color-violet-400: oklch(70.2% 0.183 293.541);\n    --color-violet-500: oklch(60.6% 0.25 292.717);\n    --color-violet-600: oklch(54.1% 0.281 293.009);\n    --color-violet-700: oklch(49.1% 0.27 292.581);\n    --color-violet-800: oklch(43.2% 0.232 292.759);\n    --color-violet-900: oklch(38% 0.189 293.745);\n    --color-violet-950: oklch(28.3% 0.141 291.089);\n\n    --color-purple-50: oklch(97.7% 0.014 308.299);\n    --color-purple-100: oklch(94.6% 0.033 307.174);\n    --color-purple-200: oklch(90.2% 0.063 306.703);\n    --color-purple-300: oklch(82.7% 0.119 306.383);\n    --color-purple-400: oklch(71.4% 0.203 305.504);\n    --color-purple-500: oklch(62.7% 0.265 303.9);\n    --color-purple-600: oklch(55.8% 0.288 302.321);\n    --color-purple-700: oklch(49.6% 0.265 301.924);\n    --color-purple-800: oklch(43.8% 0.218 303.724);\n    --color-purple-900: oklch(38.1% 0.176 304.987);\n    --color-purple-950: oklch(29.1% 0.149 302.717);\n\n    --color-fuchsia-50: oklch(97.7% 0.017 320.058);\n    --color-fuchsia-100: oklch(95.2% 0.037 318.852);\n    --color-fuchsia-200: oklch(90.3% 0.076 319.62);\n    --color-fuchsia-300: oklch(83.3% 0.145 321.434);\n    --color-fuchsia-400: oklch(74% 0.238 322.16);\n    --color-fuchsia-500: oklch(66.7% 0.295 322.15);\n    --color-fuchsia-600: oklch(59.1% 0.293 322.896);\n    --color-fuchsia-700: oklch(51.8% 0.253 323.949);\n    --color-fuchsia-800: oklch(45.2% 0.211 324.591);\n    --color-fuchsia-900: oklch(40.1% 0.17 325.612);\n    --color-fuchsia-950: oklch(29.3% 0.136 325.661);\n\n    --color-pink-50: oklch(97.1% 0.014 343.198);\n    --color-pink-100: oklch(94.8% 0.028 342.258);\n    --color-pink-200: oklch(89.9% 0.061 343.231);\n    --color-pink-300: oklch(82.3% 0.12 346.018);\n    --color-pink-400: oklch(71.8% 0.202 349.761);\n    --color-pink-500: oklch(65.6% 0.241 354.308);\n    --color-pink-600: oklch(59.2% 0.249 0.584);\n    --color-pink-700: oklch(52.5% 0.223 3.958);\n    --color-pink-800: oklch(45.9% 0.187 3.815);\n    --color-pink-900: oklch(40.8% 0.153 2.432);\n    --color-pink-950: oklch(28.4% 0.109 3.907);\n\n    --color-rose-50: oklch(96.9% 0.015 12.422);\n    --color-rose-100: oklch(94.1% 0.03 12.58);\n    --color-rose-200: oklch(89.2% 0.058 10.001);\n    --color-rose-300: oklch(81% 0.117 11.638);\n    --color-rose-400: oklch(71.2% 0.194 13.428);\n    --color-rose-500: oklch(64.5% 0.246 16.439);\n    --color-rose-600: oklch(58.6% 0.253 17.585);\n    --color-rose-700: oklch(51.4% 0.222 16.935);\n    --color-rose-800: oklch(45.5% 0.188 13.697);\n    --color-rose-900: oklch(41% 0.159 10.272);\n    --color-rose-950: oklch(27.1% 0.105 12.094);\n\n    --color-slate-50: oklch(98.4% 0.003 247.858);\n    --color-slate-100: oklch(96.8% 0.007 247.896);\n    --color-slate-200: oklch(92.9% 0.013 255.508);\n    --color-slate-300: oklch(86.9% 0.022 252.894);\n    --color-slate-400: oklch(70.4% 0.04 256.788);\n    --color-slate-500: oklch(55.4% 0.046 257.417);\n    --color-slate-600: oklch(44.6% 0.043 257.281);\n    --color-slate-700: oklch(37.2% 0.044 257.287);\n    --color-slate-800: oklch(27.9% 0.041 260.031);\n    --color-slate-900: oklch(20.8% 0.042 265.755);\n    --color-slate-950: oklch(12.9% 0.042 264.695);\n\n    --color-gray-50: oklch(98.5% 0.002 247.839);\n    --color-gray-100: oklch(96.7% 0.003 264.542);\n    --color-gray-200: oklch(92.8% 0.006 264.531);\n    --color-gray-300: oklch(87.2% 0.01 258.338);\n    --color-gray-400: oklch(70.7% 0.022 261.325);\n    --color-gray-500: oklch(55.1% 0.027 264.364);\n    --color-gray-600: oklch(44.6% 0.03 256.802);\n    --color-gray-700: oklch(37.3% 0.034 259.733);\n    --color-gray-800: oklch(27.8% 0.033 256.848);\n    --color-gray-900: oklch(21% 0.034 264.665);\n    --color-gray-950: oklch(13% 0.028 261.692);\n\n    --color-zinc-50: oklch(98.5% 0 0);\n    --color-zinc-100: oklch(96.7% 0.001 286.375);\n    --color-zinc-200: oklch(92% 0.004 286.32);\n    --color-zinc-300: oklch(87.1% 0.006 286.286);\n    --color-zinc-400: oklch(70.5% 0.015 286.067);\n    --color-zinc-500: oklch(55.2% 0.016 285.938);\n    --color-zinc-600: oklch(44.2% 0.017 285.786);\n    --color-zinc-700: oklch(37% 0.013 285.805);\n    --color-zinc-800: oklch(27.4% 0.006 286.033);\n    --color-zinc-900: oklch(21% 0.006 285.885);\n    --color-zinc-950: oklch(14.1% 0.005 285.823);\n\n    --color-neutral-50: oklch(98.5% 0 0);\n    --color-neutral-100: oklch(97% 0 0);\n    --color-neutral-200: oklch(92.2% 0 0);\n    --color-neutral-300: oklch(87% 0 0);\n    --color-neutral-400: oklch(70.8% 0 0);\n    --color-neutral-500: oklch(55.6% 0 0);\n    --color-neutral-600: oklch(43.9% 0 0);\n    --color-neutral-700: oklch(37.1% 0 0);\n    --color-neutral-800: oklch(26.9% 0 0);\n    --color-neutral-900: oklch(20.5% 0 0);\n    --color-neutral-950: oklch(14.5% 0 0);\n\n    --color-stone-50: oklch(98.5% 0.001 106.423);\n    --color-stone-100: oklch(97% 0.001 106.424);\n    --color-stone-200: oklch(92.3% 0.003 48.717);\n    --color-stone-300: oklch(86.9% 0.005 56.366);\n    --color-stone-400: oklch(70.9% 0.01 56.259);\n    --color-stone-500: oklch(55.3% 0.013 58.071);\n    --color-stone-600: oklch(44.4% 0.011 73.639);\n    --color-stone-700: oklch(37.4% 0.01 67.558);\n    --color-stone-800: oklch(26.8% 0.007 34.298);\n    --color-stone-900: oklch(21.6% 0.006 56.043);\n    --color-stone-950: oklch(14.7% 0.004 49.25);\n\n    --color-black: #000;\n    --color-white: #fff;\n\n    --spacing: 0.25rem;\n\n    --breakpoint-sm: 40rem;\n    --breakpoint-md: 48rem;\n    --breakpoint-lg: 64rem;\n    --breakpoint-xl: 80rem;\n    --breakpoint-2xl: 96rem;\n\n    --container-3xs: 16rem;\n    --container-2xs: 18rem;\n    --container-xs: 20rem;\n    --container-sm: 24rem;\n    --container-md: 28rem;\n    --container-lg: 32rem;\n    --container-xl: 36rem;\n    --container-2xl: 42rem;\n    --container-3xl: 48rem;\n    --container-4xl: 56rem;\n    --container-5xl: 64rem;\n    --container-6xl: 72rem;\n    --container-7xl: 80rem;\n\n    --text-xs: 0.75rem;\n    --text-xs--line-height: calc(1 / 0.75);\n    --text-sm: 0.875rem;\n    --text-sm--line-height: calc(1.25 / 0.875);\n    --text-base: 1rem;\n    --text-base--line-height: calc(1.5 / 1);\n    --text-lg: 1.125rem;\n    --text-lg--line-height: calc(1.75 / 1.125);\n    --text-xl: 1.25rem;\n    --text-xl--line-height: calc(1.75 / 1.25);\n    --text-2xl: 1.5rem;\n    --text-2xl--line-height: calc(2 / 1.5);\n    --text-3xl: 1.875rem;\n    --text-3xl--line-height: calc(2.25 / 1.875);\n    --text-4xl: 2.25rem;\n    --text-4xl--line-height: calc(2.5 / 2.25);\n    --text-5xl: 3rem;\n    --text-5xl--line-height: 1;\n    --text-6xl: 3.75rem;\n    --text-6xl--line-height: 1;\n    --text-7xl: 4.5rem;\n    --text-7xl--line-height: 1;\n    --text-8xl: 6rem;\n    --text-8xl--line-height: 1;\n    --text-9xl: 8rem;\n    --text-9xl--line-height: 1;\n\n    --font-weight-thin: 100;\n    --font-weight-extralight: 200;\n    --font-weight-light: 300;\n    --font-weight-normal: 400;\n    --font-weight-medium: 500;\n    --font-weight-semibold: 600;\n    --font-weight-bold: 700;\n    --font-weight-extrabold: 800;\n    --font-weight-black: 900;\n\n    --tracking-tighter: -0.05em;\n    --tracking-tight: -0.025em;\n    --tracking-normal: 0em;\n    --tracking-wide: 0.025em;\n    --tracking-wider: 0.05em;\n    --tracking-widest: 0.1em;\n\n    --leading-tight: 1.25;\n    --leading-snug: 1.375;\n    --leading-normal: 1.5;\n    --leading-relaxed: 1.625;\n    --leading-loose: 2;\n\n    --radius-xs: 0.125rem;\n    --radius-sm: 0.25rem;\n    --radius-md: 0.375rem;\n    --radius-lg: 0.5rem;\n    --radius-xl: 0.75rem;\n    --radius-2xl: 1rem;\n    --radius-3xl: 1.5rem;\n    --radius-4xl: 2rem;\n\n    --shadow-2xs: 0 1px rgb(0 0 0 / 0.05);\n    --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n    --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n    --shadow-md:\n      0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n    --shadow-lg:\n      0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n    --shadow-xl:\n      0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);\n\n    --inset-shadow-2xs: inset 0 1px rgb(0 0 0 / 0.05);\n    --inset-shadow-xs: inset 0 1px 1px rgb(0 0 0 / 0.05);\n    --inset-shadow-sm: inset 0 2px 4px rgb(0 0 0 / 0.05);\n\n    --drop-shadow-xs: 0 1px 1px rgb(0 0 0 / 0.05);\n    --drop-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.15);\n    --drop-shadow-md: 0 3px 3px rgb(0 0 0 / 0.12);\n    --drop-shadow-lg: 0 4px 4px rgb(0 0 0 / 0.15);\n    --drop-shadow-xl: 0 9px 7px rgb(0 0 0 / 0.1);\n    --drop-shadow-2xl: 0 25px 25px rgb(0 0 0 / 0.15);\n\n    --text-shadow-2xs: 0px 1px 0px rgb(0 0 0 / 0.15);\n    --text-shadow-xs: 0px 1px 1px rgb(0 0 0 / 0.2);\n    --text-shadow-sm:\n      0px 1px 0px rgb(0 0 0 / 0.075), 0px 1px 1px rgb(0 0 0 / 0.075),\n      0px 2px 2px rgb(0 0 0 / 0.075);\n    --text-shadow-md:\n      0px 1px 1px rgb(0 0 0 / 0.1), 0px 1px 2px rgb(0 0 0 / 0.1),\n      0px 2px 4px rgb(0 0 0 / 0.1);\n    --text-shadow-lg:\n      0px 1px 2px rgb(0 0 0 / 0.1), 0px 3px 2px rgb(0 0 0 / 0.1),\n      0px 4px 8px rgb(0 0 0 / 0.1);\n\n    --ease-in: cubic-bezier(0.4, 0, 1, 1);\n    --ease-out: cubic-bezier(0, 0, 0.2, 1);\n    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);\n\n    --animate-spin: spin 1s linear infinite;\n    --animate-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;\n    --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n    --animate-bounce: bounce 1s infinite;\n\n    @keyframes spin {\n      to {\n        transform: rotate(360deg);\n      }\n    }\n\n    @keyframes ping {\n      75%,\n      100% {\n        transform: scale(2);\n        opacity: 0;\n      }\n    }\n\n    @keyframes pulse {\n      50% {\n        opacity: 0.5;\n      }\n    }\n\n    @keyframes bounce {\n      0%,\n      100% {\n        transform: translateY(-25%);\n        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n      }\n\n      50% {\n        transform: none;\n        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n      }\n    }\n\n    --blur-xs: 4px;\n    --blur-sm: 8px;\n    --blur-md: 12px;\n    --blur-lg: 16px;\n    --blur-xl: 24px;\n    --blur-2xl: 40px;\n    --blur-3xl: 64px;\n\n    --perspective-dramatic: 100px;\n    --perspective-near: 300px;\n    --perspective-normal: 500px;\n    --perspective-midrange: 800px;\n    --perspective-distant: 1200px;\n\n    --aspect-video: 16 / 9;\n\n    --default-transition-duration: 150ms;\n    --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    --default-font-family: --theme(--font-sans, initial);\n    --default-font-feature-settings: --theme(\n      --font-sans--font-feature-settings,\n      initial\n    );\n    --default-font-variation-settings: --theme(\n      --font-sans--font-variation-settings,\n      initial\n    );\n    --default-mono-font-family: --theme(--font-mono, initial);\n    --default-mono-font-feature-settings: --theme(\n      --font-mono--font-feature-settings,\n      initial\n    );\n    --default-mono-font-variation-settings: --theme(\n      --font-mono--font-variation-settings,\n      initial\n    );\n  }\n\n  /* Deprecated */\n  @theme default inline reference {\n    --blur: 8px;\n    --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n    --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);\n    --drop-shadow: 0 1px 2px rgb(0 0 0 / 0.1), 0 1px 1px rgb(0 0 0 / 0.06);\n    --radius: 0.25rem;\n    --max-width-prose: 65ch;\n  }\n}\n\n@layer base {\n  /*\n  1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n  2. Remove default margins and padding\n  3. Reset all borders.\n*/\n\n  *,\n  ::after,\n  ::before,\n  ::backdrop,\n  ::file-selector-button {\n    box-sizing: border-box; /* 1 */\n    margin: 0; /* 2 */\n    padding: 0; /* 2 */\n    border: 0 solid; /* 3 */\n  }\n\n  /*\n  1. Use a consistent sensible line-height in all browsers.\n  2. Prevent adjustments of font size after orientation changes in iOS.\n  3. Use a more readable tab size.\n  4. Use the user's configured `sans` font-family by default.\n  5. Use the user's configured `sans` font-feature-settings by default.\n  6. Use the user's configured `sans` font-variation-settings by default.\n  7. Disable tap highlights on iOS.\n*/\n\n  html,\n  :host {\n    line-height: 1.5; /* 1 */\n    -webkit-text-size-adjust: 100%; /* 2 */\n    tab-size: 4; /* 3 */\n    font-family: --theme(\n      --default-font-family,\n      ui-sans-serif,\n      system-ui,\n      sans-serif,\n      \"Apple Color Emoji\",\n      \"Segoe UI Emoji\",\n      \"Segoe UI Symbol\",\n      \"Noto Color Emoji\"\n    ); /* 4 */\n    font-feature-settings: --theme(\n      --default-font-feature-settings,\n      normal\n    ); /* 5 */\n    font-variation-settings: --theme(\n      --default-font-variation-settings,\n      normal\n    ); /* 6 */\n    -webkit-tap-highlight-color: transparent; /* 7 */\n  }\n\n  /*\n  1. Add the correct height in Firefox.\n  2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n  3. Reset the default border style to a 1px solid border.\n*/\n\n  hr {\n    height: 0; /* 1 */\n    color: inherit; /* 2 */\n    border-top-width: 1px; /* 3 */\n  }\n\n  /*\n  Add the correct text decoration in Chrome, Edge, and Safari.\n*/\n\n  abbr:where([title]) {\n    -webkit-text-decoration: underline dotted;\n    text-decoration: underline dotted;\n  }\n\n  /*\n  Remove the default font size and weight for headings.\n*/\n\n  h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    font-size: inherit;\n    font-weight: inherit;\n  }\n\n  /*\n  Reset links to optimize for opt-in styling instead of opt-out.\n*/\n\n  a {\n    color: inherit;\n    -webkit-text-decoration: inherit;\n    text-decoration: inherit;\n  }\n\n  /*\n  Add the correct font weight in Edge and Safari.\n*/\n\n  b,\n  strong {\n    font-weight: bolder;\n  }\n\n  /*\n  1. Use the user's configured `mono` font-family by default.\n  2. Use the user's configured `mono` font-feature-settings by default.\n  3. Use the user's configured `mono` font-variation-settings by default.\n  4. Correct the odd `em` font sizing in all browsers.\n*/\n\n  code,\n  kbd,\n  samp,\n  pre {\n    font-family: --theme(\n      --default-mono-font-family,\n      ui-monospace,\n      SFMono-Regular,\n      Menlo,\n      Monaco,\n      Consolas,\n      \"Liberation Mono\",\n      \"Courier New\",\n      monospace\n    ); /* 1 */\n    font-feature-settings: --theme(\n      --default-mono-font-feature-settings,\n      normal\n    ); /* 2 */\n    font-variation-settings: --theme(\n      --default-mono-font-variation-settings,\n      normal\n    ); /* 3 */\n    font-size: 1em; /* 4 */\n  }\n\n  /*\n  Add the correct font size in all browsers.\n*/\n\n  small {\n    font-size: 80%;\n  }\n\n  /*\n  Prevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\n  sub,\n  sup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n  }\n\n  sub {\n    bottom: -0.25em;\n  }\n\n  sup {\n    top: -0.5em;\n  }\n\n  /*\n  1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n  2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n  3. Remove gaps between table borders by default.\n*/\n\n  table {\n    text-indent: 0; /* 1 */\n    border-color: inherit; /* 2 */\n    border-collapse: collapse; /* 3 */\n  }\n\n  /*\n  Use the modern Firefox focus style for all focusable elements.\n*/\n\n  :-moz-focusring {\n    outline: auto;\n  }\n\n  /*\n  Add the correct vertical alignment in Chrome and Firefox.\n*/\n\n  progress {\n    vertical-align: baseline;\n  }\n\n  /*\n  Add the correct display in Chrome and Safari.\n*/\n\n  summary {\n    display: list-item;\n  }\n\n  /*\n  Make lists unstyled by default.\n*/\n\n  ol,\n  ul,\n  menu {\n    list-style: none;\n  }\n\n  /*\n  1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n  2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n      This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\n  img,\n  svg,\n  video,\n  canvas,\n  audio,\n  iframe,\n  embed,\n  object {\n    display: block; /* 1 */\n    vertical-align: middle; /* 2 */\n  }\n\n  /*\n  Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\n  img,\n  video {\n    max-width: 100%;\n    height: auto;\n  }\n\n  /*\n  1. Inherit font styles in all browsers.\n  2. Remove border radius in all browsers.\n  3. Remove background color in all browsers.\n  4. Ensure consistent opacity for disabled states in all browsers.\n*/\n\n  button,\n  input,\n  select,\n  optgroup,\n  textarea,\n  ::file-selector-button {\n    font: inherit; /* 1 */\n    font-feature-settings: inherit; /* 1 */\n    font-variation-settings: inherit; /* 1 */\n    letter-spacing: inherit; /* 1 */\n    color: inherit; /* 1 */\n    border-radius: 0; /* 2 */\n    background-color: transparent; /* 3 */\n    opacity: 1; /* 4 */\n  }\n\n  /*\n  Restore default font weight.\n*/\n\n  :where(select:is([multiple], [size])) optgroup {\n    font-weight: bolder;\n  }\n\n  /*\n  Restore indentation.\n*/\n\n  :where(select:is([multiple], [size])) optgroup option {\n    padding-inline-start: 20px;\n  }\n\n  /*\n  Restore space after button.\n*/\n\n  ::file-selector-button {\n    margin-inline-end: 4px;\n  }\n\n  /*\n  Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n*/\n\n  ::placeholder {\n    opacity: 1;\n  }\n\n  /*\n  Set the default placeholder color to a semi-transparent version of the current text color in browsers that do not\n  crash when using `color-mix(…)` with `currentcolor`. (https://github.com/tailwindlabs/tailwindcss/issues/17194)\n*/\n\n  @supports (not (-webkit-appearance: -apple-pay-button)) /* Not Safari */ or\n    (contain-intrinsic-size: 1px) /* Safari 17+ */ {\n    ::placeholder {\n      color: color-mix(in oklab, currentcolor 50%, transparent);\n    }\n  }\n\n  /*\n  Prevent resizing textareas horizontally by default.\n*/\n\n  textarea {\n    resize: vertical;\n  }\n\n  /*\n  Remove the inner padding in Chrome and Safari on macOS.\n*/\n\n  ::-webkit-search-decoration {\n    -webkit-appearance: none;\n  }\n\n  /*\n  1. Ensure date/time inputs have the same height when empty in iOS Safari.\n  2. Ensure text alignment can be changed on date/time inputs in iOS Safari.\n*/\n\n  ::-webkit-date-and-time-value {\n    min-height: 1lh; /* 1 */\n    text-align: inherit; /* 2 */\n  }\n\n  /*\n  Prevent height from changing on date/time inputs in macOS Safari when the input is set to `display: block`.\n*/\n\n  ::-webkit-datetime-edit {\n    display: inline-flex;\n  }\n\n  /*\n  Remove excess padding from pseudo-elements in date/time inputs to ensure consistent height across browsers.\n*/\n\n  ::-webkit-datetime-edit-fields-wrapper {\n    padding: 0;\n  }\n\n  ::-webkit-datetime-edit,\n  ::-webkit-datetime-edit-year-field,\n  ::-webkit-datetime-edit-month-field,\n  ::-webkit-datetime-edit-day-field,\n  ::-webkit-datetime-edit-hour-field,\n  ::-webkit-datetime-edit-minute-field,\n  ::-webkit-datetime-edit-second-field,\n  ::-webkit-datetime-edit-millisecond-field,\n  ::-webkit-datetime-edit-meridiem-field {\n    padding-block: 0;\n  }\n\n  /*\n  Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n  :-moz-ui-invalid {\n    box-shadow: none;\n  }\n\n  /*\n  Correct the inability to style the border radius in iOS Safari.\n*/\n\n  button,\n  input:where([type=\"button\"], [type=\"reset\"], [type=\"submit\"]),\n  ::file-selector-button {\n    appearance: button;\n  }\n\n  /*\n  Correct the cursor style of increment and decrement buttons in Safari.\n*/\n\n  ::-webkit-inner-spin-button,\n  ::-webkit-outer-spin-button {\n    height: auto;\n  }\n\n  /*\n  Make elements with the HTML hidden attribute stay hidden by default.\n*/\n\n  [hidden]:where(:not([hidden=\"until-found\"])) {\n    display: none !important;\n  }\n}\n\n@layer utilities {\n  @tailwind utilities;\n}\n\n@layer base {\r\n  :root {\r\n    --background: 0 0% 100%;\r\n    --foreground: 222.2 84% 4.9%;\r\n    --card: 0 0% 100%;\r\n    --card-foreground: 222.2 84% 4.9%;\r\n    --popover: 0 0% 100%;\r\n    --popover-foreground: 222.2 84% 4.9%;\r\n    --primary: 222.2 47.4% 11.2%;\r\n    --primary-foreground: 210 40% 98%;\r\n    --secondary: 210 40% 96%;\r\n    --secondary-foreground: 222.2 84% 4.9%;\r\n    --muted: 210 40% 96%;\r\n    --muted-foreground: 215.4 16.3% 46.9%;\r\n    --accent: 210 40% 96%;\r\n    --accent-foreground: 222.2 84% 4.9%;\r\n    --destructive: 0 84.2% 60.2%;\r\n    --destructive-foreground: 210 40% 98%;\r\n    --border: 214.3 31.8% 91.4%;\r\n    --input: 214.3 31.8% 91.4%;\r\n    --ring: 222.2 84% 4.9%;\r\n    --chart-1: 12 76% 61%;\r\n    --chart-2: 173 58% 39%;\r\n    --chart-3: 197 37% 24%;\r\n    --chart-4: 43 74% 66%;\r\n    --chart-5: 27 87% 67%;\r\n    --radius: 0.5rem;\r\n  }\r\n\r\n  .dark {\r\n    --background: 222.2 84% 4.9%;\r\n    --foreground: 210 40% 98%;\r\n    --card: 222.2 84% 4.9%;\r\n    --card-foreground: 210 40% 98%;\r\n    --popover: 222.2 84% 4.9%;\r\n    --popover-foreground: 210 40% 98%;\r\n    --primary: 210 40% 98%;\r\n    --primary-foreground: 222.2 47.4% 11.2%;\r\n    --secondary: 217.2 32.6% 17.5%;\r\n    --secondary-foreground: 210 40% 98%;\r\n    --muted: 217.2 32.6% 17.5%;\r\n    --muted-foreground: 215 20.2% 65.1%;\r\n    --accent: 217.2 32.6% 17.5%;\r\n    --accent-foreground: 210 40% 98%;\r\n    --destructive: 0 62.8% 30.6%;\r\n    --destructive-foreground: 210 40% 98%;\r\n    --border: 217.2 32.6% 17.5%;\r\n    --input: 217.2 32.6% 17.5%;\r\n    --ring: 212.7 26.8% 83.9%;\r\n    --chart-1: 220 70% 50%;\r\n    --chart-2: 160 60% 45%;\r\n    --chart-3: 30 80% 55%;\r\n    --chart-4: 280 65% 60%;\r\n    --chart-5: 340 75% 55%;\r\n  }\r\n}\n\n@layer base {\r\n  * {\r\n    @apply border-border;\r\n  }\r\n  body {\r\n    @apply bg-background text-foreground;\r\n  }\r\n}";
                    el.type = "text/css";
                    document.head.appendChild(el);
                })();