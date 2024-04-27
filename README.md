# Welcome to Tomato Paws!

Hi! This is the user manual/README for the tomato paws application. After each sprint, this manual will be updated to explain how to run the application and use its components. 

# Running the Project 
In order to run the project, please follow these steps.

1. Clone the repository using git clone *github key*. Navigate to the master branch.
2. Create a terminal instance in your IDE of choice and ```cd``` into the hungry-cat project if you haven’t already. 
3. Run ```npm install``` in the root directory of the project, the root of the backend and frontend directories as well to ensure all dependencies are in place. 
4. Run ```npm start```. This will start the application in the localhost:3000 tab on your machine AND start the server that connects to the backend of the application. If you are not redirected to the localhost tab, please type it into your browser and the application should appear.


# Project Components 
## Base Functionality 
1. When you first run the project, you are prompted to log in through our login page. You should be able to type your username and password into the text boxes. This will redirect you to the Tomato Paws timer itself.
2. For your convenience, a custom login has been pre-set for you. The username is "Profsegovia" and the password is "profsegoviaisawesome"
3. You have the option to start a 20 minute session, take a 5 minute break, or take a 60 minute break.
4. While the timer is running, you are able to start, pause, or reset it as needed using the buttons under the Time Remaining section of the application.
5. While the timer is running, you are able to see the countdown in the Time remaining section and you are able to see which time option you selected in the Selected Time section.
   
## Feature 1 - Level System 
1. After logging in, click on your user profile at the top right corner of the application.
2. A dialog will appear featuring a level tracker and study minutes tracker in the dialog that pops up. 
3. Even if you refresh the page or log out of the application, the level tracker and study hours will remain saved and ready for you when the page reloads or you log back in. 
4. The level tracker goes up 1 point when any of the timers are run. The study hours go up by the number of minutes that you have studied/taken breaks in total. 
This feature encourages you to study more while also incentivizing you to take advantage of the breaks due to the points and study hours attached to them as well.

## Feature 2 - Calendar Tracking 
1. The calendar tracking is similar to the level system in that not only do you have a measure of their overall progress through total study minutes and levels, but you can also track progress more incrementally and try to maintain consistency.
2. The study calendar is viewable as a dialog when the Calendar menu option is pressed. It displays today’s date, study hours for that date, study hours for the week, study hours for the month, and study hours for the year. 
3. The challenges tab is also viewable as a dialog when the Challenges menu option is pressed. It displays two accordion menus. When you expand one, you are prompted to challenge another user. When you expand the other, you are able to see a record of any past challenges you may have queried and completed. 
4. The incentive for challenges is that by comparing one’s overall study time to peers that use Tomato Paws as well, a user might be more motivated to try Pomodoro consistently and keep using it to compete with their friends.

## Feature 3 - To-Do List 
1. The To-Do List is a changeable component on your end. It can be used to track all necessary tasks to be completed during study times or even break times. These to-do lists can be found at the bottom left of the application. 
2. Our application even has a suggested study/break tasks aspect to potentially remind users of forgotten or new tasks. You can add tasks from the suggested pile to your study or break list if you want or need something to do on your break or during your study time. These options can be found on the bottom right of the application. 
3. When designing the application, we focused our attention on creating an easy-to-use modular component. All you need to do is write a task to complete and press ‘Add Item.’ Once that task is complete, you then has the option to delete the task by pressing ‘Remove.’ This process encourages our users to track and complete all of their necessary tasks during their full Pomodoro Session.
   
# CI Testing and Unit Testing 
Reliable CI testing has been added and developed between the second and fourth sprints. It runs after every person's individual commit. The yml file does not have to be modified to run successfully on each developer’s machine because relative pathing that is specific to the file tree within the repository has been implemented. The only time that the yml file would have to be modified for everyone is if the file tree changes in a significant way. In that case, the ```working-directory``` commands have to be updated to reflect the new relative paths for the project. Please note that the “tests” job in the CI testing script runs the unit test suite that assesses base functionality of the timer and the level system functionality. These tests are run for every commit and provide valuable information on how to fix the tests should they fail. 

# Troubleshooting 
When running the application for the first time, there may be some issues with rendering and dependencies that occur. To solve this problem, please run the necessary commands to remove the package-lock.json and node-modules files from the front end and back end folders. 
1. Navigate to the front end folder using the ```cd``` command. It would look something like ```cd frontend``` assuming that you are inside the hungry-cat application in your terminal. 
2. Run the following command to remove the package-lock.json file: ```Remove-Item-Path “package-lock.json - Force```
3. Run the ```npm install``` command in the frontend directory. 
4. Repeat this process for the back end as well. 
This should be able to fix a common issue that developers have encountered when cloning/running the application for the first time. Please do not hesitate to reach out to the team if you continue experiencing further issues. Please note that the commands in this user manual only work with Windows. Please modify them as needed in the event that you are using a Linux or Unix system. 
