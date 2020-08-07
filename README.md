# SIG_E-NoteRenseignement
Application mobile, web hybride et cross platform permettant la mise en place d'un SIG.

Make sure The nodeJS and AngularCLI are installed Then navigate to a folder 
	1. To generate an ionic angular project run this command
		ionic start nameOfProject
	2. To run the developpement server run this command
		ionic serve
	
# preparing set up before adding cordova plugins:
	1. Make sure the JDK 1.8 is installed and the JAVA_HOME is added to the environement variable
	2. Install Gradle, add the path to the environment variable
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
	
For more informations visit (ionic docs)[https://ionicframework.com/docs].						

# add cordova plugins:
	1. Go to the official ionic docs then to native functionality
	2. Choose a plugin.
	3. check supported platforms
	4. Make sure to choose cordova
	5. run installation commands 
	6. Add the import used on the app module
	7. Add the name of the plugin on the providers arrays 
	8. Go to the ionic v3 documentation to know more about function and parameters for the plugin

