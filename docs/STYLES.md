# Styles

Next up we are going to add styles to our not-so-fancy-yet application. We are going to use [Sass](http://sass-lang.com/) as it's perhaps the most widely used **CSS preprocessor** (*and you should use one, as it helps you with managing your styles*).

### <a name="initialize">Initialize</a>

First we will again add some dependencies to our project
```
    yarn add -D node-sass sass-lint
```
to actually build **Sass** with [node-sass](https://github.com/sass/node-sass) and then lint it with [sass-lint](https://www.npmjs.com/package/sass-lint).

Next we'll create a `.sass-lint.yml` file to define the conventions for our **Sass**-files, you can check the available [rules here](https://github.com/sasstools/sass-lint/tree/master/docs/rules), but this is what I use
```yaml
options:
  merge-default-rules: false
rules:
  bem-depth:
    - 4
    - max-depth: 4
  class-name-format:
    - allow-leading-underscore: false
    - convention: hyphenatedbem
  declarations-before-nesting: true
  extends-before-declarations: true
```
from which the first command `merge-default-rules` indicates that I do not want to use the default rules as a basis, the second defines that for [BEM naming](http://getbem.com/naming/) the maximum depth is four, the third that I don't allow class names that start with an underscore and that they must follow `hyphenatedbem`-convention, the fourth that I want declarations to be before nesting and the last that extends must be bedore declarations.

### <a name="stylesscss">Styles.scss</a>

All of our style-sheets will live inside a folder `src/styles` and the first will be the "main"-stylesheet, called `styles.scss` (*`scss` is the **Sass** file extension*)
```scss
@import '_variables.scss';
@import 'index.scss';
@import 'button.scss';
@import 'todocomponent.scss';
@import 'loader.scss';

body {
    background-color: $tertiary-color;
    font-family: 'Roboto', sans-serif;
}
```
and at this point it only [imports](http://sass-lang.com/guide) our other (*soon-to-be-written stylesheets*) so that the compiler will know to bundle them all and sets two styles on our `body`, a `background-color` using the variable `$tertiary-color` (*more about variables in a bit*) and a `font-family` of `'Roboto'`, with a backup font of `sans-serif`. But wait, what is this `'Roboto'` you might ask? It is the main font of [Google's Material Design](https://material.io/) used in Android etc. and a very nice simple font. Now the way to be able to use it in our styles is to add the following line to the `head` element of our `index.html`
```html
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
```
which will include the font from Google's CDN.

### <a name="variables">Variables</a>

Next we will define those things we call `variables` in **Sass** in their own file called `_variables.scss`
```scss
// Colors
$primary-color: #343488;
$secondary-color: #5656AA;
$tertiary-color: #F0F0FF;
$modal-background: rgba(100, 100, 100, .8);
```
where the underscore in the beginning of the file name is just a convention to differentiate it from regular style files. Inside it we define four different colors (*using comments to define the variable "blocks" of colors, sizes etc. is just another convention*), a primary color, secondary color, tertiary color and a color for the background of a modal. All variables in **Sass** must begin with the dollar `$` sign.

### <a name="index">Index</a>

Next up is the styles for the `Index`-page, inside a file called `index.scss`
```scss
@import '_variables.scss';

.index {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    &__header {
        color: $primary-color;
    }

    &__form {
        align-items: inherit;
        display: flex;
        flex-direction: inherit;
        justify-content: inherit;

        &__label {
            margin-bottom: 5px;
        }

        &__input {
            background-color: inherit;
            border: 0;
            border-bottom: 1px solid $primary-color;
            margin-bottom: 10px;
            text-align: center;
            width: 250px;

            &:focus {
                border-bottom: 2px solid $secondary-color;
                outline: none;
            }
        }
    }

    &__todo-container {
        display: flex;
        flex-direction: inherit;
        justify-content: flex-start;
    }
}
```
where we introduce **nesting**. I will just explain the simplest use case so you understand what is happening
```scss
@import '_variables.scss';
.index {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    &__header {
        color: $primary-color;
    }
}
```
where we see that first we have defined a block for the class `index`, which styles the [flexbox](https://developer.mozilla.org/en/docs/Web/CSS/flex) properties for it. Inside we have another block, which starts with `&`, which is a special character in **Sass** as it translates the `&` ampersand to the parent block's selector. So the above would output as CSS something like this:
```css
.index {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.index__header {
    color: #343488;
}
```
> This shows us the power of **BEM** as it ties very nicely with the nesting in **Sass**

### <a name="button">Button</a>

In a file called `button.scss` we are going to write our styles for the `Button`-component
```scss
@import '_variables.scss';

.btn {
    background-color: $tertiary-color;
    border: 1px solid $primary-color;
    border-radius: 50%;
    cursor: pointer;
}
```
which are very simple, like the component itself.

### <a name="todocomponent">TodoComponent</a>

The styles for our `TodoComponent` will be set in a file called `todocomponent.scss`
```scss
@import '_variables.scss';

.todo {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;

    &__checkbox {
        cursor: pointer;
    }

    &__number {
        margin-left: 5px;
    }

    &__title {
        margin-left: 10px;
    }
}
```
which is a rather simple style as well, just a little **flexbox** in there.

### <a name="loader">Loader</a>

Now this is something a bit more interesting, we are going to make our `Loader`-component finally come to life, by creating the styles for it inside `loader.scss``
```scss
@import '_variables.scss';

.loader {
    animation: .8s fadein .2s linear forwards;
    background: $modal-background;
    height: 200vh;
    left: -50vw;
    opacity: 0;
    position: fixed;
    top: -50vh;
    width: 200vw;
    z-index: 1000;
    
    &__spinner:before {
        animation: spinner .6s linear infinite;
        border: 2px solid #cccccc;
        border-radius: 50%;
        border-top-color: #333333;
        box-sizing: border-box;
        content: '';
        height: 120px;
        left: 50%;
        margin-left: -60px;
        margin-top: -60px;
        position: fixed;
        top: 50%;
        width: 120px;
    }
}

@keyframes spinner {
    to {
        transform: rotate(360deg);
    }
}

@keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
```
and this might use some explaining. There are two major points of interest here, the first being [CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) and the second being [the `:before` selector](https://developer.mozilla.org/en/docs/Web/CSS/::before).

---

CSS animations are built by setting a value for `animation` inside the CSS selector
```css
.selector {
    animation: 1s name 2s linear forwards;
}
```
where the first variable (*optional*) is the delay for starting the animation, second is the name of the animation (*more about that in a bit*), third is the length of the animation, fourth is an [animation timing function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function) and the last one is [animation fill mode](https://developer.mozilla.org/en/docs/Web/CSS/animation-fill-mode).

Now the animation name has to match a [`@keyframes`](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) selector
```css
@keyframes name {
    from {
        opacity: 0;
    }
    50% {
        opacity: 0.5;
    }
    to {
        opacity: 1;
    }
}
```
where you define the style for the object being styled at different points of the animation (*any CSS style is valid here*). You can either specify those styles with percentages (*such as the 50% here*) or as the `from` and `to` selectors (*`from` for the first frame and `to` for the last one*) or mix them up.

---

The `:before` selector on the other hand is used to create a child (*it must have something set to it's `content` property to show*) for the element, that is used to create some kind of styling otherwise impossible to create, for example in our case the actual spinning element.

### <a name="scripts">Scripts</a>

Now that we have our styles set up, we need to include them in our application and to do that, we are going to set up two new scripts to our `package.json` and as we want to be able to refresh both the styles and the code while developing, we are going to add a new dependency called [concurrently](https://github.com/kimmobrunfeldt/concurrently)
```
    yarn add -D concurrently
```
which is a simple NPM tool for running multiple NPM (*or Yarn in this case*) scripts at the same time.

Now we modify and add to get styles, starting with the `develop`-script
```json
    "scripts": {
        "develop:sass": "mkdir -p dist/styles && node-sass -w -r src/styles -o dist/styles",
        "develop:client": "budo src/index.tsx:js/bundle.js --live --verbose -- -p tsify",
        "develop": "NODE_ENV=development concurrently -p \"[{name}]\" -n \"BUDO,SASS\" -c \"bgBlue,bgMagenta\" -k \"yarn run develop:client\" \"yarn run develop:sass\""
    }
```
where we renamed our old `develop` script into `develop:client` and created `develop:sass`, which uses the `watch` and `recursive` modes of `node-sass` to watch the `src/styles`-folder and output it to `dist/styles`. For the new `develop` script we use **concurrently** to run our `develop:client` and `develop:sass` at the same time, setting a prefix of `BUDO` and `SASS` in blue and magenta respectively (*try it out to see how it looks like*).
> Naming the scripts `something:subtask` is just another convention and you are free to do it another way


---

Now to get the `build`-script to also build our styles
```json
    "scripts": {
        "build:sass": "mkdir -p dist/styles && node-sass src/styles/styles.scss dist/styles/styles.css",
        "build:client": "mkdir -p dist/js && browserify src/index.tsx -p tsify > dist/js/bundle.js",
        "build": "yarn run build:sass && yarn run build:client",
    }
```
where we again rename our old `build`-script into `build:client` and then create a new script `build:sass`. Again we first make sure that the folder exists and then just build the **Sass**-files with **node-sass**'s default settings (*you can add compatibility and other plugins there as well*). The new `build`-script will simply first build the **Sass**-files and then the **TypeScript**-files.

### <a name="alternatives">Alternatives</a>

- [Less](http://lesscss.org/), another CSS preprocessor
- [Stylus](http://stylus-lang.com/), the "third" CSS preprocessor (*Sass and Less are older*)
- [PostCSS](http://postcss.org/), a CSS postprocessor
