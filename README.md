# Performativ Full Stack Challenge

Creating a full stack Laravel/React CRUD app as detailed in "Performativ-Trial.pdf"

## To run locally

-   `git clone` the repo locally
-   inside root folder:
    -   install dependencies with `composer install`
    -   create and .env file from the .env.example
    -   set FINNHUB_KEY=<"insert your Finnhub key here after creation"> on your .env file (this can be obtained from https://finnhub.io/ )
    -   one off `php artisan migrate` to create the sqlite db from the models
    -   and then`php artisan serve` to start the backend server
-   inside /app-react-frontend:
    -   create and .env file from the .env.example
    -   install dependencies with `npm install`
    -   `npm run dev` to start the frontend server
    -   test the up locally on http://localhost:5173/

## Features Learned

-   CRUD App (MVC)
    -   Laravel Framework - 10.28.0
    -   React - 18.2.0
-   Signup/Login with middleware auth Larvel layer from scaffolding of `laravel new`
-   Commands for scaffolding classes: via: `php artisan`
    -   `php artisan make:migration` <migration_name>
    -   `php artisan make:model` <model_name> --seed (to add seeder class)
    -   `php artisan make:controller` <controller_name> --model=<model_name> --resource --requests --api
    -   `php artisan make:resource` <resource_name>
-   React commands and scaffolding setup:
    -   `npm create vite`
    -   cd into fronted <project_name>
    -   do as many as `npm install <package_name> -S` needed
    -   and then do `npm install`
-   Finnhub Integration:
    After considering a few financial data APIs, I wanted to try Finnhub: https://finnhub.io/ .
    It has generous free tiers on basic data endpoints and a wrapper api for several programming languages, (including PHP!, which is not that common...)
    After trying in 5 minutes in python successfully, I tried to integrate it with Laravel backend and things strated to go wrong. Surprisingly the wrapper API is still dependent on an old version of GuzzleHttp, that created a chain of conflicts just adding the package with: `composer require finnhub/client:1.1.17`

    I found a few people running into the same blocker and decided to point to one of their forks. Surprisingly even though some PR were raised to update the wrapper they were never merged and the PHP wrapper seems abandoned.
    manual changes to composer.json as below:

    "repositories" : [{"type": "git", "url": "https://github.com/dorqa95/finnhub-php"}],
    "require": {
    "php": "^8.1",
    "finnhub/client": "dev-master",
    "guzzlehttp/guzzle": "^7.2",
    "laravel/framework": "^10.10",
    "laravel/sanctum": "^3.2",
    "laravel/tinker": "^2.8"
    }

    and finally... `composer install`

-   Jest Testing stup:

    -   `npm install @testing-library/jest-dom @testing-library/react @testing-library/user-event jest jest-environment-jsdom vitest --save-dev`

    -   `npm i --save-dev @types/jest`

    -   changes to tsconfig.json:
        "types": ["node", "jest", "@testing-library/jest-dom"], under "compilerOptions"

    -   changes to setuptest.ts:
        import "@testing-library/jest-dom";

    *   changes to vite.config.ts:
        with defineConfig imported from vitest/config (instead of just vite)

    import { defineConfig } from 'vitest/config'
    import react from '@vitejs/plugin-react'

    // additional notes on how to configure vite: https://vitejs.dev/config/
    export default defineConfig({
    plugins: [react()],
    test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setuptest.ts"
    }
    })

    remember to wrap renders inside tests in some router from "react-router-dom"; like </MemoryRouter>

    finally inside /app-react-frontend: `npm run test` to keep the tests running in the background on another shell

-   PHP testing, this is more straightforward compared to React/Jest
    just on root level run: `php artisan test`

## Conclusions

-   React is a great frontend framework overall.
-   I am really not sure about PHP as a backend when it comes to data/financial applications.
    The main issue is that data/financial package availability is low and often not properly maintained.
