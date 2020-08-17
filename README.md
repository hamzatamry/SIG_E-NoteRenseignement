# SIG_E-NoteRenseignement
Application mobile, web hybride et cross platform permettant la mise en place d'un SIG.

# To create a django app we need at first install it's framework.
	we can install it globally on the machine which is not recommended because for
	some project we may need different django versions.
	So we create a virtual environement on which we gonna install our django:
		1. navigate to your project folder
		2. open your command prompt (windows)
		3. run this command:
			python -m venv nameOfvirtualEnvironement
		4. Then we type this next command to activate the virtual environement
			nameOfvirtualEnvironement\Scripts\activate
		5. We type this command to install django on our virtual environement
			pip install Django
		6. To create a Django project we type this command:
			django-admin startproject projectName .

		    Notice: new folder created with some bunch of python files
			   a manage.py file is created
		7.a. To run the Django server we type this command:
			python manage.py runserver
		7.a. If you don't want to repeat the command each time, you can open 
		    the project folder with PyCharm IDE, and run manage.py, then go to edit
		    configurations, and put runserver as a parameter, then you can run the server
		    by only pressing the run button.
		8. Until now we have only created a django project, bascially a django project
		   can contain multiple apps, so to create an App we run this command in terminal
			django-admin startapp appName
		9. run this command to migrate modifications and installations to database:
			python manage.py migrate 
   	       10. To see what is in our database as an administrator, we can create a user admin
		   with this command:
			python manage.py createsuperuser
		11. create a Model in model.py then run these two commands
			python manage.py makemigrations
			python manage.py migrate
		12. add these two lines of code to admins.py where model is the name of the Model 
		    
		    from .models import Model
			admin.site.register(Model)

# Adding postgreSQL as a database, adding postgis extension and configuring django project settings:

	1. Make sure you have installed python and Django framework (globally or on a virtual environement)
	2. Check the version of your python by running on terminal or command prompt this command:
		python
	3. Install postgreSQL by downloading it from it's official site.
		3.a. during the installation a useradmin and password are required, make sure 
		    you keep them in mind and not forget them. If you have already install it
		    and you want to reinstall it make sure you delete postgreSQL files from programm files
	4. Make sure you run stack builder a tool installed with in postgreSQL, then make sure you check
	   postgis extension then download it.
	5. To add postgis extension to database and after installing postgis:
		5.a. open pgAdmin4.
		5.b. enter your password.
		5.c. then open your Databases, choose your database then go to Schemas after that to tables, 
		    then click on run button with a database icon named query tool, run these two commands:
				CREATE EXTENSION postgis
				CREATE EXTENSION postgis_raster 
		For more informations visit the [official docs](https://docs.djangoproject.com/fr/3.1/ref/contrib/gis/).

	6. Install OSGeo4W make sure you choose the version depending on python version
		if python is 32 bite use OSGeo4W else use OSGeo4w64
	7. Add these lines of code to settings.py at the beginning:
		import os
		if os.name == 'nt':
			import platform
			OSGEO4W = r"C:\OSGeo4W"
			if '64' in platform.architecture()[0]:
				OSGEO4W += "64"
			assert os.path.isdir(OSGEO4W), "Directory does not exist: " + OSGEO4W
			os.environ['OSGEO4W_ROOT'] = OSGEO4W
			os.environ['GDAL_DATA'] = OSGEO4W + r"\share\gdal"
			os.environ['PROJ_LIB'] = OSGEO4W + r"\share\proj"
			os.environ['PATH'] = OSGEO4W + r"\bin;" + os.environ['PATH']
	8. Configure postgis with Django
		1. Make sure you add 'django.contrib.gis' to INSTALLED_APP in settings.py
		2. Change DATABASES Constant in setting.py to this:
			DATABASES = {
				'default': {
					'ENGINE': 'django.contrib.gis.db.backends.postgis',
					'USER': '<username>',
					'NAME': '<database name>',
					'PASSWORD': '<your paswword that you have entered>',
					'PORT': '5432'

				}
			}
	
# Installing Django-Rest Framework

	1. We run this command to install django rest frameword (make sure you have activated the virtual environement)
		pip install djangorestframework
	
	2. Then you should add it to INSTALLED_APPS = [
		...
		'rest_framework',
	]

	
		


