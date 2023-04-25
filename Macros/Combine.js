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
importClass(com.nomagic.magicdraw.uml.Finder);
importClass(com.nomagic.magicdraw.uml.Refactoring);
importClass(java.util.ArrayList);
importClass(java.util.HashSet);

var debug = 1;


var riskFolderPath = "Risk Assessment"
var securityRiskPath = "Cyber::Stereotypes::SecurityRisk";
var residualProbabilityPath = "Cyber::Stereotypes::ResidualProbability";
var detectionProbabilityPath = "Cyber::Stereotypes::DetectionProbability";
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
var botsubrisk_y = y_pad + subriskHeight + constraintHeight;

var detConstraint_x = subrisk_x + subriskWidth + x_pad;
var detConstraint_y = y_pad + subriskHeight;
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

function createSimulation(firstSim, secondSim, existingHistograms, riskClass, residualProbability, detectionProbability) {
    simPackage = ef.createPackageInstance();
    simPackage.setOwner(riskClass.getOwner());
    simPackage.setName("Simulation");

    writeLog("First Size:" + firstSim.size(),3);
    writeLog("Second Size:" + secondSim.size(),3);

    for(i = 0; i < firstSim.size(); i++) {
        writeLog(i,3);
        writeLog(firstSim.get(i).getName() + " Moved", 3);
        firstSim.get(i).setOwner(simPackage);
    }
    for(i = 0; i < secondSim.size(); i++) {
        writeLog(i,3);
        writeLog(secondSim.get(i).getName() + " Moved", 3);
        secondSim.get(i).setOwner(simPackage);
    }

    simConfig = ef.createClassInstance();
    simConfig.setName(riskClass.getName());
    simConfig.setOwner(simPackage);

    simInstance = ef.createInstanceSpecificationInstance();
    simInstance.setName(riskClass.getName());
    simInstance.setOwner(simPackage);

    simulationConfigStereotypePath = "SimulationProfile::config::SimulationConfig";
    StereotypesHelper.addStereotype(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath));
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "executionTarget", riskClass);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "resultLocation", simInstance);
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
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "addControlPanel", true);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "timeVariableName", "simtime");
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "treatAllClassifiersAsActive", true);
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

    existingHistograms.add(threatHistogram);
    TagsHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "UI", existingHistograms); 
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

function main(project, ef) {
    
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

    if (!riskName) {
        writeLog("ERROR: A name for the risk was not passed to the macro. Please set the riskName argument when running the macro and try again", 1);
        return;
    }

    // Create the new risk and a new parametric diagram
    var newRisk = createRisk(project, riskName);
    var riskClass = newRisk[1];
    var riskPackage = newRisk[0];
    var diagram = ModelElementsManager.getInstance().createDiagram("SysML Parametric Diagram", riskClass);
    var parametricDiagram = project.getDiagram(diagram);

    // Draw the first subrisk on the parametric diagram, and display the residual and detection probabilities
    var firstRisk = selectedObjects[0];
    var firstRiskPart = createProperty(riskClass, null, firstRisk, null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
    var firstRiskShape = PresentationElementsManager.getInstance().createShapeElement(firstRiskPart, parametricDiagram);
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
    }                    
    var firstDetectionShape = PresentationElementsManager.getInstance().createShapeElement(firstDetection, firstRiskShape);
    var firstResidualShape = PresentationElementsManager.getInstance().createShapeElement(firstResidual, firstRiskShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(firstRiskShape, new java.awt.Rectangle(subrisk_x, topsubrisk_y, subriskWidth, subriskHeight));

    // Draw the second subrisk on the parametric diagram, and display the residual and detection probabilities
    var secondRisk = selectedObjects[1];
    var secondRiskPart = createProperty(riskClass, null, secondRisk, null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
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
    }         
    var secondResidualShape = PresentationElementsManager.getInstance().createShapeElement(secondResidual, secondRiskShape);    
    var secondDetectionShape = PresentationElementsManager.getInstance().createShapeElement(secondDetection, secondRiskShape);  
    PresentationElementsManager.getInstance().reshapeShapeElement(secondRiskShape, new java.awt.Rectangle(subrisk_x, botsubrisk_y, subriskWidth, subriskHeight));

    // Draw the constraint block which will merge the Detection Probability values
    var detConstraint = createProperty(riskClass, "Detection", Finder.byQualifiedName().find(project, detConstraintPath), null, Finder.byQualifiedName().find(project, constraintPropertyPath), Finder.byQualifiedName().find(project, detectConstraintStereotypePath), null, null);
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
    var detectionProbabilityShape = PresentationElementsManager.getInstance().createShapeElement(detectionProbability, parametricDiagram); 
    PresentationElementsManager.getInstance().reshapeShapeElement(detectionProbabilityShape, new java.awt.Rectangle(detection_x,detection_y,numWidth,numHeight));
    createBindingConnector(detectionProbability, detectionProbabilityShape, null, parameter, parameterShape, detConstraint);


    // Draw the constraint block which will merge the Residual Probability values
    var resConstraint = createProperty(riskClass, "Residual", Finder.byQualifiedName().find(project, resConstraintPath), null, Finder.byQualifiedName().find(project, constraintPropertyPath), Finder.byQualifiedName().find(project, threatConstraintStereotypePath), null, null);
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
    var residualProbabilityShape = PresentationElementsManager.getInstance().createShapeElement(residualProbability, parametricDiagram); 
    PresentationElementsManager.getInstance().reshapeShapeElement(residualProbabilityShape, new java.awt.Rectangle(residual_x,residual_y,numWidth,numHeight));
    createBindingConnector(residualProbability, residualProbabilityShape, null, parameter, parameterShape, resConstraint);

    // Move the 'Results' packages from the subrisks to the new risk
    var firstPackage = firstRisk.getOwner();
    var firstSimPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Simulation");
    var firstProposedNSPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Results::Proposed::Nation State");
    var firstProposedPPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Results::Proposed::Professional");
    var firstProposedIPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Results::Proposed::Intermediate");
    var firstProposedNPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Results::Proposed::Novice");
    var firstDesignedNSPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Results::Designed::Nation State");
    var firstDesignedPPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Results::Designed::Professional");
    var firstDesignedIPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Results::Designed::Intermediate");
    var firstDesignedNPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Results::Designed::Novice");
    var firstVerifiedNSPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Results::Verified::Nation State");
    var firstVerifiedPPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Results::Verified::Professional");
    var firstVerifiedIPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Results::Verified::Intermediate");
    var firstVerifiedNPackage = Finder.byQualifiedName().find(project, firstPackage.getQualifiedName() + "::Results::Verified::Novice");
    var secondPackage = secondRisk.getOwner();
    var secondSimPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Simulation");
    var secondProposedNSPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Results::Proposed::Nation State");
    var secondProposedPPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Results::Proposed::Professional");
    var secondProposedIPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Results::Proposed::Intermediate");
    var secondProposedNPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Results::Proposed::Novice");
    var secondDesignedNSPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Results::Designed::Nation State");
    var secondDesignedPPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Results::Designed::Professional");
    var secondDesignedIPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Results::Designed::Intermediate");
    var secondDesignedNPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Results::Designed::Novice");
    var secondVerifiedNSPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Results::Verified::Nation State");
    var secondVerifiedPPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Results::Verified::Professional");
    var secondVerifiedIPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Results::Verified::Intermediate");
    var secondVerifiedNPackage = Finder.byQualifiedName().find(project, secondPackage.getQualifiedName() + "::Results::Verified::Novice");

    var firstProposedNS = firstProposedNSPackage.getOwnedElement();
    var firstProposedP = firstProposedPPackage.getOwnedElement();
    var firstProposedI = firstProposedIPackage.getOwnedElement();
    var firstProposedN = firstProposedNPackage.getOwnedElement();
    var secondProposedNS = secondProposedNSPackage.getOwnedElement();
    var secondProposedP = secondProposedPPackage.getOwnedElement();
    var secondProposedI = secondProposedIPackage.getOwnedElement();
    var secondProposedN = secondProposedNPackage.getOwnedElement();

    var firstDesignedNS = firstDesignedNSPackage.getOwnedElement();
    var firstDesignedP = firstDesignedPPackage.getOwnedElement();
    var firstDesignedI = firstDesignedIPackage.getOwnedElement();
    var firstDesignedN = firstDesignedNPackage.getOwnedElement();
    var secondDesignedNS = secondDesignedNSPackage.getOwnedElement();
    var secondDesignedP = secondDesignedPPackage.getOwnedElement();
    var secondDesignedI = secondDesignedIPackage.getOwnedElement();
    var secondDesignedN = secondDesignedNPackage.getOwnedElement();
    
    var firstVerifiedNS = firstVerifiedNSPackage.getOwnedElement();
    var firstVerifiedP = firstVerifiedPPackage.getOwnedElement();
    var firstVerifiedI = firstVerifiedIPackage.getOwnedElement();
    var firstVerifiedN = firstVerifiedNPackage.getOwnedElement();
    var secondVerifiedNS = secondVerifiedNSPackage.getOwnedElement();
    var secondVerifiedP = secondVerifiedPPackage.getOwnedElement();
    var secondVerifiedI = secondVerifiedIPackage.getOwnedElement();
    var secondVerifiedN = secondVerifiedNPackage.getOwnedElement();

    for(i = 0; i < firstProposedNS.size(); i++) {
        firstProposedNS.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Proposed::Nation State"));
    }
    for(i = 0; i < firstProposedP.size(); i++) {
        firstProposedP.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Proposed::Professional"));
    }
    for(i = 0; i < firstProposedI.size(); i++) {
        firstProposedI.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Proposed::Intermediate"));
    }
    for(i = 0; i < firstProposedN.size(); i++) {
        firstProposedN.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Proposed::Novice"));
    }
    for(i = 0; i < secondProposedNS.size(); i++) {
        secondProposedNS.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Proposed::Nation State"));
    }
    for(i = 0; i < secondProposedP.size(); i++) {
        secondProposedP.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Proposed::Professional"));
    }
    for(i = 0; i < secondProposedI.size(); i++) {
        secondProposedI.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Proposed::Intermediate"));
    }
    for(i = 0; i < secondProposedN.size(); i++) {
        secondProposedN.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Proposed::Novice"));
    }

    for(i = 0; i < firstDesignedNS.size(); i++) {
        firstDesignedNS.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Designed::Nation State"));
    }
    for(i = 0; i < firstDesignedP.size(); i++) {
        firstDesignedP.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Designed::Professional"));
    }
    for(i = 0; i < firstDesignedI.size(); i++) {
        firstDesignedI.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Designed::Intermediate"));
    }
    for(i = 0; i < firstDesignedN.size(); i++) {
        firstDesignedN.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Designed::Novice"));
    }
    for(i = 0; i < secondDesignedNS.size(); i++) {
        secondDesignedNS.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Designed::Nation State"));
    }
    for(i = 0; i < secondDesignedP.size(); i++) {
        secondDesignedP.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Designed::Professional"));
    }
    for(i = 0; i < secondDesignedI.size(); i++) {
        secondDesignedI.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Designed::Intermediate"));
    }
    for(i = 0; i < secondDesignedN.size(); i++) {
        secondDesignedN.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Designed::Novice"));
    }

    for(i = 0; i < firstVerifiedNS.size(); i++) {
        firstVerifiedNS.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Verified::Nation State"));
    }
    for(i = 0; i < firstVerifiedP.size(); i++) {
        firstVerifiedP.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Verified::Professional"));
    }
    for(i = 0; i < firstVerifiedI.size(); i++) {
        firstVerifiedI.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Verified::Intermediate"));
    }
    for(i = 0; i < firstVerifiedN.size(); i++) {
        firstVerifiedN.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Verified::Novice"));
    }
    for(i = 0; i < secondVerifiedNS.size(); i++) {
        secondVerifiedNS.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Verified::Nation State"));
    }
    for(i = 0; i < secondVerifiedP.size(); i++) {
        secondVerifiedP.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Verified::Professional"));
    }
    for(i = 0; i < secondVerifiedI.size(); i++) {
        secondVerifiedI.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Verified::Intermediate"));
    }
    for(i = 0; i < secondVerifiedN.size(); i++) {
        secondVerifiedN.get(i).setOwner(Finder.byQualifiedName().find(project, riskPackage.getQualifiedName() + "::Results::Verified::Novice"));
    }

    // Create the new simulation. Pass in the histograms from the subrisks so they can be added to the new simulation.
    newSession(project, "Simulation");
    var histograms = new HashSet();
    const firstSim = new ArrayList();
    for(i = 0; i < firstSimPackage.getOwnedElement().size(); i++){
        firstSim.add(firstSimPackage.getOwnedElement().get(i));
    }
    writeLog("Got " + firstSim.size() + " owned simulation elements: " + firstSim, 5);
    for(i = 0; i < firstSim.size(); i++) {
        writeLog("Found Owned Element: " + firstSim.get(i).getName(), 5);
        if(firstSim.get(i).getHumanType() == "Histogram"){
            histograms.add(firstSim.get(i));
            writeLog("Found histogram: " + firstSim.get(i).getName(), 5);
        }
    }
    const secondSim = new ArrayList();
    for(i = 0; i < secondSimPackage.getOwnedElement().size(); i++){
        secondSim.add(secondSimPackage.getOwnedElement().get(i));
    }
    writeLog("Got " + secondSim.size() + " owned simulation elements: " + secondSim, 5);
    for(i = 0; i < secondSim.size(); i++) {
        writeLog("Found Owned Element: " + secondSim.get(i).getName(), 5);
        if(secondSim.get(i).getHumanType() == "Histogram"){
            histograms.add(secondSim.get(i));
            writeLog("Found histogram: " + secondSim.get(i).getName(), 5);
        }
    }
    writeLog("Got " + histograms.size() + " existing histograms: " + histograms, 5);
    createSimulation(firstSim, secondSim, histograms, riskClass, residualProbability, detectionProbability);

    // Finally, move the subrisks themselves under the new risk and delete the old subrisk packages.
    newSession(project, "Movement");
    var risks = new ArrayList();
    risks.add(firstRisk);
    risks.add(secondRisk);
    Refactoring.Moving.moveElementsWithRelations(risks, riskClass);

    firstPackage.dispose();
    secondPackage.dispose();
    project.getDiagram(diagram).open();
}

var project = Application.getInstance().getProject();
writeLog("Got project: " + project, 5);
var ef = project.getElementsFactory();
writeLog("Got elementsFactory: " + ef, 5);
newSession(project, "Parametric Creation");
try {
    main(project, ef);
} finally {
    SessionManager.getInstance().closeSession();
}