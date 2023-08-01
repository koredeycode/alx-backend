#!/usr/bin/env python3
"""
The main flask application file
"""
from flask import Flask, render_template, request, g
from flask_babel import Babel, _
from typing import Union, Dict


users: Dict = {
  1: {
    "name": "Balou",
    "locale": "fr",
    "timezone": "Europe/Paris"
  },
  2: {
    "name": "Beyonce",
    "locale": "en",
    "timezone": "US/Central"
  },
  3: {
    "name": "Spock",
    "locale": "kg",
    "timezone": "Vulcan"
  },
  4: {
    "name": "Teletubby",
    "locale": None,
    "timezone": "Europe/London"
  },
}


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


def get_user() -> Union[Dict, None]:
    """get the user from users"""
    user_id = request.args.get('login_as')
    if user_id:
        return users.get(int(user_id))
    return None


@app.before_request
def before_request() -> None:
    """run before the request"""
    user = get_user()
    g.user = user


@babel.localeselector
def get_locale():
    """
    Determine the best match for the user's preferred language
    """
    locale: str = request.args.get('locale')
    if locale and locale in app.config['LANGUAGES']:
        return locale
    if g.user and g.user['locale'] in app.config['LANGUAGES']:
        return g.user['locale']
    header_locale: str = request.headers.get('locale', '')
    if header_locale in app.config['LANGUAGES']:
        return header_locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route("/")
def index() -> str:
    """
    the index page
    """
    return render_template("6-index.html",
                           ht=_("home_title"), hh=_("home_header"))


if __name__ == "__main__":
    app.run()
