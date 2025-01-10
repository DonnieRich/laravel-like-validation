# Laravel-Like Validation for ExpressJS

A package for a Laravel-Like Validation structure on ExpressJS.

## Installation

```sh
npm install @ricciodev/laravel-like-validation
```

## Usage

### Importing the Package

#### ESM
```typescript
import { Validation, ValidationSet, BaseValidator, BaseRule, BaseValidationSet, ValidationFactory } from '@ricciodev/laravel-like-validation';
```

#### CommonJS
```js
const { Validation, ValidationSet, BaseValidator, BaseRule, BaseValidationSet, ValidationFactory } = require('@ricciodev/laravel-like-validation');
```

### Using ValidationFactory to Create Middleware

You can use the `ValidationFactory` to create middleware for ExpressJS.

#### Example

First, create a custom validator by extending the `BaseValidator` class. Please note the validation rules are separated by a pipe ```|```.
An array sintax is also available and recommended for advanced use.

```typescript
// filepath: /c:/typescript/laravel-like-validation/src/CustomValidator.ts
import BaseValidator from '@ricciodev/laravel-like-validation';

class CustomValidator extends BaseValidator {
    getRules() {
        return {
            body: {
                fieldName: 'required|min:3'
            }
        };
    }

    getMessages() {
        return {
            'fieldName.required': 'The fieldName is required.',
            'fieldName.min': 'The fieldName must be at least 3 characters long.'
        };
    }

    getAttributes() {
        return {
            fieldName: 'Field Name'
        };
    }
}

export default CustomValidator;
```

Next, use the ValidationFactory to create middleware:

```typescript
// MiddlewareValidationMaker.js
import { ValidationFactory } from '@ricciodev/laravel-like-validation';
import CustomValidator from './CustomValidator';

const factory = new ValidationFactory();

export default {
    customValidator: factory.make(CustomValidator),
}
```

Finally apply the middleware on your route:

```typescript
import express from 'express';
import { customValidator } from './MiddlewareValidationMaker';

const app = express();

app.use(express.json());

app.post('/endpoint', customValidator, (req, res) => {
    res.send('Validation passed!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

### Creating Custom Rules
You can apply your custom rules directly in the getRules method by defining a callback or by instantiating a custom rule extending the BaseRule abstract class.

#### Example
Example of a Validator Using a Callback as a Validation Rule. Please note the array syntax for the validation rules.

```js
class CustomRequestValidation extends BaseValidator {

    getRules() {
        return {
            body: {
                tags: ['required', 'is_array', (data, key, fail) => {

                    if (Array.isArray(data[key])) {

                        const emptyTag = data[key].some(tag => tag.trim() === '');

                        if (emptyTag) {

                            fail({
                                body: {
                                    [key]: {
                                        'empty-items': 'Tags cannot have empty items'
                                    }
                                }
                            })

                        }
                    }

                }]
            }
        }
    }

}
```

Please note the callback accept three arguments: the data under validation, the key corresponding to the field under validation and a fail callback that will pass the validation error to the correct method.

Also note the fail argument must be an object and the first property should be the relative element under validation (body, params or query).
Inside this object there is the property corresponding to the current field under validation (in this example is tags).
Here we can add the custom error for this validation: a property that will be the name of the error and a value corresponding to the message showed to the user.


You can create custom validation rules by extending the BaseRule class:

```typescript
import { BaseRule } from '@ricciodev/laravel-like-validation';

class CustomRule extends BaseRule {
    error = 'Custom error message';

    validate(data: { [s: string]: any }, field: string, value?: any): boolean {
        // Custom validation logic
        return true;
    }

    message(field: string, message: string = '', value?: any) {
        return {
            name: this.getName(),
            message: this.generateMessage({ field, value }, message)
        };
    }
}

export default CustomRule;
```

Then add this rule to the CustomValidation. Please note the array syntax for the validation rules.

```typescript
import BaseValidator from '@ricciodev/laravel-like-validation';
import CustomRule from './CustomRule';

class CustomRequestValidation extends BaseValidator {

    getRules() {
        return {
            body: {
                tags: ['required', 'is_array', new CustomRule()]
            }
        }
    }

}
```

### Add Custom Rules to the Validation Set

If a custom rule will be used on many validators is possible to add it directly in the Validation Set with all the other rules already availables.

## License
This project is licensed under the MIT License