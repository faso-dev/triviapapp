import json
import unittest

from flask_sqlalchemy import SQLAlchemy

from flaskr import create_app
from models import setup_db, Question


class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.client = self.app.test_client
        self.database_name = "trivia_test"
        self.database_path = "postgres://{}/{}".format('localhost:5432', self.database_name)
        setup_db(self.app, self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            # create all tables
            self.db.create_all()

    def tearDown(self):
        """Executed after reach test"""
        pass

    """
    TODO
    Write at least one test for each test for successful operation and for expected errors.
    """

    # test get categories' endpoint respond with 200 and json data
    def test_get_categories(self):
        res = self.client().get('/api/categories')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['categories'])

    # test get questions endpoint respond with 200 and json data
    def test_get_questions(self):
        res = self.client().get('/api/questions')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['questions'])
        self.assertTrue(data['total_questions'])
        self.assertTrue(data['categories'])

    # test get category questions endpoint respond with 200 and json data
    def test_get_questions_per_category(self):
        res = self.client().get('/api/categories/1/questions')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['questions'])
        self.assertTrue(data['total_questions'])
        self.assertTrue(data['categories'])

    # test get category questions endpoint respond with 404 when category not found
    def test_get_questions_per_category_404(self):
        res = self.client().get('/api/categories/1000/questions')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Not Found')

    # test we can delete a question with a valid id with questions delete endpoint
    def test_delete_question(self):
        question = Question(question='test', answer='test', category=1, difficulty=1)
        question.insert()
        res = self.client().delete('/api/questions/' + str(question.id))
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)

    # test we can not delete a question with an inexistent id with questions delete endpoint
    def test_delete_question_404(self):
        res = self.client().delete('/api/questions/1000')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Not Found')

    # test we can create a new question with questions post endpoint
    def test_add_question(self):
        question = {
            'question': 'test',
            'answer': 'test',
            'category': 1,
            'difficulty': 1
        }
        res = self.client().post('/api/questions', json=question)
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['message'], 'Question created successfully')

    # test we can not create a new question with invalid data
    def test_add_question_422(self):
        question = {
            'question': 'test',
            'answer': 'test',
            'difficulty': 1
        }
        res = self.client().post('/api/questions', json=question)
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 422)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Unprocessable Entity')

    # test we got correct questions with the search term from the search endpoint
    def test_search_questions(self):
        question = Question(question='test', answer='test', category=1, difficulty=1)
        question.insert()
        res = self.client().post('/api/questions/search', json={'searchTerm': 'test'})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['questions'])
        self.assertTrue(data['total_questions'])

    # test we can not get question with a search term does not have any question from the search endpoint
    def test_search_questions_404(self):
        res = self.client().post('/api/search', json={'searchTerm': 'Toto'})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Not Found')

    # test we get the correct quiz questions with the correct quiz_category id from the quiz endpoint
    def test_get_quiz_questions_from_previous_questions_and_current_quiz_category(self):
        question = Question(question='test', answer='test', category=1, difficulty=1)
        question.insert()
        res = self.client().post('/api/quizzes', json={'quiz_category': {'id': '1'}, 'previous_questions': []})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['question'])

    def test_get_quiz_questions_will_return_404_from_inexistent_quiz_category(self):
        res = self.client().post('/api/quizzes', json={'quiz_category': {'id': '1000'}, 'previous_questions': []})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Not Found')

    def test_get_quiz_questions_will_return_422_from_invalid_previous_questions(self):
        res = self.client().post('/api/quizzes', json={'quiz_category': {'id': '1'}, 'previous_questions': 'test'})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 422)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Unprocessable Entity')

    def test_get_quiz_questions_will_return_400_from_wrong_request_data(self):
        res = self.client().post('/api/quizzes', json={})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 400)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Bad Request')

    # tests for category creation
    def test_we_can_succefully_create_category_with_valid_data(self):
        category = {
            'type': 'test'
        }
        res = self.client().post('/api/categories', json=category)
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['category'])

    def test_create_category_with_cannot_create_category_with_empty_type(self):
        category = {
            'type': ''
        }
        res = self.client().post('/api/categories', json=category)
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 422)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Unprocessable Entity')


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
