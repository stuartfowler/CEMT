/* 
This macro updates ISM Controls to ensure the ID number matches the imported Control Number.
This macro should be run after importing ISM Controls from a CSV.
When a particular control is selected in the containment tree, only that control is processed.
When nothing is selected in the containment tree, all ISM Controls are processed. 

Author: Stuart Fowler
Date: 18 March 2022
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
var ISMControlPath = "Cyber::Stereotypes::ISMControl"

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

        function processControl(currentControl) {
            writeLog("Processing ISMControl: " + currentControl.getName(), 2);

            //Find out parent, grandparent and greatgrandparent from topic, section and guideline properties
            control = AutomatonMacroAPI.getOpaqueObject(currentControl);
            ggpPath = control.guideline;
            gpPath = control.section;
            pPath = control.topic;

            //If great grandparent package doesn exist, create it
            if(!(Finder.byQualifiedName().find(project, "ISM::" + ggpPath)))
            {
                writeLog("Creating Package: " + ggpPath, 5);
                ggpPackage = ef.createPackageInstance();
                ggpPackage.setName(ggpPath);
                ggpPackage.setOwner(Finder.byQualifiedName().find(project, "ISM"));
            }

            //If grandparent package doesn exist, create it
            if(!(Finder.byQualifiedName().find(project, "ISM::" + ggpPath + "::" + gpPath)))
            {
                writeLog("Creating Package: " + gpPath, 5);
                gpPackage = ef.createPackageInstance();
                gpPackage.setName(gpPath);
                gpPackage.setOwner(Finder.byQualifiedName().find(project, "ISM::" + ggpPath));
            }

            //If parent package doesn exist, create it
            if(!(Finder.byQualifiedName().find(project, "ISM::" + ggpPath + "::" + gpPath + "::" + pPath)))
            {
                writeLog("Creating Package: " + pPath, 5);
                pPackage = ef.createPackageInstance();
                pPackage.setName(pPath);
                pPackage.setOwner(Finder.byQualifiedName().find(project, "ISM::" + ggpPath + "::" + gpPath));
            }

            //If ISM control is not in parent package, move it
            owningPackage = Finder.byQualifiedName().find(project, "ISM::" + ggpPath + "::" + gpPath + "::" + pPath);
            owningPackage = AutomatonMacroAPI.getOpaqueObject(owningPackage);
            if(control.getOwner() != owningPackage) {
                writeLog("Moving Control: " + control.Name, 5);
                control.setOwner(owningPackage);
            }

            //Set ISM ID to match name property
            control.setISM_ID(control.Name);
        }

        //Initialises by selecting the project and element factory
        var project = Application.getInstance().getProject();
        writeLog("Got project: " + project, 5);
        var ef = project.getElementsFactory();
        writeLog("Got elementsFactory: " + ef, 5);
        newSession(project, "ISMControl");

        //Grabs the ISMControl stereotypes
        ISMControlStereo = Finder.byQualifiedName().find(project, ISMControlPath);
        writeLog("Got ISMControl stereotype: " + ISMControlStereo, 5);

        //Finds all ISMControls and processes them
        ISMControls = StereotypesHelper.getExtendedElements(ISMControlStereo);
        writeLog("ISMControls List Size: " + ISMControls.size(), 3);
        for(x = 0; x < ISMControls.size(); x++) {
            currentControl = ISMControls.get(x);
            processControl(currentControl);
        }
    }
    finally
    {
        SessionManager.getInstance().closeSession();
    }
}
