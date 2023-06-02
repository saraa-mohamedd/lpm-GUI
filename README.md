# The Linux Process Manager (or lpm) 
is a graphical-user interface based task manager implemented for linux based systems. It contains tabs such as the __Process View__ tab to display the process table with attributes, along with memory% and cpu% graphs, the __System View__ tab to display both text and graphical information on the underlying system, and the __Tree View__ tab to display an interactive process tree of the system. Implemented with the ```tauri``` framework for a ```rust``` backend and a ```ReactJS``` frontend, this program is a GUI companion to the command-line implentation of this task manager; to offer information in a graphical, easy to digest manner. Click [here](https://github.com/saraa-mohamedd/lpm-CLI) for the CLI portion of this project.

![](https://github.com/saraa-mohamedd/lpm-GUI/blob/main/processview-screenrec.gif)
![](https://github.com/saraa-mohamedd/lpm-GUI/blob/main/sysview-screenrec.gif)
![](https://github.com/saraa-mohamedd/lpm-GUI/blob/main/treeview-screenrec%20(1).gif)

## To Run From Terminal

#### Dependencies
```npm``` and ```nodejs```

#### Commands
```cd``` into the project directory\
run ```npm run tauri dev``` to run program

## To Run Using Debian File

```cd``` into the project directory\
run ```npm run tauri build``` to build debian of program, and run debian
