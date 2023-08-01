/* 
This macro ensures that ThreatJoins are named the same as the ThreatPostureSignals that are connected to them.
When a particular ThreatJoin is selected in the containment tree, only that ThreatJoin is processed.
When nothing is selected in the containment tree, all ThreatJoins are processed. 

Author: Stuart Fowler
Date: 9 April 2023
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

var debug = 1;
var threatJoinPath = "Cyber::Stereotypes::ThreatJoin";
var postureSignalPath = "Cyber::Stereotypes::PostureImpactSignal";
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

//Checks threatjoin name and updates as required
function processThreatJoin(object) {
    writeLog("Processing threatJoin: " + object.getName(), 2);
    postureSignal = Finder.byQualifiedName().find(project, postureSignalPath);
    signal = object.refGetValue("PostureImpactSignal");
    if(signal) {
        if(StereotypesHelper.hasStereotype(signal.get(0), postureSignal)) {
            writeLog("ThreatJoin: " + object.getName() + " has been renamed to " + signal.get(0).getName(), 1);
            object.setName(signal.get(0).getName());
        } else {
            writeLog("ThreatJoin: " + object.getName() + " does not have a ThreatAcceptEvent with a ThreatImpactSignal immediately connected to it. Please add this before running this macro again.", 1);
        }
    } else {
        writeLog("ThreatJoin: " + object.getName() + " does not have a ThreatAcceptEvent with a ThreatImpactSignal immediately connected to it. Please add this before running this macro again.", 1);
    }
}

function main(project, ef, progress) {
    //Grabs the threatJoin stereotypes
    threatJoin = Finder.byQualifiedName().find(project, threatJoinPath);
    writeLog("Got threatJoin stereotype: " + threatJoin, 5);

    //Get selected object from containment tree
    var selectedObjects = project.getBrowser().getContainmentTree().getSelectedNodes();

    //If something is selected in containment tree
    if(selectedObjects.length > 0) {
        progress.init("Checking selected threatjoins", 0, selectedObjects.length + 1);
        writeLog("Length: " + selectedObjects.length, 5);
        for (x = 0; x < selectedObjects.length; x++) {
            if(progress.isCancel()) {
                writeLog("ERROR: User cancelled macro.", 1);
                return;
            }
            progress.increase();
            progress.setDescription("Processing Join: " + selectedObjects[x].getUserObject().getName());
            currentObject = selectedObjects[x].getUserObject();
            writeLog("Got object name: " + currentObject.getName(), 5);
            //Process object if it is a misuseCase, otherwise do nothing
            if(StereotypesHelper.hasStereotype(currentObject,threatJoin)) {
                processThreatJoin(currentObject);
            }
            else {
                writeLog("Selected Item is not a Threat Join", 1)
            }
        }
    } else {
        //If nothing is selected, find all misuseCase and process them
        threatJoins = StereotypesHelper.getStereotypedElements(threatJoin);
        progress.init("Checking selected threatjoins", 0, threatJoins.size() + 1);
        writeLog("Got list of threatJoins: " + threatJoins, 4);
        writeLog("Threat Join List Size: " + threatJoins.size(), 3);
        for (x = 0; x < threatJoins.size(); x++) {
            if(progress.isCancel()) {
                writeLog("ERROR: User cancelled macro.", 1);
                return;
            }
            progress.increase();
            progress.setDescription("Processing Join: " + threatJoins.get(x).getName());
            currentObject = threatJoins.get(x);
            processThreatJoin(currentObject);
        }
    }
}

//Initialises by selecting the project and element factory
var project = Application.getInstance().getProject();
writeLog("Got project: " + project, 5);
var ef = project.getElementsFactory();
writeLog("Got elementsFactory: " + ef, 5);
newSession(project, "Join Creation");

var task = new RunnableWithProgress({
    run: function(progress) {
       main(project, ef, progress);
    }
});

try {
    ProgressStatusRunner.runWithProgressStatus(task, "Join Macro", true, 0);
} finally {
    SessionManager.getInstance().closeSession();
}