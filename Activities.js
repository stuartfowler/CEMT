/* 
This macro creates activities for AggregatedActions.
When a particular action is selected in the containment tree, only that action is processed.
When nothing is selected in the containment tree, all AggregatedActions are processed. 

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
var aggregatedActionPath = "Cyber::Stereotypes::AggregatedAction";
var malActivityPath = "Cyber::Stereotypes::MalActivity";
var nodePath = "UML Standard Profile::UML2 Metamodel::ActivityParameterNode";

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
        function processAggregatedAction(object) {
            writeLog("Processing aggregatedAction: " + object.getName(), 2);
            currentAction = AutomatonMacroAPI.getOpaqueObject(object);
            if(currentAction.behavior) {
                writeLog("Activity already exists: " + currentAction.getName(), 3);
                malActivityStereo = Finder.byQualifiedName().find(project, malActivityPath);
                if(!(StereotypesHelper.hasStereotype(object.getBehavior(), malActivityStereo))) {
                    StereotypesHelper.addStereotype(object.getBehavior(), malActivityStereo);
                }
                if(!(currentAction.getOwner() == currentAction.behavior.getOwner())) {
                    currentAction.behavior.setOwner(currentAction.getOwner());
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
                currentActivity = ef.createActivityInstance();
                currentActivity = AutomatonMacroAPI.getOpaqueObject(currentActivity);
                currentActivity.setOwner(currentAction.getOwner());
                currentActivity.setName(currentAction.getName());
                malActivity = Finder.byQualifiedName().find(project, malActivityPath);
                malActivity = AutomatonMacroAPI.getOpaqueObject(malActivity);
                currentActivity = AutomatonMacroAPI.addStereotype(currentActivity, malActivity);
                writeLog("Activity created: " + currentActivity.getName(), 2);
                currentAction.setBehavior(currentActivity);
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

        //If something is selected in containment tree
        if(project.getBrowser().getContainmentTree().getSelectedNode()) {
            //Get selected object from containment tree
            var currentObject = project.getBrowser().getContainmentTree().getSelectedNode().getUserObject();
            writeLog("Got object name: " + currentObject.getName(), 5);
            //Process object if it is a aggregatedAction, otherwise do nothing
            if(StereotypesHelper.hasStereotype(currentObject,aggregatedAction)) {
                processAggregatedAction(currentObject);
            }
            else {
                writeLog("Selected Item is not an AggregatedAction", 1)
            }
        } else {
            //If nothing is selected, find all aggregatedAction and process them
            aggregatedActions = StereotypesHelper.getExtendedElements(aggregatedAction);
            writeLog("Got list of aggregatedActions: " + aggregatedActions, 4);
            writeLog("Aggregated Action List Size: " + aggregatedActions.size(), 3);
             for (x = 0; x < aggregatedActions.size(); x++) {
                currentObject = aggregatedActions.get(x);
                processAggregatedAction(currentObject);
            }
        }
    }
    finally
    {
        SessionManager.getInstance().closeSession();
    }
}
