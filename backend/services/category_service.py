from models import Category


def get_categories_order_by_id_desc():
    return Category.query.order_by(Category.id.desc()).all()


def create_and_persist_category(data):
    category = Category(**data)
    category.insert()
    return category
