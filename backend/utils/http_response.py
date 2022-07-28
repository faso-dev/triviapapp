from flask import jsonify, abort


def json_abort_422(error, violations=None):
    """
    Create a JSON error response.
    """
    response = jsonify({
        'success': False,
        'error': error,
        'message': 'Unprocessable Entity',
        'violations': violations
    })
    response.status_code = 422
    abort(response)
