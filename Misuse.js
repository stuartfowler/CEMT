/* 
This macro ensures that activities under MisuseCases are apporpriate stereotyped.
When a particular misuse case is selected in the containment tree, only that misuse case is processed.
When nothing is selected in the containment tree, all MisuseCases are processed. 
Author: Stuart Fowler
Date: 22 June 2021
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
    com.nomagic.uml2.ext.magicdraw.commonbehaviors.mdbasicbehaviors,
    java.lang);

var debug = 2;
var misuseCasePath = "Cyber::Stereotypes::MisuseCase";
var malActivityPath = "Cyber::Stereotypes::MalActivity";

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

        //Checks misusecase name and updates as required
        function processMisuseCase(object) {
            writeLog("Processing misuseCase: " + object.getName(), 2);
            currentAction = AutomatonMacroAPI.getOpaqueObject(object);
            ownedActivities = object.getOwnedElement();
            for(i = 0; i < ownedActivities.size(); i++) {
                if(ownedActivities[i].getName() == object.getName()) {
                    malActivity = Finder.byQualifiedName().find(project, malActivityPath);
                    if(StereotypesHelper.hasStereotype(ownedActivities[i],malActivity)) {
                        writeLog("Selected Item already contains a MalActivity", 4)
                    }
                    else {
                        StereotypesHelper.addStereotype(ownedActivities[i],malActivity);
                    }
                }
            }
        }

        //Initialises by selecting the project and element factory
        var project = Application.getInstance().getProject();
        writeLog("Got project: " + project, 5);
        var ef = project.getElementsFactory();
        writeLog("Got elementsFactory: " + ef, 5);
        newSession(project, "Misuse Activity Creation");

        //Grabs the misuseCase stereotypes
        misuseCase = Finder.byQualifiedName().find(project, misuseCasePath);
        writeLog("Got misuseCase stereotype: " + misuseCase, 5);

        //If something is selected in containment tree
        if(project.getBrowser().getContainmentTree().getSelectedNode()) {
            //Get selected object from containment tree
            var currentObject = project.getBrowser().getContainmentTree().getSelectedNode().getUserObject();
            writeLog("Got object name: " + currentObject.getName(), 5);
            //Process object if it is a misuseCase, otherwise do nothing
            if(StereotypesHelper.hasStereotype(currentObject,misuseCase)) {
                processMisuseCase(currentObject);
            }
            else {
                writeLog("Selected Item is not a Misuse Case", 1)
            }
        } else {
            //If nothing is selected, find all misuseCase and process them
            misuseCases = StereotypesHelper.getExtendedElements(misuseCase);
            writeLog("Got list of misuseCases: " + misuseCases, 4);
            writeLog("Misuse Case List Size: " + misuseCases.size(), 3);
             for (x = 0; x < misuseCases.size(); x++) {
                currentObject = misuseCases.get(x);
                processMisuseCase(currentObject);
            }
        }
    }
    finally
    {
        SessionManager.getInstance().closeSession();
    }
}
