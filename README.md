# Dhruvan - Cryptocurrency Research and Fed Liquidity Website

This repository hosts the source code for the Dhruvan cryptocurrency research website, focusing on Bitcoin indicators, Fed liquidity data, and more. The website allows users to explore historical data and access research tools.

## Live Website

The live version of the website is hosted at: [https://crypto.dhruvan.dev](https://crypto.dhruvan.dev)

## Features

- Fastest Fed liquidity data
- Bitcoin price data and research indicators
- API endpoints with authorization

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- Python

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/website.git
cd website
```

2. Install the frontend dependencies:
```bash
cd frontend
npm install
```

3. Install the backend dependencies:
```bash
cd ../backend
python -m venv .venv
source .venv/bin/activate   # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
```

## Environment Variables
You will need to configure environment variables for both the frontend and backend.

### Frontend (Next.js)
Save `.env.local.example` file in the `frontend` directory as `.env.local` after filling in all the details.

### Backend (Django)
Save `.env.example` file in the `backend` directory as `.env` after filling in all the details.

## Running the Application
### Backend (Django)
Navigate to the backend directory and run the Django server:
```bash
cd backend
source .venv/bin/activate   # On Windows use: .venv\Scripts\activate
python manage.py migrate
python manage.py runserver
```

The backend will be available at `http://localhost:8000`.

### Frontend (Next.js)
Navigate to the frontend directory and start the development server:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`.
