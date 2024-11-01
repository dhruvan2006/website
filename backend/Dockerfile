FROM python:3.13

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py migrate
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "server.wsgi:application", "--bind", "0.0.0.0:8000"]
