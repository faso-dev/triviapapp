# Backend - Trivia API

## Setting up the Backend

### Install Dependencies

1. **Python 3.7** - Follow instructions to install the latest version of python for your platform in
   the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

2. **Virtual Environment** - We recommend working within a virtual environment whenever using Python for projects. This
   keeps your dependencies for each project separate and organized. Instructions for setting up a virual environment for
   your platform can be found in
   the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

3. **PIP Dependencies** - Once your virtual environment is setup and running, install the required dependencies by
   navigating to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

#### Key Pip Dependencies

- [Flask](http://flask.pocoo.org/) is a lightweight backend microservices framework. Flask is required to handle
  requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use to handle the lightweight SQL
  database. You'll primarily work in `app.py`and can reference `models.py`.

- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross-origin requests
  from our frontend server.

### Set up the Database

With Postgres running, create a `trivia` database:

```bash
createdb trivia
```

Populate the database using the `trivia.psql` file provided. From the `backend` folder in terminal run:

```bash
psql trivia < trivia.psql
```

### Run the Server

From within the `backend` directory first ensure you are working using your created virtual environment.

To run the server, execute:

```bash
flask run --reload
```

### Api endpoints documentation

`GET '/api/questions'`

- Fetches a dictionary of questions, number of total questions, current category, and categories.
- Request Arguments:
    - `page`: The number of questions to return.
- Returns : A dictionary with the following keys:
    - `questions`: A list of questions.
    - `total_questions`: The total number of questions.
    - `current_category`: The current category.
    - `categories`: A dictionary of categories.

    ```json
    {
      "questions": [
        {
          "id": 1,
          "category": "1",
          "difficulty": 5,
          "question": "In the &quot;The Legend of Zelda&quot; series, what is the name of the &quot;Master Sword&quot;?",
          "answer": "Master Sword"
        }
      ],
      "categories": {
        "1": "The Legend of Zelda"
      },
      "total_questions": 1,
      "current_category": "1",
      "success": true
    }
    ```

`POST '/api/questions'`

- Adds a new question.
- Request Arguments:
    - `question`: The question text.
    - `answer`: The answer text.
    - `category`: The category ID.
    - `difficulty`: The difficulty level.
- Returns : A dictionary with this format:

    ```json
    {
      "id": 1,
      "category": "1",
      "difficulty": 5,
      "question": "In the &quot;The Legend of Zelda&quot; series, what is the name of the &quot;Master Sword&quot;?",
      "answer": "Master Sword"
    }
    ```

- Errors :
    - 422: If the request data is invalid.
    - 400: If there is an error adding the question.

`DELETE '/api/questions/:id'`

- Deletes a question.
- Request Arguments:
    - `id`: The ID of the question to delete.
- Returns : No returns
- Errors :
    - 404: If the question does not exist.
    - 422: If the request data is invalid.
    - 400: If there is an error deleting the question.

`POST '/api/questions/search'`

- Searches for questions.
- Request Arguments:
    - `searchTerm`: The search term.
- Returns : A list of questions that match the search term.

    ```json
    {
      "questions": [
        {
          "id": 1,
          "category": "1",
          "difficulty": 5,
          "question": "In the &quot;The Legend of Zelda&quot; series, what is the name of the &quot;Master Sword&quot;?",
          "answer": "Master Sword"
        }
      ],
      "categories": {
        "1": "The Legend of Zelda"
      },
      "total_questions": 1,
      "current_category": "1",
      "success": true
    }
    ```

`GET '/api/categories/<int\:category_id>/questions'`

- Fetches a list of questions based on the category.
- Request Arguments:
    - `category_id`: The category ID.
- Returns : A list of questions that match the category.

    ```json
    {
      "questions": [
        {
          "id": 1,
          "category": "1",
          "difficulty": 5,
          "question": "In the &quot;The Legend of Zelda&quot; series, what is the name of the &quot;Master Sword&quot;?",
          "answer": "Master Sword"
        }
      ],
      "categories": {
        "1": "The Legend of Zelda"
      },
      "total_questions": 1,
      "current_category": "1",
      "success": true
    }
    ```

`POST '/api/quizzes'`

- Starts a quiz.
- Request Arguments:
    - `previous_questions`: A list of previous questions.
    - `quiz_category`: The quiz category.
- Return a random question within the given category and that is not one of the previous questions.
  
  ```json
  {
    "id": 1,
    "category": "1",
    "difficulty": 5,
    "question": "In the &quot;The Legend of Zelda&quot; series, what is the name of the &quot;Master Sword&quot;?",
    "answer": "Master Sword"
  }
  ```

- Errors :
    - 404: If the category does not exist.
    - 422: If the request data is invalid.
    - 400: If there is an error starting the quiz.

- Errors :
    - 422: If the request data is invalid.
    - 404: If there are no questions that match the search term.

`GET '/api/categories'`

- Fetches a dictionary of categories in which the keys are the ids and the value is the corresponding string of the
  category
- Request Arguments: None
- Returns: An object with a single key, `categories`, that contains an object of `id: category_string` key: value pairs.

    ```json
    {
      "1": "Science",
      "2": "Art",
      "3": "Geography",
      "4": "History",
      "5": "Entertainment",
      "6": "Sports"
    }
    ```

`POST '/api/categories'`

- Create a new category
- Request Arguments:
    - `type`: The category name.

    ```json
    {
      "type": "New Category"
    }
    ```

- Returns: An object of `id: number, type: category_string` key: value pairs.

    ```json
    {
      "id": 1,
      "type": "New Category"
    }
    
    ```

- Errors:
    - 422: If the `type` key is an empty string
    - 422: If the `type` key is not provided
    - 400: If the database fails to create a new category

    ```json
    {
      "1": "Science",
      "2": "Art",
      "3": "Geography",
      "4": "History",
      "5": "Entertainment",
      "6": "Sports"
    }
    ```

## Testing

So we have a lot of endpoints to test. We will test them with the following commands:

- First, be sure to create database and tables before running the tests.

    ```bash
    dropdb trivia_test
    createdb trivia_test
    psql trivia_test < trivia.psql
    ```

- Then, run the tests.

    ```bash
    python test_flaskr.py
    ```

### Stand out points

- Add a small custom validator for request data (utils dir)
- Add endpoints to create a new category
- Add tests for the new endpoint
- Add services for categories and questions processing (services dir)
- Add a custom json abort error handler for data validation errors(utils dir)
- Add app.py to the project root directory

### Resources

- [Flask documentation](http://flask.pocoo.org/docs/0.12/quickstart/)
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/quickstart/)
- [StackOverflow check if key exist in list of dicts](https://stackoverflow.com/questions/14790980/how-can-i-check-if-key-exists-in-list-of-dicts-in-python)