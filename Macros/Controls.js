/* 
This macro creates Security Properties from the Assets and Security Controls allocated to ThreatActions and DetectionActions.
When a particular action is selected in the containment tree, only that action is processed.
When nothing is selected in the containment tree, all ThreatActions and DetectionActions are processed. 
Also creates Security Properties for all Security Constraints that are Applied to Assets.

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
var securityConstraintPath = "Cyber::Stereotypes::SecurityConstraint";
var ISMControlPath = "Cyber::Stereotypes::ISMControl";
var securityPropertyPath = "Cyber::Stereotypes::SecurityProperty";
var notAssessedPath = "Cyber::Enumerations::Implementation::Not Assessed";
var notImplementedPath = "Cyber::Enumerations::Implementation::Not Implemented";
var threatActionPath = "Cyber::Stereotypes::ThreatAction";
var detectionActionPath = "Cyber::Stereotypes::DetectionAction";
var securityControlPath = "Cyber::Stereotypes::SecurityControl";
var noneControlPath = "Cyber::Stereotypes::NoneControl";
var noneAssetPath = "Cyber::Stereotypes::NoneAsset";
var systemPath = "Cyber::Stereotypes::System";
var TMAPath = "Cyber::Stereotypes::ThreatModelAction";

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

//Creates security properties for each potentialControl under each allocatedComponent
function createProperties(potentialControls, allocatedComponents, noneControl, systemAsset) {
    notAssessed = Finder.byQualifiedName().find(project, notAssessedPath);
    notImplemented = Finder.byQualifiedName().find(project, notImplementedPath);

    for (i = 0; i < allocatedComponents.size(); i++) {
        currentComponent = allocatedComponents.get(i);
        for (j = 0; j < potentialControls.size(); j++) {
            currentControl = potentialControls.get(j);  
            present = 0;
            nonePresent = 0;
            writeLog("Checking Combination: " + currentComponent.Name + " - " + currentControl.Name, 3);
            for (k = 0; k < currentComponent.getOwnedAttribute().size(); k++) {
                if (currentComponent.getOwnedAttribute().get(k).getType() == currentControl) {
                    present = 1;
                    writeLog("Already exists: " + currentComponent.getName() + " - " + currentControl.getName(), 3);
                }
            }
            if (!present) {
                if(currentControl != noneControl){                            
                    writeLog("Creating property: " + currentComponent.getName() + " - " + currentControl.getName(), 2);
                    currentProperty = ef.createPropertyInstance();
                    currentProperty.setOwner(currentComponent);
                    currentProperty.setType(currentControl);
                    securityProperty = Finder.byQualifiedName().find(project, securityPropertyPath);
                    StereotypesHelper.addStereotype(currentProperty, securityProperty)
                    TagsHelper.setStereotypePropertyValue(currentProperty, securityProperty, "Verified Implementation", notAssessed);
                    TagsHelper.setStereotypePropertyValue(currentProperty, securityProperty, "Designed Implementation", notAssessed);
                    TagsHelper.setStereotypePropertyValue(currentProperty, securityProperty, "Proposed Implementation", notAssessed);
                    new_name = currentComponent.getName() + ' - ' + currentControl.getName();
                    currentProperty.setName(new_name);
                }
                else {
                    for (l = 0; l < systemAsset.getOwnedAttribute().size(); l++) {
                        if (systemAsset.getOwnedAttribute().get(l).getType() == noneControl) {
                            nonePresent = 1;
                            writeLog("Already exists: " + systemAsset.getName() + " - " + noneControl.getName(), 3);
                        }
                    }
                    if(!nonePresent) {
                        writeLog("Creating property: " + systemAsset.getName() + " - " + noneControl.getName(), 2);
                        noneProperty = ef.createPropertyInstance();
                        noneProperty.setOwner(systemAsset);
                        noneProperty.setType(noneControl);
                        securityProperty = Finder.byQualifiedName().find(project, securityPropertyPath);                        
                        StereotypesHelper.addStereotype(noneProperty, securityProperty)
                        TagsHelper.setStereotypePropertyValue(noneProperty, securityProperty, "Verified Implementation", notImplemented);
                        TagsHelper.setStereotypePropertyValue(noneProperty, securityProperty, "Designed Implementation", notImplemented);
                        TagsHelper.setStereotypePropertyValue(noneProperty, securityProperty, "Proposed Implementation", notImplemented);
                        new_name = systemAsset.getName() + ' - ' + noneControl.getName();
                        noneProperty.setName(new_name);
                    }
                }
            }
        }
    }
}

//Extracts the potentialControls and allocatedComponents from a given threatAction
function processAction(object, noneControl, systemAsset) {
    var TMA = Finder.byQualifiedName().find(project, TMAPath);
    writeLog("Processing threatAction: " + object.getName(), 2);
    potentialControls = object.refGetValue("mitigatedBy");
    writeLog("PotentialControls: " + potentialControls, 4);
    allocatedComponents = object.refGetValue("affects");
    writeLog("AllocatedComponents: " + allocatedComponents, 4);
    if(allocatedComponents && potentialControls) {
        createProperties(potentialControls, allocatedComponents, noneControl, systemAsset);
    }
}

function processConstraint(currentConstraint, noneAssetStereo) {
    writeLog("Processing constraint: " + currentConstraint.getName(), 2);
    notAssessed = Finder.byQualifiedName().find(project, notAssessedPath);
    applicableAssets = currentConstraint.refGetValue("Applies");
    for (i = 0; i < applicableAssets.size(); i++) {
        currentAsset = applicableAssets.get(i);
        writeLog("Checking Combination: " + currentAsset.getName() + " - " + currentConstraint.getName(), 3);
        present = 0;
        if(!StereotypesHelper.hasStereotype(currentAsset, noneAssetStereo)) {
            for (k = 0; k < currentAsset.getOwnedAttribute().size(); k++) {
                if (currentAsset.getOwnedAttribute().get(k).getType() == currentConstraint) {
                    present = 1;
                    writeLog("Already exists: " + currentAsset.getName() + " - " + currentConstraint.getName(), 3);
                }
            }
            if (!present) {   
                writeLog("Creating property: " + currentAsset.getName() + " - " + currentConstraint.getName(), 2);
                currentProperty = ef.createPropertyInstance();
                currentProperty.setOwner(currentAsset);
                currentProperty.setType(currentConstraint);
                securityProperty = Finder.byQualifiedName().find(project, securityPropertyPath);
                StereotypesHelper.addStereotype(currentProperty, securityProperty)
                TagsHelper.setStereotypePropertyValue(currentProperty, securityProperty, "Verified Implementation", notAssessed);
                TagsHelper.setStereotypePropertyValue(currentProperty, securityProperty, "Designed Implementation", notAssessed);
                TagsHelper.setStereotypePropertyValue(currentProperty, securityProperty, "Proposed Implementation", notAssessed);
                new_name = currentAsset.getName() + ' - ' + currentConstraint.getName();
                currentProperty.setName(new_name);
            }
        }
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
var securityConstraint = Finder.byQualifiedName().find(project, securityConstraintPath);
writeLog("Got securityConstraint stereotype: " + securityConstraint, 5)
var ISMControl = Finder.byQualifiedName().find(project, ISMControlPath);
writeLog("Got ISMControl stereotype: " + ISMControl, 5)

var secControl = Finder.byQualifiedName().find(project, securityControlPath);
var noneControlStereo = Finder.byQualifiedName().find(project, noneControlPath);
var noneControls = StereotypesHelper.getStereotypedElements(noneControlStereo);
if(noneControls.size() > 1)
{
    writeLog("ERROR: More than 1 SecurityControl is typed as a noneControl. This is not a breaking error, but may lead to unexpected results.", 1);
}
if(noneControls.size() != 0) {
    var noneControl = noneControls.get(0);
    writeLog("Found None Control: " + noneControl.getName(), 5);
    writeLog("Found None Control: " + noneControl.getQualifiedName(), 5);
}
else {
    writeLog("ERROR: No Controls are typed as a noneControl. This is not a breaking error, but may lead to unexpected results.", 1);
}


var systemAssetStereo = Finder.byQualifiedName().find(project, systemPath);
var systemAssets = StereotypesHelper.getStereotypedElements(systemAssetStereo);
if(systemAssets.size() > 1)
{
    writeLog("ERROR: More than 1 Asset is typed as a System. This is not a breaking error, but may lead to unexpected results.", 1);
}
if(systemAssets) {
    var systemAsset = systemAssets.get(0);
    writeLog("Found System: " + systemAsset.getName(), 5);
    writeLog("Found System: " + systemAsset.getQualifiedName(), 5);
}
else {
    writeLog("ERROR: No Assets are typed as a System. This is not a breaking error, but may lead to unexpected results.", 1);
}

var noneAssetStereo = Finder.byQualifiedName().find(project, noneAssetPath);

//Get selected object from containment tree
var selectedObjects = project.getBrowser().getContainmentTree().getSelectedNodes();

//If something is selected in containment tree
if(selectedObjects.length > 0) {
    writeLog("Length: " + selectedObjects.length, 5);
    for (x = 0; x < selectedObjects.length; x++) {
        currentObject = selectedObjects[x].getUserObject();
        writeLog("Got object name: " + currentObject.getName(), 5);
        //Process object if it is a threatAction or detectionAction, otherwise do nothing
        if(StereotypesHelper.hasStereotype(currentObject, threatAction) || StereotypesHelper.hasStereotype(currentObject, detectionAction)) {
            processAction(currentObject, noneControl, systemAsset);
        }
        else {
            if(StereotypesHelper.hasStereotypeOrDerived(currentObject, securityConstraint)) {
                processConstraint(currentObject, noneAssetStereo);
            }
            else{
                writeLog("Selected Item is not a ThreatAction or DetectionAction or SecurityConstraint or ISMControl", 1)
            }
        }
    }   
} else {
    //If nothing is selected, find all threatActions and process them
    threatActions = StereotypesHelper.getStereotypedElements(threatAction);
    writeLog("Got list of threatActions: " + threatActions, 4);
    writeLog("ThreatAction List Size: " + threatActions.size(), 3);
        for (x = 0; x < threatActions.size(); x++) {
        currentObject = threatActions.get(x);
        processAction(currentObject, noneControl, systemAsset);
    }
    //Also process all detectionActions
    detectionActions = StereotypesHelper.getStereotypedElements(detectionAction);
    writeLog("Got list of detectionActions: " + detectionActions, 4);
    writeLog("DetectionAction List Size: " + detectionActions.size(), 3);
    for (x = 0; x < detectionActions.size(); x++) {
        currentObject = detectionActions.get(x);
        processAction(currentObject, noneControl, systemAsset);
    }

    //Process SecurityConstraints
    securityConstraints = StereotypesHelper.getStereotypedElementsIncludingDerived(securityConstraint);
    writeLog("Got list of securityConstraints: " + securityConstraints, 2);
    writeLog("SecurityConstraints List Size: " + securityConstraints.size(), 2);     
    for (x = 0; x < securityConstraints.size(); x++) {
        processConstraint(securityConstraints.get(x), noneAssetStereo);
    }
}

SessionManager.getInstance().closeSession();
