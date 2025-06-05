<div align="center">
   <img src="static/typer/images/favicon.ico" style="width:25%;margin:1.5rem;">
</div>

![Version](https://img.shields.io/badge/app%20version-1.4.2-blue)
[![License](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12%2B-yello.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/pypi/v/django.svg?label=Django&color=blue)](https://pypi.org/project/Flask/)

# Thunder Typer

Thunder Typer is a web-based typing practice application built with Django. It allows users to improve their typing speed and accuracy through interactive lessons, real-time statistics, and progress tracking.

## Features
- User registration and authentication
- Multiple language and lesson support
- Real-time WPM and accuracy tracking
- Progress saving for logged-in users
- Responsive and modern UI

## Getting Started

### Prerequisites
- Python 3.10+
- Django 5.x

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd typer
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```sh
   python manage.py migrate
   ```
4. Start the development server:
   ```sh
   python manage.py runserver
   ```
5. Visit [http://localhost:8000](http://localhost:8000) in your browser.

## Folder Structure
- `core/` - Django project settings and configuration
- `typing/` - Main typing app (models, views, urls)
- `static/` - Static files (CSS, JS, images)
- `templates/` - HTML templates

## License
See [LICENSE](LICENSE) for details.

## Author
[Mohammed Ismail](https://github.com/m-ismail-x2)

---
Contributions are welcome! Feel free to open issues or submit pull requests.
