/* 
This macro creates risk assessment simulations for a given attack tree path.
When a full branch of the attack tree is selected in the containment tree, a parametric risk
diagram will be generated, along with a simulation for that parametric diagram. 

Author: Stuart Fowler
Date: 20 April 2020
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
    com.nomagic.magicdraw.openapi.uml.ModelElementsManager,
    com.nomagic.magicdraw.openapi.uml.PresentationElementsManager,
    com.nomagic.magicdraw.properties.PropertyManager,
    com.nomagic.uml2.ext.jmi.helpers.ValueSpecificationHelper,
    com.nomagic.uml2.ext.jmi.helpers.StereotypesHelper,
    com.nomagic.uml2.ext.jmi.helpers.CoreHelper,
    com.nomagic.magicdraw.uml.Finder,
    java.lang,
    java.lang.Math);

var debug = 1;
var threatImpactSignalPath = "Cyber::Stereotypes::ThreatImpactSignal";
var threatStartPath = "Cyber::Stereotypes::ThreatStart";
var riskFolderPath = "Risk Assessment"
var securityRiskPath = "Cyber::Stereotypes::SecurityRisk";
var initialProbabilityPath = "Cyber::Stereotypes::InitialProbability";
var residualProbabilityPath = "Cyber::Stereotypes::ResidualProbability";
var detectionProbabilityPath = "Cyber::Stereotypes::DetectionProbability";
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
var detectConstraintStereotypePath = "Cyber::Stereotypes::DetectConstraint";
var securityConstraintStereotypePath = "Cyber::Stereotypes::SecurityConstraint";
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
var systemPath = "Cyber::Stereotypes::System";
var securityConstraintPath = "Cyber::Stereotypes::SecurityConstraint";
var assetPath = "Cyber::Stereotypes::Asset";
var uniformPath = "SysML::Non-Normative Extensions::Distributions::Uniform";
var histogramPath = "SimulationProfile::ui::Histogram";
var selectPropertiesPath = "SimulationProfile::config::SelectPropertiesConfig";
var timeSeriesChartPath = "SimulationProfile::ui::TimeSeriesChart";



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



with (CollectionsAndFiles) {
    try {
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
            throw new Error("Exiting: No " + stereotype.getName() + " in Selected Objects");          
        }

        function createRisk(project, start, signal, assetSelection) {
            threatPackage = ef.createPackageInstance();
            threatPackage.setOwner(Finder.byQualifiedName().find(project, riskFolderPath));
            if(assetSelection) {
                threatPackage.setName(start + " - " + signal + " - " + threatName + " - " + assetSelection.getName());
            }
            else {
                threatPackage.setName(start + " - " + signal + " - " + threatName);
            }            
            writeLog("Created Package: " + threatPackage.getName(), 4);

            riskClass = ef.createClassInstance();
            riskClass.setOwner(threatPackage);
            riskClass.setName(threatPackage.getName());
            StereotypesHelper.addStereotype(riskClass, Finder.byQualifiedName().find(project, securityRiskPath));
            writeLog("Created SecurityRisk: " + riskClass.getName(), 2);

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
                StereotypesHelper.setStereotypePropertyValue(newProperty, Finder.byQualifiedName().find(project, uniformPath), "min", min);
                StereotypesHelper.setStereotypePropertyValue(newProperty, Finder.byQualifiedName().find(project, uniformPath), "max", max);
            }
            if (defaultValue) {
                tempValue = ValueSpecificationHelper.createValueSpecification(project, newProperty.getType(), defaultValue, None);
                newProperty.setDefaultValue(tempValue);
            }
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

            initialProbability = createProperty(riskClass, "Initial Probability - " + initialNode.getName(), Finder.byQualifiedName().find(project, numberPath), 100, Finder.byQualifiedName().find(project, initialProbabilityPath), Finder.byQualifiedName().find(project, valuePropertyPath), null, null);
            initialProbabilityShape = PresentationElementsManager.getInstance().createShapeElement(initialProbability, parametricDiagram);
            changeProperty(initialProbabilityShape, "SHOW_DEFAULT_PART_VALUE", true);       
            PresentationElementsManager.getInstance().reshapeShapeElement(initialProbabilityShape, new java.awt.Rectangle(initialGap,initialProbability_y,valueWidth,valueHeight));

            threatLevel = createProperty(riskClass, "Threat Level", Finder.byQualifiedName().find(project, threatPath), "Nation State", Finder.byQualifiedName().find(project, threatLevelPath), Finder.byQualifiedName().find(project, valuePropertyPath), null, null);
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
            //changeProperty(difficultyConstraintShape, "SUPPRESS_STRUCTURE", true);       
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

            trivialValue = createProperty(riskClass, "Trivial Difficulty", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), null, null, null);
            trivialShape = PresentationElementsManager.getInstance().createShapeElement(trivialValue, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(trivialShape, new java.awt.Rectangle(trivial_x,difficulty_y,threatWidth,valueHeight));
            createBindingConnector(difficultyTrivialParameter, difficultyTrivialShape, difficultyConstraint, trivialValue, trivialShape, null);

            lowValue = createProperty(riskClass, "Low Difficulty", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), null, null, null);
            lowShape = PresentationElementsManager.getInstance().createShapeElement(lowValue, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(lowShape, new java.awt.Rectangle(trivial_x,low_y,threatWidth,valueHeight));
            createBindingConnector(difficultyLowParameter, difficultyLowShape, difficultyConstraint, lowValue, lowShape, null);

            mediumValue = createProperty(riskClass, "Medium Difficulty", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), null, null, null);
            mediumShape = PresentationElementsManager.getInstance().createShapeElement(mediumValue, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(mediumShape, new java.awt.Rectangle(trivial_x,medium_y,threatWidth,valueHeight));
            createBindingConnector(difficultyMediumParameter, difficultyMediumShape, difficultyConstraint, mediumValue, mediumShape, null);

            highValue = createProperty(riskClass, "High Difficulty", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), null, null, null);
            highShape = PresentationElementsManager.getInstance().createShapeElement(highValue, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(highShape, new java.awt.Rectangle(trivial_x,high_y,threatWidth,valueHeight));
            createBindingConnector(difficultyHighParameter, difficultyHighShape, difficultyConstraint, highValue, highShape, null);

            extremeValue = createProperty(riskClass, "Extreme Difficulty", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), null, null, null);
            extremeShape = PresentationElementsManager.getInstance().createShapeElement(extremeValue, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(extremeShape, new java.awt.Rectangle(trivial_x,extreme_y,threatWidth,valueHeight));
            createBindingConnector(difficultyExtremeParameter, difficultyExtremeShape, difficultyConstraint, extremeValue, extremeShape, null);

            evasionValue = createProperty(riskClass, "Evasion Skill", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), null, null, null);
            evasionShape = PresentationElementsManager.getInstance().createShapeElement(evasionValue, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(evasionShape, new java.awt.Rectangle(trivial_x,evasion_y,threatWidth,valueHeight));
            createBindingConnector(difficultyEvasionParameter, difficultyEvasionShape, difficultyConstraint, evasionValue, evasionShape, null);

            certainValue = createProperty(riskClass, "Certain", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), null, 100, 100);
            certainShape = PresentationElementsManager.getInstance().createShapeElement(certainValue, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(certainShape, new java.awt.Rectangle(leftGap,difficulty_y,threatWidth,valueHeight));
            createBindingConnector(difficultyCertainParameter, difficultyCertainShape, difficultyConstraint, certainValue, certainShape, null);

            highlyLikelyValue = createProperty(riskClass, "Highly Likely", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), null, 80, 90);
            highlyLikelyShape = PresentationElementsManager.getInstance().createShapeElement(highlyLikelyValue, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(highlyLikelyShape, new java.awt.Rectangle(leftGap,low_y,threatWidth,valueHeight));
            createBindingConnector(difficultyHighlyLikelyParameter, difficultyHighlyLikelyShape, difficultyConstraint, highlyLikelyValue, highlyLikelyShape, null);

            likelyValue = createProperty(riskClass, "Likely", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), null, 60, 70);
            likelyShape = PresentationElementsManager.getInstance().createShapeElement(likelyValue, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(likelyShape, new java.awt.Rectangle(leftGap,medium_y,threatWidth,valueHeight));
            createBindingConnector(difficultyLikelyParameter, difficultyLikelyShape, difficultyConstraint, likelyValue, likelyShape, null);

            possibleValue = createProperty(riskClass, "Possible", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), null, 40, 50);
            possibleShape = PresentationElementsManager.getInstance().createShapeElement(possibleValue, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(possibleShape, new java.awt.Rectangle(leftGap,high_y,threatWidth,valueHeight));
            createBindingConnector(difficultyPossibleParameter, difficultyPossibleShape, difficultyConstraint, possibleValue, possibleShape, null);

            unlikelyValue = createProperty(riskClass, "Unlikely", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), null, 20, 30);
            unlikelyShape = PresentationElementsManager.getInstance().createShapeElement(unlikelyValue, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(unlikelyShape, new java.awt.Rectangle(leftGap,extreme_y,threatWidth,valueHeight));
            createBindingConnector(difficultyUnlikelyParameter, difficultyUnlikelyShape, difficultyConstraint, unlikelyValue, unlikelyShape, null);

            rareValue = createProperty(riskClass, "Rare", Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), null, 0, 10);
            rareShape = PresentationElementsManager.getInstance().createShapeElement(rareValue, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(rareShape, new java.awt.Rectangle(leftGap,evasion_y,threatWidth,valueHeight));
            createBindingConnector(difficultyRareParameter, difficultyRareShape, difficultyConstraint, rareValue, rareShape, null);

            legendShape = PresentationElementsManager.getInstance().createShapeElement(Finder.byQualifiedName().find(project, legendPath), parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(legendShape, new java.awt.Rectangle(initialGap,topGap,legendWidth,legendHeight));

            return [initialProbability, initialProbabilityShape, null, initialProbability, initialProbabilityShape, null]
        }

        function getCommonNode(array1, array2) {
            for(i=0; i < array1.length; i++) {
                for(j=0; j < array2.length; j++)
                {
                    if(array1[i] == array2[j]) {
                        return array1[i];
                    }
                }
            }
            return null;
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

        function buildThreatAction(diagram, previousNode, currentNode, step, noneControlPath, systemBlockPath, noneConstraintPath, assetSelection) {
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
            
            currentDifficulty = StereotypesHelper.getStereotypePropertyValue(currentNode, Finder.byQualifiedName().find(project, threatActionStereotypePath), Finder.byQualifiedName().find(project, threatActionStereotypeDifficultyPath));
            writeLog("currentNode Difficulty: " + currentDifficulty.get(0).getName(), 4);

            switch(currentDifficulty.get(0).getName()) {
                case "Trivial":
                    createBindingConnector(threatDifficultyParameter, threatDifficultyParameterShape, threatConstraint, trivialValue, trivialShape, null);
                    break;
                case "Low":
                    createBindingConnector(threatDifficultyParameter, threatDifficultyParameterShape, threatConstraint, lowValue, lowShape, null);
                    break;
                case "Medium":
                    createBindingConnector(threatDifficultyParameter, threatDifficultyParameterShape, threatConstraint, mediumValue, mediumShape, null);
                    break;
                case "High":
                    createBindingConnector(threatDifficultyParameter, threatDifficultyParameterShape, threatConstraint, highValue, highShape, null);
                    break;
                case "Extreme":
                    createBindingConnector(threatDifficultyParameter, threatDifficultyParameterShape, threatConstraint, extremeValue, extremeShape, null);
                    break;
            } 

            threatControlEffectiveness = createProperty(riskClass, "Control Effectiveness - " + currentNode.getName(), Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, mitigationControlEffectivenessPath), defaultMinEffectiveness, defaultMaxEffectiveness);
            threatControlEffectivenessShape = PresentationElementsManager.getInstance().createShapeElement(threatControlEffectiveness, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(threatControlEffectivenessShape, new java.awt.Rectangle(getThreatX(step),threatControlEffectiveness_y,threatWidth,controlEffectivenessHeight));
            
            createBindingConnector(threatRiskInputParameter, threatRiskInputParameterShape, threatConstraint, previousNode[0], previousNode[1], previousNode[2]);
            createBindingConnector(threatControlParameter, threatControlParameterShape, threatConstraint, threatControlEffectiveness, threatControlEffectivenessShape, null);

            //draw constraints
            linkedAssets = currentNode.refGetValue("affects");
            writeLog("allocatedComponents: " + linkedAssets, 5);
            if(assetSelection) {
                for(h = 0; h < linkedAssets.length; h++) {
                    if(!(linkedAssets.get(h).isAbstract() || (linkedAssets.get(h) == assetSelection))) {
                        linkedAssets.remove(h);
                    }
                }
            }
            linkedControls = currentNode.refGetValue("mitigatedBy");
            writeLog("potentialControls: " + linkedControls, 5);

            if(linkedControls.get(0) == Finder.byQualifiedName().find(project, noneControlPath)){
                noneConstraint = Finder.byQualifiedName().find(project, noneConstraintPath);
                currentPart = createProperty(riskClass, null, Finder.byQualifiedName().find(project, systemBlockPath), null, null, null, null, null);
                currentPartShape = PresentationElementsManager.getInstance().createShapeElement(currentPart, parametricDiagram);
                currentConstraintShape = PresentationElementsManager.getInstance().createShapeElement(noneConstraint, currentPartShape);
                createDependency(threatControlEffectiveness, threatControlEffectivenessShape, noneConstraint, currentConstraintShape);
                PresentationElementsManager.getInstance().reshapeShapeElement(currentPartShape, new java.awt.Rectangle(getThreatX(step), topGap, threatWidth, componentHeight));
                StereotypesHelper.setStereotypePropertyValue(threatControlEffectiveness, Finder.byQualifiedName().find(project, uniformPath), "min", 0);
                StereotypesHelper.setStereotypePropertyValue(threatControlEffectiveness, Finder.byQualifiedName().find(project, uniformPath), "max", 0);
            }
            else {
                for(i = 0; i < linkedAssets.length; i++) {
                    currentAsset = linkedAssets.get(i);
                    currentPart = createProperty(riskClass, null, currentAsset, null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
                    currentPartShape = PresentationElementsManager.getInstance().createShapeElement(currentPart, parametricDiagram);
                    ownedConstraints = currentAsset.getOwnedElement();
                    for(j = 0; j < ownedConstraints.size(); j++) {
                        if(StereotypesHelper.hasStereotype(ownedConstraints[j], Finder.byQualifiedName().find(project, securityConstraintStereotypePath))) {
                            writeLog("SecurityConstraint Found: " + ownedConstraints[j].getName(), 5);
                            if(linkedControls.contains(ownedConstraints[j].getType())) {
                                writeLog("ApplicableControl Found: " + ownedConstraints[j].getType().getName(), 4);
                                currentConstraintShape = PresentationElementsManager.getInstance().createShapeElement(ownedConstraints[j], currentPartShape);
                                createDependency(threatControlEffectiveness, threatControlEffectivenessShape, ownedConstraints[j], currentConstraintShape);
                            }
                        }                    
                    }
                    PresentationElementsManager.getInstance().reshapeShapeElement(currentPartShape, new java.awt.Rectangle(calculateComponent_x(i, linkedAssets.length, step), topGap, threatWidth, componentHeight));
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
            
            detectControlEffectiveness = createProperty(riskClass, "Control Effectiveness - " + currentDetectNode.getName(), Finder.byQualifiedName().find(project, integerPath), null, Finder.byQualifiedName().find(project, valuePropertyPath), Finder.byQualifiedName().find(project, detectionControlEffectivenessPath), defaultMinEffectiveness, defaultMaxEffectiveness);
            detectControlEffectivenessShape = PresentationElementsManager.getInstance().createShapeElement(detectControlEffectiveness, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(detectControlEffectivenessShape, new java.awt.Rectangle(getThreatX(step),detectControlEffectiveness_y,threatWidth,controlEffectivenessHeight));
            
            createBindingConnector(detectControlParameter, detectControlParameterShape, detectConstraint, detectControlEffectiveness, detectControlEffectivenessShape, null);

            //draw constraints
            linkedAssets = currentDetectNode.refGetValue("affects");
            writeLog("allocatedComponents: " + linkedAssets, 5);
            if(assetSelection) {
                for(h = 0; h < linkedAssets.length; h++) {
                    if(!(linkedAssets.get(h).isAbstract() || (linkedAssets.get(h) == assetSelection))) {
                        linkedAssets.remove(h);
                    }
                }
            }
            linkedControls = currentDetectNode.refGetValue("mitigatedBy");
            writeLog("potentialControls: " + linkedControls, 5);

            if(linkedControls.get(0) == Finder.byQualifiedName().find(project, noneControlPath)){
                noneConstraint = Finder.byQualifiedName().find(project, noneConstraintPath);
                currentPart = createProperty(riskClass, null, Finder.byQualifiedName().find(project, systemBlockPath), null, null, null, null, null);
                currentPartShape = PresentationElementsManager.getInstance().createShapeElement(currentPart, parametricDiagram);
                currentConstraintShape = PresentationElementsManager.getInstance().createShapeElement(noneConstraint, currentPartShape);
                createDependency(detectControlEffectiveness, detectControlEffectivenessShape, noneConstraint, currentConstraintShape);
                PresentationElementsManager.getInstance().reshapeShapeElement(currentPartShape, new java.awt.Rectangle(getThreatX(step), detectComponent_y, threatWidth, componentHeight));
                StereotypesHelper.setStereotypePropertyValue(detectControlEffectiveness, Finder.byQualifiedName().find(project, uniformPath), "max", 0);
            }
            else {
                for(i = 0; i < linkedAssets.length; i++) {
                    currentAsset = linkedAssets.get(i);
                    currentPart = createProperty(riskClass, null, currentAsset, null, Finder.byQualifiedName().find(project, partPropertyPath), null, null, null);
                    currentPartShape = PresentationElementsManager.getInstance().createShapeElement(currentPart, parametricDiagram);
                    ownedConstraints = currentAsset.getOwnedElement();
                    for(j = 0; j < ownedConstraints.size(); j++) {
                        if(StereotypesHelper.hasStereotype(ownedConstraints[j], Finder.byQualifiedName().find(project, securityConstraintStereotypePath))) {
                            writeLog("SecurityConstraint Found: " + ownedConstraints[j].getName(), 5);
                            if(linkedControls.contains(ownedConstraints[j].getType())) {
                                writeLog("ApplicableControl Found: " + ownedConstraints[j].getType().getName(), 4);
                                currentConstraintShape = PresentationElementsManager.getInstance().createShapeElement(ownedConstraints[j], currentPartShape);
                                createDependency(detectControlEffectiveness, detectControlEffectivenessShape, ownedConstraints[j], currentConstraintShape);
                            }
                        }                    
                    }
                    PresentationElementsManager.getInstance().reshapeShapeElement(currentPartShape, new java.awt.Rectangle(calculateComponent_x(i, linkedAssets.length, step), detectComponent_y, threatWidth, componentHeight));
                }
            }

            return [threatRiskOutputParameter, threatRiskOutputParameterShape, threatConstraint, detectDetectProbParameter, detectDetectProbParameterShape, detectConstraint]
        }

        function buildFinalShapes(diagram, previousNode, currentNode, step, allNodes, detectionCombinationHeight, detectCombinationOut_y, detectionProbability_y) {

            parametricDiagram = project.getDiagram(diagram);

            residualProbability = createProperty(riskClass, "Residual Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, residualProbabilityPath), Finder.byQualifiedName().find(project, valuePropertyPath), null, null);
            residualProbabilityShape = PresentationElementsManager.getInstance().createShapeElement(residualProbability, parametricDiagram); 
            PresentationElementsManager.getInstance().reshapeShapeElement(residualProbabilityShape, new java.awt.Rectangle(getThreatX(step),initialProbability_y,threatWidth,valueHeight));
            createBindingConnector(residualProbability, residualProbabilityShape, null, previousNode[0], previousNode[1], previousNode[2]);

            writeLog("Number of Detections: " + allNodes.length, 4);
            detectionCombinationPath = detectConstraintPath + (allNodes.length - 1);
            detectionCombination = createProperty(riskClass, "Detection Combination", Finder.byQualifiedName().find(project, detectionCombinationPath), null, Finder.byQualifiedName().find(project, constraintPropertyPath), null, null, null);
            detectionCombinationShape = PresentationElementsManager.getInstance().createShapeElement(detectionCombination, parametricDiagram);
            PresentationElementsManager.getInstance().reshapeShapeElement(detectionCombinationShape, new java.awt.Rectangle(getThreatX(step),detectCombination_y,threatWidth,detectionCombinationHeight));

            var detectionParameters = new ArrayList();

            for(x = 0; x < allNodes.length - 1; x++) {
                parameterPath = detectionCombinationPath + "::IN" + (x + 1);
                parameter = Finder.byQualifiedName().find(project, parameterPath)
                parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detectionCombinationShape);
                PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatX(step),getDetectionCombinationY(x),parameterWidth,parameterHeight));
                parameterArray = [parameter, parameterShape];
                detectionParameters.add(parameterArray);
            }
            parameterPath = detectionCombinationPath + "::INIT";
            parameter = Finder.byQualifiedName().find(project, parameterPath)
            parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detectionCombinationShape);
            PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatX(step),getDetectionCombinationY(x),parameterWidth,parameterHeight));
            parameterArray = [parameter, parameterShape];
            detectionParameters.add(parameterArray);
            
            parameterPath = detectionCombinationPath + "::OUT";
            parameter = Finder.byQualifiedName().find(project, parameterPath)
            parameterShape = PresentationElementsManager.getInstance().createShapeElement(parameter, detectionCombinationShape);
            PresentationElementsManager.getInstance().reshapeShapeElement(parameterShape, new java.awt.Rectangle(getThreatControlParameterX(step), detectCombination_y ,parameterWidth,parameterHeight));

            detectionProbability = createProperty(riskClass, "Detection Probability", Finder.byQualifiedName().find(project, numberPath), null, Finder.byQualifiedName().find(project, detectionProbabilityPath), Finder.byQualifiedName().find(project, valuePropertyPath), null, null);
            detectionProbabilityShape = PresentationElementsManager.getInstance().createShapeElement(detectionProbability, parametricDiagram); 
            PresentationElementsManager.getInstance().reshapeShapeElement(detectionProbabilityShape, new java.awt.Rectangle(getThreatX(step), detectionProbability_y, threatWidth, valueHeight));
            createBindingConnector(detectionProbability, detectionProbabilityShape, null, parameter, parameterShape, detectionCombination);

            for(y = 0; y < detectionParameters.length; y++) {
                connector = createBindingConnector(allNodes.get(allNodes.length - 1 - y)[3], allNodes.get(allNodes.length - 1 - y)[4], allNodes.get(allNodes.length - 1 - y)[5], detectionParameters.get(y)[0], detectionParameters.get(y)[1], detectionCombination);
                if(StereotypesHelper.hasStereotype(allNodes.get(allNodes.length - 1 - y)[3], Finder.byQualifiedName().find(project, initialProbabilityPath))) {
                    pathPoints = new ArrayList();
                    point1 = new java.awt.Point(getInitProbBendX(allNodes.length - 1 - y), connector[1].getSupplier().getMiddlePoint().y);
                    point2 = new java.awt.Point(getInitProbBendX(allNodes.length - 1 - y), connector[1].getClient().getMiddlePoint().y);
                    pathPoints.add(connector[1].getSupplier().getMiddlePoint());
                    pathPoints.add(point1);
                    pathPoints.add(point2);
                    pathPoints.add(connector[1].getClient().getMiddlePoint());
                    PresentationElementsManager.getInstance().changePathPoints(connector[1], pathPoints.get(0), pathPoints.get(3), pathPoints);
                }
                else {
                    pathPoints = new ArrayList();
                    point1 = new java.awt.Point(getInitProbBendX(allNodes.length - 1 - y) - (threatHorizontalGap / 4), connector[1].getSupplier().getMiddlePoint().y);
                    point2 = new java.awt.Point(getInitProbBendX(allNodes.length - 1 - y) - (threatHorizontalGap / 4), connector[1].getClient().getMiddlePoint().y);
                    pathPoints.add(connector[1].getSupplier().getMiddlePoint());
                    pathPoints.add(point1);
                    pathPoints.add(point2);
                    pathPoints.add(connector[1].getClient().getMiddlePoint());
                    PresentationElementsManager.getInstance().changePathPoints(connector[1], pathPoints.get(0), pathPoints.get(3), pathPoints); 
                }
            }
        }

        function createSimulation() {
            simPackage = ef.createPackageInstance();
            simPackage.setOwner(riskClass.getOwner());
            simPackage.setName("Simulation");

            simConfig = ef.createClassInstance();
            simConfig.setName(riskClass.getName());
            simConfig.setOwner(simPackage);

            simInstance = ef.createInstanceSpecificationInstance();
            simInstance.setName(riskClass.getName());
            simInstance.setOwner(simPackage);

            var simulationConfigStereotypePath = "SimulationProfile::config::SimulationConfig";
            StereotypesHelper.addStereotype(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath));
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "executionTarget", riskClass);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "resultLocation", simInstance);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "animationSpeed", 95);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "autoStart", true);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "autostartActiveObjects", true);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "cloneReferences", false);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "decimalPlaces", 1);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "fireValueChangeEvent", true);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "initializeReferences", false);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "numberOfRuns", 500);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "recordTimestamp", false);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "rememberFailureStatus", false);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "runForksInParallel", true);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "silent", false);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "solveAfterInitialization", true);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "startWebServer", false);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "addControlPanel", true);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "timeVariableName", "simtime");
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "treatAllClassifiersAsActive", true);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "constraintFailureAsBreakpoint", false);

            var date = new Date()
             threatHistogram = ef.createClassInstance();
            threatHistogram.setName("Threat Analysis - " + riskClass.getName());
            threatHistogram.setOwner(simPackage);
            StereotypesHelper.addStereotype(threatHistogram, Finder.byQualifiedName().find(project, histogramPath));
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "represents", riskClass);
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "value", residualProbability);
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "nestedPropertyPaths", residualProbability.getID());
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "source", "com.nomagic.magicdraw.simulation.uiprototype.HistogramPlotter");
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, histogramPath), "dynamic", true);
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, histogramPath), "title", "Threat Analysis - " + riskClass.getName());
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridX", true);
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridY", true);
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "plotColor", "#BC334E");
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLocation", 0);
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLength", 0);
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, histogramPath), "refreshRate", 0);
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "annotateFailures", false);
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "linearInterpolation", true);
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "keepOpenAfterTermination", true);
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "recordPlotDataAs", "PNG");
            StereotypesHelper.setStereotypePropertyValue(threatHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Threat Analysis - " + riskClass.getName() + ".png");

            detectHistogram = ef.createClassInstance();
            detectHistogram.setName("Detection Analysis - " + riskClass.getName());
            detectHistogram.setOwner(simPackage);
            StereotypesHelper.addStereotype(detectHistogram, Finder.byQualifiedName().find(project, histogramPath));
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "represents", riskClass);
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "value", detectionProbability);
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "nestedPropertyPaths", detectionProbability.getID());
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, selectPropertiesPath), "source", "com.nomagic.magicdraw.simulation.uiprototype.HistogramPlotter");
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, histogramPath), "dynamic", true);
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, histogramPath), "title", "Detection Analysis - " + riskClass.getName());
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridX", true);
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "gridY", true);
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, histogramPath), "plotColor", "#BC334E");
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLocation", 0);
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "fixedTimeLength", 0);
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, histogramPath), "refreshRate", 0);
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "annotateFailures", false);
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "linearInterpolation", true);
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "keepOpenAfterTermination", true); 
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "recordPlotDataAs", "PNG");
            StereotypesHelper.setStereotypePropertyValue(detectHistogram, Finder.byQualifiedName().find(project, timeSeriesChartPath), "resultFile", ".\\Analysis\\Detection Analysis - " + riskClass.getName() + ".png");
            
            uiList = new HashSet();
            uiList.add(threatHistogram);
            uiList.add(detectHistogram);
            StereotypesHelper.setStereotypePropertyValue(simConfig, Finder.byQualifiedName().find(project, simulationConfigStereotypePath), "UI", uiList); 
            
        }

        function main(project, ef) {
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

            threatImpactSignal = Finder.byQualifiedName().find(project, threatImpactSignalPath);
            var signal = getStereotypeInArray(selectedObjects, threatImpactSignal);

            //Validate that all objects have assets, controls and difficulties
            var nextNode = initialNode;
        
            for(z = 0; z < selectedObjects.length; z++) {
                next = nextNode.refGetValue("NextThreatAction");
                nextNode = getCommonNode(selectedObjects, next);
                if(StereotypesHelper.hasStereotype(nextNode, threatImpactSignal)) {
                    break;
                }
                difficultyTest = StereotypesHelper.getStereotypePropertyValue(nextNode, Finder.byQualifiedName().find(project, threatActionStereotypePath), Finder.byQualifiedName().find(project, threatActionStereotypeDifficultyPath));
                if(difficultyTest.length == 0) {
                    writeLog("ERROR: " + nextNode.getName() + " does not have a Difficulty set. Please set a difficulty for this action and try again.", 1);
                    return;
                }
                if(nextNode.refGetValue("affects").length == 0){
                    writeLog("ERROR: " + nextNode.getName() + " does not have any linked Assets. Please link Assets to this action and try again.", 1);
                    return;
                }
                if(nextNode.refGetValue("mitigatedBy").length == 0){
                    writeLog("ERROR: " + nextNode.getName() + " does not have any linked Controls. Please link Controls to this action and try again.", 1);
                    return;
                }
            }
            
            var detectionCombinationsParameters = selectedObjects.length - 1;
            var totalDifficultyCombinationVerticalGap = (detectionCombinationsParameters * parameterHeight) + (difficultyCombinationVerticalGap * (detectionCombinationsParameters - 1));
            var detectionCombinationHeight = totalDifficultyCombinationVerticalGap + (2 * parameterHeight);
            var detectCombinationOut_y = detectCombination_y;// + (detectionCombinationHeight / 2) - (parameterHeight / 2);
            var detectionProbability_y = detectConstraint_y - (valueHeight / 2) + (threatHeight / 2);
            if(detectionCombinationHeight > threatVeriticalGap) {
                detectControlEffectiveness_y = detectControlEffectiveness_y - threatVeriticalGap + detectionCombinationHeight;
                detectComponent_y = detectControlEffectiveness_y + controlEffectivenessHeight + threatVeriticalGap;
            }

            if(assetSelectionPath){
                var assetSelection = Finder.byQualifiedName().find(project, assetSelectionPath);
            }
                    
            var secControl = Finder.byQualifiedName().find(project, securityControlPath);
            var controls = StereotypesHelper.getExtendedElements(secControl);
            for(i = 0; i < controls.size(); i++) {
                if(controls.get(i).isAbstract()) {
                    var noneControl = controls.get(i);
                }
            }
            writeLog("Found None: " + noneControl.getName(), 5);
            writeLog("Found None: " + noneControl.getQualifiedName(), 5);

            var noneControlPath = noneControl.getQualifiedName();
    
            var secConstraint = Finder.byQualifiedName().find(project, securityConstraintPath);
            var secConstraints = StereotypesHelper.getExtendedElements(secConstraint);
            for(i = 0; i < secConstraints.size(); i++) {
                if(secConstraints.get(i).getType() == noneControl) {
                    var noneConstraint = secConstraints.get(i);
                }
            }
            writeLog("Found None: " + noneConstraint.getName(), 5);
            writeLog("Found None: " + noneConstraint.getQualifiedName(), 5);

            var noneConstraintPath = noneConstraint.getQualifiedName();

            var systemAssetStereo = Finder.byQualifiedName().find(project, systemPath);
            var systemAssets = StereotypesHelper.getExtendedElements(systemAssetStereo);
            for(i = 0; i < systemAssets.size(); i++) {
                if(systemAssets.get(i).isAbstract()) {
                    var systemAsset = systemAssets.get(i);
                }
            }
            writeLog("Found System: " + systemAsset.getName(), 5);
            writeLog("Found System: " + systemAsset.getQualifiedName(), 5);

            var systemBlockPath = systemAsset.getQualifiedName();

            risk = createRisk(project, initialNode.getName(), signal.getName(), assetSelection);
            diagram = ModelElementsManager.getInstance().createDiagram("SysML Parametric Diagram", risk);

            nodeHistory = new ArrayList();
            drawnNode = buildInitialShapes(diagram, initialNode, risk);
            nodeHistory.add(drawnNode);

            var nextNode = initialNode;
        
            for(z = 0; z < selectedObjects.length; z++) {
                next = nextNode.refGetValue("NextThreatAction");
                nextNode = getCommonNode(selectedObjects, next);
                if(StereotypesHelper.hasStereotype(nextNode, threatImpactSignal)) {
                    break;
                }
                writeLog("NextThreatAction: " + nextNode.getName(), 3);
                drawnNode = buildThreatAction(diagram, drawnNode, nextNode, z, noneControlPath, systemBlockPath, noneConstraintPath, assetSelection);
                nodeHistory.add(drawnNode);
            }

            buildFinalShapes(diagram, drawnNode, nextNode, z, nodeHistory, detectionCombinationHeight, detectCombinationOut_y, detectionProbability_y);

            newSession(project, "Simulation Creation");
            createSimulation();

            project.getDiagram(diagram).open();
        }

        var project = Application.getInstance().getProject();
        writeLog("Got project: " + project, 5);
        var ef = project.getElementsFactory();
        writeLog("Got elementsFactory: " + ef, 5);
        newSession(project, "Parametric Creation");
        main(project, ef);
        
    }
    finally
    {
        SessionManager.getInstance().closeSession();
    }
}
