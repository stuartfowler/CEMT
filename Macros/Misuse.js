/* 
This macro ensures that activities under MisuseCases are appropriate stereotyped.
When a particular misuse case is selected in the containment tree, only that misuse case is processed.
When nothing is selected in the containment tree, all MisuseCases are processed. 
Author: Stuart Fowler
Date: 20 December 2022
*/

importClass(com.nomagic.magicdraw.core.Application);
importClass(com.nomagic.magicdraw.core.Project);
importClass(com.nomagic.magicdraw.openapi.uml.SessionManager);
importClass(com.nomagic.magicdraw.openapi.uml.ModelElementsManager);
importClass(com.nomagic.magicdraw.properties.PropertyManager);
importClass(com.nomagic.magicdraw.openapi.uml.PresentationElementsManager);
importClass(com.nomagic.uml2.ext.jmi.helpers.ValueSpecificationHelper);
importClass(com.nomagic.uml2.ext.jmi.helpers.StereotypesHelper);
importClass(com.nomagic.uml2.ext.jmi.helpers.TagsHelper);
importClass(com.nomagic.uml2.ext.jmi.helpers.CoreHelper);
importClass(com.nomagic.magicdraw.uml.Finder);
importClass(java.util.ArrayList);
importClass(java.util.HashSet);
importClass(com.nomagic.uml2.MagicDrawProfile);
importClass(com.nomagic.task.RunnableWithProgress);
importClass(com.nomagic.ui.ProgressStatusRunner);

var debug = 1;
var misuseCasePath = "Cyber::Stereotypes::MisuseCase";
var malActivityPath = "Cyber::Stereotypes::MalActivity";

//Helper function to write logs
function writeLog(text,level) {
    if(debug >= level) {
        Application.getInstance().getGUILog().log(text);
    }
}

//Creates new session for Cameo modifications
function newSession(project, sessionName) {
    if(SessionManager.getInstance().isSessionCreated(project)) {
        SessionManager.getInstance().closeSession(project);
    }
    SessionManager.getInstance().createSession(project, sessionName);
}

//Checks misusecase name and updates as required
function processMisuseCase(object) {
    writeLog("Processing misuseCase: " + object.getName(), 2);
    behaviour = object.getClassifierBehavior();
    if(behaviour) {
        malActivity = Finder.byQualifiedName().find(project, malActivityPath);
        if(StereotypesHelper.hasStereotype(behaviour,malActivity)) {
            writeLog("Selected Item already contains a MalActivity", 4);
        }
        else {
            StereotypesHelper.addStereotype(behaviour,malActivity);
        }

        if(behaviour.getName() == object.getName()) {
            writeLog("Selected MalActivity is already correctly named", 4);
        }
        else {
            behaviour.setName(object.getName());
        }

        if(behaviour.getOwner() == object) {
            writeLog("Selected MalActivity is already correctly placed", 4);
        }
        else {
            behaviour.setOwner(object);
        }
    }
    else {
        writeLog("No behaviour exists for this misuse case. Please create a behaviour before processing.", 2);
    }
}

function main(project, progress) {
    //Grabs the misuseCase stereotypes
    misuseCase = Finder.byQualifiedName().find(project, misuseCasePath);
    writeLog("Got misuseCase stereotype: " + misuseCase, 5);

    //Get selected object from containment tree
    var selectedObjects = project.getBrowser().getContainmentTree().getSelectedNodes();

    //If something is selected in containment tree
    if(selectedObjects.length > 0) {
        progress.init("Checking selected activities", 0, selectedObjects.length + 1);
        writeLog("Length: " + selectedObjects.length, 5);
        for (x = 0; x < selectedObjects.length; x++) {
            if(progress.isCancel()) {
                writeLog("ERROR: User cancelled macro.", 1);
                return;
            }
            progress.increase();
            progress.setDescription("Processing MisuseCase: " + selectedObjects[x].getUserObject().getName());
            currentObject = selectedObjects[x].getUserObject();
            writeLog("Got object name: " + currentObject.getName(), 5);
            //Process object if it is a misuseCase, otherwise do nothing
            if(StereotypesHelper.hasStereotype(currentObject,misuseCase)) {
                processMisuseCase(currentObject);
            }
            else {
                writeLog("Selected Item is not a Misuse Case", 1)
            }
        }
    } else {
        //If nothing is selected, find all misuseCase and process them
        misuseCases = StereotypesHelper.getStereotypedElements(misuseCase);
        progress.init("Checking all misuse cases", 0, misuseCases.size() + 1);   
        writeLog("Got list of misuseCases: " + misuseCases, 4);
        writeLog("Misuse Case List Size: " + misuseCases.size(), 3);
        for (x = 0; x < misuseCases.size(); x++) {
            if(progress.isCancel()) {
                writeLog("ERROR: User cancelled macro.", 1);
                return;
            }
            progress.increase();
            progress.setDescription("Processing MisuseCase: " + misuseCases.get(x).getName());
            currentObject = misuseCases.get(x);
            processMisuseCase(currentObject);
        }
    }
}

//Initialises by selecting the project and element factory
var project = Application.getInstance().getProject();
writeLog("Got project: " + project, 5);
var ef = project.getElementsFactory();
writeLog("Got elementsFactory: " + ef, 5);
newSession(project, "Misuse Creation");

var task = new RunnableWithProgress({
    run: function(progress) {
       main(project, progress);
    }
});

try {
    ProgressStatusRunner.runWithProgressStatus(task, "Misuse Macro", true, 0);
} finally {
    SessionManager.getInstance().closeSession();
}