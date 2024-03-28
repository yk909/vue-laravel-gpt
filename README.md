## About
ChatGPT clone, can work with Huggingface models. Made with:
-   Laravel
-   Vue 3
-   TailwindCSS (DaisyUI)

## Requirements
-   Docker
-   Composer (with PHP any version)

## Installation

```sh
# configure environment
cp .env.example .env

# install dependencies
composer install --ignore-platform-reqs

# start docker environment
vendor/bin/sail up -d

# install application
vendor/bin/sail composer install
vendor/bin/sail artisan key:generate
vendor/bin/sail bun install
vendor/bin/sail bun run build
```

## Configuration
You will need to set your credentials in the `.env` file:

```sh
 # Your api key (set any value if use localhost)
OPENAI_API_KEY="<your api key goes here>"
 # AI model to use
OPENAI_MODEL="gpt-3.5-turbo"
# Max requests per user per day (unlimited if empty)
OPENAI_LIMIT=20
```

If you want to use locally hosted AI model, you will need to configure the model in the [models](models/) folder. More details on official [localai documentation](https://localai.io/). You will need to change API URL in `.env` as well. You may use any value as API key:

```sh
OPENAI_API_KEY="blahblah"
OPENAI_BASE_URL="http://localai:8080/v1"
OPENAI_MODEL="tinyllama-chat"
```

## Access points
-   Application: http://localhost/
-   LocalAI API: http://localhost:8080/v1/
