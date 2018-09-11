# node-security

## Checking if "use strict" is enabled

The fact that this inside a function called in the global context will not point to the global object can be used to detect strict mode:

```
> echo '"use strict"; var isStrict = (function() { return !this; })(); console.log(isStrict);' | node
true
> echo 'var isStrict = (function() { return !this; })(); console.log(isStrict);' | node
false
> echo 'var isStrict = (function() { return !this; })(); console.log(isStrict);' | node --use_strict
true
```

To enforce `use strict` globally, run your application with `node --use_strict`.


## save-exact

Force the dependencies saved in the `package.json` to have the exact version (without the `~` or `^`). 

```bash
$ yarn add express --exact
```
