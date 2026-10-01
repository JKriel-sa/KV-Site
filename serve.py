"""Tiny static server for local preview:  python3 serve.py"""
import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 4321


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    handler = partial(Handler, directory=ROOT)
    ThreadingHTTPServer(("127.0.0.1", PORT), handler).serve_forever()
