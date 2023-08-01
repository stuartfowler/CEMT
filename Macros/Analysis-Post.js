/* 
This macro retrieves simulation results for the selected SecurityRisk that the 
Analysis-Pre macro recorded to the local filesystem. These simulation results 
are then imported into the model as attached files and the associated results 
attributes on the SecurityRisk are updated . The Analysis-Pre macro should be 
run immediately prior to running this macro.

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
importClass(com.nomagic.task.RunnableWithProgress);
importClass(com.nomagic.ui.ProgressStatusRunner);
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
var systemPath = "Cyber::Stereotypes::System";
var initial = "Cyber::Stereotypes::InitialProbability";
var proposedPath = "Cyber::Enumerations::Maturity::Proposed";
var designedPath = "Cyber::Enumerations::Maturity::Designed";
var verifiedPath = "Cyber::Enumerations::Maturity::Verified";

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

function calculateAverage(arrayList) {
    sum = 0.0;
    for(j = 0; j < arrayList.size(); j++) {
        sum += parseFloat(arrayList.get(j));
    }
    writeLog(sum,5);
    return (sum / (arrayList.size())).toFixed(2);
}

function main(project, ef, progress) {
        //Grabs the SecurityRisk and ThreatLevel stereotypes
        var SR = Finder.byQualifiedName().find(project, secrisk);
        var TL = Finder.byQualifiedName().find(project, threatlevel);
        var IP = Finder.byQualifiedName().find(project, initial);
    
        var systemAssetStereo = Finder.byQualifiedName().find(project, systemPath);
        var systemAssets = StereotypesHelper.getStereotypedElements(systemAssetStereo);
        if(systemAssets.size() > 1)
        {
            writeLog("ERROR: More than 1 Asset is typed as a System. Please remove unnecessary Systems so that there is only a single System.", 1);
            return;
        }
        if(systemAssets.size() != 0)
        {
            var systemAsset = systemAssets.get(0);   
            
            assessmentPhaseLiteral = TagsHelper.getStereotypePropertyValue(systemAsset, systemAssetStereo, "Assessment Phase");
            if(assessmentPhaseLiteral.get(0) == Finder.byQualifiedName().find(project, proposedPath)) {
                var assessmentPhase = "Proposed";
            }
            if(assessmentPhaseLiteral.get(0) == Finder.byQualifiedName().find(project, designedPath)) {
                var assessmentPhase = "Designed";
            }
            if(assessmentPhaseLiteral.get(0) == Finder.byQualifiedName().find(project, verifiedPath)) {
                var assessmentPhase = "Verified";
            }
            writeLog("Found Phase: " + assessmentPhase, 5);
        } else
        {
            writeLog("ERROR: No System Block found. Unable to determine an Assessment Phase without a System Block.", 1);
            return;
        }
    
        //Get selected object from containment tree
        var selectedObjects = project.getBrowser().getContainmentTree().getSelectedNodes();
    
        
        //If something is selected in containment tree
        if(selectedObjects.length == 1) {
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
                    
                TagsHelper.setStereotypePropertyValue(noviceHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + risk.getName() + " - Novice.png");
                TagsHelper.setStereotypePropertyValue(intermediateHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + risk.getName() + " - Intermediate.png");
                TagsHelper.setStereotypePropertyValue(professionalHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + risk.getName() + " - Professional.png");
                TagsHelper.setStereotypePropertyValue(nationHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + risk.getName() + " - Nation State.png");
                TagsHelper.setStereotypePropertyValue(csv, Finder.byQualifiedName().find(project, csvExportPath), "fileName", ".\\Analysis\\CSV - " + risk.getName());
                    
                var tempPath = java.lang.System.getProperty("java.io.tmpdir") + "CEMT\\";
                var NSHistfile = new java.io.File(tempPath + "Histogram - " + risk.getName() + " - Nation State.png");
                var PROHistfile = new java.io.File(tempPath + "Histogram - " + risk.getName() + " - Professional.png");
                var INTHistfile = new java.io.File(tempPath + "Histogram - " + risk.getName() + " - Intermediate.png");
                var NOVHistfile = new java.io.File(tempPath + "Histogram - " + risk.getName() + " - Novice.png");

                var csv = new java.io.File(tempPath + "CSV - " + risk.getName() + ".csv");
        
                if(!NSHistfile.isFile()) {
                    writeLog("ERROR: No Nation State Histogram found in the local filesystem. You need to run the pre-analysis macro before running this post-analysis macro.", 1);
                    return;
                }
                if(!PROHistfile.isFile()) {
                    writeLog("ERROR: No Professional Histogram found in the local filesystem. You need to run the pre-analysis macro before running this post-analysis macro.", 1);
                    return;
                }
                if(!INTHistfile.isFile()) {
                    writeLog("ERROR: No Intermediate Histogram found in the local filesystem. You need to run the pre-analysis macro before running this post-analysis macro.", 1);
                    return;
                }
                if(!NOVHistfile.isFile()) {
                    writeLog("ERROR: No Novice Histogram found in the local filesystem. You need to run the pre-analysis macro before running this post-analysis macro.", 1);
                    return;
                }
                if(!csv.isFile()) {
                    writeLog("ERROR: No CSV Results found in the local filesystem. You need to run the pre-analysis macro before running this post-analysis macro.", 1);
                    return;
                }

                res = Application.getInstance().getGUILog().showQuestion("This script will overwrite any existing results for the " + assessmentPhase + " Phase. Do you want to continue?", false, "Overwrite Results?");
                if(res == 2) {
                    progress.init("Processing simulation results for " + risk.getName(), 0, 2);
                    
    
                    for(i = 0; i < risk.getOwnedElement().size(); i++)
                    {
                        if(StereotypesHelper.hasStereotype(risk.getOwnedElement().get(i), TL))
                        {
                            var threatlev = risk.getOwnedElement().get(i);
                        }
                        if(StereotypesHelper.hasStereotype(risk.getOwnedElement().get(i), IP))
                        {
                            var initialProbability = risk.getOwnedElement().get(i);
                        }
                    }
    
                    origTL = threatlev.getDefaultValue();
                    
                    //Remove existing simulation results
                    if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - " + assessmentPhase + " - Novice").size() == 1) {
                        hpn = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - " + assessmentPhase + " - Novice").get(0);
                        ModelElementsManager.getInstance().removeElement(hpn);
                    }
                    if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - " + assessmentPhase + " - Intermediate").size() == 1) {
                        hpi = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - " + assessmentPhase + " - Intermediate").get(0);
                        ModelElementsManager.getInstance().removeElement(hpi);
                    }
                    if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - " + assessmentPhase + " - Professional").size() == 1) {
                        hpp = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - " + assessmentPhase + " - Professional").get(0);
                        ModelElementsManager.getInstance().removeElement(hpp);
                    }        
                    if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - " + assessmentPhase + " - Nation State").size() == 1) {
                        hpna = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Histogram - " + assessmentPhase + " - Nation State").get(0);
                        ModelElementsManager.getInstance().removeElement(hpna);
                    }
                
                    if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - " + assessmentPhase + " - Novice").size() == 1) {
                        ppn = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - " + assessmentPhase + " - Novice").get(0);
                        ModelElementsManager.getInstance().removeElement(ppn);
                    }
                    if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - " + assessmentPhase + " - Intermediate").size() == 1) {
                        ppi = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - " + assessmentPhase + " - Intermediate").get(0);
                        ModelElementsManager.getInstance().removeElement(ppi);
                    }
                    if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - " + assessmentPhase + " - Professional").size() == 1) {
                        ppp = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - " + assessmentPhase + " - Professional").get(0);
                        ModelElementsManager.getInstance().removeElement(ppp);
                    }
                    if(TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - " + assessmentPhase + " - Nation State").size() == 1) {
                        ppna = TagsHelper.getStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, secrisk), "Parametric - " + assessmentPhase + " - Nation State").get(0);
                        ModelElementsManager.getInstance().removeElement(ppna);
                    }
            
                    progress.increase();
                    progress.setDescription("Saving Parametric Diagram and Histogram Images...");
                    writeLog("Creating Nation State Image.",5);
    
                    tempValue = ValueSpecificationHelper.createValueSpecification(project, threatlev.getType(), "Nation State", null);
                    threatlev.setDefaultValue(tempValue);
    
                    SessionManager.getInstance().closeSession();
                    newSession(project, "Nat Image Creation");
    
                    var NSfile = new java.io.File(tempPath + risk.getName() + " - Nation State.png");                  
                    var NSexporter = new com.nomagic.magicdraw.export.image.ImageExporter();           
                    var NSimage = NSexporter.export(diagram, 1, NSfile);
                    own = Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::" + assessmentPhase + "::Nation State");
                    att = com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.createAttachedFileElement(own);
                    com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.storeFileToAttachedFile(att, NSfile);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Parametric - " + assessmentPhase + " - Nation State", att);
                    
                    
                    att = com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.createAttachedFileElement(own);
                    com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.storeFileToAttachedFile(att, NSHistfile);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Histogram - " + assessmentPhase + " - Nation State", att);
    
                    writeLog("Creating Pro Image.",5);
    
                    tempValue = ValueSpecificationHelper.createValueSpecification(project, threatlev.getType(), "Professional", null);
                    threatlev.setDefaultValue(tempValue);
    
                    SessionManager.getInstance().closeSession();
                    newSession(project, "Pro Image Creation");            
    
                    var PROfile = new java.io.File(tempPath + risk.getName() + " - Professional.png");  
                    var PROexporter = new com.nomagic.magicdraw.export.image.ImageExporter();          
                    var PROimage = PROexporter.export(diagram, 1, PROfile);
                    own = Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::" + assessmentPhase + "::Professional");
                    att = com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.createAttachedFileElement(own);
                    com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.storeFileToAttachedFile(att, PROfile);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Parametric - " + assessmentPhase + " - Professional", att);
                    
                    
                    att = com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.createAttachedFileElement(own);
                    com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.storeFileToAttachedFile(att, PROHistfile);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Histogram - " + assessmentPhase + " - Professional", att);
    
                    writeLog("Creating Intermediate Image.",5);
    
                    tempValue = ValueSpecificationHelper.createValueSpecification(project, threatlev.getType(), "Intermediate", null);
                    threatlev.setDefaultValue(tempValue);
    
                    SessionManager.getInstance().closeSession();
                    newSession(project, "Int Image Creation");            
    
                    var INTfile = new java.io.File(tempPath + risk.getName() + " - Intermediate.png");
                    var INTexporter = new com.nomagic.magicdraw.export.image.ImageExporter();           
                    var INTimage = INTexporter.export(diagram, 1, INTfile);
                    own = Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::" + assessmentPhase + "::Intermediate");
                    att = com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.createAttachedFileElement(own);
                    com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.storeFileToAttachedFile(att, INTfile);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Parametric - " + assessmentPhase + " - Intermediate", att);
                    
                    
                    att = com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.createAttachedFileElement(own);
                    com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.storeFileToAttachedFile(att, INTHistfile);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Histogram - " + assessmentPhase + " - Intermediate", att);
    
                    writeLog("Creating Intermediate Image.",5);
    
                    tempValue = ValueSpecificationHelper.createValueSpecification(project, threatlev.getType(), "Novice", null);
                    threatlev.setDefaultValue(tempValue);
    
                    SessionManager.getInstance().closeSession();
                    newSession(project, "Nov Image Creation");            
    
                    var NOVfile = new java.io.File(tempPath + risk.getName() + " - Novice.png");         
                    var NOVexporter = new com.nomagic.magicdraw.export.image.ImageExporter();           
                    var NOVimage = NOVexporter.export(diagram, 1, NOVfile);
                    own = Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::" + assessmentPhase + "::Novice");
                    att = com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.createAttachedFileElement(own);
                    com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.storeFileToAttachedFile(att, NOVfile);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Parametric - " + assessmentPhase + " - Novice", att);
                    
                    
                    att = com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.createAttachedFileElement(own);
                    com.nomagic.magicdraw.fileattachments.FileAttachmentsHelper.storeFileToAttachedFile(att, NOVHistfile);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Histogram - " + assessmentPhase + " - Novice", att);
    
                    threatlev.setDefaultValue(origTL);
    
                    SessionManager.getInstance().closeSession();
                    newSession(project, "CSV");

                    progress.increase();
                    progress.setDescription("Processing simulation results...");

                    csv = new java.io.File(tempPath + "CSV - " + risk.getName() + ".csv");
                    br = new java.io.BufferedReader(new java.io.FileReader(csv));
                    runs = new ArrayList();
                    line = br.readLine();
                    run = line.split(",");
                    for(i = 0; i < run.length; i++) {
                        if(run[i].contains("Novice")) {
                            if(run[i].contains("Residual")) {
                                var novres = i;
                                writeLog("Novice Residual Found: " + run[i],5);
                            }
                            if(run[i].contains("Detection")) {
                                var novdet = i;
                                writeLog("Novice Detection Found: " + run[i],5);
                            }
                        }
                        if(run[i].contains("Intermediate")) {
                            if(run[i].contains("Residual")) {
                                var intres = i;
                                writeLog("Intermediate Residual Found: " + run[i],5);
                            }
                            if(run[i].contains("Detection")) {
                                var intdet = i;
                                writeLog("Intermediate Detection Found: " + run[i],5);
                            }
                        }
                        if(run[i].contains("Professional")) {
                            if(run[i].contains("Residual")) {
                                var prores = i;
                                writeLog("Professional Residual Found: " + run[i],5);
                            }
                            if(run[i].contains("Detection")) {
                                var prodet = i;
                                writeLog("Professional Detection Found: " + run[i],5);
                            }
                        }
                        if(run[i].contains("Nation State")) {
                            if(run[i].contains("Residual")) {
                                var natres = i;
                                writeLog("Nation State Residual Found: " + run[i],5);
                            }
                            if(run[i].contains("Detection")) {
                                var natdet = i;
                                writeLog("Nation State Detection Found: " + run[i],5);
                            }
                        }
                    }
    
                    novResidual = new ArrayList();
                    novDetection = new ArrayList();
                    intResidual = new ArrayList();
                    intDetection = new ArrayList();
                    proResidual = new ArrayList();
                    proDetection = new ArrayList();
                    natResidual = new ArrayList();
                    natDetection = new ArrayList();
    
                    while((line = br.readLine()) != null) {
                        run = line.split(",");
                        writeLog(line, 5);
                        novResidual.add(run[novres]);
                        novDetection.add(run[novdet]);
                        intResidual.add(run[intres]);
                        intDetection.add(run[intdet]);
                        proResidual.add(run[prores]);
                        proDetection.add(run[prodet]);
                        natResidual.add(run[natres]);
                        natDetection.add(run[natdet]);
                    }
                    br.close();
    
                    novresav = calculateAverage(novResidual);
                    novdetav = calculateAverage(novDetection);
                    intresav = calculateAverage(intResidual);
                    intdetav = calculateAverage(intDetection);
                    proresav = calculateAverage(proResidual);
                    prodetav = calculateAverage(proDetection);
                    natresav = calculateAverage(natResidual);
                    natdetav = calculateAverage(natDetection);
    
                    writeLog("Novice Residual: " + novresav, 5);
                    writeLog("Novice Detection: " + novdetav, 5);
                    writeLog("Intermediate Residual: " + intresav, 5);
                    writeLog("Intermediate Detection: " + intdetav, 5);
                    writeLog("Professional Residual: " + proresav, 5);
                    writeLog("Professional Detection: " + prodetav, 5);
                    writeLog("Nation State Residual: " + natresav, 5);
                    writeLog("Nation State Detection: " + natdetav, 5);
    
                    init = initialProbability.getDefaultValue().getValue();
    
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Simulation Initial Probability - " + assessmentPhase + " - Novice", init);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Simulation Residual Probability - " + assessmentPhase + " - Novice", novresav);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Simulation Detection Probability - " + assessmentPhase + " - Novice", novdetav);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Simulation Initial Probability - " + assessmentPhase + " - Intermediate", init);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Simulation Residual Probability - " + assessmentPhase + " - Intermediate", intresav);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Simulation Detection Probability - " + assessmentPhase + " - Intermediate", intdetav);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Simulation Initial Probability - " + assessmentPhase + " - Professional", init);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Simulation Residual Probability - " + assessmentPhase + " - Professional", proresav);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Simulation Detection Probability - " + assessmentPhase + " - Professional", prodetav);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Simulation Initial Probability - " + assessmentPhase + " - Nation State", init);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Simulation Residual Probability - " + assessmentPhase + " - Nation State", natresav);
                    TagsHelper.setStereotypePropertyValue(risk, SR, "Simulation Detection Probability - " + assessmentPhase + " - Nation State", natdetav);
    
                    progress.increase();
                    progress.setDescription("Cleaning Up...");

                    NOVfile.delete();
                    NOVHistfile.delete();
                    INTfile.delete();
                    INTHistfile.delete();
                    PROfile.delete();
                    PROHistfile.delete();
                    NSfile.delete();
                    NSHistfile.delete();
                    csv.delete();
                } else {
                    writeLog("User exited before new results were added. No data was overwritten.", 1);
                }
            }
            else {
                writeLog("ERROR: Selected object is not a SecurityRisk. Please select one SecurityRisk block in the containment tree and then run the macro again.", 1);
            }
        } 
        else {
            writeLog("ERROR: Please select one SecurityRisk block in the containment tree and then run the macro again.", 1);
        }
}

var task = new RunnableWithProgress({
    run: function(progress) {
       main(project, ef, progress);
    }
});

//Initialises by selecting the project and element factory
var project = Application.getInstance().getProject();
writeLog("Got project: " + project, 5);
var ef = project.getElementsFactory();
writeLog("Got elementsFactory: " + ef, 5);
newSession(project, "Image Creation");

try {
    ProgressStatusRunner.runWithProgressStatus(task, "Post-Analysis Macro", true, 0);
} finally {
    SessionManager.getInstance().closeSession();
}