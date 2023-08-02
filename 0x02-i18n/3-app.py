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
def get_locale() -> str:
    """
    Determine the best match for the user's preferred language
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route("/")
def index() -> str:
    """
    the index page
     -- for the route "/"
    """
    return render_template("3-index.html",
                           ht=_("home_title"), hh=_("home_header"))


if __name__ == "__main__":
    app.run()
