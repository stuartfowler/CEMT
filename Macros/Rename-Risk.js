/* 
This macro renames the selected SecurityRisk as well as all other elements and
attributes that share the name of the SecurityRisk. This macro is unable to 
update the saved images of any previous results, where the SecurityRisk name is
included as the Title of a histogram or parametric drawing. All future simulations
completed after running this renaming macro will produce result images that reflect
the updated risk name in the title of the images.

Author: Stuart Fowler
Date: 20 December 2022
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
var secrisk = "Cyber::Stereotypes::SecurityRisk";
var secana = "Cyber::Stereotypes::SecurityAnalysis";
var assetPath = "Cyber::Stereotypes::Asset";
var simulationConfigStereotypePath = "SimulationProfile::config::SimulationConfig";
var timeSeriesChartPath = "SimulationProfile::ui::TimeSeriesChart";
var histogramPath = "SimulationProfile::ui::Histogram";
var csvExportStereotypePath = "SimulationProfile::config::CSVExport";
var attachedFilePath = "UML Standard Profile::MagicDraw Profile::AttachedFile";


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

function updateRisk(risk) {

    res = "";
    res = Application.getInstance().getGUILog().showInputTextDialog("Rename Risk", "Please enter a new risk name. (Current name: " + risk.getName() + ")");
    if(res == "") {
        writeLog("ERROR: Risk Name not entered, no action taken.", 1);
        return;
    }
    riskName = res;
    writeLog("New Name: " + riskName, 5);
    

    
    diagram = risk.get_diagramOfContext().get(0);
    writeLog("Got Diagram: " + diagram.getName(), 5);
    diagram.setName(riskName);
    simconfigs = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Simulation Configuration");
    
    for(i = 0; i < simconfigs.size(); i++) {
        simconf = simconfigs.get(i);
        simconf.setName(riskName);
        writeLog("Got Simulation Configuration: " + simconf.getName(), 5);
        histograms = TagsHelper.getStereotypePropertyValue(simconf, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "UI");
        for(j=0; j < histograms.size(); j++) {
            hist = histograms.get(j);
            writeLog("Got Histogram: " + hist.getName(), 5);
            TagsHelper.setStereotypePropertyValue(hist, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + riskName + ".png");
            TagsHelper.setStereotypePropertyValue(hist, Finder.byQualifiedName().find(project, histogramPath), "title", "Histogram - " + riskName);
            hist.setName("Histogram - " + riskName);
        }
    }

    analysis = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "SecurityAnalysis").get(0);
    writeLog("Got SecurityAnalysis: " + analysis.getName(), 5);
    analysis.setName("Analysis - " + riskName);

    folder = analysis.getOwner().getOwner();
    writeLog("Got Package: " + folder.getName(), 5);
    folder.setName(riskName);

    simconfigs = TagsHelper.getStereotypePropertyValue(analysis, Finder.byQualifiedName().find(project, secana), "Simulation Configuration");
    
    for(i = 0; i < simconfigs.size(); i++) {
        simconf = simconfigs.get(i);
        simconf.setName(riskName);
        writeLog("Got Simulation Configuration: " + simconf.getName(), 5);
        histograms = TagsHelper.getStereotypePropertyValue(simconf, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "UI");
        for(j=0; j < histograms.size(); j++) {
            hist = histograms.get(j);
            split = hist.getName().split(" ");
            if(split[split.length-2] == "Nation" && split[split.length-1] == "State") {
                TagsHelper.setStereotypePropertyValue(hist, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + riskName + " - Nation State.png");
                TagsHelper.setStereotypePropertyValue(hist, Finder.byQualifiedName().find(project, histogramPath), "title", "Histogram - " + riskName + " - Nation State");
                hist.setName(riskName + " - Nation State");
                writeLog("Got Nation State Histogram: " + hist.getName(), 5);
            }
            if(split[split.length-1] == "Professional") {
                TagsHelper.setStereotypePropertyValue(hist, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + riskName + " - Professional.png");
                TagsHelper.setStereotypePropertyValue(hist, Finder.byQualifiedName().find(project, histogramPath), "title", "Histogram - " + riskName + " - Professional");
                hist.setName(riskName + " - Professional");
                writeLog("Got Professional Histogram: " + hist.getName(), 5);
            }
            if(split[split.length-1] == "Intermediate") {
                TagsHelper.setStereotypePropertyValue(hist, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + riskName + " - Intermediate.png");
                TagsHelper.setStereotypePropertyValue(hist, Finder.byQualifiedName().find(project, histogramPath), "title", "Histogram - " + riskName + " - Intermediate");
                hist.setName(riskName + " - Intermediate");
                writeLog("Got Intermediate Histogram: " + hist.getName(), 5);
            }
            if(split[split.length-1] == "Novice") {
                TagsHelper.setStereotypePropertyValue(hist, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + riskName + " - Novice.png");
                TagsHelper.setStereotypePropertyValue(hist, Finder.byQualifiedName().find(project, histogramPath), "title", "Histogram - " + riskName + " - Novice");
                hist.setName(riskName + " - Novice");
                writeLog("Got Novice Histogram: " + hist.getName(), 5);
            }
            
        }
        csvs = TagsHelper.getStereotypePropertyValue(simconf, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "executionListeners");
        for(k = 0; k < csvs.size(); k++) {
            csv = csvs.get(k);
            writeLog("Got CSV Export: " + csv.getName(), 5);
            TagsHelper.setStereotypePropertyValue(csv, Finder.byQualifiedName().find(project, csvExportStereotypePath), "fileName", ".\\Analysis\\CSV - " + riskName + ".csv");
            csv.setName("Export - " + riskName);
        }
    }

    risk.setName(riskName);

    res = Application.getInstance().getGUILog().showQuestion("Do you want also want to change the names of the Attached Results Files? (NOTE: This can't/doesn't change the embedded titles in the images!)", false, "Change Results Files?");
    if(res == 2){
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Proposed - Novice").size() == 1) {
            hpn = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Proposed - Novice").get(0);
            hpn.setBody("Histogram - " + riskName + " - Novice.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Proposed - Intermediate").size() == 1) {
            hpi = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Proposed - Intermediate").get(0);
            hpi.setBody("Histogram - " + riskName + " - Intermediate.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Proposed - Professional").size() == 1) {
            hpp = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Proposed - Professional").get(0);
            hpp.setBody("Histogram - " + riskName + " - Professional.png");
        }        
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Proposed - Nation State").size() == 1) {
            hpna = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Proposed - Nation State").get(0);
            hpna.setBody("Histogram - " + riskName + " - Nation State.png");
        }

        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Designed - Novice").size() == 1) {
            hdn = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Designed - Novice").get(0);
            hdn.setBody("Histogram - " + riskName + " - Novice.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Designed - Intermediate").size() == 1) {
            hdi = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Designed - Intermediate").get(0);
            hdi.setBody("Histogram - " + riskName + " - Intermediate.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Designed - Professional").size() == 1) {
            hdp = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Designed - Professional").get(0);
            hdp.setBody("Histogram - " + riskName + " - Professional.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Designed - Nation State").size() == 1 ) {
            hdna = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Designed - Nation State").get(0);
            hdna.setBody("Histogram - " + riskName + " - Nation State.png");
        }

        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Verified - Novice").size() == 1) {
            hvn = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Verified - Novice").get(0);
            hvn.setBody("Histogram - " + riskName + " - Novice.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Verified - Intermediate").size() == 1) {
            hvi = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Verified - Intermediate").get(0);
            hvi.setBody("Histogram - " + riskName + " - Intermediate.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Verified - Professional").size() == 1) {
            hvp = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Verified - Professional").get(0);
            hvp.setBody("Histogram - " + riskName + " - Professional.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Verified - Nation State").size() == 1) {
            hvna = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - Verified - Nation State").get(0);
            hvna.setBody("Histogram - " + riskName + " - Nation State.png");
        }

        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Proposed - Novice").size() == 1) {
            ppn = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Proposed - Novice").get(0);
            ppn.setBody(riskName + " - Novice.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Proposed - Intermediate").size() == 1) {
            ppi = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Proposed - Intermediate").get(0);
            ppi.setBody(riskName + " - Intermediate.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Proposed - Professional").size() == 1) {
            ppp = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Proposed - Professional").get(0);
            ppp.setBody(riskName + " - Professional.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Proposed - Nation State").size() == 1) {
            ppna = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Proposed - Nation State").get(0);
            ppna.setBody(riskName + " - Nation State.png");
        }

        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Designed - Novice").size() == 1) {
            pdn = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Designed - Novice").get(0);
            pdn.setBody(riskName + " - Novice.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Designed - Intermediate").size() == 1) {
            pdi = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Designed - Intermediate").get(0);
            pdi.setBody(riskName + " - Intermediate.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Designed - Professional").size() == 1) {
            pdp = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Designed - Professional").get(0);
            pdp.setBody(riskName + " - Professional.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Designed - Nation State").size() == 1) {
            pdna = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Designed - Nation State").get(0);
            pdna.setBody(riskName + " - Nation State.png");
        }

        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Verified - Novice").size() == 1) {
            pvn = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Verified - Novice").get(0);
            pvn.setBody(riskName + " - Novice.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Verified - Intermediate").size() == 1) {
            pvi = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Verified - Intermediate").get(0);
            pvi.setBody(riskName + " - Intermediate.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Verified - Professional").size() == 1) {
            pvp = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Verified - Professional").get(0);
            pvp.setBody(riskName + " - Professional.png");
        }
        if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Verified - Nation State").size() == 1) {
            pvna = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - Verified - Nation State").get(0);
            pvna.setBody(riskName + " - Nation State.png");
        }
    }

    writeLog("Renaming complete. The risk name saved inside images from previous simulation results has not been changed. You will need to re-run the simulation to modify these result images.", 1);

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
        writeLog("Found: " + currentObject.getName(), 2);
        if(StereotypesHelper.hasStereotype(currentObject, Finder.byQualifiedName().find(project, secrisk))) {
            writeLog("Updating Risk: " + currentObject.getName(), 1);
            updateRisk(currentObject);
        } else {
            writeLog("Object is not a SecurityRisk object. Please only select objects of this type.", 1);
        }
    }

} finally {
    SessionManager.getInstance().closeSession();
}