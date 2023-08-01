#!/usr/bin/env python3
"""
The main flask application file
"""
from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index() -> str:
    """
    The index page.
    """
    return render_template("0-index.html")


if __name__ == "__main__":
    app.run()
