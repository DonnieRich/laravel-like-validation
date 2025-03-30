# @ricciodev/laravel-like-validation

A package for a Laravel-Like Validation structure on ExpressJS.

## Table of Contents

- [Installation](#installation)
- [Importing](#importing)
- [Basic Usage](#basic)
    - [Use the Validation Facade class](#use-the-validation-facade-class)
    - [Apply the Middleware in ExpressJS](#apply-the-middleware-in-expressjs)
- [Validation errors](#validation-errors)
- [Custom validation errors](#custom-validation-errors)
- [Custom field name](#custom-field-name)
- [Validated data](#validated-data)
- [Advanced](#advanced)
    - [withValidationSet](#withvalidationset)
    - [withValidationError](#withvalidationerror)
    - [doNotThrow](#donotthrow)
    - [Create a Validation Class](#create-a-validation-class)
    - [Create the Middleware](#create-the-middleware)
- [Available validations](#available-validations)
    - [Next steps](#next-steps)

## Installation

### npm

```sh
npm install @ricciodev/laravel-like-validation
```

### yarn

```sh
yarn add @ricciodev/laravel-like-validation
```

## Importing

### ESM

```js
import { ValidationFacade } from '@ricciodev/laravel-like-validation';
```

### CJS

```js
const { ValidationFacade } = require('@ricciodev/laravel-like-validation');
```

## Basic

You can validate the following request fields: body, query and params.
For any of these fields you can specify the input you want to validate and the rules to apply.

To apply the rules you can choose between `string` and `array` syntax:
```js

// rules as string
{
    body: {
        title: 'required|min:5'
    }
}

// rules as array
{
    body: {
        title: ['required', 'min:5']
    }
}
```

The advantage of the `array` syntax is that enables you to pass custom validation rules.
You can pass them as anonymous functions.
The first argument is the whole `data` received, the second argument is an object containing the `current` validation (`body`, `query` or `params`) and the `key` is the field beign validated.
The last argument is the `fail` callback. To this callback you should pass one argument representing the validation error.

```js

{
    body: {
        title: ['required', (data, { current, key }, fail) => {

            const emptyTag = data[key].some(tag => tag.trim() === '');

            if (emptyTag) {
                fail({ [current]: { [key]: { 'empty-items': 'Tags cannot have empty items' } } });
            }

        }]
    }
}
```

You can also use the `BaseRule` class to create a custom validation rule. In this case you should define the `error` property with the validation error to return.
In this string you can use placeholders. Make sure to call the `generateMessage` method passing an object with properties matching the placeholder names, as first argument.

The validate method should return a `boolean` value to notify if the validation check passed or failed.

Defining rules this way is great for reducing code duplication. You can register your custom rules inside the `ValidationSet` as described in the [Advanced](#advanced) -> [withValidationSet](#withvalidationset) section.

```js
const { BaseRule } = require('@ricciodev/laravel-like-validation')

export default class Uppercase extends BaseRule {

    error = "The {field} field must be all in uppercase"

    validate(data, field) {
        const text = data[field] ?? '';
        return text.toUpperCase() === data[field];
    }

    message(field, message = '') {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message)
        }
    }

}
```

### Use the Validation Facade class

Create a new file `ArticlePostRequestValidation.ts`:

```ts
import { ValidationFacade } from '@ricciodev/laravel-like-validation';

const rules = {
    body: {
        title: 'required|max:255',
        content: 'required'
    }
};

const ArticlePostRequestValidation = ValidationFacade.make(rules);

export default ArticlePostRequestValidation;
```

### Apply the Middleware in ExpressJS

In your ExpressJS route file, apply the middleware:

```js
import express from 'express';
import ArticlePostRequestValidation from './ArticlePostRequestValidation';

const app = express();
app.use(express.json());

app.post('/articles', ArticlePostRequestValidation, (req, res) => {
        res.send('Article is valid!');
});

app.listen(3000, () => {
        console.log('Server is running on port 3000');
});
```

That's it! You now have a basic setup for using Laravel-like validation in your ExpressJS application.

## Validation errors

The errors have the following structure (based on the previous example):

```js
{
    status: 422,
    errors: {
        body: {
            title: {
                max: 'The title must have a max length of 255'
            },
            content: {
                required: 'The content field is required'
            }
        }
    },
    validated: {}
}
```

## Custom validation errors

You can define a `messages` object to customize the error message for the specific validation. You can pass this as the second parameter to the `make` method.

```js
const messages = {
    'title.required': 'Please add a title.',
    'title.max': 'Be sure the title is no longer than 255 characters.',
    'content.required': 'Please provide the content.'
};

const ArticlePostRequestValidation = ValidationFacade.make(rules, messages);
```

Based on the type of validation used, you can also use the `{field}` and `{value}` placeholder to customize the error message.
The following example gives the exact same result of the previous code snippet, but this time the error will always be coherent with the value provided in the validation.
```js
const messages = {
    'title.required': 'Please add a title.',
    'title.max': 'Be sure the title is no longer than {value} characters.',
    'content.required': 'Please provide the content.'
};

const ArticlePostRequestValidation = ValidationFacade.make(rules, messages);
```

## Custom field name

You can also define `attributes` to customize the field name in the error message and pass them as the third parameter to the `make` method.

```js
const attributes = {
    'title': 'Post title',
    'content': 'Post content'
};

const ArticlePostRequestValidation = ValidationFacade.make(rules, messages, attributes);
```

## Validated data

If the validation passes the validated, you will find a `result` field inside `req.locals`. This makes them available to the next middleware/controller in the callback chain.
As you can see there is also an `errors` field if you decide to use the advanced method described in the [doNotThrow](#donotthrow) section.

```js
result: {
    errors: {},
    validated: {
        body: {
            title: "Hello World",
            content: "This is a test"
        }
    }
}
```

## Advanced

For advanced needs you can use the ValidationFactory.
This class has the following methods that can be chained before calling `make()`.

### withValidationSet

The `withValidationSet` method accept an `IValidationSet` instance for a custom validation set. `ValidationSet` is the default class and already implements all the basic
validation rules and an `add()` method for adding new custom rules extending the `BaseRule` class.
If you want to create your custom rules and make them available for every validation, you can extend the `ValidationSet` and register the new rules using the `add()` method.

### withValidationError

The `withValidationError` method accept a `typeof ValidationError`. This way you can customize the error object used by the `ValidationHandler`.

### doNotThrow

The `doNotThrow` is a method that gives you more control on what should happen if the validation fails. If called before the `make()` method instructs the `ValidationHandler` to not throw an exception on a failed validation and to continue with the regular middleware chain in Express.
This means you can then handle the errors inside the next middleware/controller.

### Create a Validation Class

Create a new file `ArticlePostRequestValidation.ts`:

```ts
import BaseValidation from '@ricciodev/laravel-like-validation';

class ArticlePostRequestValidation extends BaseValidation {
    rules() {
            return {
                    body: {
                            title: 'required|max:255',
                            content: 'required'
                    }
            };
    }

    messages() {
            return {
                    'title.required': 'The title field is required.',
                    'title.max': 'The title may not be greater than 255 characters.',
                    'content.required': 'The content field is required.'
            };
    }
}

export default ArticlePostRequestValidation;
```

### Create the Middleware

Create a new file `validationMiddleware.ts`:

```ts
import { ValidationFactory } from '@ricciodev/laravel-like-validation';
import ArticlePostRequestValidation from './ArticlePostRequestValidation';

const factory = new ValidationFactory();
const validator = new ArticlePostRequestValidation();

export const validationMiddleware = factory.make(validator);
```

You can then apply this middleware in the ExpressJS route, as seen before.

## Available validations

This is a list of all available validations

### is_array

Check if the field is an array.
Usage:

```js
body: {
    tags: 'is_array'
}
```

### Next steps