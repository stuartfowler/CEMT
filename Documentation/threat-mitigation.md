# Threat Mitigation

The threat mitigation stage involves the allocation of Security Controls and Assets to the threat model developed in the [Threat Modelling](./threat-modelling.md) stage. The purpose of this activity is to describe potential mitigations against the previously identified threat paths, allocate those mitigations to specific system assets and document the implementation state of those mitigations.

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

## Asset Definition Diagrams

```mermaid
flowchart TB
    subgraph 4["Asset Definition Diagrams"]
        4a("System of Interest") --> 4d("Directed Associations")
        4b("Assets") --> 4d
        4c("Contextual Assets") --> 4d
    end
    click 4a "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#asset-definition-diagrams" "Asset Definition Diagrams"
    click 4b "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#asset-definition-diagrams" "Asset Definition Diagrams"
    click 4c "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#asset-definition-diagrams" "Asset Definition Diagrams"
    click 4d "https://github.com/stuartfowler/CEMT/blob/main/Documentation/threat-mitigation.md#asset-definition-diagrams" "Asset Definition Diagrams"
```

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