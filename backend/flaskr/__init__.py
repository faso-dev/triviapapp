import random

from flask import Flask, request, abort, jsonify
from flask_cors import CORS, cross_origin
from models import setup_db
from services.category_service import get_categories_order_by_id_desc, create_and_persist_category
from services.question_service import get_questions_order_by_id_desc, delete_question_or_abort_404, \
    get_questions_by_category_order_by_id_desc_or_abort_404, create_and_persist_question, \
    search_questions_by_term_order_by_id_desc
from utils.http_response import json_abort_422
from utils.validator import validate

QUESTIONS_PER_PAGE = 10


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    db = setup_db(app)

    """
    @TODO: Set up CORS. Allow '*' for origins. Delete the sample route after completing the TODOs
    """
    CORS(app)
    cors = CORS(app, resources={r"/api/*": {
        "origins": "*",
    }})

    """
    @TODO: Use the after_request decorator to set Access-Control-Allow
    """

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, true')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    """
    @TODO:
    Create an endpoint to handle GET requests
    for all available categories.
    """

    @app.route('/api/categories')
    def get_categories():
        categories = get_categories_order_by_id_desc()
        return jsonify({
            'success': True,
            'categories': {category.id: category.type for category in categories}
        })

    """
    @TODO:
    Create an endpoint to handle GET requests for questions,
    including pagination (every 10 questions).
    This endpoint should return a list of questions,
    number of total questions, current category, categories.
    
    
    TEST: At this point, when you start the application
    you should see questions and categories generated,
    ten questions per page and pagination at the bottom of the screen for three pages.
    Clicking on the page numbers should update the questions.
    """

    @app.route('/api/questions')
    def get_questions():
        # for pagination, be sure to get the page number from the request in int format
        page = request.args.get('page', 1, type=int)

        # calculate the offset for the query
        start = (page - 1) * QUESTIONS_PER_PAGE

        # calculate the end for the query
        end = start + QUESTIONS_PER_PAGE

        # fetch the questions from the database
        questions = get_questions_order_by_id_desc()

        return jsonify({
            'success': True,
            # slice the questions to the current page
            'questions': [question.format() for question in questions][start:end],
            'total_questions': len(questions),  # calculate the total number of questions
            'current_category': None,  # We don't have current category yet
            'categories': {category.id: category.type for category in get_categories_order_by_id_desc()}
        })

    """
    @TODO:
    Create an endpoint to DELETE question using a question ID.

    TEST: When you click the trash icon next to a question, the question will be removed.
    This removal will persist in the database and when you refresh the page.
    """

    @app.route('/api/questions/<int:question_id>', methods=['DELETE'])
    def delete_question(question_id):
        try:
            # we try to get the question that matches the given question_id,
            # if we can't find it, we delete the question_id from the database
            # 'or' we abort the request with a 404 error
            delete_question_or_abort_404(question_id)

            # We return a success message
            return jsonify({
                'success': True,
                'deleted': question_id
            })
        except Exception as e:
            db.rollback()
            print(e)
            abort(400)

    """
    @TODO:
    Create an endpoint to POST a new question,
    which will require the question and answer text,
    category, and difficulty score.

    TEST: When you submit a question on the "Add" tab,
    the form will clear and the question will appear at the end of the last page
    of the questions list in the "List" tab.
    """

    @app.route('/api/questions', methods=['POST'])
    def create_question():
        # retrieve the data from the request
        body = request.get_json()

        # validate the request body
        violations = validate(body, ['question', 'answer', 'category', 'difficulty'])

        # validate data to be sure it's not empty or null
        if len(violations) > 0:
            # if there are errors, return a 422 error with the violations
            json_abort_422('Unprocessable Entity', violations)

        try:

            # now we're sure the data is valid, we can create the question
            question = create_and_persist_question(body)

            return jsonify({
                'success': True,
                'question': question.format(),
                'message': 'Question created successfully'
            })

        except Exception as e:
            db.session.rollback()
            print(e)
            abort(400)

    """
    @TODO:
    Create a POST endpoint to get questions based on a search term.
    It should return any questions for whom the search term
    is a substring of the question.

    TEST: Search by any phrase. The questions list will update to include
    only question that include that string within their question.
    Try using the word "title" to start.
    """

    @app.route('/api/questions/search', methods=['POST'])
    def search_questions():
        body = request.get_json()
        search_term = body.get('searchTerm')

        # if the search term is empty or null, abort with bad request
        if search_term is None:
            abort(400)

        # now try to search for the term
        questions = search_questions_by_term_order_by_id_desc(search_term)

        # if nothing is found, abort with not found
        if len(questions) == 0:
            abort(404)

        return jsonify({
            'success': True,
            'questions': [question.format() for question in questions],
            'total_questions': len(questions),
            'current_category': None
        })

    """
    @TODO:
    Create a GET endpoint to get questions based on category.

    TEST: In the "List" tab / main screen, clicking on one of the
    categories in the left column will cause only questions of that
    category to be shown.
    """

    @app.route('/api/categories/<int:category_id>/questions')
    def get_questions_by_category(category_id):
        # fetch all questions that belong to the given category
        questions = get_questions_by_category_order_by_id_desc_or_abort_404(category_id)

        return jsonify({
            'success': True,
            'questions': [question.format() for question in questions],
            'total_questions': len(questions),
            'current_category': category_id,
            'categories': {category.id: category.type for category in get_categories_order_by_id_desc()}
        })

    """
    @TODO:
    Create a POST endpoint to get questions to play the quiz.
    This endpoint should take category and previous question parameters
    and return a random questions within the given category,
    if provided, and that is not one of the previous questions.

    TEST: In the "Play" tab, after a user selects "All" or a category,
    one question at a time is displayed, the user is allowed to answer
    and shown whether they were correct or not.
    """

    @app.route('/api/quizzes', methods=['POST'])
    @cross_origin()
    def get_quiz_questions():
        body = request.get_json()
        previous_questions = body.get('previous_questions')
        quiz_category = body.get('quiz_category')
        # check if previous questions are defined or quiz_category is defined
        if previous_questions is None or quiz_category is None:
            abort(400)

        # check if previous questions a list
        if not isinstance(previous_questions, list):
            abort(422)

        # if we don't have a quiz_category, then we'll return all questions
        if 'id' not in quiz_category or quiz_category['id'] == 0:
            questions = get_questions_order_by_id_desc()
        else:
            questions = get_questions_by_category_order_by_id_desc_or_abort_404(quiz_category['id'])

        # filter the questions to remove the previous questions
        filtered_questions = [question.format() for question in questions if question.id not in previous_questions]

        # if there are no questions left, we return an empty list
        if len(filtered_questions) == 0:
            return jsonify({
                'success': True,
                'question': None
            })

        return jsonify({
            'success': True,
            'question': random.choice(filtered_questions)
        })

    @app.route('/api/categories', methods=['POST'])
    def create_category():
        body = request.get_json()

        # validate the request body
        violations = validate(body, ['type'])

        # validate data to be sure it's not empty or null
        if len(violations) > 0:
            # if there are errors, return a 422 error with the violations
            json_abort_422('Unprocessable Entity', violations)

        try:
            # now we're sure the data is valid, we can create the category
            category = create_and_persist_category(body)

            return jsonify({
                'success': True,
                'category': category.format()
            })
        except Exception as e:
            db.rollback()
            print(e)
            abort(400)

    """
    @TODO:
    Create error handlers for all expected errors
    including 404 and 422.
    """

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'success': False,
            'error': 400,
            'message': 'Bad Request'
        }), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 404,
            'message': 'Not Found'
        }), 404

    @app.errorhandler(422)
    def unprocessable(error):
        return jsonify({
            'success': False,
            'error': 422,
            'message': 'Unprocessable Entity'
        }), 422

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            'success': False,
            'error': 500,
            'message': 'Internal Server Error'
        }), 500

    return app
