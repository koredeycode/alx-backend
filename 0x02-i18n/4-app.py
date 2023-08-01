#!/usr/bin/env python3
"""
The main flask application file
"""
from flask import Flask, render_template, request
from flask_babel import Babel, _


class Config:
    """
    Represent a Flask babel configuration
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
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
    the index page
    """
    return render_template("4-index.html",
                           ht=_("home_title"), hh=_("home_header"))


if __name__ == "__main__":
    app.run()
