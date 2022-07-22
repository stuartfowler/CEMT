# Threat Mitigation

The threat mitigation stage involves the use of Asset Definition Diagrams and Dependency Matrices to tie the threat paths generated during the threat modelling stage to the Assets within the system and potential security mitigations. The purpose of this activity is to provide traceability between system components, security controls and malicious actions. 

```mermaid
flowchart TB
  subgraph TMi["Threat Mitigation"]
    direction TB
    subgraph 4["Asset Definition Diagrams"]
      4a("System of Interest") --> 4d("Directed Associations")
      4b("Assets") --> 4d
      4c("Contextual Assets") --> 4d
    end
    subgraph 5["Matrices"]
      5b("Security Controls") --> 5c("Security Properties") --> 5g("Implementation Status")
      5d("Link Assets") --> 5c
      5f("Security Constraints") --> 5c
    end
    4 --> 5
  end
```

## Overview

The threat mitigation process requires the allocation of system components and threat mitigations to the threat model developed in the [Threat Modelling](./threat-modelling.md) process. This allows the modeller to describe potential mitigations against the previously identified threat paths, allocate those mitigations to specific system assets and document the implementation state of those mitigations. 

> **Note**: The information contained in this documentation set aims to guide a modeller and provide instructions on how to use the CEMT to produce the necessary views in CAMEO Systems Modeler. The production of an accurate and comprehensive model with appropriate mitigations depends on the cybersecurity expertise and the system knowledge of the modelling team; this documentation simply outlines how to use the CEMT, not how to produce a comprehensive assessment.

## Asset Definition Diagrams

Asset Definition Diagrams provide the ability for the modeller to define a System Breakdown Structure for the system of interest. This creates objects that represent the assets and components within the system and the system context to which security mitigations can be allocated. 

```mermaid
flowchart TB
    subgraph 4["Asset Definition Diagrams"]
        4a("System of Interest") --> 4d("Directed Associations")
        4b("Assets") --> 4d
        4c("Contextual Assets") --> 4d
    end
    click 4a "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#system-of-interest" "System of Interest"
    click 4b "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#assets" "Assets"
    click 4c "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#contextual-assets" "Contextual Assets"
    click 4d "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#directed-associations" "Directed Associations"
```

Asset Definition Diagrams are drawn using a `CEMT Asset Definition Diagram`, which can be created by right clicking on a `Package` in the containment tree, selecting `Create Diagram` from the context menu and then selecting `CEMT Asset Definition Diagram`.

> **Note**: The `CEMT Asset Definition Diagram` is a [Custom Diagram](../README.md#custom-diagrams). You can also create an Asset Definition Diagram using a standard `SysML Block Definition Diagram` and manually apply the stereotypes if you wish. If the system of interest is being developed using MBSE techniques and the CEMT process is being integrated into an existing model you may already have a defined system breakdown structure in the form of a `SysML Block Definition Diagram`. If so you can apply the `System` and `Asset` stereotypes to the existing `Blocks` if you wish, rather than creating new objects and a new hierarchy.

https://user-images.githubusercontent.com/7237737/180377140-f613ddba-a722-4db6-a1e5-df7a7e03c937.mp4

Asset Definition Diagrams use the following CEMT stereotypes:

 - [`Asset`](./stereotypes.md#asset)
 - [`System`](./stereotypes.md#system)
 - [`DirectedAssociation`](./stereotypes.md#directedassociation)

### System of Interest

The first step in developing the Asset Definition Diagram is to insert a [`System`](./stereotypes.md#system) object that represents the system that is being evaluated using the CEMT. This is done by selecting `System of Interest` from the drawing palette and placing it on the diagram.

https://user-images.githubusercontent.com/7237737/180377207-68d1d84a-75a0-4ad4-802e-9b629b8ca3ab.mp4

### Assets

The next step involves creating [`Assets`](./stereotypes.md#asset) that represent the subsystems and components within the system of interest. This is done by selecting `Asset` from the drawing palette and placing them on the diagram.

https://user-images.githubusercontent.com/7237737/180377237-56bf5555-aafc-4415-b91c-97b582edbe58.mp4

### Contextual Assets

The next step requires the modeller to define the contextual assets, which are those assets that are external to the system of interest but play a role in the security of the system because they might implement security mitigations on which the system of interest depends. This is done by selecting `Contextual Asset` from the drawing palette and placing them on the diagram.

https://user-images.githubusercontent.com/7237737/180377260-030fb82e-873d-4c7a-92ef-69a2de420750.mp4

> **Note**: The `Contextual Asset` is not its own stereotype. The contextual assets are still given the [`Asset`](./stereotypes.md#asset) stereotype, but they also have the `isAbstract` property set to `true`. This is indicated on the `CEMT Asset Definition Diagram` by the name of the `Asset` being displayed in *italics*.

### Directed Associations

The final step in developing the Asset Definition Diagram is to link the system of interest, the assets and the contextual assets together into a hierarchy using [`DirectedAssociations`](./stereotypes.md#directedassociation). These are created by selecting `Directed Association` from the drawing palette and drawing them between the objects, starting from the parent and going down to the child.

https://user-images.githubusercontent.com/7237737/180377285-0e9664b4-9b3a-4842-857e-d1b60d2a4aef.mp4

### Additional Optional Steps

The `CEMT Asset Definition Diagram` also shows the controls that are applicable to the `Asset` and their implementation state, once the Threat Mitigation process has been completed. While this information will not be populated onto the model until the steps outlined in the [Matrices](#matrices) section have been completed, it provides a view that can be useful for reviewers once the model has been fully populated. An example of this is shown in the sample diagram below.

![Asset Definition Diagram](/Documentation/Images/add.png)

## Matrices

```mermaid
flowchart TB
    subgraph 5["Matrices"]
        5b("Security Controls") --> 5c("Security Properties") --> 5g("Implementation Status")
        5d("Link Assets") --> 5c
        5f("Security Constraints") --> 5c
    end
     click 5a "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#matrices" "Matrices"
    click 5b "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#matrices" "Matrices"
    click 5c "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#matrices" "Matrices"
    click 5d "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#matrices" "Matrices"
    click 5e "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#matrices" "Matrices"
    click 5f "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#matrices" "Matrices"
    click 5g "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#matrices" "Matrices"
```

![Populated Mal-Activity Diagram](/Documentation/Images/detmalact.png)

 > [Return to Modelling Process Flowchart](/README.md#threat-mitigation)
