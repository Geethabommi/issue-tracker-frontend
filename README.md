# Issue Tracker App

Issue Tracker web application is a scalable issue management and tracking application.
It is used to create, lists the projects and manages the issues.

# Tools,stacks and library used:

## Backend

Nodejs,expressjs,passport-jwt,mongoose,mongodb

## Frontend

Reactjs,bootstrap,jquery

# Deployment:

The Issue Tracker web application is deployed at https://issue-tracker-app-client.herokuapp.com/

# Key Functionalities & Workflow :

## 1) Sign Up :

       User can create new account using mail address and password.if inputs are not given error message
       will be shown at the bottom right side.for successful signup,success message will be shown.

## 2) Login in :

        User can login to the application using already created account by using email address and password.
        In case of successful login,success message will be shown and the page redirects to the project list
        screen.otherwise,error message will be shown in the application.

## 3)Projects Screen:

        1) Create Project:
            Project can be created by giving title and description.In case of error,error message will be shown.
            Otherwise success message will be shown.

        2) List Projects:
            Created project will be displayed in the screen.User can navigate to the issue creation by clicking on the issue in table cell.

## 4)Issue Screen:

        1) Create Issue:
            Issue can be created by giving the inputs such as title,description,label and author value will be
            taken from issue creator.User can select the label value from the dropdown.Upon submit,issue will be created.If created successfully,Success message will be shown,otherwise error message will be shown.

        2) Search and list issue:
            Issues will be displayed in the screen based on the search value given in the search inputs such as
            title,description,author and label by clicking on the search issue button.Search values will be cleared
            upon click of the clear search issue.

# To run the project :

Open terminal.

Change the current working directory to the location where you want the cloned directory.

$ git clone the repo
Install all the dependencies by running :
npm install
Create development variables in environment file

Run npm start to run the project at local host for frontend, port 3000:

npm start
In your browser, enter the URL :
localhost:3000/

Replicate the same instrucations for backend on port 8000:
npm start
