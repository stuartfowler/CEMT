/* 
This macro runs a simulation on the selected SecurityRisk which simulates the risk
with all four ThreatLevels with the control effectiveness and initial probability 
values currently entered into the model. These simulation results are then saved to
a temporarily location on the local filesystem for retrieval by the accompanying 
Analysis-Post macro. The Analysis-Post macro should be run immediately after this
macro.

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
importClass(com.nomagic.magicdraw.export.image.ImageExporter);
importClass(com.nomagic.magicdraw.simulation.execution.SimulationExecutionListener);
importClass(com.nomagic.magicdraw.simulation.SimulationManager);
importClass(com.nomagic.task.RunnableWithProgress);


var debug = 1;
var timeSeriesChartPath = "SimulationProfile::ui::TimeSeriesChart";
var csvExportPath = "SimulationProfile::config::CSVExport";
var threatlevel = "Cyber::Stereotypes::ThreatLevel";
var secrisk = "Cyber::Stereotypes::SecurityRisk";
var histogramPath = "SimulationProfile::ui::Histogram";

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



//Initialises by selecting the project and element factory
var project = Application.getInstance().getProject();
writeLog("Got project: " + project, 5);
var ef = project.getElementsFactory();
writeLog("Got elementsFactory: " + ef, 5);
newSession(project, "Image Creation");

try {
    //Grabs the SecurityRisk and ThreatLevel stereotypes
    var SR = Finder.byQualifiedName().find(project, secrisk);
    var TL = Finder.byQualifiedName().find(project, threatlevel);

    //Get selected object from containment tree
    var selectedObjects = project.getBrowser().getContainmentTree().getSelectedNodes();

    //If something is selected in containment tree
    if(selectedObjects.length = 1) {
        if(StereotypesHelper.hasStereotype(selectedObjects[0].getUserObject(), SR)) {    
            risk = selectedObjects[0].getUserObject();
            writeLog("Got risk: " + risk.getName(), 5);

            diagram = project.getDiagram(risk.get_diagramOfContext().get(0));
            writeLog("Risk Owned Element Size: " + risk.getOwnedElement().size(), 5);
            
            analysis = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "SecurityAnalysis");
       
            analysisPackage = analysis.get(0).getOwner();

            riskPackage = analysisPackage.getOwner();
            writeLog("Got risk package: " + riskPackage.getName(), 5);

            for(i = 0; i < analysisPackage.getOwnedElement().size(); i++)
            {
                currentElement = analysisPackage.getOwnedElement().get(i);            
                if(currentElement.getHumanType() == "Simulation Configuration") {
                    simulationConfig = currentElement;
                }
                if(currentElement.getHumanType() == "Histogram") {
                    split = currentElement.getName().split(" ");
                    if(split[split.length-2] == "Nation" && split[split.length-1] == "State") {
                        nationHistogram = currentElement;
                    }
                    if(split[split.length-1] == "Professional") {
                        professionalHistogram = currentElement;
                    }
                    if(split[split.length-1] == "Intermediate") {
                        intermediateHistogram = currentElement;
                    }
                    if(split[split.length-1] == "Novice") {
                        noviceHistogram = currentElement;
                    }
                }
                if(currentElement.getHumanType() == "CSVExport") {
                    csv = currentElement;
                }
                if(currentElement.getHumanType() == "SecurityAnalysis") {
                    analysis = currentElement;
                }
            }
            writeLog("Config: " + simulationConfig.getName(),5);
            writeLog("Nation State Histogram: " + nationHistogram.getName(),5);
            writeLog("Professional Histogram: " + professionalHistogram.getName(),5);
            writeLog("Intermediate Histogram: " + intermediateHistogram.getName(),5);
            writeLog("Novice Histogram: " + noviceHistogram.getName(),5);
            writeLog("CSV: " + csv.getName(),5);
            
            tempPath = java.lang.System.getProperty("java.io.tmpdir") + "CEMT\\";

            
            TagsHelper.setStereotypePropertyValue(noviceHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", tempPath + "Histogram - " + risk.getName() + " - Novice.png");
            TagsHelper.setStereotypePropertyValue(intermediateHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", tempPath + "Histogram - " + risk.getName() + " - Intermediate.png");
            TagsHelper.setStereotypePropertyValue(professionalHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", tempPath + "Histogram - " + risk.getName() + " - Professional.png");
            TagsHelper.setStereotypePropertyValue(nationHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", tempPath + "Histogram - " + risk.getName() + " - Nation State.png");
            TagsHelper.setStereotypePropertyValue(csv, Finder.byQualifiedName().find(project, csvExportPath), "fileName", tempPath + "CSV - " + risk.getName() + ".csv");
            
            SimulationManager.executeWithConfig(analysis, simulationConfig, true);

            writeLog("Simulation Started. Please wait for the Simulation to complete, and then run the Analysis-Post macro.",5);

        }
        else {
            writeLog("ERROR: Selected object is not a SecurityRisk. Please select one SecurityRisk block in the containment tree and then run the macro again.", 1);
        }
    } 
    else {
        writeLog("ERROR: Please select one SecurityRisk block in the containment tree and then run the macro again.", 1);
    }
} finally {
    SessionManager.getInstance().closeSession();
}