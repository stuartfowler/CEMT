/* 
This macro adds the selected Assets, ThreatActions, ThreatImpactSignals and/or MisuseCases to the
appropriate filters for the Bowtie Diagrams and Attack Trees. This macro can be used as a shortcut
when added objects to these filters instead of dragging and dropping the object in the model. 

Author: Stuart Fowler
Date: 4 August 2022
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

var assetPath = "Cyber::Stereotypes::Asset";
var threatActionPath = "Cyber::Stereotypes::ThreatAction";
var threatImpactSignalPath = "Cyber::Stereotypes::ThreatImpactSignal";
var misuseCasePath = "Cyber::Stereotypes::MisuseCase";

var assetFilterPath = "Summary Diagrams::Asset Filter"
var actionFilterPath = "Summary Diagrams::Action Filter"
var impactFilterPath = "Summary Diagrams::Impact Filter"
var misuseFilterPath = "Summary Diagrams::Misuse Case Filter"

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

        //Checks if Asset is part of filter and add if not
        function processAsset(object) {
            writeLog("Processing Asset: " + object.getName(), 2);
            var assetFilter = Finder.byQualifiedName().find(project, assetFilterPath);
            if(!assetFilter) {
                writeLog("Asset Filter not found at " + assetFilterPath + ". No action taken.", 1);
                return;
            }
            assetObject = AutomatonMacroAPI.getOpaqueObject(object);
            assetFilterObject = AutomatonMacroAPI.getOpaqueObject(assetFilter);
            if(!(assetFilterObject.AdditionalElements.contains(assetObject))) {
                assetFilterObject.AdditionalElements.add(assetObject);
                writeLog("Asset added to Filter: " + object.getName(), 2);
            }
        }
        
        //Checks if Action is part of filter and add if not
        function processThreat(object) {
            writeLog("Processing Action: " + object.getName(), 2);
            var actionFilter = Finder.byQualifiedName().find(project, actionFilterPath);
            if(!actionFilter) {
                writeLog("Action Filter not found at " + actionFilterPath + ". No action taken.", 1);
                return;
            }
            actionObject = AutomatonMacroAPI.getOpaqueObject(object);
            actionFilterObject = AutomatonMacroAPI.getOpaqueObject(actionFilter);
            if(!(actionFilterObject.AdditionalElements.contains(actionObject))) {
                actionFilterObject.AdditionalElements.add(actionObject);
                writeLog("Action added to Filter: " + object.getName(), 2);
            }
        }

        //Checks if Impact is part of filter and add if not
        function processImpact(object) {
            writeLog("Processing Impact: " + object.getName(), 2);
            var impactFilter = Finder.byQualifiedName().find(project, impactFilterPath);
            if(!impactFilter) {
                writeLog("Impact Filter not found at " + impactFilterPath + ". No action taken.", 1);
                return;
            }
            impactObject = AutomatonMacroAPI.getOpaqueObject(object);
            impactFilterObject = AutomatonMacroAPI.getOpaqueObject(impactFilter);
            if(!(impactFilterObject.AdditionalElements.contains(impactObject))) {
                impactFilterObject.AdditionalElements.add(impactObject);
                writeLog("Impact added to Filter: " + object.getName(), 2);
            }
        }

        //Checks if Misuse is part of filter and add if not
        function processMisuse(object) {
            writeLog("Processing Misuse Case: " + object.getName(), 2);
            var misuseFilter = Finder.byQualifiedName().find(project, misuseFilterPath);
            if(!misuseFilter) {
                writeLog("Misuse Case Filter not found at " + misuseFilterPath + ". No action taken.", 1);
                return;
            }
            misuseObject = AutomatonMacroAPI.getOpaqueObject(object);
            misuseFilterObject = AutomatonMacroAPI.getOpaqueObject(misuseFilter);
            if(!(misuseFilterObject.AdditionalElements.contains(misuseObject))) {
                misuseFilterObject.AdditionalElements.add(misuseObject);
                writeLog("Misuse Case added to Filter: " + object.getName(), 2);
            }
        }

        //Initialises by selecting the project and element factory
        var project = Application.getInstance().getProject();
        writeLog("Got project: " + project, 5);
        newSession(project, "Filter Update");

        //Grabs the Asset stereotype
        assetStereo = Finder.byQualifiedName().find(project, assetPath);
        writeLog("Got securityProperty stereotype: " + assetStereo, 5);

        //Grabs the Asset stereotype
        threatActionStereo = Finder.byQualifiedName().find(project, threatActionPath);
        writeLog("Got securityProperty stereotype: " + threatActionStereo, 5);        
        
        //Grabs the Asset stereotype
        threatImpactSignalStereo = Finder.byQualifiedName().find(project, threatImpactSignalPath);
        writeLog("Got securityProperty stereotype: " + threatImpactSignalStereo, 5);        
        
        //Grabs the Asset stereotype
        misuseCaseStereo = Finder.byQualifiedName().find(project, misuseCasePath);
        writeLog("Got securityProperty stereotype: " + misuseCaseStereo, 5);

        //Get selected object from containment tree
        var selectedObjects = project.getBrowser().getContainmentTree().getSelectedNodes();

        //If something is selected in containment tree
        if(selectedObjects.length > 0) {
            writeLog("Length: " + selectedObjects.length, 5);
            for (x = 0; x < selectedObjects.length; x++) {
                currentObject = selectedObjects[x].getUserObject();
                writeLog("Got object name: " + currentObject.getName(), 5);
                //Process object if it is a securityProperty, otherwise do nothing
                if(StereotypesHelper.hasStereotype(currentObject,assetStereo)) {
                    processAsset(currentObject);
                }
                else {
                    if(StereotypesHelper.hasStereotype(currentObject, threatActionStereo)) {
                        processThreat(currentObject);
                    }
                    else {
                        if(StereotypesHelper.hasStereotype(currentObject, threatImpactSignalStereo)) {
                            processImpact(currentObject);
                        }
                        else {
                            if(StereotypesHelper.hasStereotype(currentObject, misuseCaseStereo)) {
                                processMisuse(currentObject);
                            }
                            else {
                                writeLog(currentObject.getName() + "is not an Asset, ThreatAction, ThreatImpactSignal or Misuse Case", 1)
                            }
                        }
                    }
                }
            }
        } else {
            writeLog("Nothing is selected in the containment tree. No action taken.", 1)
        }
    }
    finally
    {
        SessionManager.getInstance().closeSession();
    }
}
