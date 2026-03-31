FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    xvfb \
    xauth \
    dbus-x11 \
    python3-tk \
    libx11-6 \
    chromium \
    chromium-driver \
    libnss3 \
    libatk-bridge2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir pyautogui mouseinfo python-xlib

COPY . .

ENV PORT=8080
ENV PYTHONUNBUFFERED=1

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "--bind", ":8080", "--workers", "1", "--threads", "8", "--timeout", "0", "server.wsgi:application"]
