# Laravel-Like Validation for ExpressJS

A package for a Laravel-Like Validation structure on ExpressJS.

## Installation

```sh
npm install @ricciodev/laravel-like-validation
```

## Usage

### Importing the Package
```js
import { Validation, ValidationSet, Validator, BaseRule, BaseValidationSet } from '@ricciodev/laravel-like-validation';
```

### Creating Custom Rules
You can create custom validation rules by extending the BaseRule class.

```js
import BaseRule from '@ricciodev/laravel-like-validation';

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

## Using Validation Sets
You can create custom validation sets by extending the BaseValidationSet class.

```js
import BaseValidationSet from '@ricciodev/laravel-like-validation';
import CustomRule from './CustomRule';

class CustomValidationSet extends BaseValidationSet {
    add(rule: BaseRule | BaseRule[]): void {
        if (Array.isArray(rule)) {
            rule.forEach(r => {
                this.rules[r.getName()] = r;
            });
        } else {
            this.rules[rule.getName()] = rule;
        }
    }
}

const validationSet = new CustomValidationSet();
validationSet.add(new CustomRule());
```

## Creating a Validator
You can create a custom validator by extending the Validator class.

```js
import Validator from '@ricciodev/laravel-like-validation';
import CustomValidationSet from './CustomValidationSet';

class CustomValidator extends Validator {

getRules() {
        return {
            body: {
                fieldName: 'required|min:3'
            }
        };
    }

    getMessages() {
        return {
            'fieldName.required': 'The fieldName is a required field.',
            'fieldName.min': 'The {field} must be at least {value} characters long.'
        };
    }

    getAttributes() {
        return {
            fieldName: 'Field Name'
        };
    }
}

export default new CustomValidator;
```

## Middleware Integration
You can use the Validation class to create middleware for ExpressJS.

```js
import express from 'express';
import Validation from '@ricciodev/laravel-like-validation';
import CustomValidator from './CustomValidator';

const app = express();
const validator = new CustomValidator();
const validation = new Validation(validator);

app.use(express.json());

app.post('/endpoint', validation.init(), (req, res) => {
    res.send('Validation passed!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

## License
This project is licensed under the MIT License