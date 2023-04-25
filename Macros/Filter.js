/* 
This macro adds the selected Assets, ThreatActions, ThreatImpactSignals and/or MisuseCases to the
appropriate filters for the Bowtie Diagrams and Attack Trees. This macro can be used as a shortcut
when added objects to these filters instead of dragging and dropping the object in the model. 

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

var assetPath = "Cyber::Stereotypes::Asset";
var systemPath = "Cyber::Stereotypes::System";
var threatActionPath = "Cyber::Stereotypes::ThreatAction";
var threatImpactSignalPath = "Cyber::Stereotypes::ThreatImpactSignal";
var misuseCasePath = "Cyber::Stereotypes::MisuseCase";

var assetFilterPath = "Summary Diagrams::Asset Filter";
var actionFilterPath = "Summary Diagrams::Action Filter";
var impactFilterPath = "Summary Diagrams::Impact Filter";
var misuseFilterPath = "Summary Diagrams::Misuse Case Filter";

var smartPackagePath = "UML Standard Profile::MagicDraw Profile::SmartPackage";

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

//Checks if Asset is part of filter; if yes, remove; if no, add
function processAsset(object) {
    writeLog("Processing Asset: " + object.getName(), 2);
    var assetFilter = Finder.byQualifiedName().find(project, assetFilterPath);
    if(!assetFilter) {
        writeLog("Asset Filter not found at " + assetFilterPath + ". No action taken.", 1);
        return;
    }
    smartPackage = Finder.byQualifiedName().find(project, smartPackagePath);
    assetFilterElements = TagsHelper.getStereotypePropertyValue(assetFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY);
    if((assetFilterElements.contains(object))) {
        assetFilterElements.remove(object);
        TagsHelper.setStereotypePropertyValue(assetFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY, assetFilterElements);
        writeLog("Asset removed from Filter: " + object.getName(), 2);
    }
    else{
        if(assetFilterElements.isEmpty()) {
            TagsHelper.setStereotypePropertyValue(assetFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY, object);
        }
        else {
            assetFilterElements.add(object);
            TagsHelper.setStereotypePropertyValue(assetFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY, assetFilterElements);
        }
        writeLog("Asset added to Filter: " + object.getName(), 2);
    }
}

//Checks if Action is part of filter; if yes, remove; if no, add
function processThreat(object) {
    writeLog("Processing Action: " + object.getName(), 2);
    var actionFilter = Finder.byQualifiedName().find(project, actionFilterPath);
    if(!actionFilter) {
        writeLog("Action Filter not found at " + actionFilterPath + ". No action taken.", 1);
        return;
    }
    smartPackage = Finder.byQualifiedName().find(project, smartPackagePath);
    actionFilterElements = TagsHelper.getStereotypePropertyValue(actionFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY);
    if((actionFilterElements.contains(object))) {
        actionFilterElements.remove(object);
        TagsHelper.setStereotypePropertyValue(actionFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY, actionFilterElements);
        writeLog("Action removed from Filter: " + object.getName(), 2);
    }
    else{
        if(actionFilterElements.isEmpty()) {
            TagsHelper.setStereotypePropertyValue(actionFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY, object);
        }
        else {
            actionFilterElements.add(object);
            TagsHelper.setStereotypePropertyValue(actionFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY, actionFilterElements);
        }
        
        writeLog("Action added to Filter: " + object.getName(), 2);
    }
}

//Checks if Impact is part of filter; if yes, remove; if no, add
function processImpact(object) {
    writeLog("Processing Impact: " + object.getName(), 2);
    var impactFilter = Finder.byQualifiedName().find(project, impactFilterPath);
    if(!impactFilter) {
        writeLog("Impact Filter not found at " + impactFilterPath + ". No action taken.", 1);
        return;
    }
    smartPackage = Finder.byQualifiedName().find(project, smartPackagePath);
    impactFilterElements = TagsHelper.getStereotypePropertyValue(impactFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY);
    if((impactFilterElements.contains(object))) {
        impactFilterElements.remove(object);
        TagsHelper.setStereotypePropertyValue(impactFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY, impactFilterElements);
        writeLog("Impact removed from Filter: " + object.getName(), 2);
    }
    else{
        if(impactFilterElements.isEmpty()) {
            TagsHelper.setStereotypePropertyValue(impactFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY, object);
        }
        else {
            impactFilterElements.add(object);
            TagsHelper.setStereotypePropertyValue(impactFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY, impactFilterElements);
        }
        writeLog("Impact added to Filter: " + object.getName(), 2);
    }
}

//Checks if Misuse is part of filter; if yes, remove; if no, add
function processMisuse(object) {
    writeLog("Processing Misuse Case: " + object.getName(), 2);
    var misuseFilter = Finder.byQualifiedName().find(project, misuseFilterPath);
    if(!misuseFilter) {
        writeLog("Misuse Case Filter not found at " + misuseFilterPath + ". No action taken.", 1);
        return;
    }
    smartPackage = Finder.byQualifiedName().find(project, smartPackagePath);
    misuseFilterElements = TagsHelper.getStereotypePropertyValue(misuseFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY);
    if((misuseFilterElements.contains(object))) {
        misuseFilterElements.remove(object);
        TagsHelper.setStereotypePropertyValue(misuseFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY, misuseFilterElements);
        writeLog("Misuse Case removed from Filter: " + object.getName(), 2);
    }
    else{
        if(misuseFilterElements.isEmpty()) {
            TagsHelper.setStereotypePropertyValue(misuseFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY, object);
        }
        else {
            misuseFilterElements.add(object);
            TagsHelper.setStereotypePropertyValue(misuseFilter, smartPackage, MagicDrawProfile.SMARTPACKAGE_ADDITIONALELEMENTS_PROPERTY, misuseFilterElements);
        }
        writeLog("Misuse Case added to Filter: " + object.getName(), 2);
    }
}

//Initialises by selecting the project and element factory
var project = Application.getInstance().getProject();
writeLog("Got project: " + project, 5);
newSession(project, "Filter Update");

try {
    //Grabs the Asset stereotype
    assetStereo = Finder.byQualifiedName().find(project, assetPath);
    writeLog("Got Asset stereotype: " + assetStereo, 5);

    //Grabs the System stereotype
    systemStereo = Finder.byQualifiedName().find(project, systemPath);
    writeLog("Got System stereotype: " + systemStereo, 5);

    //Grabs the threatAction stereotype
    threatActionStereo = Finder.byQualifiedName().find(project, threatActionPath);
    writeLog("Got threatAction stereotype: " + threatActionStereo, 5);        

    //Grabs the threatImpactSignal stereotype
    threatImpactSignalStereo = Finder.byQualifiedName().find(project, threatImpactSignalPath);
    writeLog("Got threatImpactSignal stereotype: " + threatImpactSignalStereo, 5);        

    //Grabs the misuseCase stereotype
    misuseCaseStereo = Finder.byQualifiedName().find(project, misuseCasePath);
    writeLog("Got misuseCase stereotype: " + misuseCaseStereo, 5);

    //Get selected object from containment tree
    var selectedObjects = project.getBrowser().getContainmentTree().getSelectedNodes();

    //If something is selected in containment tree
    if(selectedObjects.length > 0) {
        writeLog("Length: " + selectedObjects.length, 5);
        for (x = 0; x < selectedObjects.length; x++) {
            currentObject = selectedObjects[x].getUserObject();
            writeLog("Got object name: " + currentObject.getName(), 5);
            //Process object if it is a securityProperty, otherwise do nothing
            if(StereotypesHelper.hasStereotype(currentObject,assetStereo) || StereotypesHelper.hasStereotype(currentObject,systemStereo)) {
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
} finally {
    SessionManager.getInstance().closeSession();
}