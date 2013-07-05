import webapp2
import os
import jinja2
import logging
import random

DEBUG = True

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')),
    autoescape = True)


class Handler(webapp2.RequestHandler):
    # Writing and rendering utility functions
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    def render_str(self, template, **params):
        try: 
            t = JINJA_ENVIRONMENT.get_template(template)
            return t.render(params)
        except jinja2.TemplateNotFound:
            return None

    def render(self, template, **kw):
        res = self.render_str(template, **kw)
        if res:
            self.write(res)
        else:
            self.render("404.html")


class DefaultPage(Handler):
    def get(self, url):
        template = url
        t = self.request.get('t', default_value=None)

        # Remove opening slash
        if( template[0] == '/' ):
            template = template[1:]
        # Check for homepage
        if( len(template) == 0 ):
            template = "index"
        elif( template == "academia"
              or template == "industry" ):
            template = "interests"

        logging_str = "Rendering template [" + template
        if t:
            logging_str += "?t=" + t
        logging_str += "]"
        logging.info(logging_str)
        self.render(template+'.html', url=url, t=t)


PAGE_RE = r'(/(?:[a-zA-Z0-9_-]+/?)*)'
app = webapp2.WSGIApplication( [ (PAGE_RE, DefaultPage) ],
                               debug=DEBUG)
