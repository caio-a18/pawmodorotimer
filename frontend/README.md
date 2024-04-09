# Welcome to Tomato Paws!

Hi! This is the user manual/README for the tomato paws application. After each sprint, this manual will be updated to explain how to run the application and use its components. 

# Running the Project 

In order to run the project, please follow these steps. 

1. Clone the repository using ```git clone *github key*```. Navigate to the ```master``` branch. 
2. Create two terminal instances in your IDE of choice. 
3. In one of the terminals, run ```node C:\path\to\your\server.js```. Please find your own unique path to the server.js file in the Tomato Paws application and use that in place of the arbitrary file string used as a placeholder in the previous sentence. This will start the API and server that is necessary to run the application. It will be viewable in the ```localhost:8080``` tab on your machine. You do not have to explicitly open this page in order to run and view the application, but you are welcome to do so if you are curious. 
4. In the other terminal, run ```npm start```. This will start the application in the ```localhost:3000``` tab on your machine. If you are not redirected to this tab, please type it into your browser and the application should appear. 

# Project components

1. When you first run the project, you are redirected to a login page. You should be able to type your username and password into the text boxes. This will redirect you to the Tomato Paws timer itself. 
2. You have the option to select a custom time, start a 20 minute session, take a 5 minute break, or take a 60 minute break. 
3. While the timer is running, you are able to start, pause, or reset it as needed using the buttons under the ```Time Remaining``` section of the application. 
4. While the timer is running, you are able to see the countdown in the ```Time remaining``` section and you are able to see which time option you selected in the ```Selected Time``` section. 
5. After each timer is up, a pop-up is displayed to ascertain and let you know what level you are currently at. The level you are at is saved to your user profile even if you choose to exit the application at any point. 

# CI Testing 

For the first sprint, rudimentary CI testing has been added. It runs after every person's individual commit. As with running the application, please make sure that the ```node C:\your\unique\directory\server.js```command in the ```node-js.yml``` file is run using your own computer's pathway to the server.js file. 