# @ricciodev/laravel-like-validation

A package for a Laravel-Like Validation structure on ExpressJS.

## Table of Contents

- [Installation](#installation)
- [Importing](#importing)
- [Basic Usage](#basic-usage)
    - [Creating a Validation Class](#creating-a-validation-class)
    - [Using Validation Rules](#using-validation-rules)
    - [Creating Middleware](#creating-middleware)
    - [Applying Middleware in ExpressJS](#applying-middleware-in-expressjs)

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
import { ValidationFactory, BaseValidator } from '@ricciodev/laravel-like-validation';
```

### CJS

```js
const { ValidationFactory, BaseValidator } = require('@ricciodev/laravel-like-validation');
```

## Basic Usage

### Creating a Validation Class

Create a new file `ArticlePostRequestValidation.ts`:

```ts
import BaseValidator from '@ricciodev/laravel-like-validation';

class ArticlePostRequestValidation extends BaseValidator {
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

### Creating Middleware

Create a new file `validationMiddleware.ts`:

```ts
import { ValidationFactory } from '@ricciodev/laravel-like-validation';
import ArticlePostRequestValidation from './ArticlePostRequestValidation';

const factory = new ValidationFactory();
const validator = new ArticlePostRequestValidation();

export const validationMiddleware = factory.make(validator);
```

### Applying Middleware in ExpressJS

In your ExpressJS route file, apply the middleware:

```js
import express from 'express';
import { validationMiddleware } from './validationMiddleware';

const app = express();
app.use(express.json());

app.post('/articles', validationMiddleware, (req, res) => {
        res.send('Article is valid!');
});

app.listen(3000, () => {
        console.log('Server is running on port 3000');
});
```

That's it! You now have a basic setup for using Laravel-like validation in your ExpressJS application.