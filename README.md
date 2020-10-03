# SIG_E-NoteRenseignement
Application mobile, web hybride et cross platform permettant la mise en place d'un SIG.

# Installation Requirements 
	Make sure The nodeJS and AngularCLI are installed Then navigate to a folder 
		1. To create an ionic angular project run this command
			ionic start nameOfProject
		2. To run the developpement server run this command
			ionic serve
	
# Preparing setup before adding cordova plugins:
	1. Make sure the JDK 1.8 is installed and the JAVA_HOME is added to the environement variable.
		1. Make sure to choose user variable (not system)
			C:\Program Files\Java\jdk1.8.0_261\
		2. Make sure to choose system variable (not system)
			C:\Program Files\Java\jdk1.8.0_261\bin
		
	2. Install Gradle, add the path to the environment variable (system variable Path).
		C:\Gradle\gradle-6.5.1\bin

	3. Add a platform run this command by replacing <platform> with the platform name:
		ionic cordova platform add <platform>.
	Platform: android, ios, browser
	
	4. Run the native app
		1. In case of android: 
			a. make sure android studio is installed.
			b. download an emulator and open it.
			c. run this command:
				ionic cordova run android --livereload
			the option --livereload is to run the developpement server and every change
			you made inside the project it will build and run it on the emulator
			c2. In case if you want to run it on a real device
				1. add the developpement option on your device
				2. set the debug mode to True
				3. connect the device with a usb
				4. run this command:
					ionic cordova run android -l -d
				the option -l for livereload and d for device.
		2. In case of browser:
			a. add browser as a platform:
				ionic cordova add platform add browser
			b. run the developpement server:
				ionic cordova run browser -l
	5. To build the apk in case of android run this command:
		ionic cordova build android
	
For more informations visit [ionic docs](https://ionicframework.com/docs).						

# Adding cordova plugins:
	1. Go to the official ionic docs then to native functionality
	2. Choose a plugin.
	3. Check for supported platforms.
	4. Make sure to choose cordova.
	5. Run installation commands.
	6. Add the import used on the app module.
	7. Add the name of the plugin on the providers array in the app module.
	8. Add the import to a page or component of your choice.
	9. Inject the name of the service on the constructor.
	8. Go to the ionic v3 documentation, then to native, choose your plugin
	   and you can read more about function and how to use them.



# Documentation 
	# C'est qui ArcGIS ?
		ArcGIS est une suite de logiciels d'information géographique développés par la société américaine Esri
		
	# C'est quoi esri loader ?
		A tiny library to help you use the ArcGIS API for JavaScript in applications built with 
		popular JavaScript frameworks and bundlers like Angular.

For more informations about esri loader visit [esri-loader](https://github.com/Esri/esri-loader)
