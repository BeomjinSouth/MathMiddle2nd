# Desmos API 문서 (원문 유지·마크다운 정리)


## 목차

* [Coordinates](#coordinates)

  * [GraphingCalculator.setMathBounds(bounds)](#graphingcalculatorsetmathboundsbounds)
  * [GraphingCalculator.graphpaperBounds](#graphingcalculatorgraphpaperbounds)
  * [GraphingCalculator.mathToPixels(coords)](#graphingcalculatormathtopixelscoords)
  * [GraphingCalculator.pixelsToMath(coords)](#graphingcalculatorpixelstomathcoords)
  * [Additional Examples](#additional-examples)
* [Managing Observers](#managing-observers)
* [Selection and Focus](#selection-and-focus)

  * [GraphingCalculator.focusFirstExpression()](#graphingcalculatorfocusfirstexpression)
  * [GraphingCalculator.openKeypad()](#graphingcalculatoropenkeypad)
  * [GraphingCalculator.isAnyExpressionSelected](#graphingcalculatorisanyexpressionselected)
  * [GraphingCalculator.selectedExpressionId](#graphingcalculatorselectedexpressionid)
  * [GraphingCalculator.removeSelected()](#graphingcalculatorremoveselected)
* [Colors](#colors)
* [Styles](#styles)
* [Font Sizes](#font-sizes)
* [Languages](#languages)
* [Accessibility](#accessibility)
* [Image uploads](#image-uploads)
* [Basic Calculators](#basic-calculators)

  * [FourFunctionCalculator](#constructor-fourfunctioncalculatorelement-options)
  * [ScientificCalculator](#constructor-scientificcalculatorelement-options)
  * [BasicCalculator 메서드/이벤트](#basiccalculator-메서드이벤트)
* [Mathquill](#mathquill)
* [Release cycle](#release-cycle)
* [Community](#community)
* [API Keys](#api-keys)
* [Self-hosting the API](#self-hosting-the-api)
* [Collected Examples](#collected-examples)

---

## Coordinates

### GraphingCalculator.setMathBounds(bounds)

**Updates the math coordinates of the graphpaper bounds.** `bounds` **must be an object with** `left`, `right`, `bottom`, **and** `top` **properties.**

If invalid bounds are provided (`bounds.right <= bounds.left`, `bounds.top <= bounds.bottom`), the graphpaper bounds will not be changed.

**Example:**

```js
// Only show the first quadrant
calculator.setMathBounds({
  left: 0,
  right: 10,
  bottom: 0,
  top: 10
});
```

This function does not return any value.

---

### GraphingCalculator.graphpaperBounds

The **graphpaperBounds observable property** gives the bounds of the graphpaper in both math coordinates and pixel coordinates. It is an object with the following structure:

```json
{
  "mathCoordinates": {
    "top": Number,
    "bottom": Number,
    "left": Number,
    "right": Number,
    "width": Number,
    "height": Number
  },
  "pixelCoordinates": {
    "top": Number,
    "bottom": Number,
    "left": Number,
    "right": Number,
    "width": Number,
    "height": Number
  }
}
```

`pixelCoordinates` are referenced to the top left of the calculator's parent DOM element — that is, the element that is passed into the `GraphingCalculator` constructor. **Note that** `pixelCoordinates.top < pixelCoordinates.bottom`, **but** `mathCoordinates.top > mathCoordinates.bottom`.

**Observing** the `graphpaperBounds` property allows being notified whenever the graphpaper is panned or zoomed.

**Example:**

```js
calculator.observe('graphpaperBounds', function () {
  var pixelCoordinates = calculator.graphpaperBounds.pixelCoordinates;
  var mathCoordinates = calculator.graphpaperBounds.mathCoordinates;

  var pixelsPerUnitY = pixelCoordinates.height / mathCoordinates.height;
  var pixelsPerUnitX = pixelCoordinates.width / mathCoordinates.width;

  console.log('Current aspect ratio: ' + pixelsPerUnitY / pixelsPerUnitX);
});
```

---

### GraphingCalculator.mathToPixels(coords)

**Convert math coordinates to pixel coordinates.** `coords` is an object with an `x` property, a `y` property, or both. **Returns** an object with the same properties as `coords`.

---

### GraphingCalculator.pixelsToMath(coords)

**Convert pixel coordinates to math coordinates.** Inverse of `mathToPixels`.

**Examples:**

```js
// Find the pixel coordinates of the graphpaper origin:
calculator.mathToPixels({ x: 0, y: 0 });

// Find the math coordinates of the mouse
var calculatorRect = calculatorElt.getBoundingClientRect();
document.addEventListener('mousemove', function (evt) {
  console.log(
    calculator.pixelsToMath({
      x: evt.clientX - calculatorRect.left,
      y: evt.clientY - calculatorRect.top
    })
  );
});
```

---

### Additional Examples:

* Observe `calculator.graphpaperBounds` to keep external labels synced with the graphpaper: `examples/graphpaper-bounds.html`
* Translate clicks to math coordinates to add points to a table: `examples/click-table.html`

---

## Managing Observers

The calculator exposes several objects with **observable properties** that may be accessed via an `observe` method. The first argument to `observe` is a **property string**, and the second is a **callback** to be fired when the property changes. The attached callback represents an **observer** for that property. Multiple observers can be added to a single property.

In general, calling `.unobserve(property)` removes all of the observers created with `.observe(property)`. It is also possible to use **namespaced property strings** when creating observers so that they can be **removed individually**.

**Example:**

```js
// Add three different observers to the 'xAxisLabel' property
calculator.settings.observe('xAxisLabel.foo', callback1);
calculator.settings.observe('xAxisLabel.bar', callback2);
calculator.settings.observe('xAxisLabel.baz', callback3);

// Stop firing `callback2` when the x-axis label changes
calculator.settings.unobserve('xAxisLabel.bar');

// Remove the two remaining observers
calculator.settings.unobserve('xAxisLabel');
```

See `examples/managing-observers.html` for a live example.

`GraphingCalculator.observeEvent` and `GraphingCalculator.unobserveEvent` behave in the same way as `observe` and `unobserve`, respectively. The only difference is that, while `observe` is always associated with a property of an object that is being updated, `observeEvent` is used to **listen for global calculator events** (currently just `'change'`). Calculator events can be namespaced in the same way that properties can. For instance, binding a callback to `'change.foo'` would make it possible to remove a single observer with `GraphingCalculator.unobserveEvent('change.foo')`.

---

## Selection and Focus

When an expression in the calculator is **selected**, its corresponding curve is highlighted. Expressions may be selected even when the expressions list is not present. Currently, only one expression may be selected at a time, but in the future it may be possible to select more than one expression.

When an expression is **focused**, a cursor appears in it in the expressions list, allowing the expression to be updated with the keypad or a keyboard. A focused expression is always selected, but an expression may be selected without being focused. Only one expression can be focused at a time.

### GraphingCalculator.focusFirstExpression()

Focus the first expression in the expressions list. Note that the first expression isn't focused by default because if the calculator is embedded in a page that can be scrolled, the browser will typically scroll the focused expression into view at page load time, which may not be desirable.

### GraphingCalculator.openKeypad()

Open the calculator keypad. An expression must be focused for the keypad to be open, so if no expression is focused, this method will focus the first expression. If the onscreen keypad is already open, this method has no effect.

If the calculator is configured with `keypad: false`, this method will ensure that some expression is focused but will not display the keypad.

### GraphingCalculator.isAnyExpressionSelected

**Boolean observable property**, `true` when an expression is selected, `false` when no expression is selected.

### GraphingCalculator.selectedExpressionId

Observable property that holds the **id of the currently selected expression**, or `undefined` when no expression is selected.

### GraphingCalculator.removeSelected()

Remove the selected expression. **Returns** the id of the expression that was removed, or `undefined` if no expression was selected.

See `examples/remove-selected.html` for an example.

---

## Colors

Colors are chosen from a default list of 6 colors. These are available through the `Colors` object.

**Name ↔ Hex String**

| Name            | Hex String |
| --------------- | ---------- |
| `Colors.RED`    | `#c74440`  |
| `Colors.BLUE`   | `#2d70b3`  |
| `Colors.GREEN`  | `#388c46`  |
| `Colors.PURPLE` | `#6042a6`  |
| `Colors.ORANGE` | `#fa7e19`  |
| `Colors.BLACK`  | `#000000`  |

You may also specify colors as a property on the options object in the constructor, which will override the default color palette. `colors` must be an object whose values are strings representing valid CSS color values. As a convenience, a calculator instance's current color palette can be accessed via `Calculator.colors`.

You can choose the color of a new expression explicitly by setting its `color` property.

Note that the ability to override the color palette means that graph states saved in one environment may contain colors not found in another environment. For instance, loading a graph state created with the default palette will yield a graph with colors that are not accessible from your customized color menu in the UI. The best solution is to load only those graphs created in an environment using your custom colors.

Alternatively, we provide you two ways to handle this problem when calling `Calculator.setState`. You may either load the state with the saved colors as-is, or you may **coerce unavailable colors to their perceptually closest counterparts** in your `Calculator.colors` object ("perceptually closest" in the sense of nearest in the Lab color space). See the section on `setState` for more information.

**Examples:**

```js
calculator.setExpression({
  id: '1',
  latex: 'y=x',
  color: Desmos.Colors.BLUE
});

calculator.setExpression({
  id: '2',
  latex: 'y=x + 1',
  color: '#ff0000'
});

calculator.setExpression({
  id: '3',
  latex: 'y=sin(x)',
  color: calculator.colors.customBlue
});
```

For a live example see `examples/colors.html`.

---

## Styles

Drawing styles for points and curves may be chosen from a set of predefined values, which are available through the `Styles` object.

**For points:**

* `Desmos.Styles.POINT`
* `Desmos.Styles.OPEN`
* `Desmos.Styles.CROSS`
* `Desmos.Styles.SQUARE`
* `Desmos.Styles.PLUS`
* `Desmos.Styles.TRIANGLE`
* `Desmos.Styles.DIAMOND`
* `Desmos.Styles.STAR`

**For curves:**

* `Desmos.Styles.SOLID`
* `Desmos.Styles.DASHED`
* `Desmos.Styles.DOTTED`

**Examples:**

```js
// Make a dashed line
calculator.setExpression({
  id: 'line',
  latex: 'y=x',
  lineStyle: Desmos.Styles.DASHED
});

// Make a point that looks like a cross
calculator.setExpression({
  id: 'pointA',
  latex: 'A=(1,2)',
  pointStyle: Desmos.Styles.CROSS
});

// Point B will render as a hole
calculator.setExpression({
  id: 'pointB',
  latex: 'B=(2,4)',
  pointStyle: Desmos.Styles.OPEN
});
```

---

## Font Sizes

Though the calculator's `fontSize` property can be set to any numeric value, we provide a set of predefined font sizes for convenience. These are available through the `FontSizes` object.

**Name ↔ Pixel Value**

| Name                   | Pixel Value |
| ---------------------- | ----------- |
| `FontSizes.VERY_SMALL` | `9`         |
| `FontSizes.SMALL`      | `12`        |
| `FontSizes.MEDIUM`     | `16`        |
| `FontSizes.LARGE`      | `20`        |
| `FontSizes.VERY_LARGE` | `24`        |

You can set the base font size for the calculator through the `updateSettings` method.

**Examples:**

```js
calculator.updateSettings({ fontSize: Desmos.FontSizes.LARGE });

calculator.updateSettings({ fontSize: 11 });
```

---

## Languages

The calculator's display language can be set to any of our supported languages using the `updateSettings` method. **Languages are not provided by default**, but they may be requested from the `api/` endpoint via a `lang` URL parameter. The requested translations are bundled into `calculator.js` before it is returned, and those languages become available to any calculator instance in the page. (If you are self-hosting the API code and are interested in using languages other than English, contact `partnerships@desmos.com` for more information.)

To inspect the available languages at runtime, we expose a `Desmos.supportedLanguages` property that provides an array of language codes suitable for passing into `Calculator.updateSettings`.

Note that the level of translation coverage varies somewhat by language, but translations are regularly added and improved. **Available languages are:**

| Language              | Code    |
| --------------------- | ------- |
| German                | `de`    |
| English (U.S.)        | `en`    |
| Spanish               | `es`    |
| Estonian              | `et`    |
| French                | `fr`    |
| Indonesian            | `id`    |
| Italian               | `it`    |
| Japanese              | `ja`    |
| Korean                | `ko`    |
| Dutch                 | `nl`    |
| Polish                | `pl`    |
| Portuguese (Brazil)   | `pt-BR` |
| Russian               | `ru`    |
| Swedish               | `sv-SE` |
| Thai                  | `th`    |
| Turkish               | `tr`    |
| Vietnamese            | `vi`    |
| Chinese (Simplified)  | `zh-CN` |
| Chinese (Traditional) | `zh-TW` |

**Examples:**

```html
<!-- Include Spanish translations -->
<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=[YOUR_API_KEY_HERE]&lang=es"></script>

<!-- Include Spanish and French translations -->
<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=[YOUR_API_KEY_HERE]&lang=es,fr"></script>

<!-- Include all available translations -->
<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=[YOUR_API_KEY_HERE]&lang=all"></script>
```

```js
// Inspect available languages
Desmos.supportedLanguages; // ['en', 'es', 'fr']

// Set a calculator instance to French
calculator.updateSettings({ language: 'fr' });
```

See `examples/languages.html` to see this example live or to try out this example on your page, read about **getting your own API key**.

---

## Accessibility

In service of our mission to help everybody grow with math, we strive to make our tools accessible to the widest possible audience. See our accessibility documentation to learn about features that help enable broad access.

The default calculator configurations represent our current best thinking about how to make the calculator accessible to everyone. **Changing certain options can have important accessibility implications**, which API consumers should consider carefully.

* **settingsMenu:** The settings menu contains controls for making items in the calculator easier to see, such as the display size of items in the expressions list and on the graph paper, as well as reverse contrast mode. It also contains the controls for switching Braille modes. When setting this option to `false`, you should provide alternate methods for users to set `projectorMode`, `reverseContrast`, and `brailleMode`.
* **brailleControls:** Setting this option to `false` means that users will not be able to set the Braille mode through the settings menu or with keyboard shortcuts. When setting this option to `false`, you should provide a way for users to set `brailleMode` externally. Be aware that some users may find it valuable to switch back and forth between a Braille mode and visually typeset math as they are using the calculator, so we recommend supporting keyboard shortcuts for switching between modes.
* **audio:** Disabling graph sonification means that a user who has difficulty seeing the graph paper will not be able to get auditory information about the shape of the graph. When setting this option to `false`, you should have a plan for accommodating people who use sound to access graphical information.
* **graphDescription:** When setting this value to an empty string, a user of software such as a screen reader may lack important information about the layout, bounds, and visible features of the graph paper. Take care that an alternative method for obtaining important graph information is readily available in your application.

Desmos has developed a library called **Abraham** for translating between LaTeX and the Braille math codes **Nemeth** and **UEB**. If you would like to use this library, please contact us at `partnerships@desmos.com`.

---

## Image uploads

By default, users can upload images to use on graphs by either dragging images to the expressions list, or selecting "Image" from the "Add Expression" menu.

Image uploads can be disabled by passing `{images: false}` as a constructor option.

When users upload images, **image data will be stored inline** with graph states as **data URLs**. Graph states that contain inline images are typically much larger than other graph states.

An alternative is available that can significantly **reduce the size** of graph states that contain images by storing the images separately so that only the image URL is stored in the state. To enable this behavior, specify `{imageUploadCallback: function (file, cb) {/*...*/}}` as a constructor option.

The `imageUploadCallback` function will be called whenever a user uploads an image file. The first argument is a `File` object that you should serialize to a location with a publicly accessible URL. The second argument is a callback with the signature `cb(err, url)` that should be called with either an error or the URL of the serialized image.

When storing images remotely, it is important that they are either served from the same domain as the page that the calculator is displayed on, or that proper **CORS Access-Control-Allow-Origin** headers are set to allow the images to be loaded on a different domain.

The default `imageUploadCallback` function is provided as `Desmos.imageFileToDataURL(file, cb)` as a convenience. It will covert the file to a **data URL**, taking EXIF orientation headers into account and recompressing large images. The passed callback will be called with either an error as the first argument, or the data URL as a second argument.

**Example:**

```js
function imageUploadCallback(file, cb) {
  Desmos.imageFileToDataURL(file, function (err, dataURL) {
    if (err) {
      cb(err);
      return;
    }

    // Send the data to your server, and arrange for your server to
    // respond with a URL
    $.post('https://example.com/serialize-image', { imageData: dataURL }).then(
      function (msg) {
        cb(null, msg.url);
      }, // Success, call the callback with a URL
      function () {
        cb(true);
      } // Indicate that an error has occurred
    );
  });
}

Desmos.GraphingCalculator(elt, { imageUploadCallback: imageUploadCallback });
```

For a working example, see `examples/image-upload-callback.html`.

---

## Basic Calculators

In addition to the graphing calculator, Desmos offers a **four function calculator** and a **scientific calculator**. The four function and scientific calculators are created in a similar way to the graphing calculator, and support a **subset of its functionality**.

Note that access to the **four-function calculator**, **scientific calculator**, and **geometry tool** must be separately enabled per API key. You can see which features are enabled for your API key by reading `Desmos.enabledFeatures`. Calling a constructor for a feature that is not enabled is an error.

**Examples:**

```js
// All features enabled
Desmos.enabledFeatures ===
  {
    GraphingCalculator: true,
    FourFunctionCalculator: true,
    ScientificCalculator: true,
    GeometryCalculator: true
  };

// Only graphing calculator enabled
Desmos.enabledFeatures ===
  {
    GraphingCalculator: true,
    FourFunctionCalculator: false,
    ScientificCalculator: false,
    GeometryCalculator: false
  };
```

### constructor FourFunctionCalculator(element, \[options])

Creates a four function calculator object to control the calculator embedded in the DOM element specified by `element`.

`options` is an optional object that specifies features that should be included or excluded.

**Options**

| name                  | default    | description                                                                                                                                                                                          |
| --------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `links`               | `true`     | Allow external hyperlinks (e.g. to braille examples)                                                                                                                                                 |
| `additionalFunctions` | `['sqrt']` | Picks the extra function(s) that appear in the top bar. Maximum 2, minimum 1. Options include `'exponent'`, `'percent'`, `'fraction'`, and `'sqrt'`. Pass in a single string or an array of strings. |
| `fontSize`            | `16`       | Base font size.                                                                                                                                                                                      |
| `invertedColors`      | `false`    | Display the calculator with an inverted color scheme.                                                                                                                                                |
| `settingsMenu`        | `true`     | Display the settings menu. See Accessibility Notes.                                                                                                                                                  |
| `language`            | `'en'`     | Language. See the Languages section for more information.                                                                                                                                            |
| `brailleMode`         | `'none'`   | Set the input and output Braille code for persons using refreshable Braille displays. Valid options are `'nemeth'`, `'ueb'`, or `'none'`.                                                            |
| `sixKeyInput`         | `false`    | Allow users to write six-dot Braille characters using the Home Row keys (S, D, F, J, K, and L). Requires that `brailleMode` be `'nemeth'` or `'ueb'`.                                                |
| `projectorMode`       | `false`    | Display the calculator in a larger font.                                                                                                                                                             |
| `decimalToFraction`   | `false`    | When true, users are able to toggle between decimal and fraction output in evaluations if Desmos detects a good rational approximation.                                                              |
| `capExpressionSize`   | `false`    | Limit the size of an expression to 500 LaTeX tokens and a maximum nesting depth of 30                                                                                                                |

For a working example see `examples/four-function-with-percent.html`.

### constructor ScientificCalculator(element, \[options])

Creates a scientific calculator object to control the calculator embedded in the DOM element specified by `element`.

`options` is an optional object that specifies features that should be included or excluded.

**Options**

| name                        | default  | description                                                                                                                                                                                                             |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `links`                     | `true`   | Allow external hyperlinks (e.g. to braille examples)                                                                                                                                                                    |
| `qwertyKeyboard`            | `true`   | Display the keypad in QWERTY layout (false shows an alphabetical layout)                                                                                                                                                |
| `degreeMode`                | `false`  | When true, trig functions assume arguments are in degrees. Otherwise, arguments are assumed to be in radians.                                                                                                           |
| `fontSize`                  | `16`     | Base font size.                                                                                                                                                                                                         |
| `invertedColors`            | `false`  | Display the calculator with an inverted color scheme.                                                                                                                                                                   |
| `settingsMenu`              | `true`   | Display the settings menu. See Accessibility Notes.                                                                                                                                                                     |
| `language`                  | `'en'`   | Language. See the Languages section for more information.                                                                                                                                                               |
| `brailleMode`               | `'none'` | Set the input and output Braille code for persons using refreshable Braille displays. Valid options are `'nemeth'`, `'ueb'`, or `'none'`.                                                                               |
| `sixKeyInput`               | `false`  | Allow users to write six-dot Braille characters using the Home Row keys (S, D, F, J, K, and L). Requires that `brailleMode` be `'nemeth'` or `'ueb'`.                                                                   |
| `brailleExpressionDownload` | `true`   | Allows the user to export a Braille rendering of the expression list. Requires that `brailleMode` be `'nemeth'` or `'ueb'`.                                                                                             |
| `projectorMode`             | `false`  | Display the calculator in a larger font.                                                                                                                                                                                |
| `decimalToFraction`         | `true`   | When true, users are able to toggle between decimal and fraction output in evaluations if Desmos detects a good rational approximation.                                                                                 |
| `capExpressionSize`         | `false`  | Limit the size of an expression to 500 LaTeX tokens and a maximum nesting depth of 30                                                                                                                                   |
| `functionDefinition`        | `true`   | Allow function definition, i.e. `f(x) = 2x`                                                                                                                                                                             |
| `autosize`                  | `true`   | Determine whether the calculator should automatically resize whenever there are changes to element's dimensions. If set to `false` you will need to explicitly call `.resize()` in certain situations. See `.resize()`. |

**Examples:**

```js
var elt1 = document.getElementById('four-function-calculator');
var calculator1 = Desmos.FourFunctionCalculator(elt1);

var elt2 = document.getElementById('scientific-calculator');
var calculator2 = Desmos.ScientificCalculator(elt2);
```

The object returned is a `Desmos.BasicCalculator` object, which exposes the following methods and observable events:

### BasicCalculator 메서드/이벤트

* `BasicCalculator.getState()`
* `BasicCalculator.setState(state, [options])`
* `BasicCalculator.setBlank([options])`
* `BasicCalculator.undo()`
* `BasicCalculator.redo()`
* `BasicCalculator.clearHistory()`
* `BasicCalculator.resize()`
* `BasicCalculator.focusFirstExpression()`
* `BasicCalculator.observeEvent('change', function () {/.../})`
* `BasicCalculator.unobserveEvent('change')`
* `BasicCalculator.destroy()`

The methods and events above function exactly as described for the graphing calculator. The `updateSettings` method is more limited in that it only supports a subset of the options available in the graphing calculator.

**BasicCalculator.updateSettings(\[options])**

Updates the current calculator settings. This method behaves identically to the graphing calculator method, except the properties available for updating are limited to the basic calculator options.

For working examples of the four function and scientific calculators, see

* `examples/fourfunction.html`
* `examples/scientific.html`

---

## Mathquill

Inside of the Desmos Calculator, we use **mathquill** for all of our equation rendering. We even use mathquill to render all of the math in this documentation. We're basically big fans of Mathquill. You can visit Mathquill at **[www.mathquill.com](http://www.mathquill.com)**.

---

## Release cycle

New stable versions of the calculator API are released once per year in April. At any given time, there is an **experimental preview version**, a **stable version** that is recommended for production, and **older versions are frozen**.

* **Experimental:** The embedded calculator exposed through the API will track changes to the [www.desmos.com](http://www.desmos.com) calculator in real time. In the Experimental version, we may make breaking changes to the API methods and to the calculator’s appearance at any time. The experimental version will generally be available for public preview and comment, but should not be used in production because of the possibility of breaking changes.
* **Stable:** When a version of the API is stabilized, we will commit to not making any breaking changes to the API methods, and the embedded calculator will stop tracking changes to the [www.desmos.com](http://www.desmos.com) calculator. We think that it’s important that the visual appearance of the embedded calculator will not change once an API version is stabilized, because this gives our partners precise control over the appearance of their site. Important bug fixes that do not break compatibility are backported from Experimental to Stable.
* **Frozen:** When a new version of the API is stabilized, the previous Stable version will become Frozen. This means that no future changes will be made to it, and it will not receive bug fixes. Partners are encouraged to migrate from Frozen versions to the Stable version in order to keep receiving bug fixes.

---

## Community

We manage a pair of google groups for announcements and discussion of the API:

* **desmos-api-announce:** Official announcements of releases and previews of the API. This is a low volume list, and will only have a handful of posts per year. We recommend that all clients subscribe to stay up to date with new releases.
* **desmos-api-discuss:** General discussion and questions about the API. Posts to this group are open to the public.

---

## API Keys

In order to include the Desmos API in your page, you must supply an **API key** as a URL parameter, like this:

```html
<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=[YOUR_API_KEY_HERE]"></script>
```

To obtain your own API key, visit **desmos.com/my-api**.

---

## Self-hosting the API

Desmos partners have the option to either host the API on their own servers or load it from desmos.com accessed via the API key. The functionality available in the Desmos tools is the same in either case. Self-hosting gives partners the ability to have total separation in terms of infrastructure and privacy, as well as the option to use the tools without a network connection. Visit **desmos.com/my-api** to learn more about partnership options.

---

## Collected Examples

* `examples/parabola.html`
* `examples/fullscreen.html`
* `examples/screenshot.html`
* `examples/async-screenshot.html`
* `examples/mousemove.html`
* `examples/graphsettings.html`
* `examples/slider-bounds.html`
* `examples/column-properties.html`
* `examples/graphpaper-bounds.html`
* `examples/click-table.html`
* `examples/helper.html`
* `examples/remove-selected.html`
* `examples/mirror-state.html`
* `examples/secret-folders.html`
* `examples/fourfunction.html`
* `examples/scientific.html`
* `examples/default-state.html`
* `examples/managing-observers.html`
* `examples/languages.html`
* `examples/colors.html`
* `examples/image-upload-callback.html`
* `examples/dynamic-labels.html`
* `examples/four-function-with-percent.html`
