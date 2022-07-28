from flaskr import create_app

app = create_app()


def __main__():
    app.run(debug=True)
    app.run(host='0.0.0.0', port=8000)


if __name__ == '__main__':
    __main__()
