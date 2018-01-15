# webpack

Now as we have everything necessary for our application, it's time to get it working!

### Initialize

We'll begin by installing a "couple" of new dependencies
```
yarn add -D webpack webpack-dev-server source-map-loader react-hot-loader copy-webpack-plugin babel babel-cli babel-core babel-loader babel-preset-env awesome-typescript-loader html-webpack-plugin
```
from which [webpack](https://webpack.js.org/) is a very powerful tool for bundling and configuration, [webpack-dev-server](https://webpack.js.org/configuration/dev-server/#src/components/Sidebar/Sidebar.jsx) is a lightweight server to host client code, [source-map-loader](https://webpack.js.org/loaders/source-map-loader/#src/components/Sidebar/Sidebar.jsx) to allow errors and other messages to be pointed to the right source code lines while developing, [react-hot-loader](https://github.com/gaearon/react-hot-loader) to allow for [Hot Module Replcement (HMR)](https://webpack.js.org/concepts/hot-module-replacement/), [copy-webpack-plugin](https://webpack.js.org/plugins/copy-webpack-plugin/#src/components/Sidebar/Sidebar.jsx) to copy our `index.html` over to **webpack**'s process, [babel](https://babeljs.io) and it's plugins to speed up our process and [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader) to use **webpack** with **TypeScript**. Finally we also add [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) to generate an `index.html` for us in the build phase.

---

First we need a couple of configuration files for **webpack** to get started. (*There are a few ways to have multiple different configurations for **webpack** simultaneously and the way I do it here is just one of them.*) Begin by creating a file in your root folder called `webpack.config.js`, which will look like this:
```javascript
module.exports = function(env) {
    return require('./webpack.' + env + '.js');
}
```
This file is simply a way to call one configuration file from our script and provide it with an environment variable that will call the corresponding configuration.

---

To actually use **Babel** we need to give it a simple configuration inside our root folder within a file called `.babelrc`:
```json
{
  "presets": ["babel-preset-env"],
  "plugins": ["react-hot-loader/babel"]
}
```
where the `presets` gives us automatic compilation down to ES5 via [`babel-preset-env`](https://github.com/babel/babel/tree/master/packages/babel-preset-env) and the `plugins` allows **Babel** to work together with our **Hot Module Replacement**.

### Development

For our development configuration we will need another file in our root folder, called `webpack.dev.js` so create the file and type in the following:
```javascript
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:9966',
        'webpack/hot/only-dev-server',
        path.resolve(__dirname, 'src', 'index.tsx')
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist', 'js'),
        publicPath: '/'
    },
    devtool: 'source-map',
    devServer: {
        hot: true,
        contentBase: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
            {
                test: /\.tsx?$/,
                use: ['react-hot-loader/webpack', 'awesome-typescript-loader'],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new CopyWebpackPlugin([{ from: path.resolve(__dirname, 'index.html') }]),
        new webpack.EnvironmentPlugin({ 'NODE_ENV': 'development' }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};
```

Now there is a lot to digest, but we'll go through the sections one by one.

The first section after `module.exports` (*which just tells JavaScript that when this file is called, we want the following lines to be called*), `context`, simply gives our configuration a location context to work in, in this case `__dirname`, which is a variable **Node.JS** gives us to point to our current location.

The second section gets a little more interesting, `entry`, which contains a few lines of strings. The first tells **webpack** to use the `patch`-mode from `react-hot-loader`, meaning that we do not have to refresh the whole page when something changes in our code, only the affected parts will be updated. The second line `webpack-dev-server/client?http://localhost:9966` tells webpack where we want our `webpack-dev-server` to run (*in this case inside port `9966`*). The third line `webpack/hot/only-dev-server` tells `webpack-dev-server` that we want to do **HMR**. Finally the fourth line `path.resolve(__dirname, 'src', 'index.tsx')` is the most important one, as it tells *webpack* where our application actually starts from, a.k.a. the *entry* file.

The third section, `output` tells **webpack** where we want our compiled and bundled code to come out to. The first line `filename` tells **webpack** to store our bundled file as `bundle.js`. The second line configures the location for our `bundle.js` under `path`, in this case a folder `js` inside `dist`. Finally the [`publicPath`](https://webpack.js.org/guides/public-path/) variable sets the base path for all assets (such as images and stylesheets) for your application, in this case the same as the context folder.

The fourth section [`devtool`](https://webpack.js.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx) is a simple section, which sets if and how source maps are generated, in our case, using `source-map-loader`.

The fifth section [`devServer`](https://webpack.js.org/configuration/dev-server/) allows configuration for the development server. `hot` defines whether we want **HMR** or not (in our case yes), `contentBase` tells the server where to serve content from, in this case the `dist`-folder. `publicPath` defines where our files are accessible from the browser, in this case from the root. `historyApiFallback` will allow the server to serve `index.html` even if any other path is requested, as is the case when using **react-router**.

The sixth section [`module`](https://webpack.js.org/configuration/module/) defines how different types of files are processed. In our case we have two different `rules`, one for **JavaScript** files and one for **TypeScript** files. The one for **TypeScript** files consists of a `test`, to see whether we want to use this rule or not, a `use`, meaning which loaders to use and an `exclude`, to determine excluded files. The **JavaScript** `rule` is `enforce`d as  `pre`, meaning it'll come into affect for files coming out of other rules (*a.k.a. our compiled **TypeScript** files*) and will be passed through to `source-map-loader`.

The seventh section [`resolve`](https://webpack.js.org/configuration/resolve/) allows us to define `extensions` that will be resolved automatically. This means that in our source code when we `import` a file that ends in `.tsx`, `.ts` or `.js` we don't need to write the file extension type.

The final section [`plugins`](https://webpack.js.org/configuration/plugins/) allows for customization of the **webpack** build process. The line `new CopyWebpackPlugin([{ from: path.resolve(__dirname, 'index.html') }])` copies our `index.html` to the same folder as our `bundle.js`. `new webpack.EnvironmentPlugin({ 'NODE_ENV': 'development' })` sets the [`NODE_ENV`](https://dzone.com/articles/what-you-should-know-about-node-env) environment variable to `development` so our code is not minimized. [`new webpack.HotModuleReplacementPlugin()`](https://webpack.js.org/plugins/hot-module-replacement-plugin/) enables **HMR**. [`new webpack.NamedModulesPlugin()`](https://webpack.js.org/plugins/named-modules-plugin/) shows the relative path of modules when using **HMR** and [`new webpack.NoEmitOnErrorsPlugin()`](https://webpack.js.org/plugins/no-emit-on-errors-plugin/) will ensure no errors are emitted when calling non-existent assets in development.

---

Now that we have our configuration file for the development process, we need to write a script for it, so head on over to your `package.json`-file and add the following lines to `scripts`:
```json
    // ...
    "scripts": {
        "clean": "rm -rf dist",
        "develop": "yarn clean && webpack-dev-server -d --env=dev --colors --port 9966",
    }
```
where `clean` removes our build folder and after that `develop` starts our development server inside port `9966` so go ahead and run it `yarn develop` and open up `http://localhost:9966` inside your browser.

### Production

Next up we want to build our application to be hosted on the Internet, so we begin by creating a configuration file for webpack to use with `production` called `webpack.prod.js` (in our root folder):
```javascript
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: path.resolve('src', 'index.tsx'),
    output: {
        filename: 'bundle.js',
        path: path.resolve('dist', 'assets')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader', 'awesome-typescript-loader'],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
};
```

The first two sections are very similar to our `development`-configuration, as the `context` is the same, and from `entry` we have simply removed the lines related to **HMR**.

The third section `output` also has the same filename as before, but we have now changed the path where bundled assets should be stored.

For the fourth section `module` we have removed the `source-map-loader` and replaced the `react-hot-loader` in **TypeScript** files with `babel-loader`.

The fifth section `resolve` is identical to our development configuration and for the final section `plugins` we have removed most of the plugins and added the `HtmlWebpackPlugin` which will create an `index.html` for us. We have also set the `NODE_ENV` environment variable to `production`.

---

Now that our configuration is complete, we need to make a script to actually build our files, so add the following line to your `package.json` inside the `scripts`-key:
```json
    // ...
    "scripts": {
        // ...
        "build": "yarn clean && webpack -d --env=prod --colors"
    }
```
where we first delete our previous builds and then build again with the environment for `production`.

### Alternatives

- An alternative for **webpack** is [browserify](http://browserify.org/), which I like more (as it is simpler and all configuration is in the scripts), but it does not have all the features I prefer, such as HMR with TypeScript