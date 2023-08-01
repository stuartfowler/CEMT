/* 
This macro combines two existing risk assessment simulations to provide the ability to simulate two co-requisite risks.
This should be used when a security posture impact (eg. loss of redundant power) needs to be combined with a
threat impact (eg. availability loss of primary power) to get a true likelihood of the impact being realised.
When two SecurityRisks are selected in the containment tree and this macro is run, a new parametric risk
diagram that combines those two risks together will be generated, along with a simulation for that parametric diagram. 

Author: Stuart Fowler
Date: 9 April 2023
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
importClass(com.nomagic.uml2.ext.magicdraw.classes.mdkernel.AggregationKindEnum);
importClass(com.nomagic.magicdraw.sysml.util.SysMLProfile);
importClass(com.nomagic.magicdraw.uml.Finder);
importClass(com.nomagic.magicdraw.uml.Refactoring);
importClass(java.util.ArrayList);
importClass(java.util.HashSet);
importClass(com.nomagic.task.RunnableWithProgress);
importClass(com.nomagic.ui.ProgressStatusRunner);

var debug = 1;


var riskFolderPath = "Risk Assessment"
var securityRiskPath = "Cyber::Stereotypes::SecurityRisk";
var residualProbabilityPath = "Cyber::Stereotypes::ResidualProbability";
var detectionProbabilityPath = "Cyber::Stereotypes::DetectionProbability";
var initialProbabilityPath = "Cyber::Stereotypes::InitialProbability";
var resConstraintPath = "Cyber::Constraints::Combine";
var valuePropertyPath = "MD Customization for SysML::additional_stereotypes::ValueProperty";
var partPropertyPath = "MD Customization for SysML::additional_stereotypes::PartProperty";
var numberPath = "SysML::Libraries::PrimitiveValueTypes::Number";
var detConstraintPath = "Cyber::Constraints::Combine2";
var bindingConnectorPath = "SysML::Blocks::BindingConnector";
var histogramPath = "SimulationProfile::ui::Histogram";
var selectPropertiesPath = "SimulationProfile::config::SelectPropertiesConfig";
var timeSeriesChartPath = "SimulationProfile::ui::TimeSeriesChart";
var threatConstraintStereotypePath = "Cyber::Stereotypes::ThreatConstraint";
var detectConstraintStereotypePath = "Cyber::Stereotypes::DetectConstraint";
var constraintPropertyPath = "MD Customization for SysML::additional_stereotypes::deprecated elements::ConstraintProperty";
var nestedConnectorEndPath = "SysML::Blocks::NestedConnectorEnd";
var threatLevelPath = "Cyber::Stereotypes::ThreatLevel";
var threatPath = "Cyber::Enumerations::Threat";
var securityAnalysisPath = "Cyber::Stereotypes::SecurityAnalysis";


var x_pad = 50;
var y_pad = 50;
var subriskHeight = 200;
var subriskWidth = 150;
var constraintHeight = 100;
var constraintWidth = 100;
var paraWidth = 10;
var paraHeight = paraWidth;
var numHeight = constraintHeight;
var numWidth = constraintWidth;

var subrisk_x = x_pad;
var topsubrisk_y = y_pad;
var botsubrisk_y = y_pad + (subriskHeight * 2) + constraintHeight;

var detConstraint_x = subrisk_x + subriskWidth + x_pad;
var detConstraint_y = y_pad + (subriskHeight * 1.5);
var detPara_x = detConstraint_x + (constraintWidth / 2) - (paraWidth / 2);
var topdetPara_y = detConstraint_y;
var botdetPara_y = detConstraint_y + constraintHeight;
var detoutPara_x = detConstraint_x + constraintWidth;
var detoutPara_y = detConstraint_y + (constraintHeight / 2) - (paraHeight / 2);

var detection_x = detConstraint_x + constraintWidth + x_pad;
var detection_y = detConstraint_y

var resConstraint_x = detection_x + numWidth + x_pad;
var resConstraint_y = detection_y;
var resPara_x = resConstraint_x + (constraintWidth / 2) - (paraWidth / 2);
var topresPara_y = resConstraint_y;
var botresPara_y = resConstraint_y + constraintHeight;
var resoutPara_x = resConstraint_x + constraintWidth;
var resoutPara_y = resConstraint_y + (constraintHeight / 2) - (paraHeight / 2);

var residual_x = resConstraint_x + constraintWidth + x_pad;
var residual_y = resConstraint_y;

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

//Get Selected Nodes as an array objects
function getSelectedObjects(project) {
    //If something is selected in containment tree
    if(project.getBrowser().getContainmentTree().getSelectedNodes().length > 1) {
        //Get selected objects from containment tree
        currentNodes = project.getBrowser().getContainmentTree().getSelectedNodes();
        currentObjects = [];
        for (x = 0; x < currentNodes.length; x++) {
            currentObjects[x] = currentNodes[x].getUserObject();
            writeLog("Got object name: " + currentObjects[x].getName(), 4);
        }
        return currentObjects;   
    } else {
        //If nothing is selected, return false
        return false;
    }
}

function createRisk(project, riskName) {
    if(!(Finder.byQualifiedName().find(project, riskFolderPath))){
        riskPackage = ef.createPackageInstance();
        riskPackage.setName(riskFolderPath);
        riskPackage.setOwner(project.getPrimaryModel());
    }
    threatPackage = ef.createPackageInstance();
    threatPackage.setOwner(Finder.byQualifiedName().find(project, riskFolderPath));
    threatPackage.setName(riskName);         
    writeLog("Created Package: " + threatPackage.getName(), 4);

    riskClass = ef.createClassInstance();
    riskClass.setOwner(threatPackage);
    riskClass.setName(threatPackage.getName());
    StereotypesHelper.addStereotype(riskClass, Finder.byQualifiedName().find(project, securityRiskPath));
    writeLog("Created SecurityRisk: " + riskClass.getName(), 2);

    resultPackage = ef.createPackageInstance();
    resultPackage.setOwner(threatPackage);
    resultPackage.setName("Results");

    proposedPackage = ef.createPackageInstance();
    proposedPackage.setOwner(resultPackage);
    proposedPackage.setName("Proposed");

    proposedNSPackage = ef.createPackageInstance();
    proposedNSPackage.setOwner(proposedPackage);
    proposedNSPackage.setName("Nation State");

    proposedPPackage = ef.createPackageInstance();
    proposedPPackage.setOwner(proposedPackage);
    proposedPPackage.setName("Professional");

    proposedIPackage = ef.createPackageInstance();
    proposedIPackage.setOwner(proposedPackage);
    proposedIPackage.setName("Intermediate");

    proposedNPackage = ef.createPackageInstance();
    proposedNPackage.setOwner(proposedPackage);
    proposedNPackage.setName("Novice");

    designedPackage = ef.createPackageInstance();
    designedPackage.setOwner(resultPackage);
    designedPackage.setName("Designed");

    designedNSPackage = ef.createPackageInstance();
    designedNSPackage.setOwner(designedPackage);
    designedNSPackage.setName("Nation State");

    designedPPackage = ef.createPackageInstance();
    designedPPackage.setOwner(designedPackage);
    designedPPackage.setName("Professional");

    designedIPackage = ef.createPackageInstance();
    designedIPackage.setOwner(designedPackage);
    designedIPackage.setName("Intermediate");

    designedNPackage = ef.createPackageInstance();
    designedNPackage.setOwner(designedPackage);
    designedNPackage.setName("Novice");

    verifiedPackage = ef.createPackageInstance();
    verifiedPackage.setOwner(resultPackage);
    verifiedPackage.setName("Verified");

    verifiedNSPackage = ef.createPackageInstance();
    verifiedNSPackage.setOwner(verifiedPackage);
    verifiedNSPackage.setName("Nation State");

    verifiedPPackage = ef.createPackageInstance();
    verifiedPPackage.setOwner(verifiedPackage);
    verifiedPPackage.setName("Professional");

    verifiedIPackage = ef.createPackageInstance();
    verifiedIPackage.setOwner(verifiedPackage);
    verifiedIPackage.setName("Intermediate");

    verifiedNPackage = ef.createPackageInstance();
    verifiedNPackage.setOwner(verifiedPackage);
    verifiedNPackage.setName("Novice");

    return [threatPackage, riskClass];
}

function createSimulation(riskClass, residualProbability, detectionProbability) {
    simPackage = ef.createPackageInstance();
    simPackage.setOwner(riskClass.getOwner());
    simPackage.setName("Simulation");

    simConfig = ef.createClassInstance();
    simConfig.setName(riskClass.getName());
    simConfig.setOwner(simPackage);

    simulationConfigStereotypePath = "SimulationProfile::config::SimulationConfig";
    StereotypesHelper.addStereotype(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath));
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "executionTarget", riskClass);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "animationSpeed", "100");
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "autoStart", true);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "autostartActiveObjects", true);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "cloneReferences", false);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "decimalPlaces", "1");
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "fireValueChangeEvent", true);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "initializeReferences", false);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "numberOfRuns", "500");
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "recordTimestamp", false);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "rememberFailureStatus", false);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "runForksInParallel", true);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "silent", false);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "solveAfterInitialization", true);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "startWebServer", false);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "addControlPanel", false);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "timeVariableName", "simtime");
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "treatAllClassifiersAsActive", false);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "constraintFailureAsBreakpoint", false);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "openSimulationPane", false);

    valueList = new ArrayList();
    valueList.add(residualProbability);
    valueList.add(detectionProbability);
        
    IDList = new ArrayList();
    IDList.add(residualProbability.getID());
    IDList.add(detectionProbability.getID());

    threatHistogram = ef.createClassInstance();
    threatHistogram.setName("Histogram - " + riskClass.getName());
    threatHistogram.setOwner(simPackage);
    StereotypesHelper.addStereotype(threatHistogram, Finder.byQualifiedName().find(project, histogramPath));
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "represents", riskClass);
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "value", valueList);
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "nestedPropertyPaths", IDList);
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "source", "com.nomagic.magicdraw.simulation.uiprototype.HistogramPlotter");
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, histogramPath), "dynamic", true);
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, histogramPath), "title", "Histogram - " + riskClass.getName());
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridX", true);
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridY", true);
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "plotColor", "#BC334E");
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLocation", "0");
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLength", "0");
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, histogramPath), "refreshRate", "0");
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "annotateFailures", false);
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "linearInterpolation", true);
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "keepOpenAfterTermination", true);
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "recordPlotDataAs", "PNG");
    TagsHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + riskClass.getName() + ".png");

    uiList = new HashSet();
    uiList.add(threatHistogram);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "UI", uiList); 

    return simConfig;
}

function createAnalysis() {
    anPackage = ef.createPackageInstance();
    anPackage.setOwner(riskClass.getOwner());
    anPackage.setName("Analysis");

    anConfig = ef.createClassInstance();
    anConfig.setName("Analysis - " + riskClass.getName());
    anConfig.setOwner(anPackage);

    analysis = ef.createClassInstance();
    StereotypesHelper.addStereotype(analysis, Finder.byQualifiedName().find(project, securityAnalysisPath));
    analysis.setName("Analysis");
    analysis.setOwner(anPackage);

    nestedConnectorEnd = Finder.byQualifiedName().find(project, nestedConnectorEndPath);
    
    //Nation State Shapes
    threatLevel = createProperty(analysis, "Threat Level - Nation State", Finder.byQualifiedName().find(project, threatPath), "Nation State", Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, threatLevelPath), null, null);
    threatLevel.setAggregation(AggregationKindEnum.COMPOSITE);

    riskPartNation = createProperty(analysis, "Nation State", riskClass, null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
    riskPartNation.setAggregation(AggregationKindEnum.COMPOSITE);
    elements = riskClass.getOwnedElement();

    nationResidualProbability = createProperty(analysis, "Nation State - Residual Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, residualProbabilityPath), null, null);
    nationResidualProbability.setAggregation(AggregationKindEnum.COMPOSITE);

    nationDetectionProbability = createProperty(analysis, "Nation State - Detection Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, detectionProbabilityPath), null, null);
    nationDetectionProbability.setAggregation(AggregationKindEnum.COMPOSITE);

    for(j = 0; j < elements.size(); j++) {
        if(StereotypesHelper.hasStereotype(elements.get(j), Finder.byQualifiedName().find(project, threatLevelPath))) {
            writeLog("ThreatLevel Found: " + elements.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(analysis);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(elements.get(j));  
            newConnectorEnds.get(1).setRole(threatLevel);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, riskPartNation);
        }

        if(StereotypesHelper.hasStereotype(elements.get(j), Finder.byQualifiedName().find(project, residualProbabilityPath))) {
            writeLog("ResidualProbability Found: " + elements.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(analysis);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(elements.get(j));  
            newConnectorEnds.get(1).setRole(nationResidualProbability);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, riskPartNation);

        }    
        if(StereotypesHelper.hasStereotype(elements.get(j), Finder.byQualifiedName().find(project, detectionProbabilityPath))) {
            writeLog("DetectionProbability Found: " + elements.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(analysis);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(elements.get(j));  
            newConnectorEnds.get(1).setRole(nationDetectionProbability);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, riskPartNation);

        }                         
    }

    nationValueList = new ArrayList();
    nationValueList.add(nationResidualProbability);
    nationValueList.add(nationDetectionProbability);
        
    nationIDList = new ArrayList();
    nationIDList.add(nationResidualProbability.getID());
    nationIDList.add(nationDetectionProbability.getID());
        
    nationThreatHistogram = ef.createClassInstance();
    nationThreatHistogram.setName("Histogram - " + riskClass.getName() + " - Nation State");
    nationThreatHistogram.setOwner(anPackage);
    StereotypesHelper.addStereotype(nationThreatHistogram, Finder.byQualifiedName().find(project, histogramPath));
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "represents", analysis);
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "value", nationValueList);
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "nestedPropertyPaths", nationIDList);
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "source", "com.nomagic.magicdraw.simulation.uiprototype.HistogramPlotter");
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, histogramPath), "dynamic", true);
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, histogramPath), "title", "Histogram - " + riskClass.getName() + " - Nation State");
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridX", true);
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridY", true);
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "plotColor", "#BC334E");
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLocation", "0");
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLength", "0");
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, histogramPath), "refreshRate", "0");
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "annotateFailures", false);
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "linearInterpolation", true);
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "keepOpenAfterTermination", true);
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "recordPlotDataAs", "PNG");
    TagsHelper.setStereotypePropertyValue(nationThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + riskClass.getName() + " - Nation State.png");

    //Professional Shapes
    threatLevel = createProperty(analysis, "Threat Level - Professional", Finder.byQualifiedName().find(project, threatPath), "Professional", Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, threatLevelPath), null, null);
    threatLevel.setAggregation(AggregationKindEnum.COMPOSITE);

    proResidualProbability = createProperty(analysis, "Professional - Residual Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, residualProbabilityPath), null, null);
    proResidualProbability.setAggregation(AggregationKindEnum.COMPOSITE);

    proDetectionProbability = createProperty(analysis, "Professional - Detection Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, detectionProbabilityPath), null, null);
    proDetectionProbability.setAggregation(AggregationKindEnum.COMPOSITE);

    riskPartPro = createProperty(analysis, "Professional", riskClass, null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
    riskPartPro.setAggregation(AggregationKindEnum.COMPOSITE);

    elements = riskClass.getOwnedElement();
    for(j = 0; j < elements.size(); j++) {
        if(StereotypesHelper.hasStereotype(elements.get(j), Finder.byQualifiedName().find(project, threatLevelPath))) {
            writeLog("ThreatLevel Found: " + elements.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(analysis);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(elements.get(j));  
            newConnectorEnds.get(1).setRole(threatLevel);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, riskPartPro);
        }
        if(StereotypesHelper.hasStereotype(elements.get(j), Finder.byQualifiedName().find(project, residualProbabilityPath))) {
            writeLog("ResidualProbability Found: " + elements.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(analysis);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(elements.get(j));  
            newConnectorEnds.get(1).setRole(proResidualProbability);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, riskPartPro);
        }    
        if(StereotypesHelper.hasStereotype(elements.get(j), Finder.byQualifiedName().find(project, detectionProbabilityPath))) {
            writeLog("DetectionProbability Found: " + elements.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(analysis);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(elements.get(j));  
            newConnectorEnds.get(1).setRole(proDetectionProbability);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, riskPartPro);
        }                         
    }

    proValueList = new ArrayList();
    proValueList.add(proResidualProbability);
    proValueList.add(proDetectionProbability);
        
    proIDList = new ArrayList();
    proIDList.add(proResidualProbability.getID());
    proIDList.add(proDetectionProbability.getID());
        
    proThreatHistogram = ef.createClassInstance();
    proThreatHistogram.setName("Histogram - " + riskClass.getName() + " - Professional");
    proThreatHistogram.setOwner(anPackage);
    StereotypesHelper.addStereotype(proThreatHistogram, Finder.byQualifiedName().find(project, histogramPath));
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "represents", analysis);
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "value", proValueList);
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "nestedPropertyPaths", proIDList);
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "source", "com.nomagic.magicdraw.simulation.uiprototype.HistogramPlotter");
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, histogramPath), "dynamic", true);
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, histogramPath), "title", "Histogram - " + riskClass.getName() + " - Professional");
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridX", true);
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridY", true);
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "plotColor", "#BC334E");
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLocation", "0");
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLength", "0");
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, histogramPath), "refreshRate", "0");
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "annotateFailures", false);
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "linearInterpolation", true);
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "keepOpenAfterTermination", true);
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "recordPlotDataAs", "PNG");
    TagsHelper.setStereotypePropertyValue(proThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + riskClass.getName() + " - Professional.png");

    //Intermediate Shapes
    threatLevel = createProperty(analysis, "Threat Level - Intermediate", Finder.byQualifiedName().find(project, threatPath), "Intermediate", Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, threatLevelPath), null, null);
    threatLevel.setAggregation(AggregationKindEnum.COMPOSITE);

    intResidualProbability = createProperty(analysis, "Intermediate - Residual Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, residualProbabilityPath), null, null);
    intResidualProbability.setAggregation(AggregationKindEnum.COMPOSITE);

    intDetectionProbability = createProperty(analysis, "Intermediate - Detection Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, detectionProbabilityPath), null, null);
    intDetectionProbability.setAggregation(AggregationKindEnum.COMPOSITE);

    riskPartInt = createProperty(analysis, "Intermediate", riskClass, null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
    riskPartInt.setAggregation(AggregationKindEnum.COMPOSITE);

    elements = riskClass.getOwnedElement();
    for(j = 0; j < elements.size(); j++) {
        if(StereotypesHelper.hasStereotype(elements.get(j), Finder.byQualifiedName().find(project, threatLevelPath))) {
            writeLog("ThreatLevel Found: " + elements.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(analysis);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(elements.get(j));  
            newConnectorEnds.get(1).setRole(threatLevel);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, riskPartInt);
        }
        if(StereotypesHelper.hasStereotype(elements.get(j), Finder.byQualifiedName().find(project, residualProbabilityPath))) {
            writeLog("ResidualProbability Found: " + elements.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(analysis);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(elements.get(j));  
            newConnectorEnds.get(1).setRole(intResidualProbability);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, riskPartInt);
        }    
        if(StereotypesHelper.hasStereotype(elements.get(j), Finder.byQualifiedName().find(project, detectionProbabilityPath))) {
            writeLog("DetectionProbability Found: " + elements.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(analysis);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(elements.get(j));  
            newConnectorEnds.get(1).setRole(intDetectionProbability);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, riskPartInt);
        }                         
    }

    intValueList = new ArrayList();
    intValueList.add(intResidualProbability);
    intValueList.add(intDetectionProbability);
        
    intIDList = new ArrayList();
    intIDList.add(intResidualProbability.getID());
    intIDList.add(intDetectionProbability.getID());
        
    intThreatHistogram = ef.createClassInstance();
    intThreatHistogram.setName("Histogram - " + riskClass.getName() + " - Intermediate");
    intThreatHistogram.setOwner(anPackage);
    StereotypesHelper.addStereotype(intThreatHistogram, Finder.byQualifiedName().find(project, histogramPath));
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "represents", analysis);
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "value", intValueList);
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "nestedPropertyPaths", intIDList);
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "source", "com.nomagic.magicdraw.simulation.uiprototype.HistogramPlotter");
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, histogramPath), "dynamic", true);
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, histogramPath), "title", "Histogram - " + riskClass.getName() + " - Intermediate");
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridX", true);
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridY", true);
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "plotColor", "#BC334E");
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLocation", "0");
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLength", "0");
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, histogramPath), "refreshRate", "0");
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "annotateFailures", false);
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "linearInterpolation", true);
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "keepOpenAfterTermination", true);
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "recordPlotDataAs", "PNG");
    TagsHelper.setStereotypePropertyValue(intThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + riskClass.getName() + " - Intermediate.png");

    //Novice Shapes
    threatLevel = createProperty(analysis, "Threat Level - Novice", Finder.byQualifiedName().find(project, threatPath), "Novice", Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, threatLevelPath), null, null);
    threatLevel.setAggregation(AggregationKindEnum.COMPOSITE);
    
    novResidualProbability = createProperty(analysis, "Novice - Residual Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, residualProbabilityPath), null, null);
    novResidualProbability.setAggregation(AggregationKindEnum.COMPOSITE);

    novDetectionProbability = createProperty(analysis, "Novice - Detection Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, detectionProbabilityPath), null, null);
    novDetectionProbability.setAggregation(AggregationKindEnum.COMPOSITE);

    riskPartNov = createProperty(analysis, "Novice", riskClass, null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
    riskPartNov.setAggregation(AggregationKindEnum.COMPOSITE);

    elements = riskClass.getOwnedElement();
    for(j = 0; j < elements.size(); j++) {
        if(StereotypesHelper.hasStereotype(elements.get(j), Finder.byQualifiedName().find(project, threatLevelPath))) {
            writeLog("ThreatLevel Found: " + elements.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(analysis);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(elements.get(j));  
            newConnectorEnds.get(1).setRole(threatLevel);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, riskPartNov);
        }
        if(StereotypesHelper.hasStereotype(elements.get(j), Finder.byQualifiedName().find(project, residualProbabilityPath))) {
            writeLog("ResidualProbability Found: " + elements.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(analysis);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(elements.get(j));  
            newConnectorEnds.get(1).setRole(novResidualProbability);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, riskPartNov);
        }    
        if(StereotypesHelper.hasStereotype(elements.get(j), Finder.byQualifiedName().find(project, detectionProbabilityPath))) {
            writeLog("DetectionProbability Found: " + elements.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(analysis);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(elements.get(j));  
            newConnectorEnds.get(1).setRole(novDetectionProbability);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, riskPartNov);
        }                         
    }

    novValueList = new ArrayList();
    novValueList.add(novResidualProbability);
    novValueList.add(novDetectionProbability);
        
    novIDList = new ArrayList();
    novIDList.add(novResidualProbability.getID());
    novIDList.add(novDetectionProbability.getID());
        
    novThreatHistogram = ef.createClassInstance();
    novThreatHistogram.setName("Histogram - " + riskClass.getName() + " - Novice");
    novThreatHistogram.setOwner(anPackage);
    StereotypesHelper.addStereotype(novThreatHistogram, Finder.byQualifiedName().find(project, histogramPath));
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "represents", analysis);
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "value", novValueList);
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "nestedPropertyPaths", novIDList);
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "source", "com.nomagic.magicdraw.simulation.uiprototype.HistogramPlotter");
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, histogramPath), "dynamic", true);
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, histogramPath), "title", "Histogram - " + riskClass.getName() + " - Novice");
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridX", true);
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridY", true);
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "plotColor", "#BC334E");
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLocation", "0");
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLength", "0");
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, histogramPath), "refreshRate", "0");
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "annotateFailures", false);
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "linearInterpolation", true);
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "keepOpenAfterTermination", true);
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "recordPlotDataAs", "PNG");
    TagsHelper.setStereotypePropertyValue(novThreatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Histogram - " + riskClass.getName() + " - Novice.png");


    csvValueList = new ArrayList();
    csvValueList.add(novResidualProbability);
    csvValueList.add(novDetectionProbability);
    csvValueList.add(intResidualProbability);
    csvValueList.add(intDetectionProbability);
    csvValueList.add(proResidualProbability);
    csvValueList.add(proDetectionProbability);
    csvValueList.add(nationResidualProbability);
    csvValueList.add(nationDetectionProbability);
        
    csvIDList = new ArrayList();
    csvIDList.add(novResidualProbability.getID());
    csvIDList.add(novDetectionProbability.getID());
    csvIDList.add(intResidualProbability.getID());
    csvIDList.add(intDetectionProbability.getID());
    csvIDList.add(proResidualProbability.getID());
    csvIDList.add(proDetectionProbability.getID());
    csvIDList.add(nationResidualProbability.getID());
    csvIDList.add(nationDetectionProbability.getID());

    var csvExportStereotypePath = "SimulationProfile::config::CSVExport";
    csvExport = ef.createClassInstance();
    csvExport.setName("Export - " + riskClass.getName());
    csvExport.setOwner(anPackage);
    StereotypesHelper.addStereotype(csvExport, Finder.byQualifiedName().find(project, csvExportStereotypePath));
    TagsHelper.setStereotypePropertyValue(csvExport, Finder.byQualifiedName().find(project, csvExportStereotypePath), "fileName", ".\\Analysis\\CSV - " + riskClass.getName() + ".csv");
    TagsHelper.setStereotypePropertyValue(csvExport, Finder.byQualifiedName().find(project, csvExportStereotypePath), "recordTime", false);
    TagsHelper.setStereotypePropertyValue(csvExport, Finder.byQualifiedName().find(project, csvExportStereotypePath), "writeAtTheEnd", true);
    TagsHelper.setStereotypePropertyValue(csvExport, Finder.byQualifiedName().find(project, selectPropertiesPath), "represents", analysis);
    TagsHelper.setStereotypePropertyValue(csvExport, Finder.byQualifiedName().find(project, selectPropertiesPath), "value", csvValueList);
    TagsHelper.setStereotypePropertyValue(csvExport, Finder.byQualifiedName().find(project, selectPropertiesPath), "nestedPropertyPaths", csvIDList);

    var simulationConfigStereotypePath = "SimulationProfile::config::SimulationConfig";
    StereotypesHelper.addStereotype(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath));
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "executionTarget", analysis);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "executionListeners", csvExport);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "animationSpeed", "100");
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "autoStart", true);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "autostartActiveObjects", true);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "cloneReferences", false);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "decimalPlaces", "1");
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "fireValueChangeEvent", true);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "initializeReferences", false);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "numberOfRuns", "500");
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "recordTimestamp", false);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "rememberFailureStatus", false);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "runForksInParallel", true);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "silent", false);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "solveAfterInitialization", true);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "startWebServer", false);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "addControlPanel", false);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "timeVariableName", "simtime");
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "treatAllClassifiersAsActive", false);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "constraintFailureAsBreakpoint", false);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "openSimulationPane", false);

    anuiList = new HashSet();
    anuiList.add(nationThreatHistogram);
    anuiList.add(proThreatHistogram);
    anuiList.add(intThreatHistogram);
    anuiList.add(novThreatHistogram);
    TagsHelper.setStereotypePropertyValue(anConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "UI", anuiList); 
    
    simConfigs = new HashSet();
    simConfigs.add(anConfig);
    TagsHelper.setStereotypePropertyValue(analysis, Finder.byQualifiedName().find(project, securityAnalysisPath), "Simulation Configuration", simConfigs);

    return analysis;

}

function createProperty(owner, name, type, defaultValue, stereotype1, stereotype2, min, max) {
    newProperty = ef.createPropertyInstance();
    if (stereotype1) {
        StereotypesHelper.addStereotype(newProperty, stereotype1);
    }
    if (stereotype2) {
        StereotypesHelper.addStereotype(newProperty, stereotype2);
    }
    if (owner) {
        newProperty.setOwner(owner);
    }
    if (name) {
        newProperty.setName(name);
    }
    if (type) {
        newProperty.setType(type);
    }
    if((min || min == 0) && max) {
        StereotypesHelper.addStereotype(newProperty, Finder.byQualifiedName().find(project, uniformPath));
        TagsHelper.setStereotypePropertyValue(newProperty, Finder.byQualifiedName().find(project, uniformPath), "min", min);
        TagsHelper.setStereotypePropertyValue(newProperty, Finder.byQualifiedName().find(project, uniformPath), "max", max);
    }
    if (defaultValue) {
        tempValue = ValueSpecificationHelper.createValueSpecification(project, newProperty.getType(), defaultValue, null);
        newProperty.setDefaultValue(tempValue);
    }
    newProperty.setAggregation(AggregationKindEnum.COMPOSITE);
    writeLog("Created new property: " + newProperty.getName(), 4);
    return newProperty;
}

function createBindingConnector(part1, shape1, owner1, part2, shape2, owner2) {
    newConnector = ef.createConnectorInstance();
    StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
    newConnector.setOwner(riskClass);
    newConnectorEnds = newConnector.getEnd();
    newConnectorEnds.get(0).setRole(part1);
    if(owner1) {
        newConnectorEnds.get(0).setPartWithPort(owner1);
    }            
    newConnectorEnds.get(1).setRole(part2);
    if(owner2) {
        newConnectorEnds.get(1).setPartWithPort(owner2);
    }  
    var newConnectorShape = PresentationElementsManager.getInstance().createPathElement(newConnector, shape1, shape2);
    writeLog("Created new connecter: " + part1.getName() + " - " + part2.getName(), 4);
    return [newConnector, newConnectorShape];
}

function main(project, ef, progress) {
    
    // Pre-checks to ensure two SecurityRisks are selected
    var selectedObjects = getSelectedObjects(project);
    if(!selectedObjects) {
        writeLog("ERROR: No objects are selected in the containment tree. Please select two SecurityRisks in the containment tree and try again.", 1);
        return;
    }
    writeLog("Got selectedObjects: " + selectedObjects, 5);
    writeLog("selectedObjects length: " + selectedObjects.length, 5);

    if(selectedObjects.length != 2) {
        writeLog("ERROR: Incorrect number of objects selected. Please select two SecurityRisks in the containment tree and try again.", 1);
        return;
    }

    var securityRisk = Finder.byQualifiedName().find(project, securityRiskPath);
    for (x = 0; x < selectedObjects.length; x++) {
        if(!StereotypesHelper.hasStereotype(selectedObjects[x], securityRisk)) {
            writeLog("ERROR: One or more selected objects is not a SecurityRisk. Please select two SecurityRisks in the containment tree and try again.", 1);
            return;
        }
        if(selectedObjects[x].getName() != selectedObjects[x].getOwner().getName()) {
            writeLog("ERROR: SecurityRisk is not in the right location. Perhaps the SecurityRisk has already been joined to another. If that is the case, please create a new SecurityRisk before joining it to another.", 1);
            return;
        }
    }

    riskName = selectedObjects[0].getName() + " AND " + selectedObjects[1].getName();

    res = Application.getInstance().getGUILog().showQuestion("Do you want to set a custom name? (Default: " + riskName + ")", false, "Name Selection");
    if(res == 2){
        res = "";
        res = Application.getInstance().getGUILog().showInputTextDialog("Name Combined Risk", "Please enter a new risk name.");
        if(res == "") {
            writeLog("ERROR: Risk Name not entered, no action taken.", 1);
            return;
        }
        riskName = res;
        writeLog("New Name: " + riskName, 5);
    }


    progress.init("Creating Risk Diagram for " + riskName, 0, 3);

    // Create the new risk and a new parametric diagram
    var newRisk = createRisk(project, riskName);
    var riskClass = newRisk[1];
    var riskPackage = newRisk[0];
    var diagram = ModelElementsManager.getInstance().createDiagram("CEMT Parametric Risk Diagram", riskClass);
    var parametricDiagram = project.getDiagram(diagram);

    // Draw the first subrisk on the parametric diagram, and display the residual and detection probabilities
    var firstRisk = selectedObjects[0];
    var firstRiskPart = createProperty(riskClass, null, firstRisk, null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
    firstRiskPart.setName("firstRisk");
    firstRiskPart.setAggregation(AggregationKindEnum.COMPOSITE);
    var firstRiskShape = PresentationElementsManager.getInstance().createShapeElement(firstRiskPart, parametricDiagram);

    var combinedThreatLevel = createProperty(riskClass, "Threat Level", Finder.byQualifiedName().find(project, threatPath), "Nation State", Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, threatLevelPath), null, null);
    combinedThreatLevel.setAggregation(AggregationKindEnum.COMPOSITE);
    var combinedThreatLevelShape = PresentationElementsManager.getInstance().createShapeElement(combinedThreatLevel, parametricDiagram);

    var combinedInitialProbability = createProperty(riskClass, "Initial Probability", Finder.byQualifiedName().find(project, numberPath), 100, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, initialProbabilityPath), null, null);
    combinedInitialProbability.setAggregation(AggregationKindEnum.COMPOSITE);
    var combinedInitialProbabilityShape = PresentationElementsManager.getInstance().createShapeElement(combinedInitialProbability, parametricDiagram);

    var nestedConnectorEnd = Finder.byQualifiedName().find(project, nestedConnectorEndPath);

    var ownedValues = firstRisk.getOwnedElement();
    for(j = 0; j < ownedValues.size(); j++) {
        if(StereotypesHelper.hasStereotype(ownedValues.get(j), Finder.byQualifiedName().find(project, residualProbabilityPath))) {
            var firstResidual = ownedValues.get(j);
            writeLog("ResidualProbability Found: " + firstResidual.getName(), 5);
        }
        if(StereotypesHelper.hasStereotype(ownedValues.get(j), Finder.byQualifiedName().find(project, detectionProbabilityPath))) {
            var firstDetection = ownedValues.get(j);
            writeLog("DetectionProbability Found: " + firstDetection.getName(), 5);
        }
        if(StereotypesHelper.hasStereotype(ownedValues.get(j), Finder.byQualifiedName().find(project, threatLevelPath))) {
            writeLog("ThreatLevel Found: " + ownedValues.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(riskClass);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(ownedValues.get(j));  
            newConnectorEnds.get(1).setRole(combinedThreatLevel);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, firstRiskPart);
        }
        if(StereotypesHelper.hasStereotype(ownedValues.get(j), Finder.byQualifiedName().find(project, initialProbabilityPath))) {
            writeLog("InitialProbability Found: " + ownedValues.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(riskClass);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(ownedValues.get(j));  
            newConnectorEnds.get(1).setRole(combinedInitialProbability);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, firstRiskPart);
        }
    }                    
    var firstDetectionShape = PresentationElementsManager.getInstance().createShapeElement(firstDetection, firstRiskShape);
    var firstResidualShape = PresentationElementsManager.getInstance().createShapeElement(firstResidual, firstRiskShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(firstRiskShape, new java.awt.Rectangle(subrisk_x, topsubrisk_y, subriskWidth, subriskHeight));
    PresentationElementsManager.getInstance().reshapeShapeElement(combinedThreatLevelShape, new java.awt.Rectangle(subrisk_x, detConstraint_y, numWidth, (numHeight / 2)));
    PresentationElementsManager.getInstance().reshapeShapeElement(combinedInitialProbabilityShape, new java.awt.Rectangle(subrisk_x, detConstraint_y + (numHeight / 2), numWidth, (numHeight / 2)));
    
    if(progress.isCancel()) {
        writeLog("ERROR: User cancelled macro. Extraneous objects may exist in the model from the partially completed macro. You may want to Undo using Ctrl + Z, or manually delete the partial package in the Risk Assessment section.", 1);
        return;
    }

    // Draw the second subrisk on the parametric diagram, and display the residual and detection probabilities
    var secondRisk = selectedObjects[1];
    var secondRiskPart = createProperty(riskClass, null, secondRisk, null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
    secondRiskPart.setName("secondRisk");
    secondRiskPart.setAggregation(AggregationKindEnum.COMPOSITE);
    var secondRiskShape = PresentationElementsManager.getInstance().createShapeElement(secondRiskPart, parametricDiagram);
    ownedValues = secondRisk.getOwnedElement();
    for(j = 0; j < ownedValues.size(); j++) {
        if(StereotypesHelper.hasStereotype(ownedValues.get(j), Finder.byQualifiedName().find(project, residualProbabilityPath))) {
            var secondResidual = ownedValues.get(j);
            writeLog("ResidualProbability Found: " + secondResidual.getName(), 5); 
        }
        if(StereotypesHelper.hasStereotype(ownedValues.get(j), Finder.byQualifiedName().find(project, detectionProbabilityPath))) {
            var secondDetection = ownedValues.get(j);
            writeLog("DetectionProbability Found: " + secondDetection.getName(), 5);
        }
        if(StereotypesHelper.hasStereotype(ownedValues.get(j), Finder.byQualifiedName().find(project, threatLevelPath))) {
            writeLog("ThreatLevel Found: " + ownedValues.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(riskClass);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(ownedValues.get(j));  
            newConnectorEnds.get(1).setRole(combinedThreatLevel);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, secondRiskPart);
        }
        if(StereotypesHelper.hasStereotype(ownedValues.get(j), Finder.byQualifiedName().find(project, initialProbabilityPath))) {
            writeLog("InitialProbability Found: " + ownedValues.get(j).getName(), 5);
            newConnector = ef.createConnectorInstance();
            StereotypesHelper.addStereotype(newConnector, Finder.byQualifiedName().find(project, bindingConnectorPath));
            newConnector.setOwner(riskClass);
            newConnectorEnds = newConnector.getEnd();
            newConnectorEnds.get(0).setRole(ownedValues.get(j));  
            newConnectorEnds.get(1).setRole(combinedInitialProbability);
            StereotypesHelper.setStereotypePropertyValue(newConnectorEnds.get(0), nestedConnectorEnd, SysMLProfile.ELEMENTPROPERTYPATH_PROPERTYPATH_PROPERTY, secondRiskPart);
        }
    }         
    var secondResidualShape = PresentationElementsManager.getInstance().createShapeElement(secondResidual, secondRiskShape);    
    var secondDetectionShape = PresentationElementsManager.getInstance().createShapeElement(secondDetection, secondRiskShape);  
    PresentationElementsManager.getInstance().reshapeShapeElement(secondRiskShape, new java.awt.Rectangle(subrisk_x, botsubrisk_y, subriskWidth, subriskHeight));

    if(progress.isCancel()) {
        writeLog("ERROR: User cancelled macro. Extraneous objects may exist in the model from the partially completed macro. You may want to Undo using Ctrl + Z, or manually delete the partial package in the Risk Assessment section.", 1);
        return;
    }

    // Draw the constraint block which will merge the Detection Probability values
    var detConstraint = createProperty(riskClass, "Detection", Finder.byQualifiedName().find(project, detConstraintPath), null, Finder.byQualifiedName().find(project, constraintPropertyPath), null, null, null);
    var detConstraintShape = PresentationElementsManager.getInstance().createShapeElement(detConstraint, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(detConstraintShape, new java.awt.Rectangle(detConstraint_x, detConstraint_y, constraintWidth, constraintHeight));

    // Add parameters and binding connectors that join the detection constraint block to the subrisk Detection Probability values
    var  parameterPath = detConstraintPath + "::IN1";
    var parameter = Finder.byQualifiedName().find(project, parameterPath)
    var parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(detPara_x, topdetPara_y, paraWidth, paraHeight));

    var connector = createBindingConnector(firstDetection, firstDetectionShape, null, parameter, parameterShape, detConstraint);
    var pathPoints = new ArrayList();
    var point1 = new java.awt.Point(connector[1].getSupplier().getMiddlePoint().x, connector[1].getClient().getMiddlePoint().y);
    pathPoints.add(connector[1].getSupplier().getMiddlePoint());
    pathPoints.add(point1);
    pathPoints.add(connector[1].getClient().getMiddlePoint());
    PresentationElementsManager.getInstance().changePathPoints(connector[1], pathPoints.get(0), pathPoints.get(2), pathPoints);

    parameterPath = detConstraintPath + "::IN2";
    parameter = Finder.byQualifiedName().find(project, parameterPath)
    parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(detPara_x, botdetPara_y, paraWidth, paraHeight));

    connector = createBindingConnector(secondDetection, secondDetectionShape, null, parameter, parameterShape, detConstraint);
    pathPoints = new ArrayList();
    point1 = new java.awt.Point(connector[1].getSupplier().getMiddlePoint().x, connector[1].getClient().getMiddlePoint().y);
    pathPoints.add(connector[1].getSupplier().getMiddlePoint());
    pathPoints.add(point1);
    pathPoints.add(connector[1].getClient().getMiddlePoint());
    PresentationElementsManager.getInstance().changePathPoints(connector[1], pathPoints.get(0), pathPoints.get(2), pathPoints);

    // Add parameters and binding connectors that join the detection constraint block to the overall Detection Probability value
    parameterPath = detConstraintPath + "::OUT";
    parameter = Finder.byQualifiedName().find(project, parameterPath)
    parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(detoutPara_x, detoutPara_y, paraWidth, paraHeight));

    var detectionProbability = createProperty(riskClass, "Detection Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, detectionProbabilityPath), null, null);
    detectionProbability.setAggregation(AggregationKindEnum.COMPOSITE);
    var detectionProbabilityShape = PresentationElementsManager.getInstance().createShapeElement(detectionProbability, parametricDiagram); 
    PresentationElementsManager.getInstance().reshapeShapeElement(detectionProbabilityShape, new java.awt.Rectangle(detection_x,detection_y,numWidth,numHeight));
    createBindingConnector(detectionProbability, detectionProbabilityShape, null, parameter, parameterShape, detConstraint);

    if(progress.isCancel()) {
        writeLog("ERROR: User cancelled macro. Extraneous objects may exist in the model from the partially completed macro. You may want to Undo using Ctrl + Z, or manually delete the partial package in the Risk Assessment section.", 1);
        return;
    }

    // Draw the constraint block which will merge the Residual Probability values
    var resConstraint = createProperty(riskClass, "Residual", Finder.byQualifiedName().find(project, resConstraintPath), null, Finder.byQualifiedName().find(project, constraintPropertyPath), null, null, null);
    var resConstraintShape = PresentationElementsManager.getInstance().createShapeElement(resConstraint, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(resConstraintShape, new java.awt.Rectangle(resConstraint_x, resConstraint_y, constraintWidth, constraintHeight));

    // Add parameters and binding connectors that join the residual constraint block to the subrisk Residual Probability values
    parameterPath = resConstraintPath + "::IN1";
    parameter = Finder.byQualifiedName().find(project, parameterPath)
    parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, resConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(resPara_x, topresPara_y, paraWidth, paraHeight));

    connector = createBindingConnector(firstResidual, firstResidualShape, null, parameter, parameterShape, resConstraint);
    pathPoints = new ArrayList();
    point1 = new java.awt.Point(connector[1].getSupplier().getMiddlePoint().x, connector[1].getClient().getMiddlePoint().y);
    pathPoints.add(connector[1].getSupplier().getMiddlePoint());
    pathPoints.add(point1);
    pathPoints.add(connector[1].getClient().getMiddlePoint());
    PresentationElementsManager.getInstance().changePathPoints(connector[1], pathPoints.get(0), pathPoints.get(2), pathPoints);

    parameterPath = resConstraintPath + "::IN2";
    parameter = Finder.byQualifiedName().find(project, parameterPath)
    parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, resConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(resPara_x, botresPara_y, paraWidth, paraHeight));

    connector = createBindingConnector(secondResidual, secondResidualShape, null, parameter, parameterShape, resConstraint);
    pathPoints = new ArrayList();
    point1 = new java.awt.Point(connector[1].getSupplier().getMiddlePoint().x, connector[1].getClient().getMiddlePoint().y);
    pathPoints.add(connector[1].getSupplier().getMiddlePoint());
    pathPoints.add(point1);
    pathPoints.add(connector[1].getClient().getMiddlePoint());
    PresentationElementsManager.getInstance().changePathPoints(connector[1], pathPoints.get(0), pathPoints.get(2), pathPoints);

    // Add parameters and binding connectors that join the residual constraint block to the overall Residual Probability value
    parameterPath = resConstraintPath + "::OUT";
    parameter = Finder.byQualifiedName().find(project, parameterPath)
    parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, resConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(resoutPara_x, resoutPara_y, paraWidth, paraHeight));

    var residualProbability = createProperty(riskClass, "Residual Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, residualProbabilityPath), null, null);
    residualProbability.setAggregation(AggregationKindEnum.COMPOSITE);
    var residualProbabilityShape = PresentationElementsManager.getInstance().createShapeElement(residualProbability, parametricDiagram); 
    PresentationElementsManager.getInstance().reshapeShapeElement(residualProbabilityShape, new java.awt.Rectangle(residual_x,residual_y,numWidth,numHeight));
    createBindingConnector(residualProbability, residualProbabilityShape, null, parameter, parameterShape, resConstraint);

    var firstPackage = firstRisk.getOwner();
    var firstSimPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Simulation");

    var secondPackage = secondRisk.getOwner();
    var secondSimPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Simulation");

    if(progress.isCancel()) {
        writeLog("ERROR: User cancelled macro. Extraneous objects may exist in the model from the partially completed macro. You may want to Undo using Ctrl + Z, or manually delete the partial package in the Risk Assessment section.", 1);
        return;
    }
    progress.increase();
    progress.setDescription("Creating New Simulation");

    // Create the new simulation. Pass in the histograms from the subrisks so they can be added to the new simulation.
    newSession(project, "Simulation");
    sim = createSimulation(riskClass, residualProbability, detectionProbability);
    analysis = createAnalysis();

    analysisList = new HashSet();
    analysisList.add(analysis);
    TagsHelper.setStereotypePropertyValue(riskClass, Finder.byQualifiedName().find(project, securityRiskPath), "SecurityAnalysis", analysisList);

    configList = new HashSet();
    configList.add(sim);
    TagsHelper.setStereotypePropertyValue(riskClass, Finder.byQualifiedName().find(project, securityRiskPath), "Simulation Configuration", configList);

    mergedThreat = new HashSet();
    mergedThreat.addAll(TagsHelper.getStereotypePropertyValue(firstRisk, Finder.byQualifiedName().find(project, securityRiskPath), "ThreatStart"));
    mergedThreat.addAll(TagsHelper.getStereotypePropertyValue(secondRisk, Finder.byQualifiedName().find(project, securityRiskPath), "ThreatStart"));
    TagsHelper.setStereotypePropertyValue(riskClass, Finder.byQualifiedName().find(project, securityRiskPath), "ThreatStart", mergedThreat);

    mergedSignal = new HashSet();
    mergedSignal.addAll(TagsHelper.getStereotypePropertyValue(firstRisk, Finder.byQualifiedName().find(project, securityRiskPath), "ThreatImpactSignal"));
    mergedSignal.addAll(TagsHelper.getStereotypePropertyValue(secondRisk, Finder.byQualifiedName().find(project, securityRiskPath), "ThreatImpactSignal"));
    TagsHelper.setStereotypePropertyValue(riskClass, Finder.byQualifiedName().find(project, securityRiskPath), "ThreatImpactSignal", mergedSignal);

    mergedAsset = new HashSet();
    mergedAsset.addAll(TagsHelper.getStereotypePropertyValue(firstRisk, Finder.byQualifiedName().find(project, securityRiskPath), "AssetSelection"));
    mergedAsset.addAll(TagsHelper.getStereotypePropertyValue(secondRisk, Finder.byQualifiedName().find(project, securityRiskPath), "AssetSelection"));
    TagsHelper.setStereotypePropertyValue(riskClass, Finder.byQualifiedName().find(project, securityRiskPath), "AssetSelection", mergedAsset);

    if(progress.isCancel()) {
        writeLog("ERROR: User cancelled macro. Extraneous objects may exist in the model from the partially completed macro. You may want to Undo using Ctrl + Z, or manually delete the partial package in the Risk Assessment section.", 1);
        return;
    }
    progress.increase();
    progress.setDescription("Moving Subrisks");

    // Finally, move the subrisks themselves under the new risk.
    newSession(project, "Risk Movement");
    var risks = new ArrayList();
    risks.add(firstRisk);
    risks.add(secondRisk);
    Refactoring.Moving.moveElementsWithRelations(risks, riskClass);

    if(progress.isCancel()) {
        writeLog("ERROR: User cancelled macro. Extraneous objects may exist in the model from the partially completed macro. You may want to Undo using Ctrl + Z, or manually delete the partial package in the Risk Assessment section.", 1);
        return;
    }
    progress.increase();
    progress.setDescription("Moving Subrisk Data");

    newSession(project, "Remaining Movement");
    var subriskPackage = ef.createPackageInstance();
    subriskPackage.setOwner(riskPackage);
    subriskPackage.setName("Sub-risk Data");
    
    firstPackage.setOwner(subriskPackage);
    secondPackage.setOwner(subriskPackage);

    project.getDiagram(diagram).open();
}

var project = Application.getInstance().getProject();
writeLog("Got project: " + project, 5);
var ef = project.getElementsFactory();
writeLog("Got elementsFactory: " + ef, 5);
newSession(project, "Parametric Creation");

var task = new RunnableWithProgress({
    run: function(progress) {
       main(project, ef, progress);
    }
});

try {
    ProgressStatusRunner.runWithProgressStatus(task, "Combine Macro", true, 0);
} finally {
    SessionManager.getInstance().closeSession();
}