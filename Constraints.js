/* 
This macro updates Security Constraints to ensure they fit the "<Asset Name> - <Control Name>" format.
This macro should be run when the modeller changes the name of a Security Control.
When a particular constraint is selected in the containment tree, only that constraint is processed.
When nothing is selected in the containment tree, all Security Constraints are processed. 

Author: Stuart Fowler
Date: 16 March 2020
*/

var CollectionsAndFiles = new JavaImporter(
    java.util,
    java.io,
    com.nomagic.magicdraw.automaton,
    com.nomagic.magicdraw.core,
    com.nomagic.magicdraw.core.Application,
    com.nomagic.magicdraw.core.project,
    com.nomagic.magicdraw.openapi,
    com.nomagic.magicdraw.openapi.uml.SessionManager,
    com.nomagic.uml2.ext.jmi.helpers.StereotypesHelper,
    com.nomagic.uml2.ext.jmi.helpers.ModelHelper,
    com.nomagic.magicdraw.uml.Finder,
    java.lang);

var debug = 2;
var securityConstraintPath = "Cyber::Stereotypes::SecurityConstraint";

with (CollectionsAndFiles) {
    try {
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
        function processConstraint(object) {
            writeLog("Processing securityConstraint: " + object.getName(), 2);
            type = object.getType().getName();
            name = object.getName();
            owner = object.getOwner().getName();
            if(name == owner + " - " + type) {
                writeLog("Already Correct: " + object.getName(), 3);
            }
            else {
                new_name = owner + " - " + type;
                object.setName(new_name);
                writeLog("Constraint updated: " + object.getName(), 2);
            }
        }

        //Initialises by selecting the project and element factory
        var project = Application.getInstance().getProject();
        writeLog("Got project: " + project, 5);
        newSession(project, "Constraint Creation");

        //Grabs the securityConstraint stereotypes
        securityConstraint = Finder.byQualifiedName().find(project, securityConstraintPath);
        writeLog("Got securityConstraint stereotype: " + securityConstraint, 5);

        //If something is selected in containment tree
        if(project.getBrowser().getContainmentTree().getSelectedNode()) {
            //Get selected object from containment tree
            var currentObject = project.getBrowser().getContainmentTree().getSelectedNode().getUserObject();
            writeLog("Got object name: " + currentObject.getName(), 5);
            //Process object if it is a securityConstraint, otherwise do nothing
            if(StereotypesHelper.hasStereotype(currentObject,securityConstraint)) {
                processConstraint(currentObject);
            }
            else {
                writeLog("Selected Item is not a SecurityConstraint", 1)
            }
        } else {
            //If nothing is selected, find all securityConsraints and process them
            securityConstraints = StereotypesHelper.getExtendedElements(securityConstraint);
            writeLog("Got list of securityConstraints: " + securityConstraints, 4);
            writeLog("Secuirty Constraint List Size: " + securityConstraints.size(), 3);
             for (x = 0; x < securityConstraints.size(); x++) {
                currentObject = securityConstraints.get(x);
                processConstraint(currentObject);
            }
        }
    }
    finally
    {
        SessionManager.getInstance().closeSession();
    }
}
