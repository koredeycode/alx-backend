#!/usr/bin/env python3
"""
The main flask application file with the basic setup and babel
with internalization support
"""
from flask import Flask, render_template, request
from flask_babel import Babel


class Config:
    """
    Represent a Flask babel configuration contains
    configuration need for flask babel.
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """
    Determine the best match for the user's preferred language
    """
    locale: str = request.args.get('locale')
    if locale and locale in app.config['LANGUAGES']:
        return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route("/")
def index() -> str:
    """
    the index page -- for the route '/'
    returns the template string of the html provided
    the index page
    """
    return render_template("4-index.html")


if __name__ == "__main__":
    app.run()
