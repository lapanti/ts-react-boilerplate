# Structure

All source code in our application will live in a folder called `src`.
`src`-folder will mainly contain other folders (which we will go through in a moment) and the main entry files for both server-side rendering and the application itself.

Always remember though that this structure is not set in stone and you can modify it as much as you want to, this has mainly proven a good structure in previous projects.

The full architecture will look something like this:
```
src/
-- common/
-- components/
-- modules/
-- redux/
-- styles/
-- index.tsx
-- server.tsx
package.json
// And all the other configuration files
```
## Common

In this folder we will have common files needed by modules and components alike, such as classes to define information needed in multiple places. We dive more deeply into it [here](/docs/COMMON.md).

## Components

In this folder we will have common components, such as buttons, links and inputs. A deeper dive can be found [here](/docs/COMPONENTS.md).

## Modules

In this folder we will have all modules, which can basically be thought of as pages (or parts of pages) and their functionalities. This will consist of [views](/docs/VIEWS.md), [containers](/docs/CONTAINERS.md) and [reducers](/docs/REDUCERS.md).

## Redux

In this folder we will have common redux files, such as a store, utilities etc. A deeper dive can be found [here](/docs/REDUX.md).

## Styles

In this folder we will include all the stylesheets for the application. A deeper dive can be found [here](/docs/STYLES.md).

## Tests

Tests for each file will be contained in a folder called `__specs__` in the same directory as the file itself. You can read more about testing [here](/docs/TESTS.md)
