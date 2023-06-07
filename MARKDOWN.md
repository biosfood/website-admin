# Markdown extensions

When editing pages, there are a some additional functionalities implemented to make your life easier.

## Github flavored markdown

Pages support shorthands similar to the additions made on github markdown. [Here](https://gist.github.com/stevenyap/7038119) you can foind a guide to show some of the functionalities.

## Remark directives

Remark directives is a plugin to streamline the addition of custom components into markdown.

Use at least three `:::component` to start a component and the same number of colons to end the styled block.

For nested directives, the outer layer needs to have more colons than the inner layer.

### gridtable

The `gridtable` directive allows access to a NextUI grid component. All children of this component will be wrapped in a `<Grid>` element to create the correct layout.

To group multiple children into one grid cell, use a `:::div` directive to ensure all are inserted into a single HTML tag.

### row

The `row` directive is a shorthand access to a `flex container` in the horizonal direction and with the justify-items option `space-around` enabled. Use this to evenly space components horizontally.
