/* 
This macro creates risk assessment simulations for a given attack tree path.
When a full branch of the attack tree is selected in the containment tree, a parametric risk
diagram will be generated, along with a simulation for that parametric diagram. 

Author: Stuart Fowler
Date: 20 December 2022
*/

importClass(com.nomagic.magicdraw.core.Application);
importClass(com.nomagic.magicdraw.core.Project);
importClass(com.nomagic.magicdraw.openapi.uml.SessionManager);
importClass(com.nomagic.magicdraw.openapi.uml.ModelElementsManager);
importClass(com.nomagic.magicdraw.properties.PropertyManager);
importClass(com.nomagic.magicdraw.validation.ValidationHelper);
importClass(com.nomagic.magicdraw.openapi.uml.PresentationElementsManager);
importClass(com.nomagic.uml2.ext.jmi.helpers.ValueSpecificationHelper);
importClass(com.nomagic.uml2.ext.jmi.helpers.StereotypesHelper);
importClass(com.nomagic.uml2.ext.jmi.helpers.TagsHelper);
importClass(com.nomagic.uml2.ext.jmi.helpers.CoreHelper);
importClass(com.nomagic.uml2.ext.magicdraw.classes.mdkernel.AggregationKindEnum);
importClass(com.nomagic.magicdraw.sysml.util.SysMLProfile);
importClass(com.nomagic.magicdraw.uml.Finder);
importClass(java.util.ArrayList);
importClass(java.util.HashSet);
importClass(com.nomagic.task.RunnableWithProgress);
importClass(com.nomagic.ui.ProgressStatusRunner);
importClass(com.nomagic.magicdraw.ui.dialogs.MDDialogParentProvider);
importClass(com.nomagic.magicdraw.ui.dialogs.selection.ElementSelectionDlgFactory);
importClass(com.nomagic.magicdraw.ui.dialogs.SelectElementTypes);
importClass(com.nomagic.magicdraw.ui.dialogs.SelectElementInfo);
importClass(com.nomagic.generictable.GenericTableManager);

var debug = 1;
var threatImpactSignalPath = "Cyber::Stereotypes::ThreatImpactSignal";
var threatStartPath = "Cyber::Stereotypes::ThreatStart";
var riskFolderPath = "Risk Assessment"
var securityRiskPath = "Cyber::Stereotypes::SecurityRisk";
var initialProbabilityPath = "Cyber::Stereotypes::InitialProbability";
var residualProbabilityPath = "Cyber::Stereotypes::ResidualProbability";
var detectionProbabilityPath = "Cyber::Stereotypes::DetectionProbability";
var difficultyPropertyPath = "Cyber::Stereotypes::difficultyProperty";
var valuePropertyPath = "MD Customization for SysML::additional_stereotypes::ValueProperty";
var partPropertyPath = "MD Customization for SysML::additional_stereotypes::PartProperty";
var numberPath = "SysML::Libraries::PrimitiveValueTypes::Number";
var integerPath = "SysML::Libraries::PrimitiveValueTypes::Integer";
var constraintPropertyPath = "MD Customization for SysML::additional_stereotypes::deprecated elements::ConstraintProperty";
var difficultyConstraintPath = "Cyber::Constraints::Difficulty";
var difficultyConstraintStereotypePath = "Cyber::Stereotypes::DifficultyConstraint";
var difficultyThreatParameterPath = "Cyber::Constraints::Difficulty::Threat";
var difficultyTrivialParameterPath = "Cyber::Constraints::Difficulty::Trivial";
var difficultyLowParameterPath = "Cyber::Constraints::Difficulty::Low";
var difficultyMediumParameterPath = "Cyber::Constraints::Difficulty::Medium";
var difficultyHighParameterPath = "Cyber::Constraints::Difficulty::High";
var difficultyExtremeParameterPath = "Cyber::Constraints::Difficulty::Extreme";
var difficultyEvasionParameterPath = "Cyber::Constraints::Difficulty::Evasion";
var difficultyCertainParameterPath = "Cyber::Constraints::Difficulty::Certain";
var difficultyHighlyLikelyParameterPath = "Cyber::Constraints::Difficulty::HighlyLikely";
var difficultyLikelyParameterPath = "Cyber::Constraints::Difficulty::Likely";
var difficultyPossibleParameterPath = "Cyber::Constraints::Difficulty::Possible";
var difficultyUnlikelyParameterPath = "Cyber::Constraints::Difficulty::Unlikely";
var difficultyRareParameterPath = "Cyber::Constraints::Difficulty::Rare";
var threatLevelPath = "Cyber::Stereotypes::ThreatLevel";
var threatPath = "Cyber::Enumerations::Threat";
var bindingConnectorPath = "SysML::Blocks::BindingConnector";
var legendPath = "Cyber::Legends::Implementation Status";
var threatConstraintPath = "Cyber::Constraints::Threat";
var threatConstraintStereotypePath = "Cyber::Stereotypes::ThreatConstraint";
var detectConstraintPath = "Cyber::Constraints::Detect";
var combineConstraintPath = "Cyber::Constraints::Combine";
var detectConstraintStereotypePath = "Cyber::Stereotypes::DetectConstraint";
var securityConstraintStereotypePath = "Cyber::Stereotypes::SecurityProperty";
var threatRiskInputParameterPath = "Cyber::Constraints::Threat::RiskInput";
var threatRiskOutputParameterPath = "Cyber::Constraints::Threat::RiskOutput";
var threatControlParameterPath = "Cyber::Constraints::Threat::Control";
var threatDifficultyParameterPath = "Cyber::Constraints::Threat::Difficulty";
var mitigationControlEffectivenessPath = "Cyber::Stereotypes::MitigationControlEffectiveness";
var detectionControlEffectivenessPath = "Cyber::Stereotypes::DetectionControlEffectiveness";
var threatActionStereotypePath = "Cyber::Stereotypes::ThreatAction";
var threatActionStereotypeDifficultyPath = "Cyber::Stereotypes::ThreatAction::Difficulty";
var detectProbInputParameterPath = "Cyber::Constraints::Detect::ProbInput";
var detectDetectProbParameterPath = "Cyber::Constraints::Detect::DetectProb";
var detectControlParameterPath = "Cyber::Constraints::Detect::Control";
var detectEvasionParameterPath = "Cyber::Constraints::Detect::Evasion";
var securityControlPath = "Cyber::Stereotypes::SecurityControl";
var noneControlStereoPath = "Cyber::Stereotypes::NoneControl";
var systemPath = "Cyber::Stereotypes::System";
var assetPath = "Cyber::Stereotypes::Asset";
var uniformPath = "SysML::Non-Normative Extensions::Distributions::Uniform";
var histogramPath = "SimulationProfile::ui::Histogram";
var selectPropertiesPath = "SimulationProfile::config::SelectPropertiesConfig";
var timeSeriesChartPath = "SimulationProfile::ui::TimeSeriesChart";
var threatJoinPath = "Cyber::Stereotypes::ThreatJoin";
var postureSignalPath = "Cyber::Stereotypes::PostureImpactSignal";
var nestedConnectorEndPath = "SysML::Blocks::NestedConnectorEnd";
var securityAnalysisPath = "Cyber::Stereotypes::SecurityAnalysis";
var threatModelActionStereotypePath = "Cyber::Stereotypes::ThreatModelAction";

// Diagram global variables
var leftGap = 50;


var topGap = 50;
var threatVeriticalGap = 60;
var threatHorizontalGap = 240;

var threatWidth = 150;
var componentHeight = 150;
var componentGap = 10;
var controlHeight = 80;
var controlEffectivenessHeight = 60;

var valueHeight = 50;
var valueWidth = 240;
var difficultyVerticalGap = 40;

var legendHeight = 100;
var legendWidth = 150;

var parameterWidth = 10;

var numberOfDifficultyParameters = 6;
var difficultyCombinationVerticalGap = 0;

var defaultMinEffectiveness = 10;
var defaultMaxEffectiveness = 90;

// Diagram calculated variables
var initialGap = leftGap + threatWidth + leftGap;
var parameterHeight = parameterWidth;
var threatHeight = threatWidth;
var controlWidth = controlHeight;
var difficultyConstraintHeight = valueHeight * (numberOfDifficultyParameters + 1);
var difficultyGap = valueHeight / (numberOfDifficultyParameters - 1);
var threatConstraint_y = topGap + componentHeight + threatVeriticalGap + controlEffectivenessHeight + threatVeriticalGap;
var threatControlEffectiveness_y = topGap + componentHeight + threatVeriticalGap;
var initialProbability_y = threatConstraint_y + (threatHeight / 2) - (valueHeight / 2) + 2; //Adding 2 aligns with the threat input parameter
var threatLevel_y = initialProbability_y + valueHeight + difficultyVerticalGap;
var difficulty_y = threatLevel_y + valueHeight + difficultyVerticalGap;
var trivial_x = initialGap + threatWidth + leftGap;
var low_y = difficulty_y + valueHeight + difficultyGap;
var medium_y = low_y + valueHeight + difficultyGap;
var high_y = medium_y + valueHeight + difficultyGap;
var extreme_y = high_y + valueHeight + difficultyGap;
var evasion_y = extreme_y + valueHeight + difficultyGap;
var difficultyThreatParameter_x = initialGap + (threatWidth / 2) - (parameterWidth / 2);
var difficultyTrivialParameter_x = initialGap + threatWidth;
var difficultyTrivialParameter_y = difficulty_y + (valueHeight / 2) - (parameterHeight / 2);
var difficultyLowParameter_y = difficultyTrivialParameter_y + valueHeight + difficultyGap;
var difficultyMediumParameter_y = difficultyLowParameter_y + valueHeight + difficultyGap;
var difficultyHighParameter_y = difficultyMediumParameter_y + valueHeight + difficultyGap;
var difficultyExtremeParameter_y = difficultyHighParameter_y + valueHeight + difficultyGap;
var difficultyEvasionParameter_y = difficultyExtremeParameter_y + valueHeight + difficultyGap;
var firstthreat_x = trivial_x + valueWidth + leftGap;
var threatRiskInputParameter_y = threatConstraint_y + (threatHeight / 2) - (parameterHeight / 2);
var threatRiskOutputParameter_x = firstthreat_x + threatWidth;
var threatControlParameter_x = firstthreat_x + (threatWidth / 2) - (parameterWidth / 2);
var threatDifficultyParameter_y = threatConstraint_y + threatHeight;
var difficultyThreatGap = difficulty_y - (threatConstraint_y + threatHeight);
var detectConstraint_y = difficulty_y + difficultyConstraintHeight + difficultyThreatGap;
var detectProbInputParameter_y = detectConstraint_y + (threatHeight / 2) - (parameterHeight / 2);
var threatControlParameter_y = detectConstraint_y + threatHeight;
var detectControlEffectiveness_y = detectConstraint_y + threatHeight + threatVeriticalGap;
var detectComponent_y = detectControlEffectiveness_y + controlEffectivenessHeight + threatVeriticalGap;
var initProbPath_x = initialGap + valueWidth;
var initProbBend_x = trivial_x + threatWidth + leftGap;
var detectCombination_y = detectConstraint_y + threatHeight;




function calculateComponent_x(componentNumber, totalComponents, step) {
    return (getThreatX(step) - ((totalComponents - 1) * (threatWidth / 2)) - ((totalComponents - 1) * (componentGap / 2)) + (componentNumber * (threatWidth + componentGap)));
}

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
        var currentNodes = project.getBrowser().getContainmentTree().getSelectedNodes();
        var currentObjects = [];
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

function getStereotypeInArray(array, stereotype) {
    //If something is selected in containment tree
    for (x = 0; x < array.length; x++) {
        if(StereotypesHelper.hasStereotype(array[x], stereotype)) {
            writeLog("Got " + stereotype.getName() +": " + array[x].getName(), 5);
            return array[x];
        }
    }
    writeLog("No " + stereotype.getName() + " in Selected Objects", 3);
    return null;      
}

function createRisk(project, start, signal, assetSelectionString, threatName) {
    if(!(Finder.byQualifiedName().find(project, riskFolderPath))){
        riskPackage = ef.createPackageInstance();
        riskPackage.setName(riskFolderPath);
        riskPackage.setOwner(project.getPrimaryModel());
    }
    threatPackage = ef.createPackageInstance();
    threatPackage.setOwner(Finder.byQualifiedName().find(project, riskFolderPath));
    threatPackage.setName(start + " - " + signal + " - " + threatName + assetSelectionString);
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

    return riskClass;
}

function changeProperty(shape, ID, value) {
    properties = shape.getPropertyManager().clone();
    prop = properties.getProperties();
    for(i = 0; i < prop.size(); i++) {
        writeLog(prop.get(i).getName() + " - " + prop.get(i).getID() + " - " + prop.get(i).getValue(), 5);
    }        
    newValue = shape.getProperty(ID);
    newValue.setValue(value);
    properties.addProperty(newValue);
    PresentationElementsManager.getInstance().setPresentationElementProperties(shape, properties);
    writeLog("Changed Property: " + shape.getName() + " - " + ID.toString() + " - " + value, 4);
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
    newConnectorShape = PresentationElementsManager.getInstance().createPathElement(newConnector, shape1, shape2);
    writeLog("Created new connecter: " + part1.getName() + " - " + part2.getName(), 4);
    return [newConnector, newConnectorShape];
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

function createDependency(clientPart, clientShape, supplierPart, supplierShape) {
    newDependency = ef.createDependencyInstance();
    newDependency.setOwner(riskClass.getOwner());
    CoreHelper.setClientElement(newDependency, clientPart);
    CoreHelper.setSupplierElement(newDependency, supplierPart);
    if(clientShape && supplierShape) {
        PresentationElementsManager.getInstance().createPathElement(newDependency, clientShape, supplierShape);
    }
    return newDependency
}

function buildInitialShapes(diagram, initialNode, riskClass) {

    parametricDiagram = project.getDiagram(diagram);

    initialProbability = createProperty(riskClass, "Initial Probability - " + initialNode.getName(), Finder.byQualifiedName().find(project, numberPath), 100, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, initialProbabilityPath), null, null);
    initialProbabilityShape = PresentationElementsManager.getInstance().createShapeElement(initialProbability, parametricDiagram);
    changeProperty(initialProbabilityShape, "SHOW_DEFAULT_PART_VALUE", true);       
    PresentationElementsManager.getInstance().reshapeShapeElement(initialProbabilityShape, new java.awt.Rectangle(initialGap,initialProbability_y,valueWidth,valueHeight));

    threatLevel = createProperty(riskClass, "Threat Level", Finder.byQualifiedName().find(project, threatPath), "Nation State", Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, threatLevelPath), null, null);
    threatLevelShape = PresentationElementsManager.getInstance().createShapeElement(threatLevel, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(threatLevelShape, new java.awt.Rectangle(initialGap,threatLevel_y,threatWidth,valueHeight));

    difficultyConstraint = createProperty(riskClass, "Difficulty", Finder.byQualifiedName().find(project, difficultyConstraintPath), null, Finder.byQualifiedName().find(project, constraintPropertyPath), Finder.byQualifiedName().find(project, difficultyConstraintStereotypePath), null, null);
    difficultyConstraintShape = PresentationElementsManager.getInstance().createShapeElement(difficultyConstraint, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyConstraintShape, new java.awt.Rectangle(initialGap,difficulty_y,threatWidth,difficultyConstraintHeight));

    difficultyThreatParameter = Finder.byQualifiedName().find(project, difficultyThreatParameterPath);
    difficultyTrivialParameter = Finder.byQualifiedName().find(project, difficultyTrivialParameterPath);
    difficultyLowParameter = Finder.byQualifiedName().find(project, difficultyLowParameterPath);
    difficultyMediumParameter = Finder.byQualifiedName().find(project, difficultyMediumParameterPath);
    difficultyHighParameter = Finder.byQualifiedName().find(project, difficultyHighParameterPath);
    difficultyExtremeParameter = Finder.byQualifiedName().find(project, difficultyExtremeParameterPath);
    difficultyEvasionParameter = Finder.byQualifiedName().find(project, difficultyEvasionParameterPath);

    difficultyCertainParameter = Finder.byQualifiedName().find(project, difficultyCertainParameterPath);
    difficultyHighlyLikelyParameter = Finder.byQualifiedName().find(project, difficultyHighlyLikelyParameterPath);
    difficultyLikelyParameter = Finder.byQualifiedName().find(project, difficultyLikelyParameterPath);
    difficultyPossibleParameter = Finder.byQualifiedName().find(project, difficultyPossibleParameterPath);
    difficultyUnlikelyParameter = Finder.byQualifiedName().find(project, difficultyUnlikelyParameterPath);
    difficultyRareParameter = Finder.byQualifiedName().find(project, difficultyRareParameterPath);

    difficultyThreatShape = PresentationElementsManager.getInstance().createShapeElement(difficultyThreatParameter, difficultyConstraintShape);
    changeProperty(difficultyThreatShape, "SHOW_NAME", false);     
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyThreatShape, new java.awt.Rectangle(difficultyThreatParameter_x,difficulty_y,parameterWidth,parameterHeight));
    createBindingConnector(difficultyThreatParameter, difficultyThreatShape, difficultyConstraint, threatLevel, threatLevelShape, null);

    difficultyTrivialShape = PresentationElementsManager.getInstance().createShapeElement(difficultyTrivialParameter, difficultyConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyTrivialShape, new java.awt.Rectangle(difficultyTrivialParameter_x,difficultyTrivialParameter_y,parameterWidth,parameterHeight));
    difficultyLowShape = PresentationElementsManager.getInstance().createShapeElement(difficultyLowParameter, difficultyConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyLowShape, new java.awt.Rectangle(difficultyTrivialParameter_x,difficultyLowParameter_y,parameterWidth,parameterHeight));
    difficultyMediumShape = PresentationElementsManager.getInstance().createShapeElement(difficultyMediumParameter, difficultyConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyMediumShape, new java.awt.Rectangle(difficultyTrivialParameter_x,difficultyMediumParameter_y,parameterWidth,parameterHeight));            
    difficultyHighShape = PresentationElementsManager.getInstance().createShapeElement(difficultyHighParameter, difficultyConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyHighShape, new java.awt.Rectangle(difficultyTrivialParameter_x,difficultyHighParameter_y,parameterWidth,parameterHeight));            
    difficultyExtremeShape = PresentationElementsManager.getInstance().createShapeElement(difficultyExtremeParameter, difficultyConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyExtremeShape, new java.awt.Rectangle(difficultyTrivialParameter_x,difficultyExtremeParameter_y,parameterWidth,parameterHeight));            
    difficultyEvasionShape = PresentationElementsManager.getInstance().createShapeElement(difficultyEvasionParameter, difficultyConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyEvasionShape, new java.awt.Rectangle(difficultyTrivialParameter_x,difficultyEvasionParameter_y,parameterWidth,parameterHeight));   

    difficultyCertainShape = PresentationElementsManager.getInstance().createShapeElement(difficultyCertainParameter, difficultyConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyCertainShape, new java.awt.Rectangle(initialGap,difficultyTrivialParameter_y,parameterWidth,parameterHeight));
    difficultyHighlyLikelyShape = PresentationElementsManager.getInstance().createShapeElement(difficultyHighlyLikelyParameter, difficultyConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyHighlyLikelyShape, new java.awt.Rectangle(initialGap,difficultyLowParameter_y,parameterWidth,parameterHeight));
    difficultyLikelyShape = PresentationElementsManager.getInstance().createShapeElement(difficultyLikelyParameter, difficultyConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyLikelyShape, new java.awt.Rectangle(initialGap,difficultyMediumParameter_y,parameterWidth,parameterHeight));            
    difficultyPossibleShape = PresentationElementsManager.getInstance().createShapeElement(difficultyPossibleParameter, difficultyConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyPossibleShape, new java.awt.Rectangle(initialGap,difficultyHighParameter_y,parameterWidth,parameterHeight));            
    difficultyUnlikelyShape = PresentationElementsManager.getInstance().createShapeElement(difficultyUnlikelyParameter, difficultyConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyUnlikelyShape, new java.awt.Rectangle(initialGap,difficultyExtremeParameter_y,parameterWidth,parameterHeight));            
    difficultyRareShape = PresentationElementsManager.getInstance().createShapeElement(difficultyRareParameter, difficultyConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(difficultyRareShape, new java.awt.Rectangle(initialGap,difficultyEvasionParameter_y,parameterWidth,parameterHeight));         

    trivialValue = createProperty(riskClass, "Trivial Difficulty", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, difficultyPropertyPath), null, null);
    trivialShape = PresentationElementsManager.getInstance().createShapeElement(trivialValue, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(trivialShape, new java.awt.Rectangle(trivial_x,difficulty_y,threatWidth,valueHeight));
    createBindingConnector(difficultyTrivialParameter, difficultyTrivialShape, difficultyConstraint, trivialValue, trivialShape, null);

    lowValue = createProperty(riskClass, "Low Difficulty", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, difficultyPropertyPath), null, null);
    lowShape = PresentationElementsManager.getInstance().createShapeElement(lowValue, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(lowShape, new java.awt.Rectangle(trivial_x,low_y,threatWidth,valueHeight));
    createBindingConnector(difficultyLowParameter, difficultyLowShape, difficultyConstraint, lowValue, lowShape, null);

    mediumValue = createProperty(riskClass, "Medium Difficulty", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, difficultyPropertyPath), null, null);
    mediumShape = PresentationElementsManager.getInstance().createShapeElement(mediumValue, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(mediumShape, new java.awt.Rectangle(trivial_x,medium_y,threatWidth,valueHeight));
    createBindingConnector(difficultyMediumParameter, difficultyMediumShape, difficultyConstraint, mediumValue, mediumShape, null);

    highValue = createProperty(riskClass, "High Difficulty", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, difficultyPropertyPath), null, null);
    highShape = PresentationElementsManager.getInstance().createShapeElement(highValue, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(highShape, new java.awt.Rectangle(trivial_x,high_y,threatWidth,valueHeight));
    createBindingConnector(difficultyHighParameter, difficultyHighShape, difficultyConstraint, highValue, highShape, null);

    extremeValue = createProperty(riskClass, "Extreme Difficulty", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, difficultyPropertyPath), null, null);
    extremeShape = PresentationElementsManager.getInstance().createShapeElement(extremeValue, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(extremeShape, new java.awt.Rectangle(trivial_x,extreme_y,threatWidth,valueHeight));
    createBindingConnector(difficultyExtremeParameter, difficultyExtremeShape, difficultyConstraint, extremeValue, extremeShape, null);

    evasionValue = createProperty(riskClass, "Evasion Skill", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, difficultyPropertyPath), null, null);
    evasionShape = PresentationElementsManager.getInstance().createShapeElement(evasionValue, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(evasionShape, new java.awt.Rectangle(trivial_x,evasion_y,threatWidth,valueHeight));
    createBindingConnector(difficultyEvasionParameter, difficultyEvasionShape, difficultyConstraint, evasionValue, evasionShape, null);

    certainValue = createProperty(riskClass, "Certain", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, difficultyPropertyPath), 100, 100);
    certainShape = PresentationElementsManager.getInstance().createShapeElement(certainValue, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(certainShape, new java.awt.Rectangle(leftGap,difficulty_y,threatWidth,valueHeight));
    createBindingConnector(difficultyCertainParameter, difficultyCertainShape, difficultyConstraint, certainValue, certainShape, null);

    highlyLikelyValue = createProperty(riskClass, "Highly Likely", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, difficultyPropertyPath), 80, 90);
    highlyLikelyShape = PresentationElementsManager.getInstance().createShapeElement(highlyLikelyValue, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(highlyLikelyShape, new java.awt.Rectangle(leftGap,low_y,threatWidth,valueHeight));
    createBindingConnector(difficultyHighlyLikelyParameter, difficultyHighlyLikelyShape, difficultyConstraint, highlyLikelyValue, highlyLikelyShape, null);

    likelyValue = createProperty(riskClass, "Likely", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, difficultyPropertyPath), 60, 70);
    likelyShape = PresentationElementsManager.getInstance().createShapeElement(likelyValue, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(likelyShape, new java.awt.Rectangle(leftGap,medium_y,threatWidth,valueHeight));
    createBindingConnector(difficultyLikelyParameter, difficultyLikelyShape, difficultyConstraint, likelyValue, likelyShape, null);

    possibleValue = createProperty(riskClass, "Possible", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, difficultyPropertyPath), 40, 50);
    possibleShape = PresentationElementsManager.getInstance().createShapeElement(possibleValue, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(possibleShape, new java.awt.Rectangle(leftGap,high_y,threatWidth,valueHeight));
    createBindingConnector(difficultyPossibleParameter, difficultyPossibleShape, difficultyConstraint, possibleValue, possibleShape, null);

    unlikelyValue = createProperty(riskClass, "Unlikely", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, difficultyPropertyPath), 20, 30);
    unlikelyShape = PresentationElementsManager.getInstance().createShapeElement(unlikelyValue, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(unlikelyShape, new java.awt.Rectangle(leftGap,extreme_y,threatWidth,valueHeight));
    createBindingConnector(difficultyUnlikelyParameter, difficultyUnlikelyShape, difficultyConstraint, unlikelyValue, unlikelyShape, null);

    rareValue = createProperty(riskClass, "Rare", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, difficultyPropertyPath), 0, 10);
    rareShape = PresentationElementsManager.getInstance().createShapeElement(rareValue, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(rareShape, new java.awt.Rectangle(leftGap,evasion_y,threatWidth,valueHeight));
    createBindingConnector(difficultyRareParameter, difficultyRareShape, difficultyConstraint, rareValue, rareShape, null);

    legendShape = PresentationElementsManager.getInstance().createShapeElement(Finder.byQualifiedName().find(project, legendPath), parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(legendShape, new java.awt.Rectangle(initialGap,topGap,legendWidth,legendHeight));

    return [initialProbability, initialProbabilityShape, null, initialProbability, initialProbabilityShape, null]
}

function getThreatX (threatNumber) {
    return (firstthreat_x + (threatNumber * (threatHorizontalGap + threatWidth)));
}

function getThreatRiskOutputParameterX (threatNumber) {
    return (threatRiskOutputParameter_x + (threatNumber * (threatHorizontalGap + threatWidth)));
}

function getThreatControlParameterX (threatNumber) {
    return (threatControlParameter_x + (threatNumber * (threatHorizontalGap + threatWidth)));
}

function getInitProbBendX(threatNumber) {
    return (initProbBend_x + (threatNumber * (threatHorizontalGap + threatWidth)));
}

function getDetectionCombinationY (parameterNumber) {
    return detectCombination_y + parameterHeight + (parameterNumber * (parameterHeight + difficultyCombinationVerticalGap));
}

function buildThreatAction(diagram, previousNode, currentNode, step, noneControlPath, systemBlockPath, noneConstraintPath, assetSelection, mitigationTable, detectionTable) {
    parametricDiagram = project.getDiagram(diagram);

    threatConstraint = createProperty(riskClass, currentNode.getName(), Finder.byQualifiedName().find(project, threatConstraintPath), null, Finder.byQualifiedName().find(project, constraintPropertyPath), Finder.byQualifiedName().find(project, threatConstraintStereotypePath), null, null);
    threatConstraintShape = PresentationElementsManager.getInstance().createShapeElement(threatConstraint, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(threatConstraintShape, new java.awt.Rectangle(getThreatX(step),threatConstraint_y,threatWidth,threatHeight));

    createDependency(threatConstraint, null, currentNode, null);

    threatRiskInputParameter = Finder.byQualifiedName().find(project, threatRiskInputParameterPath);
    threatRiskOutputParameter = Finder.byQualifiedName().find(project, threatRiskOutputParameterPath);
    threatControlParameter = Finder.byQualifiedName().find(project, threatControlParameterPath);
    threatDifficultyParameter = Finder.byQualifiedName().find(project, threatDifficultyParameterPath);

    threatRiskInputParameterShape = PresentationElementsManager.getInstance().createShapeElement(threatRiskInputParameter, threatConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(threatRiskInputParameterShape, new java.awt.Rectangle(getThreatX(step),threatRiskInputParameter_y,parameterWidth,parameterHeight));
    writeLog("InputParameter_y: " + threatRiskInputParameter_y, 4);
    threatRiskOutputParameterShape = PresentationElementsManager.getInstance().createShapeElement(threatRiskOutputParameter, threatConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(threatRiskOutputParameterShape, new java.awt.Rectangle(getThreatRiskOutputParameterX(step),threatRiskInputParameter_y,parameterWidth,parameterHeight));
    threatControlParameterShape = PresentationElementsManager.getInstance().createShapeElement(threatControlParameter, threatConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(threatControlParameterShape, new java.awt.Rectangle(getThreatControlParameterX(step),threatConstraint_y,parameterWidth,parameterHeight));
    threatDifficultyParameterShape = PresentationElementsManager.getInstance().createShapeElement(threatDifficultyParameter, threatConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(threatDifficultyParameterShape, new java.awt.Rectangle(getThreatControlParameterX(step),threatDifficultyParameter_y,parameterWidth,parameterHeight));
    
    currentDifficulty = TagsHelper.getStereotypePropertyValue(currentNode, Finder.byQualifiedName().find(project, threatActionStereotypePath), "Difficulty");
    writeLog("currentNode Difficulty: " + currentDifficulty.get(0).getName(), 4);

    if(currentDifficulty.get(0).getName() == "Trivial") {
        createBindingConnector(threatDifficultyParameter, threatDifficultyParameterShape, threatConstraint, trivialValue, trivialShape, null);
    }else if(currentDifficulty.get(0).getName() == "Low") {
        createBindingConnector(threatDifficultyParameter, threatDifficultyParameterShape, threatConstraint, lowValue, lowShape, null); 
    }else if(currentDifficulty.get(0).getName() == "Medium") {
        createBindingConnector(threatDifficultyParameter, threatDifficultyParameterShape, threatConstraint, mediumValue, mediumShape, null); 
    }else if(currentDifficulty.get(0).getName() == "High") {
        createBindingConnector(threatDifficultyParameter, threatDifficultyParameterShape, threatConstraint, highValue, highShape, null);
    }else if(currentDifficulty.get(0).getName() == "Extreme") {
        createBindingConnector(threatDifficultyParameter, threatDifficultyParameterShape, threatConstraint, extremeValue, extremeShape, null);
    }

    if(TagsHelper.getStereotypePropertyValue(currentNode, Finder.byQualifiedName().find(project, threatModelActionStereotypePath), "controlEffectivenessMin").size() == 1) {
        var CEmin = TagsHelper.getStereotypePropertyValue(currentNode, Finder.byQualifiedName().find(project, threatModelActionStereotypePath), "controlEffectivenessMin").get(0);
    } else {
        var CEmin = defaultMinEffectiveness;
    }
    if(TagsHelper.getStereotypePropertyValue(currentNode, Finder.byQualifiedName().find(project, threatModelActionStereotypePath), "controlEffectivenessMax").size() == 1) {
        var CEmax = TagsHelper.getStereotypePropertyValue(currentNode, Finder.byQualifiedName().find(project, threatModelActionStereotypePath), "controlEffectivenessMax").get(0);
    } else {
        var CEmax = defaultMaxEffectiveness;
    }
    if(TagsHelper.getStereotypePropertyValue(currentNode, Finder.byQualifiedName().find(project, threatModelActionStereotypePath), "controlEffectivenessJustification").size() == 1) {
        var CEjustification = TagsHelper.getStereotypePropertyValue(currentNode, Finder.byQualifiedName().find(project, threatModelActionStereotypePath), "controlEffectivenessJustification").get(0);
    } else {
        var CEjustification = "";
    }  

    threatControlEffectiveness = createProperty(riskClass, "Control Effectiveness - " + currentNode.getName(), Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, mitigationControlEffectivenessPath), CEmin, CEmax);
    CoreHelper.setComment(threatControlEffectiveness, CEjustification);
    TagsHelper.setStereotypePropertyValue(threatControlEffectiveness, Finder.byQualifiedName().find(project, mitigationControlEffectivenessPath), "overrideDerivedEffectiveness", false);
    threatControlEffectivenessShape = PresentationElementsManager.getInstance().createShapeElement(threatControlEffectiveness, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(threatControlEffectivenessShape, new java.awt.Rectangle(getThreatX(step),threatControlEffectiveness_y,threatWidth,controlEffectivenessHeight));
    GenericTableManager.addRowElement(mitigationTable, threatControlEffectiveness);

    createBindingConnector(threatRiskInputParameter, threatRiskInputParameterShape, threatConstraint, previousNode[0], previousNode[1], previousNode[2]);
    createBindingConnector(threatControlParameter, threatControlParameterShape, threatConstraint, threatControlEffectiveness, threatControlEffectivenessShape, null);

    //draw constraints
    linkedAssets = currentNode.refGetValue("affects");
    writeLog("allocatedComponents: " + linkedAssets, 5);
    if(assetSelection) {
        for(h = 0; h < linkedAssets.size(); h++) {
            if(!(linkedAssets.get(h).isAbstract() || assetSelection.contains(linkedAssets.get(h)) || (linkedAssets.get(h) == Finder.byQualifiedName().find(project, systemBlockPath)))) {
                linkedAssets.remove(h);
            }
        }
    }
    linkedControls = currentNode.refGetValue("mitigatedBy");
    writeLog("potentialControls: " + linkedControls, 5);

    if(noneControlPath && linkedControls.get(0) == Finder.byQualifiedName().find(project, noneControlPath)){
        if(noneConstraintPath && systemBlockPath){
            noneConstraint = Finder.byQualifiedName().find(project, noneConstraintPath);
            currentPart = createProperty(riskClass, null, Finder.byQualifiedName().find(project, systemBlockPath), null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
            currentPartShape = PresentationElementsManager.getInstance().createShapeElement(currentPart, parametricDiagram);
            currentConstraintShape = PresentationElementsManager.getInstance().createShapeElement(noneConstraint, currentPartShape);
            createDependency(threatControlEffectiveness, threatControlEffectivenessShape, noneConstraint, currentConstraintShape);
            PresentationElementsManager.getInstance().reshapeShapeElement(currentPartShape, new java.awt.Rectangle(getThreatX(step), topGap, threatWidth, componentHeight));
        } else {
            writeLog("ERROR: NoneControl is linked to " + currentNode.getName() + " but there is no associated SecurityProperty on the System Block.")
        }
        TagsHelper.setStereotypePropertyValue(threatControlEffectiveness, Finder.byQualifiedName().find(project, uniformPath), "min", "0");
        TagsHelper.setStereotypePropertyValue(threatControlEffectiveness, Finder.byQualifiedName().find(project, uniformPath), "max", "0");
        CoreHelper.setComment(threatControlEffectiveness, "There are no controls linked to this action. Control effectiveness is 0.");
    }
    else {
        for(i = 0; i < linkedAssets.size(); i++) {
            currentAsset = linkedAssets.get(i);
            currentPart = createProperty(riskClass, null, currentAsset, null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
            currentPartShape = PresentationElementsManager.getInstance().createShapeElement(currentPart, parametricDiagram);
            ownedConstraints = currentAsset.getOwnedElement();
            for(j = 0; j < ownedConstraints.size(); j++) {
                if(StereotypesHelper.hasStereotype(ownedConstraints.get(j), Finder.byQualifiedName().find(project, securityConstraintStereotypePath))) {
                    writeLog("SecurityConstraint Found: " + ownedConstraints.get(j).getName(), 5);
                    if(linkedControls.contains(ownedConstraints.get(j).getType())) {
                        writeLog("ApplicableControl Found: " + ownedConstraints.get(j).getType().getName(), 4);
                        currentConstraintShape = PresentationElementsManager.getInstance().createShapeElement(ownedConstraints.get(j), currentPartShape);
                        createDependency(threatControlEffectiveness, threatControlEffectivenessShape, ownedConstraints.get(j), currentConstraintShape);
                    }
                }                    
            }
            PresentationElementsManager.getInstance().reshapeShapeElement(currentPartShape, new java.awt.Rectangle(calculateComponent_x(i, linkedAssets.size(), step), topGap, threatWidth, componentHeight));
        }
    }

    currentDetectNode = currentNode.refGetValue("DetectionAction").get(0);

    //draw detect
    detectConstraint = createProperty(riskClass, currentDetectNode.getName(), Finder.byQualifiedName().find(project, detectConstraintPath), null, Finder.byQualifiedName().find(project, constraintPropertyPath), Finder.byQualifiedName().find(project, detectConstraintStereotypePath), null, null);
    detectConstraintShape = PresentationElementsManager.getInstance().createShapeElement(detectConstraint, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(detectConstraintShape, new java.awt.Rectangle(getThreatX(step),detectConstraint_y,threatWidth,threatHeight));

    createDependency(detectConstraint, null, currentDetectNode, null);

    detectProbInputParameter = Finder.byQualifiedName().find(project, detectProbInputParameterPath);
    detectDetectProbParameter = Finder.byQualifiedName().find(project, detectDetectProbParameterPath);
    detectControlParameter = Finder.byQualifiedName().find(project, detectControlParameterPath);
    detectEvasionParameter = Finder.byQualifiedName().find(project, detectEvasionParameterPath);

    detectProbInputParameterShape = PresentationElementsManager.getInstance().createShapeElement(detectProbInputParameter, detectConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(detectProbInputParameterShape, new java.awt.Rectangle(getThreatX(step),detectProbInputParameter_y,parameterWidth,parameterHeight));
    detectDetectProbParameterShape = PresentationElementsManager.getInstance().createShapeElement(detectDetectProbParameter, detectConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(detectDetectProbParameterShape, new java.awt.Rectangle(getThreatRiskOutputParameterX(step),detectProbInputParameter_y,parameterWidth,parameterHeight));
    detectControlParameterShape = PresentationElementsManager.getInstance().createShapeElement(detectControlParameter, detectConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(detectControlParameterShape, new java.awt.Rectangle(getThreatControlParameterX(step),threatControlParameter_y,parameterWidth,parameterHeight));
    detectEvasionParameterShape = PresentationElementsManager.getInstance().createShapeElement(detectEvasionParameter, detectConstraintShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(detectEvasionParameterShape, new java.awt.Rectangle(getThreatControlParameterX(step),detectConstraint_y,parameterWidth,parameterHeight));

    initToDetect = createBindingConnector(previousNode[0], previousNode[1], previousNode[2], detectProbInputParameter, detectProbInputParameterShape, detectConstraint);

        // DRAW PATH PROPERLY
    pathPoints = new ArrayList();
    point1 = new java.awt.Point(getInitProbBendX(step), initToDetect[1].getSupplier().getMiddlePoint().y);        
    point2 = new java.awt.Point(getInitProbBendX(step), initToDetect[1].getClient().getMiddlePoint().y);
    pathPoints.add(initToDetect[1].getSupplier().getMiddlePoint());
    pathPoints.add(point1);
    pathPoints.add(point2);
    pathPoints.add(initToDetect[1].getClient().getMiddlePoint());
    writeLog("supplier: " + pathPoints.get(0).toString(), 5);
    writeLog("point1: " + pathPoints.get(1).toString(), 5);
    writeLog("point2: " + pathPoints.get(2).toString(), 5);
    writeLog("client: " + pathPoints.get(3).toString(), 5);
    PresentationElementsManager.getInstance().changePathPoints(initToDetect[1], pathPoints.get(0), pathPoints.get(3), pathPoints);

    createBindingConnector(detectEvasionParameter, detectEvasionParameterShape, detectConstraint, evasionValue, evasionShape, null);
    
    if(TagsHelper.getStereotypePropertyValue(currentDetectNode, Finder.byQualifiedName().find(project, threatModelActionStereotypePath), "controlEffectivenessMin").size() == 1) {
        var CEmin = TagsHelper.getStereotypePropertyValue(currentDetectNode, Finder.byQualifiedName().find(project, threatModelActionStereotypePath), "controlEffectivenessMin").get(0);
    } else {
        var CEmin = defaultMinEffectiveness;
    }
    if(TagsHelper.getStereotypePropertyValue(currentDetectNode, Finder.byQualifiedName().find(project, threatModelActionStereotypePath), "controlEffectivenessMax").size() == 1) {
        var CEmax = TagsHelper.getStereotypePropertyValue(currentDetectNode, Finder.byQualifiedName().find(project, threatModelActionStereotypePath), "controlEffectivenessMax").get(0);
    } else {
        var CEmax = defaultMaxEffectiveness;
    }
    if(TagsHelper.getStereotypePropertyValue(currentDetectNode, Finder.byQualifiedName().find(project, threatModelActionStereotypePath), "controlEffectivenessJustification").size() == 1) {
        var CEjustification = TagsHelper.getStereotypePropertyValue(currentDetectNode, Finder.byQualifiedName().find(project, threatModelActionStereotypePath), "controlEffectivenessJustification").get(0);
    } else {
        var CEjustification = "";
    }  

    detectControlEffectiveness = createProperty(riskClass, "Control Effectiveness - " + currentDetectNode.getName(), Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, detectionControlEffectivenessPath), CEmin, CEmax);
    CoreHelper.setComment(detectControlEffectiveness, CEjustification);
    TagsHelper.setStereotypePropertyValue(detectControlEffectiveness, Finder.byQualifiedName().find(project, detectionControlEffectivenessPath), "overrideDerivedEffectiveness", false);
    detectControlEffectivenessShape = PresentationElementsManager.getInstance().createShapeElement(detectControlEffectiveness, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(detectControlEffectivenessShape, new java.awt.Rectangle(getThreatX(step),detectControlEffectiveness_y,threatWidth,controlEffectivenessHeight));
    GenericTableManager.addRowElement(detectionTable, detectControlEffectiveness);

    createBindingConnector(detectControlParameter, detectControlParameterShape, detectConstraint, detectControlEffectiveness, detectControlEffectivenessShape, null);

    //draw constraints
    linkedAssets = currentDetectNode.refGetValue("affects");
    writeLog("allocatedComponents: " + linkedAssets, 5);
    if(assetSelection) {
        for(h = 0; h < linkedAssets.size(); h++) {
            if(!(linkedAssets.get(h).isAbstract() || assetSelection.contains(linkedAssets.get(h)) || (linkedAssets.get(h) == Finder.byQualifiedName().find(project, systemBlockPath)))) {
                linkedAssets.remove(h);
            }
        }
    }
    linkedControls = currentDetectNode.refGetValue("mitigatedBy");
    writeLog("potentialControls: " + linkedControls, 5);

    if(noneControlPath && linkedControls.get(0) == Finder.byQualifiedName().find(project, noneControlPath)){
        if(noneConstraintPath && systemBlockPath){
            noneConstraint = Finder.byQualifiedName().find(project, noneConstraintPath);
            currentPart = createProperty(riskClass, null, Finder.byQualifiedName().find(project, systemBlockPath), null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
            currentPartShape = PresentationElementsManager.getInstance().createShapeElement(currentPart, parametricDiagram);
            currentConstraintShape = PresentationElementsManager.getInstance().createShapeElement(noneConstraint, currentPartShape);
            createDependency(detectControlEffectiveness, detectControlEffectivenessShape, noneConstraint, currentConstraintShape);
            PresentationElementsManager.getInstance().reshapeShapeElement(currentPartShape, new java.awt.Rectangle(getThreatX(step), detectComponent_y, threatWidth, componentHeight));
        } else {
            writeLog("ERROR: NoneControl is linked to " + currentDetectNode.getName() + " but there is no associated SecurityProperty on the System Block.")
        }
        TagsHelper.setStereotypePropertyValue(detectControlEffectiveness, Finder.byQualifiedName().find(project, uniformPath), "min", 0);
        TagsHelper.setStereotypePropertyValue(detectControlEffectiveness, Finder.byQualifiedName().find(project, uniformPath), "max", 0);
        CoreHelper.setComment(threatControlEffectiveness, "There are no controls linked to this action. Control effectiveness is 0.");
    }
    else {
        for(i = 0; i < linkedAssets.size(); i++) {
            currentAsset = linkedAssets.get(i);
            currentPart = createProperty(riskClass, null, currentAsset, null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
            currentPartShape = PresentationElementsManager.getInstance().createShapeElement(currentPart, parametricDiagram);
            ownedConstraints = currentAsset.getOwnedElement();
            for(j = 0; j < ownedConstraints.size(); j++) {
                if(StereotypesHelper.hasStereotype(ownedConstraints.get(j), Finder.byQualifiedName().find(project, securityConstraintStereotypePath))) {
                    writeLog("SecurityConstraint Found: " + ownedConstraints.get(j).getName(), 5);
                    if(linkedControls.contains(ownedConstraints.get(j).getType())) {
                        writeLog("ApplicableControl Found: " + ownedConstraints.get(j).getType().getName(), 4);
                        currentConstraintShape = PresentationElementsManager.getInstance().createShapeElement(ownedConstraints.get(j), currentPartShape);
                        createDependency(detectControlEffectiveness, detectControlEffectivenessShape, ownedConstraints.get(j), currentConstraintShape);
                    }
                }                    
            }
            PresentationElementsManager.getInstance().reshapeShapeElement(currentPartShape, new java.awt.Rectangle(calculateComponent_x(i, linkedAssets.size(), step), detectComponent_y, threatWidth, componentHeight));
        }
    }

    return [threatRiskOutputParameter, threatRiskOutputParameterShape, threatConstraint, detectDetectProbParameter, detectDetectProbParameterShape, detectConstraint]
}

function buildFinalShapes(diagram, previousNode, currentNode, step, allNodes, detectionCombinationHeight, detectCombinationOut_y, detectionProbability_y, finalParameters, fullBlocks, fullBlockHeight) {

    parametricDiagram = project.getDiagram(diagram);

    residualProbability = createProperty(riskClass, "Residual Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, residualProbabilityPath), null, null);
    residualProbabilityShape = PresentationElementsManager.getInstance().createShapeElement(residualProbability, parametricDiagram); 
    PresentationElementsManager.getInstance().reshapeShapeElement(residualProbabilityShape, new java.awt.Rectangle(getThreatX(step),initialProbability_y,threatWidth,valueHeight));
    createBindingConnector(residualProbability, residualProbabilityShape, null, previousNode[0], previousNode[1], previousNode[2]);

    var detectionParameters = new ArrayList();
    var outParameters = new ArrayList();

    writeLog("Number of Detections: " + allNodes.size() - 1, 3);

    for(x = 0; x < fullBlocks; x++) {
        detectionCombinationPath = detectConstraintPath + "10";
        detectionCombination = createProperty(riskClass, "Detection Combination " + (x + 1), Finder.byQualifiedName().find(project, detectionCombinationPath), null, Finder.byQualifiedName().find(project, constraintPropertyPath), null, null, null);
        detectionCombinationShape = PresentationElementsManager.getInstance().createShapeElement(detectionCombination, parametricDiagram);
        PresentationElementsManager.getInstance().reshapeShapeElement(detectionCombinationShape, new java.awt.Rectangle(getThreatX(step),detectCombination_y + (fullBlockHeight * x),threatWidth,fullBlockHeight));
        for(y = 0; y < 10; y++) {
            parameterPath = detectionCombinationPath + "::IN" + (y + 1);
            parameter = Finder.byQualifiedName().find(project, parameterPath)
            parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detectionCombinationShape);
            PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatX(step),getDetectionCombinationY(y) + (fullBlockHeight * x),parameterWidth,parameterHeight));
            parameterArray = [parameter, parameterShape];
            detectionParameters.add(parameterArray);
        }
        parameterPath = detectionCombinationPath + "::INIT";
        parameter = Finder.byQualifiedName().find(project, parameterPath)
        parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detectionCombinationShape);
        PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatX(step),getDetectionCombinationY(y) + (fullBlockHeight * x),parameterWidth,parameterHeight));
        connector = createBindingConnector(allNodes.get(0)[3], allNodes.get(0)[4], allNodes.get(0)[5], parameter, parameterShape, null);
        pathPoints = new ArrayList();
        point1 = new java.awt.Point(getInitProbBendX(0), connector[1].getSupplier().getMiddlePoint().y);
        point2 = new java.awt.Point(getInitProbBendX(0), connector[1].getClient().getMiddlePoint().y);
        pathPoints.add(connector[1].getSupplier().getMiddlePoint());
        pathPoints.add(point1);
        pathPoints.add(point2);
        pathPoints.add(connector[1].getClient().getMiddlePoint());
        PresentationElementsManager.getInstance().changePathPoints(connector[1], pathPoints.get(0), pathPoints.get(3), pathPoints);

        parameterPath = detectionCombinationPath + "::OUT";
        parameter = Finder.byQualifiedName().find(project, parameterPath)
        parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detectionCombinationShape);
        PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatRiskOutputParameterX(step), detectCombination_y  + (fullBlockHeight * x) + (fullBlockHeight / 2) - (parameterHeight / 2),parameterWidth,parameterHeight));
        parameterArray = [parameter, parameterShape];
        outParameters.add(parameterArray);
    }

    detectionCombinationPath = detectConstraintPath + finalParameters;
    if(fullBlocks) {
        detectionCombination = createProperty(riskClass, "Detection Combination " + (fullBlocks + 1), Finder.byQualifiedName().find(project, detectionCombinationPath), null, Finder.byQualifiedName().find(project, constraintPropertyPath), null, null, null);
    } else {
        detectionCombination = createProperty(riskClass, "Detection Combination", Finder.byQualifiedName().find(project, detectionCombinationPath), null, Finder.byQualifiedName().find(project, constraintPropertyPath), null, null, null);
    }
    detectionCombinationShape = PresentationElementsManager.getInstance().createShapeElement(detectionCombination, parametricDiagram);
    PresentationElementsManager.getInstance().reshapeShapeElement(detectionCombinationShape, new java.awt.Rectangle(getThreatX(step),detectCombination_y + (fullBlockHeight * fullBlocks),threatWidth,detectionCombinationHeight));
    
    for(x = 0; x < finalParameters; x++) {
        parameterPath = detectionCombinationPath + "::IN" + (x + 1);
        parameter = Finder.byQualifiedName().find(project, parameterPath)
        parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detectionCombinationShape);
        PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatX(step),getDetectionCombinationY(x) + (fullBlockHeight * fullBlocks),parameterWidth,parameterHeight));
        parameterArray = [parameter, parameterShape];
        detectionParameters.add(parameterArray);
    }
    parameterPath = detectionCombinationPath + "::INIT";
    parameter = Finder.byQualifiedName().find(project, parameterPath)
    parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detectionCombinationShape);
    PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatX(step),getDetectionCombinationY(x) + (fullBlockHeight * fullBlocks),parameterWidth,parameterHeight));
    parameterArray = [parameter, parameterShape];
    connector = createBindingConnector(allNodes.get(0)[3], allNodes.get(0)[4], allNodes.get(0)[5], parameter, parameterShape, null);
    pathPoints = new ArrayList();
    point1 = new java.awt.Point(getInitProbBendX(0), connector[1].getSupplier().getMiddlePoint().y);
    point2 = new java.awt.Point(getInitProbBendX(0), connector[1].getClient().getMiddlePoint().y);
    pathPoints.add(connector[1].getSupplier().getMiddlePoint());
    pathPoints.add(point1);
    pathPoints.add(point2);
    pathPoints.add(connector[1].getClient().getMiddlePoint());
    PresentationElementsManager.getInstance().changePathPoints(connector[1], pathPoints.get(0), pathPoints.get(3), pathPoints);
    
    if(!fullBlocks) {
        parameterPath = detectionCombinationPath + "::OUT";
        parameter = Finder.byQualifiedName().find(project, parameterPath)
        parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detectionCombinationShape);
        PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatControlParameterX(step), detectCombination_y ,parameterWidth,parameterHeight));

        detectionProbability = createProperty(riskClass, "Detection Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, detectionProbabilityPath), null, null);
        detectionProbabilityShape = PresentationElementsManager.getInstance().createShapeElement(detectionProbability, parametricDiagram); 
        PresentationElementsManager.getInstance().reshapeShapeElement(detectionProbabilityShape, new java.awt.Rectangle(getThreatX(step), detectionProbability_y, threatWidth, valueHeight));
        createBindingConnector(detectionProbability, detectionProbabilityShape, null, parameter, parameterShape, detectionCombination);
    } else {
        parameterPath = detectionCombinationPath + "::OUT";
        parameter = Finder.byQualifiedName().find(project, parameterPath)
        parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detectionCombinationShape);
        PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatRiskOutputParameterX(step), detectCombination_y + (fullBlockHeight * fullBlocks) + (detectionCombinationHeight / 2) - (parameterHeight / 2),parameterWidth,parameterHeight));
        parameterArray = [parameter, parameterShape];
        outParameters.add(parameterArray);

        step++;

        combination = fullBlocks + 1;
        combinationPath = combineConstraintPath + combination;
        combine = createProperty(riskClass, "Detection Combination", Finder.byQualifiedName().find(project, combinationPath), null, Finder.byQualifiedName().find(project, constraintPropertyPath), Finder.byQualifiedName().find(project, detectConstraintStereotypePath), null, null);
        combineShape = PresentationElementsManager.getInstance().createShapeElement(combine, parametricDiagram);
        PresentationElementsManager.getInstance().reshapeShapeElement(combineShape, new java.awt.Rectangle(getThreatX(step), detectCombination_y,threatWidth, (fullBlockHeight * fullBlocks) + detectionCombinationHeight));
        for (x = 0; x < combination; x++) {
            parameterPath = combinationPath + "::IN" + (x + 1);
            parameter = Finder.byQualifiedName().find(project, parameterPath)
            parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, combineShape);
            if(x == combination - 1) {
                PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatX(step),detectCombination_y + (fullBlockHeight * fullBlocks) + (detectionCombinationHeight / 2) - (parameterHeight / 2),parameterWidth,parameterHeight));
            } else {
                PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatX(step),detectCombination_y  + (fullBlockHeight * x) + (fullBlockHeight / 2) - (parameterHeight / 2),parameterWidth,parameterHeight));
            }
            createBindingConnector(outParameters.get(x)[0], outParameters.get(x)[1], null, parameter, parameterShape, combine);
        }

        parameterPath = combinationPath + "::OUT";
        parameter = Finder.byQualifiedName().find(project, parameterPath)
        parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, combineShape);
        PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatControlParameterX(step), detectCombination_y,parameterWidth,parameterHeight));
        
        detectionProbability = createProperty(riskClass, "Detection Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, detectionProbabilityPath), null, null);
        detectionProbabilityShape = PresentationElementsManager.getInstance().createShapeElement(detectionProbability, parametricDiagram); 
        PresentationElementsManager.getInstance().reshapeShapeElement(detectionProbabilityShape, new java.awt.Rectangle(getThreatX(step), detectionProbability_y, threatWidth, valueHeight));
        createBindingConnector(detectionProbability, detectionProbabilityShape, null, parameter, parameterShape, combine);
    }
    for(y = 0; y < detectionParameters.size(); y++) {
        connector = createBindingConnector(allNodes.get(allNodes.size() - 1 - y)[3], allNodes.get(allNodes.size() - 1 - y)[4], allNodes.get(allNodes.size() - 1 - y)[5], detectionParameters.get(y)[0], detectionParameters.get(y)[1], null);
        pathPoints = new ArrayList();
        point1 = new java.awt.Point(getInitProbBendX(allNodes.size() - 1 - y) - (threatHorizontalGap / 4), connector[1].getSupplier().getMiddlePoint().y);
        point2 = new java.awt.Point(getInitProbBendX(allNodes.size() - 1 - y) - (threatHorizontalGap / 4), connector[1].getClient().getMiddlePoint().y);
        pathPoints.add(connector[1].getSupplier().getMiddlePoint());
        pathPoints.add(point1);
        pathPoints.add(point2);
        pathPoints.add(connector[1].getClient().getMiddlePoint());
        PresentationElementsManager.getInstance().changePathPoints(connector[1], pathPoints.get(0), pathPoints.get(3), pathPoints); 
    }
}

function createSimulation() {
    simPackage = ef.createPackageInstance();
    simPackage.setOwner(riskClass.getOwner());
    simPackage.setName("Simulation");

    simConfig = ef.createClassInstance();
    simConfig.setName(riskClass.getName());
    simConfig.setOwner(simPackage);

    var simulationConfigStereotypePath = "SimulationProfile::config::SimulationConfig";
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

function getCommonNode(array, arraylist) {
    var nodeArray = new ArrayList();
    for(a=0; a < array.length; a++) {
        for(b=0; b < arraylist.size(); b++)
        {
            if(array[a] == arraylist.get(b)) {
                nodeArray.add(array[a]);
            }
        }
    }
    return nodeArray;
}

function getOrderedPath(start, nodes) {

    var orderedPath = new ArrayList();
    var path = new ArrayList();
    path.add(start);
    orderedPath.add(path);
    forkedPath = new ArrayList();
    writeLog("Node Length: " + nodes.length, 4);
    for(i = 0; i < nodes.length - 1; i++) {
        writeLog("Node number: " + i, 5);
        for(j = 0; j < orderedPath.size(); j++) {
            writeLog("Path number: " + j, 5);
            writeLog("Path size: " + orderedPath.get(j).size(), 4);
            if(StereotypesHelper.hasStereotype(orderedPath.get(j).get(i),threatImpactSignal)) {
                orderedPath.remove(j);
                j--;
                continue;
            }
            if(StereotypesHelper.hasStereotype(orderedPath.get(j).get(i),postureImpactSignal)) {
                orderedPath.remove(j);
                j--;
                continue;
            }
            var nextNodeArray = orderedPath.get(j).get(i).refGetValue("NextThreatAction");
            var possibleNode = getCommonNode(nodes, nextNodeArray);
            writeLog("NextThreatAction: " + possibleNode, 3);
            if(possibleNode.size() == 0) {
                return null;
            }
            if(possibleNode.size() == 1) {
                orderedPath.get(j).add(possibleNode.get(0));
            }
            if(possibleNode.size() > 1) {                
                for(k = 1; k < possibleNode.size(); k++) {
                    writeLog("Fork number: " + k, 5);
                    forkedNode = new ArrayList();
                    forkedNode.addAll(orderedPath.get(j));
                    forkedNode.add(possibleNode.get(k));
                    writeLog("Forked Node: " + forkedNode, 1);
                    forkedPath.add(forkedNode);
                }
                orderedPath.get(j).add(possibleNode.get(0));
            }
        }
        for(l = 0; l < forkedPath.size(); l++) {
            writeLog("Path Size: " + forkedPath.get(l).size(), 5);
            orderedPath.add(forkedPath.get(l));
        }
        forkedPath.clear();
    }
    return orderedPath;

}

function main(project, ef, progress) {
    //Initialises by selecting the project and element factory

    var selectedObjects = getSelectedObjects(project);
    if(!selectedObjects) {
        writeLog("ERROR: No objects are selected in the containment tree. Please select a branch of an attack tree in the containment tree and try again.", 1);
        return;
    }
    writeLog("Got selectedObjects: " + selectedObjects, 5);
    writeLog("selectedObjects length: " + selectedObjects.length, 5);

    threatStart = Finder.byQualifiedName().find(project, threatStartPath);
    var initialNode = getStereotypeInArray(selectedObjects, threatStart);
    if(!initialNode) {
        writeLog("ERROR: No InitialNode is selected in the containment tree. Please select a full branch of an attack tree in the containment tree and try again.", 1);
        return;
    }
    threatImpactSignal = Finder.byQualifiedName().find(project, threatImpactSignalPath);
    postureImpactSignal = Finder.byQualifiedName().find(project, postureSignalPath);
    var signal = getStereotypeInArray(selectedObjects, threatImpactSignal);
    if(!signal) {                          
        signal = getStereotypeInArray(selectedObjects, postureImpactSignal);
        if(!signal) {
            writeLog("ERROR: No Signal is selected in the containment tree. Please select a full branch of an attack tree in the containment tree and try again.", 1);
            return;
        }
    }
    var threatJoin = Finder.byQualifiedName().find(project, threatJoinPath);
    var joinPresent = 0;
    if(getStereotypeInArray(selectedObjects, threatJoin)) {
        joinPresent = 1;
    }

    //Get correct path
    var validPath = getOrderedPath(initialNode, selectedObjects);
    if(!validPath) {
        writeLog("ERROR: Incompleted branch selected in the containment tree. Please select a full branch of an attack tree in the containment tree and try again.", 1);
        return;
    }
    if(validPath.size() > 1) {
        writeLog("ERROR: Multiple valid paths selected. Please unambiguously select a full branch of an attack tree in the containment tree and try again.", 1);
        return;
    }
    progress.init("Creating Risk Diagram for " + threatName, 0, validPath.get(0).size() + 2);
    //Validate that all objects have assets, controls and difficulties
    var checksPassed = true;
    var validationTAConstraints = [Finder.byQualifiedName().find(project, "Cyber::Stereotypes::ThreatAction::Controls"), Finder.byQualifiedName().find(project, "Cyber::Stereotypes::ThreatAction::Properties"), Finder.byQualifiedName().find(project, "Cyber::Stereotypes::ThreatAction::Assets")];
    var validationDAConstraints = [Finder.byQualifiedName().find(project, "Cyber::Stereotypes::DetectionAction::Controls"), Finder.byQualifiedName().find(project, "Cyber::Stereotypes::DetectionAction::Properties"), Finder.byQualifiedName().find(project, "Cyber::Stereotypes::DetectionAction::Assets")];
    for(z = 1; z < validPath.get(0).size() - 1; z++) {
        nextNode = validPath.get(0).get(z);

        if(StereotypesHelper.hasStereotype(nextNode,threatJoin)) {
            continue;
        }
        
        difficultyTest = TagsHelper.getStereotypePropertyValue(nextNode, Finder.byQualifiedName().find(project, threatActionStereotypePath), "Difficulty");
        if(difficultyTest.size() == 0) {
            writeLog("Validation Check Failed! Threat Action: " + nextNode.getName() + " does not have a Difficulty set. Please set a difficulty for this action and try again.", 1);
            checksPassed = false;
        }

        results = ValidationHelper.validateElement(nextNode, validationTAConstraints, true);
        if(results.size() > 0) {
            for(i = 0; i < results.size(); i++) {
                writeLog("Validation Check Failed! Threat Action: " + nextNode.getName() + ". Rule: " + results.get(i).getRule().getName() + " - " + results.get(i).getErrorMessage(), 1);
            }
            checksPassed = 0;
        }
        
        detectNode = nextNode.refGetValue("DetectionAction").get(0);
        if(!detectNode) {
            writeLog("Validation Check Failed! Threat Action: " + nextNode.getName() + " does not have a DetectionAction linked to it. Please linked a DetectionAction to this ThreatAction and try again.", 1);
        } else {
            results = ValidationHelper.validateElement(detectNode, validationDAConstraints, true);
            if(results.size() > 0) {
                for(i = 0; i < results.size(); i++) {
                    writeLog("Validation Check Failed! Detection Action: " + detectNode.getName() + ". Rule: " + results.get(i).getRule().getName() + " - " + results.get(i).getErrorMessage(), 1);
                }
                checksPassed = 0;
            }
        }
    }

    var numberOfActions = validPath.get(0).size() - 2;
    if(joinPresent) {
        numberOfActions--;
    }
    var detectionCombinationsParameters = numberOfActions % 10;
    var numberOf10CombinationBlocks = ((numberOfActions - detectionCombinationsParameters) / 10);
    if (detectionCombinationsParameters == 0) {
        detectionCombinationsParameters = 10;
        numberOf10CombinationBlocks--;
    }
    if(numberOfActions > 100){
        writeLog("Validation Check Failed! There are " + numberOfActions + " ThreatActions selected. Maximum supported is 100.", 1);
        checksPassed = false;
    }

    var fullDifficultyCombinationHeight = (10 * parameterHeight) + (difficultyCombinationVerticalGap * 10) + (4 * parameterHeight);
    var finalDifficultyCombinationHeight = (detectionCombinationsParameters * parameterHeight) + (difficultyCombinationVerticalGap * (detectionCombinationsParameters)) + (4 * parameterHeight);
    var totalDifficultyCombinationHeight = (fullDifficultyCombinationHeight * numberOf10CombinationBlocks) + finalDifficultyCombinationHeight;
    var detectionCombinationHeight = finalDifficultyCombinationHeight;
    var detectCombinationOut_y = detectCombination_y;// + (detectionCombinationHeight / 2) - (parameterHeight / 2);
    var detectionProbability_y = detectConstraint_y - (valueHeight / 2) + (threatHeight / 2);
    if(totalDifficultyCombinationHeight > threatVeriticalGap) {
        detectControlEffectiveness_y = detectControlEffectiveness_y - threatVeriticalGap + totalDifficultyCombinationHeight;
        detectComponent_y = detectControlEffectiveness_y + controlEffectivenessHeight + threatVeriticalGap;
    }

          
    var secControl = Finder.byQualifiedName().find(project, securityControlPath);
    var noneControlStereo = Finder.byQualifiedName().find(project, noneControlStereoPath);
    var noneControls = StereotypesHelper.getStereotypedElements(noneControlStereo);
    if(noneControls.size() > 1)
    {
        writeLog("Validation Check Failed! More than 1 SecurityControl is typed as a noneControl. Please remove unnecessary noneControls so that there is only a single noneControl.", 1);
        checksPassed = false;
    }
    if(noneControls.size() != 0)
    {
        var noneControl = noneControls.get(0);
        writeLog("Found None: " + noneControl.getName(), 5);
        writeLog("Found None: " + noneControl.getQualifiedName(), 5);

        var noneControlPath = noneControl.getQualifiedName();

        var secConstraint = Finder.byQualifiedName().find(project, securityConstraintStereotypePath);
        var secConstraints = StereotypesHelper.getStereotypedElements(secConstraint);
        for(i = 0; i < secConstraints.size(); i++) {
            if(secConstraints.get(i).getType() == noneControl) {
                var noneConstraint = secConstraints.get(i);
            }
        }
        if(noneConstraint)
        {
            writeLog("Found None: " + noneConstraint.getName(), 5);
            writeLog("Found None: " + noneConstraint.getQualifiedName(), 5);
            var noneConstraintPath = noneConstraint.getQualifiedName();
        } else
        {
            var noneConstraintPath = null;
        }
    } else
    {
        var noneControlPath = null;                
    }

    var systemAssetStereo = Finder.byQualifiedName().find(project, systemPath);
    var systemAssets = StereotypesHelper.getStereotypedElements(systemAssetStereo);
    if(systemAssets.size() > 1)
    {
        writeLog("Validation Check Failed! More than 1 Asset is typed as a System. Please remove unnecessary Systems so that there is only a single System.", 1);
        checksPassed = false;
    }
    if(systemAssets.size() != 0)
    {
        var systemAsset = systemAssets.get(0);

        writeLog("Found System: " + systemAsset.getName(), 5);
        writeLog("Found System: " + systemAsset.getQualifiedName(), 5);

        var systemBlockPath = systemAsset.getQualifiedName();
    } else
    {
        var systemBlockPath = null;
    }

    if(!checksPassed) {
        writeLog("ERROR: Validation Checks were not Passed. Please address reported errors before trying to build a Parametric Risk Diagram from this attack path.", 1);
        return;
    }
    if(checksPassed) {
        writeLog("Validation Checks Passed. Creating Risk...", 1);
    }

    if(progress.isCancel()) {
        writeLog("ERROR: User cancelled macro. Extraneous objects may exist in the model from the partially completed macro. You may want to Undo using Ctrl + Z, or manually delete the partial package in the Risk Assessment section.", 1);
        return;
    }

    res = Application.getInstance().getGUILog().showQuestion("Do you want to select specific assets?", false, "Asset Selection");
    if(res == 2){
        var dialogParent = MDDialogParentProvider.getProvider().getDialogParent();
        var dlg = ElementSelectionDlgFactory.create(dialogParent);
        var assets = StereotypesHelper.getStereotypedElements(Finder.byQualifiedName().find(project, assetPath));

        var sel = new SelectElementTypes(assets, null, Finder.byQualifiedName().find(project, assetPath));
        var info = new SelectElementInfo(false, false, project.getPrimaryModel(), false);
        var arr = [];
        ElementSelectionDlgFactory.initMultiple(dlg, sel, info, arr);

        dlg.show();

        if(dlg.isOkClicked()) {
            var assetSelection = dlg.getSelectedElements();            
        } else {
            var assetSelection = null;
            writeLog("Nothing Selected.", 5);
        }
    }

    assetSelectionString = "";
    if(assetSelection) {
        if(assetSelection.size() == 1) {
            assetSelectionString = " - " + assetSelection.get(0).getName(); 
        }
    }

    res = "";
    res = Application.getInstance().getGUILog().showInputTextDialog("Create Risk", "Please enter a threat description. (Name Format: " +initialNode.getName() + " - " + signal.getName() + " - <threatDescription>" + assetSelectionString);
    if(res == "") {
        writeLog("ERROR: Threat description not entered, no action taken.", 1);
        return;
    }
    var threatName = res;
    writeLog("New Name: " + threatName, 5);

    risk = createRisk(project, initialNode.getName(), signal.getName(), assetSelectionString, threatName);
    diagram = ModelElementsManager.getInstance().createDiagram("CEMT Parametric Risk Diagram", risk);

    progress.increase();
    progress.setDescription("Drawing Initial Shapes");

    var nodeHistory = new ArrayList();
    drawnNode = buildInitialShapes(diagram, initialNode, risk);
    nodeHistory.add(drawnNode);
    
    mit = new ArrayList();
    mit.add(Finder.byQualifiedName().find(project, mitigationControlEffectivenessPath));    
    var mitigationTable = GenericTableManager.createGenericTable(project, "Mitigation Control Effectiveness");
    GenericTableManager.setTableElementTypes(mitigationTable, mit);
    mitigationTable.setOwner(risk);
    columns = new ArrayList();
    columns.add("_NUMBER_");
    columns.add("QPROP:Element:threatAction");
    columns.add("QPROP:Element:name");
    columns.add("QPROP:Element:min");
    columns.add("QPROP:Element:max");
    columns.add("QPROP:Element:documentation");
    columns.add("QPROP:Element:Not Assessed");
    columns.add("QPROP:Element:Implemented");
    columns.add("QPROP:Element:Partially Implemented");    
    columns.add("QPROP:Element:Not Implemented");
    columns.add("QPROP:Element:overrideDerivedEffectiveness");
    columns.add("QPROP:Element:derivedControlEffectivenessMin");
    columns.add("QPROP:Element:derivedControlEffectivenessMax");
    columns.add("QPROP:Element:derivedControlEffectivenessJustification");
    GenericTableManager.addColumnsById(mitigationTable, columns);

    det = new ArrayList();
    det.add(Finder.byQualifiedName().find(project, detectionControlEffectivenessPath));
    var detectionTable = GenericTableManager.createGenericTable(project, "Detection Control Effectiveness");
    GenericTableManager.setTableElementTypes(detectionTable, det);
    detectionTable.setOwner(risk);
    columns = new ArrayList();
    columns.add("_NUMBER_");
    columns.add("QPROP:Element:detectionAction");
    columns.add("QPROP:Element:name");
    columns.add("QPROP:Element:min");
    columns.add("QPROP:Element:max");
    columns.add("QPROP:Element:documentation");
    columns.add("QPROP:Element:Not Assessed");
    columns.add("QPROP:Element:Implemented");
    columns.add("QPROP:Element:Partially Implemented");    
    columns.add("QPROP:Element:Not Implemented");
    columns.add("QPROP:Element:overrideDerivedEffectiveness");
    columns.add("QPROP:Element:derivedControlEffectivenessMin");
    columns.add("QPROP:Element:derivedControlEffectivenessMax");
    columns.add("QPROP:Element:derivedControlEffectivenessJustification");
    GenericTableManager.addColumnsById(detectionTable, columns);

    joinPresent = 0;
    for(z = 0; z < validPath.get(0).size() - 2; z++) {
        var nextNode = validPath.get(0).get(z+1);
        progress.increase();
        progress.setDescription("Drawing Node " + nextNode.getName());
        if(progress.isCancel()) {
            writeLog("ERROR: User cancelled macro. Extraneous objects may exist in the model from the partially completed macro. You may want to Undo using Ctrl + Z, or manually delete the partial package in the Risk Assessment section.", 1);
            return;
        }
        if(StereotypesHelper.hasStereotype(nextNode, threatJoin)) {
            joinPresent = 1;
            continue;
        }
        writeLog("NextThreatAction: " + nextNode.getName(), 3);
        drawnNode = buildThreatAction(diagram, drawnNode, nextNode, (z - joinPresent), noneControlPath, systemBlockPath, noneConstraintPath, assetSelection, mitigationTable, detectionTable);
        nodeHistory.add(drawnNode);
    }

    progress.increase();
    progress.setDescription("Drawing Final Shapes");
    if(progress.isCancel()) {
        writeLog("ERROR: User cancelled macro. Extraneous objects may exist in the model from the partially completed macro. You may want to Undo using Ctrl + Z, or manually delete the partial package in the Risk Assessment section.", 1);
        return;
    }

    buildFinalShapes(diagram, drawnNode, nextNode, (z - joinPresent), nodeHistory, detectionCombinationHeight, detectCombinationOut_y, detectionProbability_y, detectionCombinationsParameters, numberOf10CombinationBlocks, fullDifficultyCombinationHeight);

    progress.increase();
    progress.setDescription("Creating Simulation");
    if(progress.isCancel()) {
        writeLog("ERROR: User cancelled macro. Extraneous objects may exist in the model from the partially completed macro. You may want to Undo using Ctrl + Z, or manually delete the partial package in the Risk Assessment section.", 1);
        return;
    }

    newSession(project, "Simulation Creation");
    sim = createSimulation();

    progress.increase();
    progress.setDescription("Creating Analysis");
    if(progress.isCancel()) {
        writeLog("ERROR: User cancelled macro. Extraneous objects may exist in the model from the partially completed macro. You may want to Undo using Ctrl + Z, or manually delete the partial package in the Risk Assessment section.", 1);
        return;
    }

    newSession(project, "Analysis Creation");
    analysis = createAnalysis();

    analysisList = new HashSet();
    analysisList.add(analysis);
    TagsHelper.setStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, securityRiskPath), "SecurityAnalysis", analysisList);

    configList = new HashSet();
    configList.add(sim);
    TagsHelper.setStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, securityRiskPath), "Simulation Configuration", configList);

    threatStart = new HashSet();
    threatStart.add(initialNode);
    TagsHelper.setStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, securityRiskPath), "ThreatStart", threatStart);

    impactSignal = new HashSet();
    impactSignal.add(signal);
    TagsHelper.setStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, securityRiskPath), "ThreatImpactSignal", signal);
    if(assetSelection) {
        TagsHelper.setStereotypePropertyValue(risk, Finder.byQualifiedName().find(project, securityRiskPath), "AssetSelection", assetSelection);
    }

    project.getDiagram(diagram).open();
}

var task = new RunnableWithProgress({
    run: function(progress) {
       main(project, ef, progress);
    }
});

var project = Application.getInstance().getProject();
writeLog("Got project: " + project, 5);
var ef = project.getElementsFactory();
writeLog("Got elementsFactory: " + ef, 5);
newSession(project, "Parametric Creation");

try {
    ProgressStatusRunner.runWithProgressStatus(task, "Risk Macro", true, 0);
} finally {
    SessionManager.getInstance().closeSession();
}





