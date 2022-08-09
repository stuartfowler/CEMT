# Stereotypes

## CEMT Misuse Case Diagrams

### CyberActor

The `CyberActor` stereotype uses the `Actor` class as a metaclass, and provides a labelling stereotype for all `Actor`s used within the CEMT Misuse Case Diagrams. This aids with the formation of structured expressions and queries in the model, by differentiating the `CyberActor`s used in CEMT Misuse Case Diagrams from generic `Actor`s which may be used within a broader system model.

```mermaid
    classDiagram
        CyberActor~Actor~ <|-- MaliciousActor~Actor~
        CyberActor <|-- NonMaliciousActor~Actor~
```

`CyberActor` contains no attributes or constraints, but acts as a generalised stereotype for both the `MaliciousActor` and `NonMaliciousActor` stereotypes.

#### MaliciousActor

The `MaliciousActor` stereotype uses the `Actor` class as a metaclass, inherits from the `CyberActor` stereotype and provides a labelling stereotype for all `CyberActor`s used in CEMT Misuse Case Diagrams that have malicious intent. This aids with the formation of structured expressions and queries in the model, by differentiating the `MaliciousActor`s from other `CyberActor`s.

```mermaid
    classDiagram
        CyberActor~Actor~ <|-- MaliciousActor~Actor~
```

`MaliciousActor` contains no attributes or constraints, but inherits from the `CyberActor` stereotype.

#### NonMaliciousActor

The `NonMaliciousActor` stereotype uses the `Actor` class as a metaclass, inherits from the `CyberActor` stereotype and provides a labelling stereotype for all `CyberActor`s used in CEMT Misuse Case Diagrams that do not have malicious intent. This aids with the formation of structured expressions and queries in the model, by differentiating the `NonMaliciousActor`s from other `CyberActor`s.

```mermaid
    classDiagram
        CyberActor~Actor~ <|-- NonMaliciousActor~Actor~
```

`MaliciousActor` contains no attributes or constraints, but inherits from the `CyberActor` stereotype.

### MisuseCase

The `MisuseCase` stereotype uses the `UseCase` class as a metaclass and provides a stereotype for the misuse cases used in CEMT Misuse Case Diagrams. This aids with the formation of structured expressions and queries in the model, by differentiating the `MisuseCase`s from other `UseCase`s. The `MisuseCase` stereotype also defines constraints which are used by the active validation suite in the CEMT to provide automated review of this stereotype and its related objects to aid both modellers and reviewers.

```mermaid
    classDiagram
        class MisuseCase~UseCase~ {      
            -[constraint] Name()
            -[constraint] Mal-Activities()
        }
        
```

`MisuseCase` contains no attributes, but has two active validation constraints:
 - Name() - which checks that the name of the `MisuseCase` and the name of the `MalActivity` which classifies its behaviour are equal; and
 - Mal-Activities() - which checks that the `Activity` which classifies the `MisuseCases` behaviour is stereotyped as a `MalActivity`.

### Association

This is the built-in `Association` class within CAMEO System Modeler. Further detail can be found in the CAMEO documentation on their website.

## CEMT Mal-Activity Diagrams

### ThreatStart

The `ThreatStart` stereotype uses the `InitialNode` class as a metaclass and provides a stereotype for all `InitialNode`s used in the CEMT Mal-Activity Diagrams. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatStart`s from other `InitialNode`s which may be used within a broader system model.

```mermaid
    classDiagram
        class ThreatStart~InitialNode~ {
            -[derived] NextThreatAction~RedefinableElement~[0..*]
        }
```

`ThreatStart` contains a single derived property:
 - NextThreatAction - which traverses the `ThreatFlow`s to determine which `ThreatAction`s are connected to this `ThreatStart`.

### ThreatEnd

The `ThreatEnd` stereotype uses the `FlowFinalNode` class as a metaclass and provides a labelling stereotype for all `FlowFinalNode`s used in the CEMT Mal-Activity Diagrams. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatEnd`s from other `FlowFinalNode`s which may be used within a broader system model.

```mermaid
    classDiagram
        class ThreatEnd~FlowFinalNode~
```

`ThreatEnd` contains no attributes or constraints.

### AggregatedAction

The `AggregatedAction` stereotype uses the `CallBehaviorAction` class as a metaclass and provides a stereotype for the actions used in CEMT Mal-Activity Diagrams that have nested content below them. This aids with the formation of structured expressions and queries in the model, by differentiating the `AggregatedAction`s from other `CallBehaviorAction`s. The `AggregatedAction` stereotype also defines constraints which are used by the active validation suite in the CEMT to provide automated review of this stereotype and its related objects to aid both modellers and reviewers.

```mermaid
    classDiagram
        class MisuseCase~UseCase~ {      
            -[constraint] Name()
            -[constraint] Mal-Activities()
            -[constraint] Nodes()
        }
        
```

`AggregatedAction` contains no attributes, but has three active validation constraints:
 - Name() - which checks that the name of the `AggregatedAction` and the name of the `MalActivity` which classifies its behaviour are equal;
 - Mal-Activities() - which checks that the `Activity` which classifies the `AggregatedAction` behaviour is stereotyped as a `MalActivity`; and
 - Nodes() - which checks that the `ActivityParameterNodes` within the the `Activity` which classifies the `AggregatedAction` behaviour have the `isControlType` flag set, allowing them to be connected by `ThreatModelFlow`s.

`AggregatedAction` also has a related stereotype `Customization` which sets the CEMT Mal-Activity Diagram as a `Suggested Owned Diagram`, which allows the CEMT Mal-Activity Diagram to appear in the context menu shortcuts associated with `AggregatedAction`s.

### ThreatInput

The `ThreatInput` stereotype uses the `InputPin` class as a metaclass and provides a labelling stereotype for all `InputPin`s used in the CEMT Mal-Activity Diagrams. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatInput`s from other `InputPin`s which may be used within a broader system model.

```mermaid
    classDiagram
        class ThreatInput~InputPin~
```

`ThreatInput` contains no attributes or constraints.

### ThreatOutput

The `ThreatOutput` stereotype uses the `OutputPin` class as a metaclass and provides a labelling stereotype for all `OutputPin`s used in the CEMT Mal-Activity Diagrams. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatOutput`s from other `OutputPin`s which may be used within a broader system model.

```mermaid
    classDiagram
        class ThreatOutput~OutputPin~
```

`ThreatOutput` contains no attributes or constraints.

### ThreatModelFlow

The `ThreatModelFlow` stereotype uses the `ControlFlow` class as a metaclass, and provides a labelling stereotype for all `ControlFlow`s used within the CEMT Mal-Activity Diagrams. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatModelFlow`s used in CEMT Mal-Activity Diagrams from generic `ControlFlow`s which may be used within a broader system model.

```mermaid
    classDiagram
        ThreatModelFlow~ControlFlow~ <|-- ThreatFlow~ControlFlow~
        ThreatModelFlow <|-- DetectionFlow~ControlFlow~
```

`ThreatModelFlow` contains no attributes or constraints, but acts as a generalised stereotype for both the `ThreatFlow` and `DetectionFlow` stereotypes.

#### ThreatFlow

The `ThreatFlow` stereotype uses the `ControlFlow` class as a metaclass, and provides a labelling stereotype for all `ControlFlow`s used in the CEMT Mal-Activity Diagrams that are associated with a `CyberActor`s actions against the system. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatFlow`s used in CEMT Mal-Activity Diagrams from other `ThreatModelFlow`s.

```mermaid
    classDiagram
        ThreatModelFlow~ControlFlow~ <|-- ThreatFlow~ControlFlow~
```

`ThreatFlow` contains no attributes or constraints, but inherits from the `ThreatModelFlow` stereotype.

#### DetectionFlow

The `DetectionFlow` stereotype uses the `ControlFlow` class as a metaclass, aand provides a labelling stereotype for all `ControlFlow`s used in the CEMT Mal-Activity Diagrams that are associated with the system's detection capabilities. This aids with the formation of structured expressions and queries in the model, by differentiating the `DetectionFlow`s used in CEMT Mal-Activity Diagrams from other `ThreatModelFlow`s.

```mermaid
    classDiagram
        ThreatModelFlow~ControlFlow~ <|-- DetectionFlow~ControlFlow~
```

`DetectionFlow` contains no attributes or constraints, but inherits from the `ThreatModelFlow` stereotype.

### ThreatSignal

The `ThreatSignal` stereotype uses the `Signal` class as a metaclass, and provides a labelling stereotype for all `Signal`s used within the CEMT Mal-Activity Diagrams. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatSignal`s used in CEMT Mal-Activity Diagrams from generic `Signal`s which may be used within a broader system model.

```mermaid
    classDiagram
        class ThreatImpactSignal~Signal~ {      
            -[derived] PreviousThreatAction~RedefinableElement~[0..*]
        }
        class ThreatDetectionSignal~Signal~ {      
            -[derived] PreviousDetectionAction~RedefinableElement~[0..*]
        }
        ThreatSignal~Signal~ <|-- ThreatImpactSignal~Signal~
        ThreatSignal <|-- ThreatDetectionSignal~Signal~
```

`ThreatSignal` contains no attributes or constraints, but acts as a generalised stereotype for both the `ThreatImpactSignal` and `ThreatDetectionSignal` stereotypes.

`ThreatSignal` also has a related stereotype `Customization` which sets the `Package` metaclass as a `Possible Owner` and the `Signal` metaclass as a `Quick Applying For` property, which allows the `ThreatSignal` stereotype to appear when creating elements under a `Package` and in the context menu for a `Signal`, respectively.

#### ThreatImpactSignal

The `ThreatImpactSignal` stereotype uses the `Signal` class as a metaclass, and provides a stereotype for all `Signal`s used within the CEMT Mal-Activity Diagrams that relate to an adverse impact on the system. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatImpactSignal`s used in CEMT Mal-Activity Diagrams from generic `ThreatSignal`s.

```mermaid
    classDiagram
        class ThreatImpactSignal~Signal~ {      
            -[derived] PreviousThreatAction~RedefinableElement~[0..*]
        }
        ThreatSignal~Signal~ <|-- ThreatImpactSignal~Signal~
```

`ThreatImpactSignal` contains a single derived property:
 - PreviousThreatAction - which traverses the `ThreatFlow`s in reverse to determine which `ThreatAction`s are connected to this `ThreatImpactSignal`.

`ThreatImpactSignal` inherits from the `ThreatSignal` stereotype.

`ThreatImpactSignal` also has a related stereotype `Customization` which sets the `Package` metaclass as a `Possible Owner` and both the `Signal` metaclass and the `ThreatSignal` stereotype as `Quick Applying For` properties, which allows the `ThreatImpactSignal` stereotype to appear when creating elements under a `Package` and in the context menu for both a `Signal` and `ThreatSignal`.

#### ThreatDetectionSignal

The `ThreatDetectionSignal` stereotype uses the `Signal` class as a metaclass, and provides a stereotype for all `Signal`s used within the CEMT Mal-Activity Diagrams that relate to the system detecting an adversary's actions. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatDetectionSignal`s used in CEMT Mal-Activity Diagrams from generic `ThreatSignal`s.

```mermaid
    classDiagram
        class ThreatDetectionSignal~Signal~ {      
            -[derived] PreviousDetectionAction~RedefinableElement~[0..*]
        }
        ThreatSignal~Signal~ <|-- ThreatDetectionSignal~Signal~
```

`ThreatDetectionSignal` contains a single derived property:
 - PreviousDetectionAction - which traverses the `DetectionFlow`s in reverse to determine which `DetectionAction`s are connected to this `ThreatDetectionSignal`.

`ThreatDetectionSignal` inherits from the `ThreatSignal` stereotype.

`ThreatDetectionSignal` also has a related stereotype `Customization` which sets the `Package` metaclass as a `Possible Owner` and both the `Signal` metaclass and the `ThreatSignal` stereotype as `Quick Applying For` properties, which allows the `ThreatDetectionSignal` stereotype to appear when creating elements under a `Package` and in the context menu for both a `Signal` and `ThreatSignal`.

### ThreatSendSignal

The `ThreatSendSignal` stereotype uses the `SendSignalAction` class as a metaclass, and provides a stereotype for all `SendSignalAction`s used within the CEMT Mal-Activity Diagrams. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatSendSignal`s used in CEMT Mal-Activity Diagrams from generic `SendSignalAction`s which may be used within a broader system model.

```mermaid
    classDiagram
        class ThreatSendSignal~SendSignalAction~ {      
            -[derived] LinkedDiagram~Diagram~[0..*]
        }
        ThreatSendSignal~SendSignalAction~ <|-- ThreatImpact~SendSignalAction~
        ThreatSendSignal <|-- ThreatDetection~SendSignalAction~
```

`ThreatSendSignal` contains a single derived property:
 - LinkedDiagram - which lists the `Diagram`s which contains the `ThreatAcceptEvent`s that are linked to this `ThreatSendSignal` by the `ThreatSignal` that they share.

`ThreatSendSignal`acts as a generalised stereotype for both the `ThreatImpact` and `ThreatDetection` stereotypes.

`ThreatSendSignal` also has a related stereotype `Customization` which sets the `SendSignalAction` metaclass as a `Quick Applying For` property, which allows the `ThreatSendSignal` stereotype to appear in the context menu for a `SendSignalAction`.

#### ThreatImpact

The `ThreatImpact` stereotype uses the `SendSignalAction` class as a metaclass, and provides a labelling stereotype for all `ThreatSendSignal`s used within the CEMT Mal-Activity Diagrams that relate to an adverse impact on the system. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatImpact`s used in CEMT Mal-Activity Diagrams from other `ThreatSendSignal`s.

```mermaid
    classDiagram
        class ThreatSendSignal~SendSignalAction~ {      
            -[derived] LinkedDiagram~Diagram~[0..*]
        }
        ThreatSendSignal~SendSignalAction~ <|-- ThreatImpact~SendSignalAction~
```

`ThreatImpact` contains no attributes or constraints, but inherits from the `ThreatSendSignal` stereotype.

`ThreatSendSignal` also has a related stereotype `Customization` which sets the `SendSignalAction` metaclass as a `Quick Applying For` property, which allows the `ThreatImpact` stereotype to appear in the context menu for a `SendSignalAction`.

#### ThreatDetection

The `ThreatDetection` stereotype uses the `SendSignalAction` class as a metaclass, and provides a labelling stereotype for all `ThreatSendSignal`s used within the CEMT Mal-Activity Diagrams that relate to the system detecting an adversary's actions. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatDetection`s used in CEMT Mal-Activity Diagrams from other `ThreatSendSignal`s.

```mermaid
    classDiagram
        class ThreatSendSignal~SendSignalAction~ {      
            -[derived] LinkedDiagram~Diagram~[0..*]
        }
        ThreatSendSignal~SendSignalAction~ <|-- ThreatDetection~SendSignalAction~
```

`ThreatDetection` contains no attributes or constraints, but inherits from the `ThreatSendSignal` stereotype.

`ThreatSendSignal` also has a related stereotype `Customization` which sets the `SendSignalAction` metaclass as a `Quick Applying For` property, which allows the `ThreatDetection` stereotype to appear in the context menu for a `SendSignalAction`.

### ThreatAcceptEvent

The `ThreatAcceptEvent` stereotype uses the `AcceptEventAction` class as a metaclass, and provides a labelling stereotype for all `AcceptEventAction`s used within the CEMT Mal-Activity Diagrams. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatAcceptEvent`s used in CEMT Mal-Activity Diagrams from other `AcceptEventAction`s.

```mermaid
    classDiagram
        class ThreatAcceptEvent~AcceptEventAction~ {      
            -[derived] LinkedDiagram~Diagram~[0..*]
        }
```

`ThreatAcceptEvent` contains a single derived property:
 - LinkedDiagram - which lists the `Diagram`s which contains the `ThreatSendSignal`s that are linked to this `ThreatAcceptEvent` by the `ThreatSignal` that they share.

`ThreatAcceptEvent` also has a related stereotype `Customization` which sets the `AcceptEventAction` metaclass as a `Quick Applying For` property, which allows the `ThreatAcceptEvent` stereotype to appear in the context menu for a `AcceptEventAction`.

### ThreatModelAction

The `ThreatModelAction` stereotype uses the `CallBehaviorAction` class as a metaclass, and provides a stereotype for all `CallBehaviorAction`s used within the CEMT Mal-Activity Diagrams. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatModelAction`s used in CEMT Mal-Activity Diagrams from generic `CallBehaviorAction`s which may be used within a broader system model.

```mermaid
    classDiagram
        class ThreatModelAction~CallBehaviorAction~ { 
            +[derived] mitigatedBy~Element~ [0..*]    
            +[derived] affects~Element~ [0..*]  
            +[derived] Implemented Controls~Property~[0..*]
            +[derived] Not Implemented Controls~Property~[0..*]
            +[derived] Partially Implemented Controls~Property~[0..*]
            +[derived] Not Assessed Controls~Property~[0..*]
        }
        class ThreatAction~CallBehaviorAction~ { 
            +Difficulty~Difficulty~     
            -[derived] NextThreatAction~RedefinableElement~[0..*]
            -[derived] PreviousThreatAction~RedefinableElement~[0..*]
            -[derived] DetectionAction~ActivityNode~[0..*]
            -[constraint] Assets()
            -[constraint] Controls()
            -[constraint] Difficulty()
            -[constraint] Incoming()
            -[constraint] OutgoingDet()
            -[constraint] OutgoingThreat()
            -[constraint] Properties()
        }
        class DetectionAction~CallBehaviorAction~ {      
            -[constraint] Assets()
            -[constraint] Controls()
            -[constraint] Incoming()
            -[constraint] OutgoingDet()
            -[constraint] Properties()
        }
        ThreatModelAction~CallBehaviorAction~ <|-- ThreatAction~CallBehaviorAction~
        ThreatModelAction <|-- DetectionAction~CallBehaviorAction~
```

`ThreatModelAction` contains six derived properties:
 - mitigatedBy - which lists the `SecurityControl`s which are linked to this `ThreatModelAction` by the `Mitigates` relationship;
 - affects - which lists the `Asset`s which are linked to this `ThreatModelAction` by the `Affects` relationship;
 - Implemented Controls - which lists the `SecurityProperty`s associated with this `ThreatModelAction` that have an `Implementation` status of `Implemented`;
 - Not Implemented Controls - which lists the `SecurityProperty`s associated with this `ThreatModelAction` that have an `Implementation` status of ` Not Implemented`;
 - Partially Implemented Controls - which lists the `SecurityProperty`s associated with this `ThreatModelAction` that have an `Implementation` status of `Partially Implemented`; and
 - Not Assessed Controls - which lists the `SecurityProperty`s associated with this `ThreatModelAction` that have an `Implementation` status of `Not Assessed`.

`ThreatModelAction`acts as a generalised stereotype for both the `ThreatAction` and `DetectionAction` stereotypes.

`ThreatModelAction` also has a related stereotype `Customization` which sets the `affects` and `mitigatedBy` properties as `Properties Displayed In Compartments`, which causes the `affects` and `mitigatedBy` properties to appear on `ThreatModelAction` shapes in the CEMT Mal-Activity Diagrams.

#### ThreatAction

The `ThreatAction` stereotype uses the `CallBehaviorAction` class as a metaclass, and provides a stereotype for all `ThreatModelAction`s used within the CEMT Mal-Activity Diagrams that relate to the actions of an adversary. This aids with the formation of structured expressions and queries in the model, by differentiating the `ThreatAction`s used in CEMT Mal-Activity Diagrams from generic `ThreatModelAction`s.

```mermaid
    classDiagram
        class ThreatModelAction~CallBehaviorAction~ { 
            +[derived] mitigatedBy~Element~ [0..*]    
            +[derived] affects~Element~ [0..*]  
            +[derived] Implemented Controls~Property~[0..*]
            +[derived] Not Implemented Controls~Property~[0..*]
            +[derived] Partially Implemented Controls~Property~[0..*]
            +[derived] Not Assessed Controls~Property~[0..*]
        }
        class ThreatAction~CallBehaviorAction~ { 
            +Difficulty~Difficulty~     
            -[derived] NextThreatAction~RedefinableElement~[0..*]
            -[derived] PreviousThreatAction~RedefinableElement~[0..*]
            -[derived] DetectionAction~ActivityNode~[0..*]
            -[constraint] Assets()
            -[constraint] Controls()
            -[constraint] Difficulty()
            -[constraint] Incoming()
            -[constraint] OutgoingDet()
            -[constraint] OutgoingThreat()
            -[constraint] Properties()
        }
        ThreatModelAction~CallBehaviorAction~ <|-- ThreatAction~CallBehaviorAction~
```

`ThreatAction` contains one tagged value:
 - Difficulty - which captures the difficulty of the adversary action in absence of any mitigating controls, using the [Difficulty](#difficulty) enumeration.

`ThreatAction` contains three derived properties:
 - NextThreatAction - which traverses the `ThreatFlow`s to determine which other `ThreatAction`s are connected to this `ThreatAction`;
 - PreviousThreatAction - which traverses the `ThreatFlow`s in reverse to determine which other `ThreatAction`s are connected to this `ThreatAction`; and
 - DetectionAction - which traverses the `DetectionFlow`s to determine which `DetectionAction`s are connected to this `ThreatAction`.

`ThreatAction` inherits from the `ThreatModelAction` stereotype.

`ThreatAction`has seven active validation constraints:
 - Assets() - which checks whether there are any `Asset`s linked to this `ThreatAction` and flags if there are no linked `Asset`s;
 - Controls() - which checks whether there are any `SecurityControl`s linked to this `ThreatAction` and flags if there are no linked `SecurityControl`s;
 - Difficulty() - which checks whether the Difficulty property has been set for the `ThreatAction`;
 - Incoming() - which checks whether there is a `ThreatFlow` coming into this `ThreatAction`;
 - OutgoingDet() - which checks whether there is a `DetectionFlow` leaving this `TheatAction`;
 - OutgoingThreat() - which checks whether there is a `ThreatFlow` leaving this `TheatAction`; and
 - Properties() - which checks whether all of the `SecurityProperty`s implied by the linked `Asset`s and `SecurityControl`s have been created in the model.

#### DetectionAction

The `DetectionAction` stereotype uses the `CallBehaviorAction` class as a metaclass, and provides a stereotype for all `ThreatModelAction`s used within the CEMT Mal-Activity Diagrams that relate to the system's detection response to an adversary. This aids with the formation of structured expressions and queries in the model, by differentiating the `DetectionAction`s used in CEMT Mal-Activity Diagrams from generic `ThreatModelAction`s.

```mermaid
    classDiagram
        class ThreatModelAction~CallBehaviorAction~ { 
            +[derived] mitigatedBy~Element~ [0..*]    
            +[derived] affects~Element~ [0..*]  
            +[derived] Implemented Controls~Property~[0..*]
            +[derived] Not Implemented Controls~Property~[0..*]
            +[derived] Partially Implemented Controls~Property~[0..*]
            +[derived] Not Assessed Controls~Property~[0..*]
        }
        class DetectionAction~CallBehaviorAction~ {      
            -[constraint] Assets()
            -[constraint] Controls()
            -[constraint] Incoming()
            -[constraint] OutgoingDet()
            -[constraint] Properties()
        }
        ThreatModelAction~CallBehaviorAction~ <|-- DetectionAction~CallBehaviorAction~
```

`DetectionAction` inherits from the `ThreatModelAction` stereotype.

`DetectionAction`has five active validation constraints:
 - Assets() - which checks whether there are any `Asset`s linked to this `DetectionAction` and flags if there are no linked `Asset`s;
 - Controls() - which checks whether there are any `SecurityControl`s linked to this `DetectionAction` and flags if there are no linked `SecurityControl`s;
 - Incoming() - which checks whether there is a `DetectionFlow` coming into this `DetectionAction`;
 - OutgoingDet() - which checks whether there is a `DetectionFlow` leaving this `DetectionAction`; and
 - Properties() - which checks whether all of the `SecurityProperty`s implied by the linked `Asset`s and `SecurityControl`s have been created in the model.

### MalActivity

The `MalActivity` stereotype uses the `Activity` class as a metaclass and provides a labelling stereotype for all `Activity`s used in the CEMT Mal-Activity Diagrams. This aids with the formation of structured expressions and queries in the model, by differentiating the `MalActivity`s from generic `Activity`s which may be used within a broader system model.

```mermaid
    classDiagram
        class MalActivity~Activity~
```

`MalActivity` contains no attributes or constraints.

`MalActivity` also has a related stereotype `Customization` which sets the `Activity` metaclass as a `Quick Applying For` property, which allows the `MalActivity` stereotype to appear in the context menu for an `Activity`. It also sets the `MisuseCase`, `Package` and `AggregatedAction` stereotypes as `Possible Owners` which allows the `MalActivity` stereotype to appear when creating elements under a `Package`, `MisuseCase` or `AggregatedAction`.

## CEMT Asset Definition Diagram

### Asset

#### System

#### NoneAsset

### DirectedAssociation

This is the built-in `DirectedAssociation` class within CAMEO System Modeler. Further detail can be found in the CAMEO documentation on their website.

## Dependency Matrix

### SecurityControl

### NoneControl

#### SecurityConstraint

##### ISMControl

### Mitigates

### Affects

### Applies

### SecurityProperty

## SysML Parametric Diagrams

### SecurityRisk

### ValueProperty

#### ThreatLevel

#### InitialProbability

#### ResidualProbability

#### DetectionProbability

#### DetectionControlEffectiveness

#### MitigationControlEffectiveness

#### difficultyProperty

### ConstraintProperty

#### ThreatConstraint

#### DetectConstraint

#### DifficultyConstraint

# Expressions

## NextThreatAction

## PreviousThreatAction

## DetectionAction

## LinkedDiagram

# Enumerations

## Difficulty

## Likelihood

## Consequence