# Threat Modelling

The threat modelling stage involves the use of Misuse Case Diagrams and Mal-Activity Diagrams to model the way threat actors interact with the attack surface to achieve their malicious intent. The purpose of this activity is to enumerate the paths that an attacker must take to compromise the system.

## Overview

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

## Misuse Case Diagrams

![Misuse Case Diagram](/Documentation/Images/misuse.png)

```mermaid
flowchart TB
    subgraph 1["Misuse Case Diagrams"]
      direction LR
      1a("Misuse Cases") --> 1c("Associations")
      1b("Actors") --> 1c
    end
```

## Intermediate Mal-Activity Diagrams

![Intermediate Mal-Activity Diagram](/Documentation/Images/intmalact.png)

## Detailed Mal-Activity Diagrams

![Detailed Mal-Activity Diagram](/Documentation/Images/detmalact.png)

 > [Return to Modelling Process Flowchart](/README.md#threat-modelling)