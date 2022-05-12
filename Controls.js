/* 
This macro creates Security Constraints from the Assets and Security Controls allocated to ThreatActions and DetectionActions.
When a particular action is selected in the containment tree, only that action is processed.
When nothing is selected in the containment tree, all ThreatActions and DetectionActions are processed. 

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

var debug = 1;
var securityConstraintPath = "Cyber::Stereotypes::SecurityConstraint";
var notAssessedPath = "Cyber::Enumerations::Implementation::Not Assessed";
var threatActionPath = "Cyber::Stereotypes::ThreatAction";
var detectionActionPath = "Cyber::Stereotypes::DetectionAction";
var noneControlPath = "Threat Model::Controls::None";

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

        //Creates security constraint properties for each potentialControl under each allocatedComponent
        function createConstraints(potentialControls, allocatedComponents) {
            notAssessed = Finder.byQualifiedName().find(project, notAssessedPath);
            notAssessed = AutomatonMacroAPI.getOpaqueObject(notAssessed);
            noneControl = Finder.byQualifiedName().find(project, noneControlPath);
            noneControl = AutomatonMacroAPI.getOpaqueObject(noneControl);
            for (i = 0; i < allocatedComponents.size(); i++) {
                currentComponent = allocatedComponents.get(i);
                for (j = 0; j < potentialControls.size(); j++) {
                    currentControl = potentialControls.get(j);  
                    present = 0;
                    writeLog("Checking Combination: " + currentComponent.Name + " - " + currentControl.Name, 3);
                    for (k = 0; k < currentComponent.Owned_Element.size(); k++) {
                        if (currentComponent.Owned_Element.get(k).Type == currentControl) {
                            present = 1;
                            writeLog("Already exists: " + currentComponent.Name + " - " + currentControl.Name, 3);
                        }
                    }
                    if (!present) {
                        if(currentControl != noneControl){                            
                            writeLog("Creating constraint: " + currentComponent.Name + " - " + currentControl.Name, 2);
                            currentConstraint = AutomatonMacroAPI.createElement("Property");
                            currentConstraint.setOwner(currentComponent);
                            currentConstraint.setType(currentControl);
                            securityConstraint = Finder.byQualifiedName().find(project, securityConstraintPath);
                            securityConstraint = AutomatonMacroAPI.getOpaqueObject(securityConstraint);
                            currentConstraint = AutomatonMacroAPI.addStereotype(currentConstraint, securityConstraint);
                            currentConstraint.setImplementation(notAssessed);
                            new_name = currentComponent.getName() + ' - ' + currentControl.getName();
                            currentConstraint.setName(new_name);
                        }
                    }
                }
            }
        }

        //Extracts the potentialControls and allocatedComponents from a given threatAction
        function processAction(object) {
            writeLog("Processing threatAction: " + object.getName(), 2);
            opaqueObject = AutomatonMacroAPI.getOpaqueObject(object);
            potentialControls = opaqueObject.Mitigated_By;
            writeLog("PotentialControls: " + potentialControls, 3);
            allocatedComponents = opaqueObject.affects;
            writeLog("AllocatedComponents: " + allocatedComponents, 3);
            if(allocatedComponents && potentialControls) {
                createConstraints(potentialControls, allocatedComponents);
            }
        }

        //Initialises by selecting the project and element factory
        var project = Application.getInstance().getProject();
        writeLog("Got project: " + project, 5);
        var ef = project.getElementsFactory();
        writeLog("Got elementsFactory: " + ef, 5);
        newSession(project, "Constraint Creation");

        //Grabs the threatAction and detectionAction stereotypes
        var threatAction = Finder.byQualifiedName().find(project, threatActionPath);
        writeLog("Got threatAction stereotype: " + threatAction, 5);
        var detectionAction = Finder.byQualifiedName().find(project, detectionActionPath);
        writeLog("Got detectionAction stereotype: " + detectionAction, 5);

        //If something is selected in containment tree
        if(project.getBrowser().getContainmentTree().getSelectedNode()) {
            //Get selected object from containment tree
            var currentObject = project.getBrowser().getContainmentTree().getSelectedNode().getUserObject();
            writeLog("Got object name: " + currentObject.getName(), 5);
            //Process object if it is a threatAction or detectionAction, otherwise do nothing
            if(StereotypesHelper.hasStereotype(currentObject,threatAction) || StereotypesHelper.hasStereotype(currentObject,detectionAction)) {
                processAction(currentObject);
            }
            else {
                writeLog("Selected Item is not a ThreatAction or DetectionAction", 1)
            }
        } else {
            //If nothing is selected, find all threatActions and process them
            threatActions = StereotypesHelper.getExtendedElements(threatAction);
            writeLog("Got list of threatActions: " + threatActions, 4);
            writeLog("ThreatAction List Size: " + threatActions.size(), 3);
             for (x = 0; x < threatActions.size(); x++) {
                currentObject = threatActions.get(x);
                processAction(currentObject);
            }
            //Also process all detectionActions
            detectionActions = StereotypesHelper.getExtendedElements(detectionAction);
            writeLog("Got list of detectionActions: " + detectionActions, 4);
            writeLog("DetectionAction List Size: " + detectionActions.size(), 3);
             for (x = 0; x < detectionActions.size(); x++) {
                currentObject = detectionActions.get(x);
                processAction(currentObject);
            }
        }
    }
    finally
    {
        SessionManager.getInstance().closeSession();
    }
}
