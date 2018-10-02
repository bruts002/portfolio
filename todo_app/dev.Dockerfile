FROM python:3.6

WORKDIR /app
COPY . /app

RUN pip install --trusted-host pypi.python.org -r requirements.txt
ENV FLASK_APP flaskr
ENV FLASK_ENV development
ENV FLASK_DEBUG 1
ENV FLASK_RUN_PORT 5000
ENV CONFIG_FILE /app/config.dev.py

EXPOSE ${FLASK_RUN_PORT}
CMD ["flask", "run", "--host=0.0.0.0"]
