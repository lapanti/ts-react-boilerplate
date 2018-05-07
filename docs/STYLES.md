# Styles

Next up we are going to add styles to our not-so-fancy-yet application. We are going to use [Sass](http://sass-lang.com/) as it's perhaps the most widely used **CSS preprocessor** (*and you should use one, as it helps you with managing your styles*).

### Initialize

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
from which the first command `merge-default-rules` indicates that I do not want to use the default rules as a basis, the second defines that for [BEM naming](http://getbem.com/naming/) the maximum depth is four, the third that I don't allow class names that start with an underscore and that they must follow `hyphenatedbem`-convention, the fourth that I want style declarations to be before nested selectors and the last that possible [`@extend`](http://sass-lang.com/guide) must be before style declarations.

### Styles.scss

All of our style-sheets will live inside a folder `src/styles` and the first will be the "main"-stylesheet, called `styles.scss` (*`scss` is the **Sass** file extension*)
```scss
@import 'variables.scss';
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

### Variables

Next we will define those things we call `variables` in **Sass** in their own file called `variables.scss`
```scss
// Colors
$primary-color: #343488;
$secondary-color: #5656AA;
$tertiary-color: #F0F0FF;
$modal-background: rgba(100, 100, 100, .8);
```
where the underscore in the beginning of the file name is just a convention to differentiate it from regular style files. Inside it we define four different colors (*using comments to define the variable "blocks" of colors, sizes etc. is just another convention*), a primary color, secondary color, tertiary color and a color for the background of a modal. All variables in **Sass** must begin with the dollar `$` sign.

### HNClient

Next up is the styles for the `HNClient`-page, inside a file called `index.scss`
```scss
@import 'variables.scss';

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
@import 'variables.scss';
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
> This shows us one the uses of **BEM** as it ties very nicely with the nesting in **Sass**. You can read more about the reasoning behind **BEM** [here](http://getbem.com/faq/#why-bem), but the main point is that **BEM** is as modular and independent as most JavaScript modules, while keeping it similar for every developer.

### Button

In a file called `button.scss` we are going to write our styles for the `Button`-component
```scss
@import 'variables.scss';

.btn {
    background-color: $tertiary-color;
    border: 1px solid $primary-color;
    border-radius: 50%;
    cursor: pointer;
}
```
which are very simple, like the component itself.

### TodoComponent

The styles for our `TodoComponent` will be set in a file called `todocomponent.scss`
```scss
@import 'variables.scss';

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

### Loader

Now this is something a bit more interesting, we are going to make our `Loader`-component finally come to life, by creating the styles for it inside `loader.scss``
```scss
@import 'variables.scss';

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

### Scripts

Now that we have our styles set up, we need to include them in our application and to do that, we are going to update our **webpack** configurations and update our `index.tsx`-file a bit, beginning with the `index.tsx`-change, which is to add the following line as the last `import` statement:
```typescript
import './styles/styles.scss';
```
which is because **webpack** only bundles files related to the `entry`-file (*our `index.tsx`*).

---

To use **webpack** with **Sass** we need to first add a couple of new development dependencies, so go ahead and:
```
yarn add -D style-loader css-loader sass-loader extract-text-webpack-plugin
```
where [`sass-loader`](https://webpack.js.org/loaders/sass-loader/#src/components/Sidebar/Sidebar.jsx) compiles our **Sass** to **CSS**, [`css-loader`](https://webpack.js.org/loaders/css-loader/#src/components/Sidebar/Sidebar.jsx) allows **webpack** to process **CSS**, [`style-loader`](https://webpack.js.org/loaders/style-loader/#src/components/Sidebar/Sidebar.jsx) injects said **CSS** straight into the HTML (*faster for development*) and [`extract-text-webpack-plugin`](https://webpack.js.org/plugins/extract-text-webpack-plugin/#src/components/Sidebar/Sidebar.jsx) extracts our **CSS** into a single file when doing production builds.

For our development configuration we only need to add the following new rule to `webpack.dev.js`:
```javascript
    // ...
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
```
where we tell **webpack** to process our **Sass** through the described loaders (*from right to left*).

For our production build we need to do a few more changes into `webpack.prod.js`:
```javascript
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// ...
    module : {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            }
        ]
    },
    // ...
    plugins: [
        new ExtractTextPlugin(path.join('styles.css'))
    ]
```
where at first we use `extract-text-webpack-plugin` to extract all processed **Sass** and then in `plugins` we tell it to save them in a file called `styles.css`.

### Alternatives

- [Less](http://lesscss.org/), another CSS preprocessor
- [Stylus](http://stylus-lang.com/), the "third" CSS preprocessor (*Sass and Less are older*)
- [PostCSS](http://postcss.org/), a CSS postprocessor
