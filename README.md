# forge-recipe-duplicator
Takes two Laravel Forge API keys and copies all recipes from one account to the other.

# Installation
`npm i`
`cp .env.example .env`

# Configuration
Have both users go to https://forge.laravel.com/user-profile/api and generate an API token.
Enter the API tokens for the target and the source account in the .env file.

# Run
`npm start`
