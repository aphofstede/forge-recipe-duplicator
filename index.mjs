import assert from 'assert/strict';
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()
const { SOURCE_API_TOKEN, TARGET_API_TOKEN } = process.env;
assert(!!SOURCE_API_TOKEN, 'Expected SOURCE_API_TOKEN environment variable to be set in .env file.');
assert(!!TARGET_API_TOKEN, 'Expected TARGET_API_TOKEN environment variable to be set in .env file.');

const apiUrl = 'https://forge.laravel.com/api/v1';
const srcHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${SOURCE_API_TOKEN}`,
}
const targetHeaders = {
  ...srcHeaders,
  Authorization: `Bearer ${TARGET_API_TOKEN}`,
}

// Log the users involved
const logUsername = async(headers, messageCb) => {
  try {
    const { data } = await axios.get(apiUrl + '/user', { headers });
    console.log(messageCb(data.user.name))
  } catch (error) {
    console.error('Failed to retrieve user name', error)
  }
}
await logUsername(targetHeaders, user => `About to add recipes to ${user}`);
await logUsername(srcHeaders, user => `Retrieving recipes for ${user}`);

const recipesUrl = apiUrl + '/recipes';
let recipes = [];
try {
  const { data } = await axios.get(recipesUrl, { headers: srcHeaders });
  recipes = data.recipes
} catch (error) {
  console.error('Failed to retrieve recipes', error)
}

try {
  await Promise.all(recipes.map((recipe) => {
    const { name, user, script } = recipe;
    console.log(`Inserting ${name}...`);
    return axios.post(recipesUrl, { name, user, script }, { headers: targetHeaders })
  }))
} catch (error) {
  console.error('Failed to add recipes', error)
}
