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

The threat modelling process involves the investigation of misuse cases which represent the top level threats to a systems and the development of a nested flow chart, in the form of hierarchical mal-activity diagrams, that articulates what steps an attacker needs to perform in order to achieve those misuse cases. The information contained in this document aims to guide a modeller and provide instructions on how to use the CEMT to produce the necessary views in CAMEO Systems Modeler. The production of an accurate and comprehensive model depends on the cybersecurity expertise and the system knowledge of the modelling team; this documentation simply outlines how to use the CEMT, not how to produce a comprehensive assessment.

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

Misuse Case Diagrams are drawn using the `CEMT Misuse Case Diagram`, which can be created inside a `Package` in the containment tree.

> **Note**: The `CEMT Misuse Case Diagram` is a [Custom Diagram](../README.md#custom-diagrams). You can also create a Misuse Case Diagram using a standard `SysML Use Case Diagram` and manually apply the stereotypes if you wish.

Misuse Case Diagrams use the following CEMT stereotypes:

 - [`MisuseCase`](./stereotypes.md#misusecase)
 - [`CyberActor`](./stereotypes.md#cyberactor)
   - [`MaliciousActor`](./stereotypes.md#maliciousactor)
   - [`NonMaliciousActor`](./stereotypes.md#nonmaliciousactor)
 - [`Association`](./stereotypes.md#association)

### Misuse Cases, Actors and Associations

The diagrams are created by placing [`MaliciousActors`](./stereotypes.md#maliciousactor), [`NonMaliciousActors`](./stereotypes.md#nonmaliciousactor) and [`MisuseCases`](./stereotypes.md#misusecase), naming them appropriately and then connecting them together using the Association relationship. The CEMT also includes a `Mis-use Case` legend, which will apply the appropriate colouring and adornments. This is shown in the video snippet below.

https://user-images.githubusercontent.com/7237737/177487459-e7660d65-c24c-4d7c-ab7b-ba983d8c70a6.mp4

### Additional Optional Steps

Additional `MaliciousActors`, `NonMaliciousActors` and `MisuseCases` can be drawn on the same misuse case diagram until a full picture of the top level threats to the system has been created.

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
Intermediate Mal-Activity Diagrams are drawn using the `CEMT Mal-Activity Diagram`, which can be created by right clicking on a MisuseCase, selecting `Create Diagram` from the context menu and then selecting `CEMT Mal-Activity Diagram`. Creating a `CEMT Mal-Activity Diagram` does not automatically apply the [`MalActivity`](./stereotypes.md#malactivity) stereotype to the Activity object that is created. A constraint on the [`MisuseCase`](./stereotypes.md#misusecase) stereotype checks for this in real-time if CAMEO active validation is turned on, and indicates that you can either manually apply the stereotype - by right-clicking on the Activity object that was created and selecting `MalActivity` from the context menu, or by running the included [Misuse macro](../Macros/README.md#misuse), as shown in the video below.

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
 - [`ThreatAcceptEvent`](./stereotypes.md#threatacceptevent)
 - [`ThreatImpact`](./stereotypes.md#threatimpact)
 - [`ThreatDetection`](./stereotypes.md#threatdetection)

### Threat Start

The first step in developing the Intermediate Mal-Activity Diagrams is to insert a [`ThreatStart`](./stereotypes.md#threatstart) object into the drawing and name it to match the misuse case.

https://user-images.githubusercontent.com/7237737/179894577-9b2b8317-d76f-4272-b0c7-009776ded925.mp4

### Signals

Signals should be created next that capture the expected outcomes of the misuse case. The [`ThreatImpactSignal`](./stereotypes.md#threatimpactsignal) stereotype should be used for the undesirable outcomes which the threat actor is trying to achieve. While these can be expressed using the Confidentiality, Integrity and Availability triad, they do not have to be expressed like this. The [`ThreatDetectionSignal`](./stereotypes.md#threatdetectionsignal) stereotype should be used to create the detection outcomes which represent the system detecting the threat actor.

https://user-images.githubusercontent.com/7237737/179894602-a06bb366-dccd-4b64-b699-6d282032b7d4.mp4

These are drawn on the `CEMT Mal-Activity Diagram` by placing a [`ThreatImpact`](./stereotypes.md#threatimpact) object for the undesirable threat outcomes and a [`ThreatDetection`](./stereotypes.md#threatdetection) object for the detection outcomes. The `ThreatImpactSignals` and `ThreatDetectionSignals` can then be dragged from the containment tree onto the `ThreatImpacts` and `ThreatDetections`.

https://user-images.githubusercontent.com/7237737/179894631-5e16f41e-77cd-48c8-ab3e-415a7e39c97f.mp4

> **Note**: If you add the signals to the `ThreatImpact` or `ThreatDetection` via the context menu that appears when you place the `ThreatImpact` or `ThreatDetection` object, rather than by dragging them from the containment tree, the underlying `ThreatImpact` or `ThreatDetection` stereotypes are stripped from the object. You will notice this because the red and blue colours from the legend will not apply properly once they are connected via the [Flows](#flows). The stereotype can be manually re-applied by right clicking on the object and selecting `ThreatImpact` or `ThreatDetection` from the context menu to fix this issue.

### Aggregated Actions

The next step in the threat modelling process is to define and draw the [`AggregatedActions`](./stereotypes.md#aggregatedaction) that describe the high level actions that an attacker needs to take between the `ThreatStart` and the `ThreatImpact`. These `AggregatedActions` are logical groupings that are designed to manage the complexity of the actual steps in the threat flow during the modelling process, and will not appear in the final [Attack Trees](./risk.md#attack-trees) as nodes.

https://user-images.githubusercontent.com/7237737/179895990-d646c9e8-21ec-4400-8c0d-408636918cf2.mp4

### Pins

Pins must be added to the `AggregatedActions` before connecting the flows, as this is the mechanism that allows the flows to transition into the more detailed mal-activity diagrams inside the `AggregatedActions`. [`ThreatInputs`](./stereotypes.md#threatinput) are used to create the input pins for flows into the `AggregatedAction` while [`ThreatOutputs`](./stereotypes.md#threatoutput) are used to create the output pins for flows out of the `AggregatedAction`. As there are usually multiple `ThreatOutputs` for each `AggregatedAction`, the `ThreatOutputs` should be labelled by setting the name of the object to something that describes the condition by which the flow would be active.

https://user-images.githubusercontent.com/7237737/179895999-0bed82a1-8370-4173-af7c-3371656b298e.mp4

> **Note**: The `ThreatOutput` stereotype is used for all output pins from an `AggregatedAction`. This includes pins that carry `ThreatFlows` and pins that carry `DetectionFlows`.

### Flows

[`ThreatModelFlows`](./stereotypes.md#threatmodelflow) are used to connect together the various objects on the `CEMT Mal-Activity Diagram`. There are two types of flows that are used:

 - [`ThreatFlows`](./stereotypes.md#threatflow) - which are used to model the path that the attacker must take; and
 - [`DetectionFlows`](./stereotypes.md#detectionflow) - which are used to model the path that a system takes to detect the attacker.

 `ThreatFlows` should be drawn from the `ThreatStart` to the input pins of an `AggregatedAction` and from the output pins of an `AggregatedAction` to either another `AggregatedAction` or to a `ThreatImpact`.

 `DetectionFlows` should be drawn from the output pins of an `AggregatedAction` to a `ThreatDetection`.

https://user-images.githubusercontent.com/7237737/179896018-0a9a8697-a03b-4ad0-a180-3a0faba7e495.mp4

### Additional Optional Steps

The CEMT does not limit modellers to a single Intermediate Mal-Activity diagram. If the modeller wishes to use multiple levels of nested mal-activity diagrams by using `AggregatedActions` within `AggregatedActions` that is currently supported to a depth of 3. These can be created by following the same process outlined in the [Detailed Mal-Activity Diagrams](#detailed-mal-activity-diagrams) section, but continuing to use `AggregatedActions`, `ThreatInputs` and `ThreatOutputs` to draw the next intermediate level of detail.

The CEMT also provides the ability to link together different mal-activity diagrams which may reside under different misuse cases to avoid duplication of mal-activity diagrams. This is achieved using the [`ThreatSendSignal`](./stereotypes.md#threatsendsignal), [`ThreatAcceptEvent`](./stereotypes.md#threatacceptevent) and [`ThreatSignal`](./stereotypes.md#threatsignal) stereotypes. The `ThreatSendSignal` would be drawn on the mal-activity diagram that is the source of the `ThreatFlow` being passed between the two mal-activity diagrams and the `ThreatAcceptEvent` would be drawn on the mal-activity diagram that is the destination of the `ThreatFlow` being passed between the two mal-activity diagrams. A `ThreatSignal` would be created and assigned to both the `ThreatAcceptEvent` and `ThreatSendSignal`, linking them together. 

The process for creating and drawing these objects is similar to that shown in the [Signals](#signals) section. The completed Intermediate Mal-Activity Diagram shown below includes the 'System Access' object at the top, which is a `ThreatAcceptEvent` which is accepting a `ThreatSignal` named 'System Access' from one or more `ThreatSendSignal` objects elsewhere in the model. 

![Intermediate Mal-Activity Diagram](/Documentation/Images/intmalact.png)

 > [Return to Modelling Process Flowchart](/README.md#threat-modelling)

## Detailed Mal-Activity Diagrams

<mark>Purpose</mark>

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

| Test |
|:----:|
| https://user-images.githubusercontent.com/7237737/180127957-9e69a985-63de-4e22-974b-2e472b007291.mp4 |


<mark>Creation</mark>

Detailed Mal-Activity Diagrams use the following CEMT stereotypes:

 - [`ThreatModelAction`](./stereotypes.md#threatmodelaction)
   - [`ThreatAction`](./stereotypes.md#threataction)
   - [`DetectionAction`](./stereotypes.md#detectionaction)
 - [`ThreatModelFlow`](./stereotypes.md#threatmodelflow)
   - [`ThreatFlow`](./stereotypes.md#threatflow)
   - [`DetectionFlow`](./stereotypes.md#detectionflow)
 - [`ThreatEnd`](./stereotypes.md#threatend)

### Threat Actions


https://user-images.githubusercontent.com/7237737/180129375-b821794b-79b5-4076-8328-e7339aaaa203.mp4


### Threat Difficulty


https://user-images.githubusercontent.com/7237737/180129383-8d8faaae-19a8-49fa-bf98-1b4fad5cd0b3.mp4


### Detection Actions


https://user-images.githubusercontent.com/7237737/180129398-448faac0-72cd-4571-a897-fe51d74e7134.mp4


### Threat Ends


https://user-images.githubusercontent.com/7237737/180129648-8858f33c-c866-4065-8233-c045d93fa45e.mp4


### Flows


https://user-images.githubusercontent.com/7237737/180129660-3e8ae33c-5b9e-42a4-8f3f-bb849691c2a8.mp4


### Labels


https://user-images.githubusercontent.com/7237737/180129680-d85b2138-7889-4742-8143-aafa275a8728.mp4


### Additional Optional Steps

<mark>Adding multiple ThreatEnds.</mark>

![Detailed Mal-Activity Diagram](/Documentation/Images/detmalact-clean.png)

 > [Return to Modelling Process Flowchart](/README.md#threat-modelling)
