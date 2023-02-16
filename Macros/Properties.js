/* 
This macro updates Security Properties to ensure they fit the "<Asset Name> - <Control Name>" format and removes untyped Security Properties.
This macro should be run when the modeller changes the name of a Security Control or deletes a Security Control.
When a particular property is selected in the containment tree, only that property is processed.
When nothing is selected in the containment tree, all Security Properties are processed. 

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

var debug = 1;
var securityPropertyPath = "Cyber::Stereotypes::SecurityProperty";


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

//Checks Property name and updates as required
function processProperty(object) {
    writeLog("Processing securityProperty: " + object.getName(), 2);
    if(!object.getType()) {
        writeLog(object.getName() + " did not have a type, and has been deleted. If this is undesired, you can reinstate the SecurityProperty using the 'Undo' command.", 1);
        ModelElementsManager.getInstance().removeElement(object);
        return;
    }
    type = object.getType().getName();
    objname = object.getName();
    owner = object.getOwner().getName();
    if(objname == owner + " - " + type) {
        writeLog("Already Correct: " + object.getName(), 3);
    }
    else {
        new_name = owner + " - " + type;
        object.setName(new_name);
        writeLog("Property updated: " + object.getName(), 2);
    }
}

//Initialises by selecting the project and element factory
var project = Application.getInstance().getProject();
writeLog("Got project: " + project, 5);
newSession(project, "Property Update");

//Grabs the securityProperty stereotypes
securityProperty = Finder.byQualifiedName().find(project, securityPropertyPath);
writeLog("Got securityProperty stereotype: " + securityProperty, 5);

//Get selected object from containment tree
var selectedObjects = project.getBrowser().getContainmentTree().getSelectedNodes();

//If something is selected in containment tree
if(selectedObjects.length > 0) {
    writeLog("Length: " + selectedObjects.length, 5);
    for (x = 0; x < selectedObjects.length; x++) {
        currentObject = selectedObjects[x].getUserObject();
        writeLog("Got object name: " + currentObject.getName(), 5);
        //Process object if it is a securityProperty, otherwise do nothing
        if(StereotypesHelper.hasStereotype(currentObject,securityProperty)) {
            processProperty(currentObject);
        }
        else {
            writeLog("Selected Item is not a SecurityProperty", 1)
        }
    }
} else {
    //If nothing is selected, find all securityProperties and process them
    securityProperties = StereotypesHelper.getStereotypedElements(securityProperty);
    writeLog("Got list of securityProperties: " + securityProperties, 4);
    writeLog("Secuirty Constraint List Size: " + securityProperties.size(), 3);
        for (x = 0; x < securityProperties.size(); x++) {
        currentObject = securityProperties.get(x);
        processProperty(currentObject);
    }
}

SessionManager.getInstance().closeSession();
