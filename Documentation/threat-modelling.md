# Threat Modelling

The threat modelling stage involves the use of Misuse Case Diagrams and Mal-Activity Diagrams to model the way threat actors interact with the attack surface to achieve their malicious intent. The purpose of this activity is to enumerate the paths that an attacker must take to compromise the system.

```mermaid
flowchart TB
  subgraph TMo["Threat Modelling"]
    direction TB
    subgraph 1["Misuse Case Diagrams"]
      direction LR
      1a("Misuse Cases") --> 1c("Associations")
      1b("Actors") --> 1c
    end
    subgraph 2["Intermediate Mal-Activity Diagrams"]
      direction LR
      2c("Threat Start") --> 2d("Signals") --> 2e("Flows")
      2a("Aggregated Actions") --> 2b("Pins") --> 2e    
    end
    subgraph 3["Detailed Mal-Activity Diagrams"]
      direction LR
      3a("Threat Actions") --> 3c("Threat Difficulty") --> 3d("Flows") --> 3f("Labels")
      3b("Detection Actions") --> 3d
      3e("Threat Ends") --> 3d
    end
    1 --> 2 --> 3
  end
```

## Overview

The threat modelling process involves the investigation of misuse cases which represent the top level threats to a systems and the development of a nested flow chart, in the form of hierarchical mal-activity diagrams, that articulates what steps an attacker needs to perform in order to achieve those misuse cases. 

> **Note**: The information contained in this documentation set aims to guide a modeller and provide instructions on how to use the CEMT to produce the necessary views in CAMEO Systems Modeler. The production of an accurate and comprehensive model depends on the cybersecurity expertise and the system knowledge of the modelling team; this documentation simply outlines how to use the CEMT, not how to produce a comprehensive assessment.

## Misuse Case Diagrams

The process for creating Misuse Case Diagrams requires the modeller to define misuse cases that align with the top level threats to the system, articulate the actors that perform those misuse cases and then link them together using associations.

```mermaid
flowchart TB
    subgraph 1["Misuse Case Diagrams"]
      direction LR
      1a("Misuse Cases") --> 1c("Associations")
      1b("Actors") --> 1c
    end
    click 1a "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md##misuse-cases-actors-and-associations" "Misuse Cases"
    click 1b "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md##misuse-cases-actors-and-associations" "Actors"
    click 1c "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md##misuse-cases-actors-and-associations" "Associations"
```

Misuse Case Diagrams are drawn using a `CEMT Misuse Case Diagram`, which can be created by right clicking on a `Package` in the containment tree, selecting `Create Diagram` from the context menu and then selecting `CEMT Misuse Case Diagram`.

> **Note**: The `CEMT Misuse Case Diagram` is a [Custom Diagram](../README.md#custom-diagrams). You can also create a Misuse Case Diagram using a standard `SysML Use Case Diagram` and manually apply the stereotypes if you wish.

Misuse Case Diagrams use the following CEMT stereotypes:

 - [`MisuseCase`](./stereotypes.md#misusecase)
 - [`CyberActor`](./stereotypes.md#cyberactor)
   - [`MaliciousActor`](./stereotypes.md#maliciousactor)
   - [`NonMaliciousActor`](./stereotypes.md#nonmaliciousactor)
 - [`Association`](./stereotypes.md#association)

### Misuse Cases, Actors and Associations

The diagrams are created by placing [`MaliciousActor`](./stereotypes.md#maliciousactor)s, [`NonMaliciousActor`](./stereotypes.md#nonmaliciousactor)s and [`MisuseCase`](./stereotypes.md#misusecase)s, naming them appropriately and then connecting them together using the Association relationship. The CEMT also includes a `Mis-use Case` legend, which will apply the appropriate colouring and adornments. This is shown in the video snippet below.

https://user-images.githubusercontent.com/7237737/177487459-e7660d65-c24c-4d7c-ab7b-ba983d8c70a6.mp4

### Additional Optional Steps

Additional `MaliciousActor`s, `NonMaliciousActor`s and `MisuseCase`s can be drawn on the same misuse case diagram until a full picture of the top level threats to the system has been created.

![Misuse Case Diagram](/Documentation/Images/misuse.png)

The purpose of these diagrams is to provide a high level view of the scope of the assessment, in terms of the actors and the threats that they pose to the system. Modellers should ensure that a misuse case has been created for each of the top level threats to the sys

 > [Return to Modelling Process Flowchart](/README.md#threat-modelling)

## Intermediate Mal-Activity Diagrams

The process for creating Intermediate Mal-Activity Diagrams requires the modeller to develop a detailed flow chart of the steps an attacker needs to take to achieve a particular misuse case. They provide the nested detail below the misuse case diagram, and articulate the path that the threat takes through the system as well as the ways in which a system can detect and mitigate the threat.

```mermaid
flowchart TB
    subgraph 2["Intermediate Mal-Activity Diagrams"]
      direction LR
      2c("Threat Start") --> 2d("Signals") --> 2e("Flows")
      2a("Aggregated Actions") --> 2b("Pins") --> 2e      
    end
    click 2a "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md#aggregated-actions" "Aggregated Actions"
    click 2b "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md#pins" "Pins"
    click 2c "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md#threat-start" "Threat Start"
    click 2d "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md#signals" "Signals"
    click 2e "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md#flows" "Flows"
```
Intermediate Mal-Activity Diagrams are drawn using a `CEMT Mal-Activity Diagram`, which can be created by right clicking on a `MisuseCase`, selecting `Create Diagram` from the context menu and then selecting `CEMT Mal-Activity Diagram`. Creating a `CEMT Mal-Activity Diagram` does not automatically apply the [`MalActivity`](./stereotypes.md#malactivity) stereotype to the Activity object that is created. A constraint on the [`MisuseCase`](./stereotypes.md#misusecase) stereotype checks for this in real-time if CAMEO active validation is turned on, and indicates that you can either manually apply the stereotype - by right-clicking on the Activity object that was created and selecting `MalActivity` from the context menu - or by running the included [Misuse macro](../Macros/README.md#misuse), as shown in the video below.

> **Note**: The `CEMT Mal-Activity Diagram` is a [Custom Diagram](../README.md#custom-diagrams). You can also create a Intermediate Mal-Activity Diagram using a standard `SysML Activity Diagram` and manually apply the stereotypes if you wish.

https://user-images.githubusercontent.com/7237737/179884484-dc7cdcd6-3d92-406a-83b6-28a08240c6c7.mp4

Intermediate Mal-Activity Diagrams use the following CEMT stereotypes:

 - [`ThreatStart`](./stereotypes.md#threatstart)
 - [`AggregatedAction`](./stereotypes.md#aggregatedaction)
 - [`ThreatInput`](./stereotypes.md#threatinput)
 - [`ThreatOutput`](./stereotypes.md#threatoutput)
 - [`ThreatModelFlow`](./stereotypes.md#threatmodelflow)
   - [`ThreatFlow`](./stereotypes.md#threatflow)
   - [`DetectionFlow`](./stereotypes.md#detectionflow)
 - [`ThreatSignal`](./stereotypes.md#threatsignal)
   - [`ThreatImpactSignal`](./stereotypes.md#threatimpactsignal)
   - [`ThreatDetectionSignal`](./stereotypes.md#threatdetectionsignal)
 - [`ThreatSendSignal`](./stereotypes.md#threatsendsignal)
   - [`ThreatImpact`](./stereotypes.md#threatimpact)
   - [`ThreatDetection`](./stereotypes.md#threatdetection)
 - [`ThreatAcceptEvent`](./stereotypes.md#threatacceptevent)

### Threat Start

The first step in developing the Intermediate Mal-Activity Diagrams is to insert a [`ThreatStart`](./stereotypes.md#threatstart) object into the drawing and name it to match the misuse case.

https://user-images.githubusercontent.com/7237737/179894577-9b2b8317-d76f-4272-b0c7-009776ded925.mp4

### Signals

Signals should be created next that capture the expected outcomes of the misuse case. The [`ThreatImpactSignal`](./stereotypes.md#threatimpactsignal) stereotype should be used for the undesirable outcomes which the threat actor is trying to achieve. While these can be expressed using the Confidentiality, Integrity and Availability triad, they do not have to be expressed like this. The [`ThreatDetectionSignal`](./stereotypes.md#threatdetectionsignal) stereotype should be used to create the detection outcomes which represent the system detecting the threat actor.

https://user-images.githubusercontent.com/7237737/179894602-a06bb366-dccd-4b64-b699-6d282032b7d4.mp4

These are drawn on the `CEMT Mal-Activity Diagram` by placing a [`ThreatImpact`](./stereotypes.md#threatimpact) object for the undesirable threat outcomes and a [`ThreatDetection`](./stereotypes.md#threatdetection) object for the detection outcomes. The `ThreatImpactSignal`s and `ThreatDetectionSignal`s can then be dragged from the containment tree onto the `ThreatImpact`s and `ThreatDetection`s.

https://user-images.githubusercontent.com/7237737/179894631-5e16f41e-77cd-48c8-ab3e-415a7e39c97f.mp4

> **Note**: If you add the signals to the `ThreatImpact` or `ThreatDetection` via the context menu that appears when you place the `ThreatImpact` or `ThreatDetection` object, rather than by dragging them from the containment tree, the underlying `ThreatImpact` or `ThreatDetection` stereotypes are stripped from the object. You will notice this because the red and blue colours from the legend will not apply properly once they are connected via the [Flows](#flows). The stereotype can be manually re-applied by right clicking on the object and selecting `ThreatImpact` or `ThreatDetection` from the context menu to fix this issue.

### Aggregated Actions

The next step in the threat modelling process is to define and draw the [`AggregatedAction`](./stereotypes.md#aggregatedaction)s that describe the high level actions that an attacker needs to take between the `ThreatStart` and the `ThreatImpact`. These `AggregatedAction`s are logical groupings that are designed to manage the complexity of the actual steps in the threat flow during the modelling process, and will not appear in the final [Attack Trees](./risk.md#attack-trees) as nodes.

https://user-images.githubusercontent.com/7237737/179895990-d646c9e8-21ec-4400-8c0d-408636918cf2.mp4

### Pins

Pins must be added to the `AggregatedAction`s before connecting the flows, as this is the mechanism that allows the flows to transition into the more detailed mal-activity diagrams inside the `AggregatedAction`s. [`ThreatInputs`](./stereotypes.md#threatinput) are used to create the input pins for flows into the `AggregatedAction` while [`ThreatOutput`](./stereotypes.md#threatoutput)s are used to create the output pins for flows out of the `AggregatedAction`. As there are usually multiple `ThreatOutput`s for each `AggregatedAction`, the `ThreatOutput`s should be labelled by setting the name of the object to something that describes the condition by which the flow would be active.

https://user-images.githubusercontent.com/7237737/179895999-0bed82a1-8370-4173-af7c-3371656b298e.mp4

> **Note**: The `ThreatOutput` stereotype is used for all output pins from an `AggregatedAction`. This includes pins that carry `ThreatFlow`s and pins that carry `DetectionFlow`s.

### Flows

[`ThreatModelFlow`](./stereotypes.md#threatmodelflow)s are used to connect together the various objects on the `CEMT Mal-Activity Diagram`. There are two types of flows that are used:

 - [`ThreatFlow`](./stereotypes.md#threatflow) - which are used to model the path that the attacker must take; and
 - [`DetectionFlow`](./stereotypes.md#detectionflow) - which are used to model the path that a system takes to detect the attacker.

 `ThreatFlow`s should be drawn from the `ThreatStart` to the input pins of an `AggregatedAction` and from the output pins of an `AggregatedAction` to either another `AggregatedAction` or to a `ThreatImpact`.

 `DetectionFlow`s should be drawn from the output pins of an `AggregatedAction` to a `ThreatDetection`.

https://user-images.githubusercontent.com/7237737/179896018-0a9a8697-a03b-4ad0-a180-3a0faba7e495.mp4

### Additional Optional Steps

The CEMT does not limit modellers to a single Intermediate Mal-Activity diagram. If the modeller wishes to use multiple levels of nested mal-activity diagrams by using `AggregatedAction`s within `AggregatedAction`s that is currently supported to a depth of 3. These can be created by following the same process outlined in the [Detailed Mal-Activity Diagrams](#detailed-mal-activity-diagrams) section, but continuing to use `AggregatedAction`s, `ThreatInput`s and `ThreatOutput`s to draw the next intermediate level of detail.

The CEMT also provides the ability to link together different mal-activity diagrams which may reside under different misuse cases to avoid duplication of mal-activity diagrams. This is achieved using the [`ThreatSendSignal`](./stereotypes.md#threatsendsignal), [`ThreatAcceptEvent`](./stereotypes.md#threatacceptevent) and [`ThreatSignal`](./stereotypes.md#threatsignal) stereotypes. The `ThreatSendSignal` would be drawn on the mal-activity diagram that is the source of the `ThreatFlow` being passed between the two mal-activity diagrams and the `ThreatAcceptEvent` would be drawn on the mal-activity diagram that is the destination of the `ThreatFlow` being passed between the two mal-activity diagrams. A `ThreatSignal` would be created and assigned to both the `ThreatAcceptEvent` and `ThreatSendSignal`, linking them together. 

The process for creating and drawing these objects is similar to that shown in the [Signals](#signals) section. The completed Intermediate Mal-Activity Diagram shown below includes the 'System Access' object at the top, which is a `ThreatAcceptEvent` which is accepting a `ThreatSignal` named 'System Access' from one or more `ThreatSendSignal` objects elsewhere in the model. 

![Intermediate Mal-Activity Diagram](/Documentation/Images/intmalact.png)

 > [Return to Modelling Process Flowchart](/README.md#threat-modelling)

## Detailed Mal-Activity Diagrams

The process for creating Detailed Mal-Activity Diagrams requires the modeller to provide additional detail underneath the Intermediate Mal-Activity Diagrams that outline the higher level view of the path an attacker needs to take to compromise the system. These Detailed Mal-Activity Diagrams articulate the elemental steps that must be completed by the attacker, and are used as the basis for the [Attack Trees](./risk.md#attack-trees) developed later in the process. This is the final step in the Threat Modelling process, and creates the objects against which the Threat Mitigation process will be performed.

```mermaid
flowchart TB
    subgraph 3["Detailed Mal-Activity Diagrams"]
      direction LR
      3a("Threat Actions") --> 3c("Threat Difficulty") --> 3d("Flows") --> 3f("Labels")
      3b("Detection Actions") --> 3d
      3e("Threat Ends") --> 3d
    end
    click 3a "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md#threat-actions" "Threat Actions"
    click 3b "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md#detection-actions" "Detection Actions"
    click 3c "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md#threat-difficulty" "Threat Difficulty"
    click 3d "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md#flows-1" "Flows"
    click 3e "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md#threat-ends" "Threat Ends"
    click 3f "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-modelling.md#labels" "Labels"
```

Detailed Mal-Activity Diagrams are drawn using a `CEMT Mal-Activity Diagram`, which can be created by right clicking on an `AggregatedAction`, selecting `Create Diagram` from the context menu and then selecting `CEMT Mal-Activity Diagram`. They can also be created by selecting the `AggregatedAction` and selecting the `CEMT Mal-Activity Diagram` icon form the context manu. Creating a `CEMT Mal-Activity Diagram` does not automatically apply the [`MalActivity`](./stereotypes.md#malactivity) stereotype to the Activity object that is created. A constraint on the [`AggregatedAction`](./stereotypes.md#aggregationaction) stereotype checks for this in real-time if CAMEO active validation is turned on, and indicates that you can resolve this issue by running the included [Activities macro](../Macros/README.md#activities), as shown in the video below.

> **Note**: The `CEMT Mal-Activity Diagram` is a [Custom Diagram](../README.md#custom-diagrams). You can also create a Detailed Mal-Activity Diagram using a standard `SysML Activity Diagram` and manually apply the stereotypes if you wish.

https://user-images.githubusercontent.com/7237737/180127957-9e69a985-63de-4e22-974b-2e472b007291.mp4

Detailed Mal-Activity Diagrams use the following CEMT stereotypes:

 - [`ThreatModelAction`](./stereotypes.md#threatmodelaction)
   - [`ThreatAction`](./stereotypes.md#threataction)
   - [`DetectionAction`](./stereotypes.md#detectionaction)
 - [`ThreatModelFlow`](./stereotypes.md#threatmodelflow)
   - [`ThreatFlow`](./stereotypes.md#threatflow)
   - [`DetectionFlow`](./stereotypes.md#detectionflow)
 - [`ThreatEnd`](./stereotypes.md#threatend)

### Threat Actions

The first step in drawing the Detailed Mal-Activity Diagrams is to insert [`ThreatAction`](./stereotypes.md#threataction)s which represent the specific steps an attacker is taking at this point of the threat flow. This is achieved by simply selecting `ThreatAction` from the drawing palette, placing it on the `CEMT Mal-Activity Diagram` and typing in a name for the `ThreatAction`.

The purpose here is to create `ThreatAction`s that define the steps the attacker needs to take to move between the input nodes and the output nodes of the `CEMT Mal-Activity Diagram`. That could be a single `ThreatAction`, as shown in the videos below, or it could be a number of sequential `ThreatAction`s, or it could be parallel `ThreatAction`s that represent multiple paths the attack may take from the input. The goal here is to manage the complexity of the threat model by appropriately grouping these detailed `ThreatAction`s into `AggregatedActions` which are the basis of the [Intermediate Mal-Activity Diagrams](#intermediate-mal-activity-diagrams). If these Detailed Mal-Activity Diagrams start to become too complex and confusing, the modeller should reassess whether the diagram could become more intuitive and understandable by adding another layer of `AggregatedActions`.

https://user-images.githubusercontent.com/7237737/180129375-b821794b-79b5-4076-8328-e7339aaaa203.mp4

### Threat Difficulty

Once the `ThreatAction`s have been drawn, the modeller needs to assign a `Difficulty` property to each `ThreatAction`. This property represents the difficulty of the step irrespective of any mitigations being in place. This is meant to represent a relative difficulty between the steps in your threat model, and is used in the [Risk Assessment](./risk.md) step of the analysis. 

As an example, inserting a removable media device into a USB port is trivially difficult, and any attacker would be able to do that, whereas a complex Electronic Attack that targets bespoke signal processors is likely to require a higher level of attacker expertise and resources. In this case, those steps on the Electronic Attack threat path would have a higher `Difficulty` value than those associated with inserting the removable media device.

https://user-images.githubusercontent.com/7237737/180129383-8d8faaae-19a8-49fa-bf98-1b4fad5cd0b3.mp4

### Detection Actions

Every `ThreatAction` taken by an attacker will generate some sort of activity that the system may be able to detect. [`DetectionAction`](./stereotypes.md#detectionaction)s are added by selecting `DetectionAction` from the drawing palette, placing it on the `CEMT Mal-Activity Diagram` and typing in a name for the `DetectionAction`. Each `ThreatAction` should have a corresponding `DetectionAction`, which represents the system's ability to detect that specific `ThreatAction`.

https://user-images.githubusercontent.com/7237737/180129398-448faac0-72cd-4571-a897-fe51d74e7134.mp4

### Threat Ends

[`ThreatEnd`](./stereotypes.md#threatend)s represent a potential end point for a threat flow in the threat model. While one potential path is for the attacker to reach their desired outcome (the `ThreatImpact`s described in the [Signals](#signals) section), the attacker may be stopped because an attacker was unable to complete a particular step in the attacker path and the attack was stopped. These objects can be created by simply selecting `ThreatImpact` from the drawing palette and placing it on the diagram.

https://user-images.githubusercontent.com/7237737/180129648-8858f33c-c866-4065-8233-c045d93fa45e.mp4

### Flows

Once the building blocks of the `CEMT Mal-Activity Diagram` have been placed, you can connect them up using [`ThreatFlow`](./stereotypes.md#threatflow)s and [`DetectionFlow`](./stereotypes.md#detectionflow)s. 

`ThreatFlow`s should start at the input parameter, pass through each `ThreatAction` in the order the attacker would need to complete those actions and then end at the output parameter. `ThreatFlow`s should also connect each `ThreatAction` to a `ThreatEnd`.

`DetectionFlow`s should start at a `ThreatAction` and connect to the corresponding `DetectionAction`. Each `DetectionAction` should also connect to a `ThreatEnd` and the output parameter associated with a detection event via `DetectionFlow`s.

https://user-images.githubusercontent.com/7237737/180129660-3e8ae33c-5b9e-42a4-8f3f-bb849691c2a8.mp4

### Labels

Labels should be added to the `ThreatFlow`s and `DetectionFlow`s to provide context for the reviewers. These labels are not used by the model, but they are important because they provide reviewers with the necessary information to understand and review the model.

There are two types of labels used:
 - Names - used to label a flow when that flow always occurs when the proceeding action is attempted; and
 - Guard conditions - used when that flow only occurs if the guard condition is met.

 In the example below, the flow between the `Log Into Component` action and the `System Accessed` parameter only occurs if the attacker successfully logs into the system and accesses the system, so this is represented as a guard condition. The `else` guard condition is used to show all other alternatives (ie. the system was not accessed successfully), which would cause the flow to head towards the `ThreatEnd` as the threat was stopped at that point.

 However, whenever there is an attempt to log into a component, some sort of activity is generated, which can be detected. Consequently, the label on the `DetectionFlow` between the `Log Into Component` action and the `Detect Component Login` action uses a name, rather than a guard condition.

https://user-images.githubusercontent.com/7237737/180129680-d85b2138-7889-4742-8143-aafa275a8728.mp4

### Additional Optional Steps

In some cases, you may want to have multiple `ThreatEnd`s on a single `CEMT Mal-Activity Diagram` to simplify the routing of `ThreatFlow`s and `DetectionFlow`s around a diagram. While you can just drag on a new `ThreatEnd` from the drawing palette, this would actually create a new object in the model. A cleaner way to do this would be to select the existing `ThreatEnd` object for a particular diagram in the containment tree (you can do this by selecting the object on the drawing and using the `Alt + B` keyboard shortcut) and then dragging that object from the containment tree onto the diagram. This will create a second representation of the same object, which can then be used as the sink of multiple `ThreatFlow`s and `DetectionFlow`s without creating unnecessary object in the model.

This technique can also be used to duplicate the representation of any other object in the `CEMT Mal-Activity Diagram` if doing so would make your diagram more understandable.

![Detailed Mal-Activity Diagram](/Documentation/Images/detmalact-clean.png)

 > [Return to Modelling Process Flowchart](/README.md#threat-modelling)
