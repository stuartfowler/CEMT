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
      2a("Aggregated Actions") --> 2b("Pins") --> 2e("Flows") --> 2f("Labels")
      2c("Threat Start") --> 2d("Signals") --> 2e      
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

Misuse Case Diagrams use the following CEMT stereotypes:

 - [Misuse Cases](./stereotypes.md#misuse-case)
 - [Actors](./stereotypes.md#actor)
 - [Associations](./stereotypes.md#association)

```mermaid
flowchart TB
    subgraph 1["Misuse Case Diagrams"]
      direction LR
      1a("Misuse Cases") --> 1c("Associations")
      1b("Actors") --> 1c
    end
    click 1a "https://github.com/stuartfowler/CEMT/blob/main/Documentation/stereotypes.md#misuse-case" "Misuse Case Stereotype"
    click 1b "https://github.com/stuartfowler/CEMT/blob/main/Documentation/stereotypes.md#actor" "Actor Stereotype"
    click 1c "https://github.com/stuartfowler/CEMT/blob/main/Documentation/stereotypes.md#association" "Association Stereotype"
```

Misuse Case Diagrams are drawn using the `CEMT Misuse Case Diagram`, which can be created inside a `Package` in the containment tree.

> **Note**: The `CEMT Misuse Case Diagram` is a [Custom Diagram](../README.md#custom-diagrams). You can also create a Misuse Case Diagram using a standard `SysML Use Case Diagram` and manually apply the stereotypes if you wish.

The diagrams are created by placing the [Actors](./stereotypes.md#actor) and [Misuse Cases](./stereotypes.md#misuse-case), naming them appropriately and then connecting them together using the Association relationship. This is shown in the video snippet below.

https://user-images.githubusercontent.com/7237737/177487459-e7660d65-c24c-4d7c-ab7b-ba983d8c70a6.mp4

The CEMT includes a `Mis-use Case` legend, which will apply the appropriate colouring and adornments. Additional [Actors](./stereotypes.md#actor) and [Misuse Cases](./stereotypes.md#misuse-case) can be drawn on the same misuse case diagram until a full picture of the top level threats to the system has been created.

![Misuse Case Diagram](/Documentation/Images/misuse.png)

 > [Return to Modelling Process Flowchart](/README.md#threat-modelling)

## Intermediate Mal-Activity Diagrams

![Intermediate Mal-Activity Diagram](/Documentation/Images/intmalact.png)

```mermaid
flowchart TB
    subgraph 2["Intermediate Mal-Activity Diagrams"]
      direction LR
      2a("Aggregated Actions") --> 2b("Pins") --> 2e("Flows") --> 2f("Labels")
      2c("Threat Start") --> 2d("Signals") --> 2e      
    end
```

 > [Return to Modelling Process Flowchart](/README.md#threat-modelling)

## Detailed Mal-Activity Diagrams

![Detailed Mal-Activity Diagram](/Documentation/Images/detmalact.png)

```mermaid
flowchart TB
    subgraph 3["Detailed Mal-Activity Diagrams"]
      direction LR
      3a("Threat Actions") --> 3c("Threat Difficulty") --> 3d("Flows") --> 3f("Labels")
      3b("Detection Actions") --> 3d
      3e("Threat Ends") --> 3d
    end
```

 > [Return to Modelling Process Flowchart](/README.md#threat-modelling)
