from flask_restful import abort
from models import Question

from models import Category


def get_questions_order_by_id_desc():
    return Question.query.order_by(Question.id.desc()).all()


def create_and_persist_question(data):
    question = Question(**data)
    question.insert()
    return question


def search_questions_by_term_order_by_id_desc(search_term):
    return Question.query.filter(Question.question.ilike('%' + search_term + '%')).order_by(Question.id.desc()).all()


def get_questions_by_category_order_by_id_desc_or_abort_404(category_id):

    # we'll return all questions that belong to the given category or abort with a 404
    category = Category.query.get_or_404(category_id)
    return Question.query.filter(Question.category == category.id).order_by(Question.id.desc()).all()


def delete_question_or_abort_404(question_id):
    question = Question.query.get_or_404(question_id)
    question.delete()
