# Sync. With Ease
<p align="center">
  <img src="img/obsidianTemplatePreview.png" alt="SyncMyObsidian Template Preview">
  </p>

## Main Motivation
This project was created with the goal of syncing files in your Obsidian desktop and mobile application vaults without paying for a subscription. As lovers of all things free, be it food, PS 5s, money, relationships, or especially the open source community, Unfortunately we don't get as much as we fantasize about it, however this project, ah it's free.

To put it simply, suppose you have downloaded the Obsidian Application and created a vault, where you write notes and create wonderful content. Naturally, you'd like to access these notes on the go, but you can't always carry your laptop or the Obsidian desktop application with you. This is where the Obsidian mobile application comes in. However, in order to have the same notes on your mobile interface as in your computer's Obsidian vault, you need to synchronize between the two applications. Obsidian has its own cloud service to store and access files from different devices if you're using the same account, but as mentioned earlier, you need to pay for it.

Here's where this repository comes in. It takes care of the synchronization process and gives you the freedom to write notes and read them on any device where you're logged in with the same account. However, you will need to make some effort as well since this repository is not intelligent enough to do everything on its own.

## Main Functionality
So, basically this project's working is very simple and easily understandable if you're a linux user and has worked with systemd service files, or bash in general. I'd like to mention one thing that is very important for the end users, ***overall development of this project is done on Linux***. 

It doesn't follow any windows development patterns and architecture, so if you're a windows user, unfortunately, you won't get much but you can make a use of the Javascript file named `index.js` which focuses on how to upload files to the google drive. 
<p align="center">
  <img src="img/workflow.png" alt="SyncMyObsidian Workflow">
  </p>

So, here the user needs to run obsidian application (or app Image) using the systemd service file, this service file is responsible for running some scripts in the background before and after running obsidian. 

- Script that runs before the obsidian sets up a log directory and ensures no content in terms of files to be present in the "logs/" directory. 

- The another script that runs after the obsidian gets closed, takes care of number of files user has created/modified in the obsidian vault, it keep traks of those files and write their full path in a JSON based log file called "logs/modified_files.json". Later file paths written on this file is used by JS script to perform upload functionality. 

Above mentioned background scripts are:
1. [index.js](index.js) (Javascript)
2. [performStuff.sh](performStuff.sh) (Bash)

## Setting up the project

  ### Requirements
  
  ### Google service account set-up
  
  ### Systemd service file set-up
  
  ### HOWIT works & HOWTO use
  
  ### Android Installation set-up
