/* 
This macro ensures activities that define AggregatedActions are Mal-Activities.
When a particular action is selected in the containment tree, only that action is processed.
When nothing is selected in the containment tree, all AggregatedActions are processed. 

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

var debug = 1;
var aggregatedActionPath = "Cyber::Stereotypes::AggregatedAction";
var malActivityPath = "Cyber::Stereotypes::MalActivity";
var nodePath = "UML Standard Profile::UML2 Metamodel::ActivityParameterNode";
var inputPinPath = "Cyber::Stereotypes::ThreatInput";
var outputPinPath = "Cyber::Stereotypes::ThreatOutput";

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

//Checks Constraint name and updates as required
function processAggregatedAction(object) {
    writeLog("Processing aggregatedAction: " + object.getName(), 2);
    if(object.getBehavior()) {
        writeLog("Activity already exists: " + object.getName(), 3);
        malActivityStereo = Finder.byQualifiedName().find(project, malActivityPath);
        if(!(StereotypesHelper.hasStereotype(object.getBehavior(), malActivityStereo))) {
            StereotypesHelper.addStereotype(object.getBehavior(), malActivityStereo);
            writeLog("Adding MalActivity Stereotype: " + object.getName(), 2);
        }
        if(!(object.getContext() == object.getBehavior().getOwner())) {
            object.getBehavior().setOwner(object.getContext());
            writeLog("Activity in Wrong Location, moving to: " + object.getContext(), 2);
        }
        if(!(object.getBehavior().getName() == object.getName())) {
            object.getBehavior().setName(object.getName());
            writeLog("Incorrect Activity Name, renaming to: " + object.getName(), 2);
        }
        for(i = 0; i < object.getBehavior().getOwnedElement().size(); i++) {
            writeLog("Found Owned Element: " + object.getBehavior().getOwnedElement().get(i).getName(), 5);
            if(object.getBehavior().getOwnedElement().get(i).getClass() == "class com.nomagic.uml2.ext.magicdraw.activities.mdbasicactivities.impl.ActivityParameterNodeImpl") {
                writeLog("Found ActivtyParameterNode: " + object.getBehavior().getOwnedElement().get(i).getName(), 5);
                if(!(object.getBehavior().getOwnedElement().get(i).isControlType())) {
                    writeLog("Changing ActivtyParameterNode to Control Type: " + object.getBehavior().getOwnedElement().get(i).getName(), 2)
                    object.getBehavior().getOwnedElement().get(i).setControlType(true);
                }
            }
        }
    } else {
        writeLog("This action does not have an activity attached: " + object.getName() + ". Create a CEMT Mal-Activity diagram below this action to progress.", 2);
    }
}

function processPin(pin) {
    writeLog("Processing Pin: " + pin.getName(), 3);
    var parameter = pin.getSyncElement();
    if(parameter){
        writeLog("Found Parameter: " + parameter.getName(), 5);
        if(!(parameter.getName() == pin.getName())) {
            parameter.setName(pin.getName());
            writeLog("Changed Parameter Name to: " + parameter.getName(), 2);
        }
        var parameterNode = parameter.get_activityParameterNodeOfParameter().get(0);
        writeLog("Found ParameterNode: " + parameterNode.getName(), 5);
        if(!(parameterNode.getName() == pin.getName())) {
            parameterNode.setName(pin.getName());
            writeLog("Changed Parameter Node Name to: " + parameterNode.getName(), 2);
        }
    }
    else {
        writeLog("Pin does not have a parameter, skipping.", 5);
    }
}

//Initialises by selecting the project and element factory
var project = Application.getInstance().getProject();
writeLog("Got project: " + project, 5);
var ef = project.getElementsFactory();
writeLog("Got elementsFactory: " + ef, 5);
newSession(project, "Activity Creation");

//Grabs the aggregatedAction stereotypes
aggregatedAction = Finder.byQualifiedName().find(project, aggregatedActionPath);
writeLog("Got aggregatedAction stereotype: " + aggregatedAction, 5);

//Get selected object from containment tree
var selectedObjects = project.getBrowser().getContainmentTree().getSelectedNodes();
//If something is selected in containment tree
if(selectedObjects.length > 0) {            
    writeLog("Length: " + selectedObjects.length, 5);
    for (x = 0; x < selectedObjects.length; x++) {
        currentObject = selectedObjects[x].getUserObject();
        writeLog("Got object name: " + currentObject.getName(), 5);
        //Process object if it is a aggregatedAction, otherwise do nothing
        if(StereotypesHelper.hasStereotype(currentObject,aggregatedAction)) {
            processAggregatedAction(currentObject);
        }
        else {
            writeLog("Selected Item is not an AggregatedAction", 1)
        }
    }
} else {
    //If nothing is selected, find all aggregatedAction and process them
    aggregatedActions = StereotypesHelper.getStereotypedElements(aggregatedAction);
    writeLog("Got list of aggregatedActions: " + aggregatedActions, 4);
    writeLog("Aggregated Action List Size: " + aggregatedActions.size(), 3);
        for (x = 0; x < aggregatedActions.size(); x++) {
        currentObject = aggregatedActions.get(x);
        processAggregatedAction(currentObject);
    }
}

var inputPinStereo = Finder.byQualifiedName().find(project, inputPinPath);
var inputPins = StereotypesHelper.getStereotypedElements(inputPinStereo);
writeLog("Got list of inputPins: " + inputPins, 4);
writeLog("Input Pins List Size: " + inputPins.size(), 3);
for (x = 0; x < inputPins.size(); x++) {
    currentObject = inputPins.get(x);
    processPin(currentObject);
}

var outputPinStereo = Finder.byQualifiedName().find(project, outputPinPath);
var outputPins = StereotypesHelper.getStereotypedElements(outputPinStereo);
writeLog("Got list of outputPins: " + outputPins, 4);
writeLog("Output Pins List Size: " + outputPins.size(), 3);
for (x = 0; x < outputPins.size(); x++) {
    currentObject = outputPins.get(x);
    processPin(currentObject);
}

SessionManager.getInstance().closeSession();