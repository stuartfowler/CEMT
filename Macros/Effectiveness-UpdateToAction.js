/* 
This macro aligns the control effectiveness values set on the parametric risk diagrams with 
the derived control effectiveness from the linked ThreatModelActions. It does this by updating
the control effectiveness values on the ThreatModelAction to match the values currently entered
on the selected MitigationControlEffectiveness and/or DetectionControlEffectiveness objects.
The min, max and justification values are all updated by this macro.

Author: Stuart Fowler
Date: 3 July 2023
*/

importClass(com.nomagic.magicdraw.core.Application);
importClass(com.nomagic.magicdraw.core.Project);
importClass(com.nomagic.magicdraw.openapi.uml.SessionManager);
importClass(com.nomagic.magicdraw.openapi.uml.ModelElementsManager);
importClass(com.nomagic.magicdraw.properties.PropertyManager);
importClass(com.nomagic.uml2.ext.jmi.helpers.StereotypesHelper);
importClass(com.nomagic.uml2.ext.jmi.helpers.TagsHelper);
importClass(com.nomagic.uml2.ext.jmi.helpers.CoreHelper);
importClass(com.nomagic.magicdraw.uml.Finder);



var debug = 1;
var uniformPath = "SysML::Non-Normative Extensions::Distributions::Uniform";
var TMAPath = "Cyber::Stereotypes::ThreatModelAction";
var MCAPath = "Cyber::Stereotypes::MitigationControlEffectiveness";
var DCAPath = "Cyber::Stereotypes::DetectionControlEffectiveness";

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

function updateAction(effectiveness, type) {

    if(type == "Threat") {        
        if(TagsHelper.getStereotypePropertyValue(effectiveness, Finder.byQualifiedName().find(project, MCAPath), "overrideDerivedEffectiveness").size() == 1) {
            if(TagsHelper.getStereotypePropertyValue(effectiveness, Finder.byQualifiedName().find(project, MCAPath), "overrideDerivedEffectiveness").get(0) == true) {
                writeLog("ERROR: " + effectiveness.getName() + " has the overrideDerivedEffectiveness flag set. No action has been taken for this property.", 1);
                return;
            }
        }
        action = effectiveness.refGetValue("threatAction");
    } else if(type == "Detection") {
        if(TagsHelper.getStereotypePropertyValue(effectiveness, Finder.byQualifiedName().find(project, DCAPath), "overrideDerivedEffectiveness").size() == 1) {
            if(TagsHelper.getStereotypePropertyValue(effectiveness, Finder.byQualifiedName().find(project, DCAPath), "overrideDerivedEffectiveness").get(0) == true) {
                writeLog("ERROR: " + effectiveness.getName() + " has the overrideDerivedEffectiveness flag set. No action has been taken for this property.", 1);
                return;
            }
        }
        action = effectiveness.refGetValue("detectionAction");
    } else {
        writeLog("ERROR: Incorrect property type detected.", 1);
        return;
    }

    justification = CoreHelper.getComment(effectiveness);
       
    if(TagsHelper.getStereotypePropertyValue(effectiveness, Finder.byQualifiedName().find(project, uniformPath), "min").size() == 1) {
        min = TagsHelper.getStereotypePropertyValue(effectiveness, Finder.byQualifiedName().find(project, uniformPath), "min").get(0);
    } else {
        writeLog("ERROR: The Min field has not been set on this control effectiveness property. Please set this value before trying again.", 1);
        return;
    }
    if(TagsHelper.getStereotypePropertyValue(effectiveness, Finder.byQualifiedName().find(project, uniformPath), "max").size() == 1) {
        max = TagsHelper.getStereotypePropertyValue(effectiveness, Finder.byQualifiedName().find(project, uniformPath), "max").get(0);
    } else {
        writeLog("ERROR: The Max field has not been set on this control effectiveness property. Please set this value before trying again.", 1);
        return;
    }

    writeLog("Justification: " + justification, 2);
    writeLog("min: " + min, 2);
    writeLog("max: " + max, 2);
    writeLog("threatAction: " + action.getName(), 2);
    
    TagsHelper.setStereotypePropertyValue(action, Finder.byQualifiedName().find(project, TMAPath), "controlEffectivenessMin", min);
    TagsHelper.setStereotypePropertyValue(action, Finder.byQualifiedName().find(project, TMAPath), "controlEffectivenessMax", max);
    TagsHelper.setStereotypePropertyValue(action, Finder.byQualifiedName().find(project, TMAPath), "controlEffectivenessJustification", justification);

}

//Initialises by selecting the project and element factory
var project = Application.getInstance().getProject();
writeLog("Got project: " + project, 5);
var ef = project.getElementsFactory();
writeLog("Got elementsFactory: " + ef, 5);
newSession(project, "Image Creation");

try {
    var selectedObjects = project.getBrowser().getContainmentTree().getSelectedNodes();
    for(i = 0; i < selectedObjects.length; i++) {
        currentObject = selectedObjects[i].getUserObject();
        
        if(StereotypesHelper.hasStereotype(currentObject, Finder.byQualifiedName().find(project, DCAPath))) {
            writeLog("Updating Property: " + currentObject.getName(), 1);
            updateAction(currentObject, "Detection");
        } else if (StereotypesHelper.hasStereotype(currentObject, Finder.byQualifiedName().find(project, MCAPath))) {
            writeLog("Updating Property: " + currentObject.getName(), 1);
            updateAction(currentObject, "Threat");
        } else {
            writeLog("Object " + currentObject.getName() + "is not a MitigationControlEffectiveness object or DetectionControlEffectiveness object. Please only select objects of this type.", 1);
        }
    }

} finally {
    SessionManager.getInstance().closeSession();
}