FROM python:latest

RUN mkdir -p /app

COPY . /app

RUN apt-get update && \
    cd /app && pip install --upgrade pip && \
    pip install -r ./requirements.txt 

WORKDIR /app
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "--access-logfile", "-", "app:app"]

