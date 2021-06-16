## Weather App

Django application to view weather informations.


### Pages

> Home Page

![Home Page](homepage.png)


> Forecast Page

![Home Page](forecast.png)


### Setup

Install application dependencies.

```bash
$ pip install -r requirements.txt 
```

Add secret key and openweather api key to `env` file. sample of `env` file is available in repo. all necessary files will be available in the gdrive link below.


Now make the migration files

```bash
$ python manage.py makemigration
```

Run migration

```bash
$ python manage.py migrate
```

Run Server

```bash
$ python manage.py runserver
```
