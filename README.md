# SIG_E-NoteRenseignement
Application mobile, web hybride et cross platform permettant la mise en place d'un SIG.

# To create a django framework we need at first install it.
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
			pip3 install Django
		6. To create a Django project we type this command:
			django-admin startproject projectName .

		   Notice: new folder created with some bunch of python files
			   a manage.py file is created
		7.a To run the Django server we type this command:
			python manage.py runserver
		7.a If you don't want to repeat the command each time, you can open 
		    the project folder with PyCharm IDE, and run manage.py, then go to edit
		    configurations, and put runserver as a parameter, then you can run the server
		    by only pressing the run button.
		8. Until now we have only created a django project, bascially a django project
		   can contain multiple apps, so to create an App we run this command in terminal
			django-admin startapp appName
		
   (optional)   9. To see what is in our database as an administrator, we can create a user admin
		   with this command:
			python manage.py createsuperuser
				
		


