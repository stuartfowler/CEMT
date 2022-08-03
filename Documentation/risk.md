# Risk Assessment

The threat mitigation stage involves the use of Relationship Maps and Parametric Diagrams to assess the likelihood of a particular threat succeeding. The purpose of this activity is to provide determine a risk rating for key threat paths identified in the earlier stages. Click on the steps in the flowchart below to see additional detail and instructions.

```mermaid
flowchart TB
  subgraph RA["Risk Assessment"]
    direction TB
    subgraph 6["Summary Diagrams"]
      6a("Bowties") --> 6b("Attack Trees")
    end
    subgraph 7["Parametric Diagrams"]
      7a("Threat Path") --> 7b("Threat Level") --> 7e("Simulate")
      7a --> 7c("Initial Probability") --> 7e
      7a --> 7d("Control Effectiveness") --> 7e
    end
    subgraph 8["Risk Table"]
      8a("Description") --> 8b("Simulated Probabilities") --> 8c("Risk Rating")
    end
    6 --> 7 --> 8
  end
```

## Overview

## Summary Diagrams

```mermaid
flowchart TB
  subgraph RA["Risk Assessment"]
    direction TB
    subgraph 6["Summary Diagrams"]
      6a("Bowties") --> 6b("Attack Trees")
    end
  end
  
  click 6a "https://github.com/stuartfowler/CEMT/blob/main/Documentation/risk.md#bowties" "Bowtie Diagrams"
  click 6b "https://github.com/stuartfowler/CEMT/blob/main/Documentation/risk.md#attack-trees" "Attack Tree Diagrams"
```

### Bowties

### Attack Trees

## Parametric Diagrams

```mermaid
flowchart TB
  subgraph RA["Risk Assessment"]
    direction TB
    subgraph 7["Parametric Diagrams"]
      7a("Threat Path") --> 7b("Threat Level") --> 7e("Simulate")
      7a --> 7c("Initial Probability") --> 7e
      7a --> 7d("Control Effectiveness") --> 7e
    end
  end

  click 7a "https://github.com/stuartfowler/CEMT/blob/main/Documentation/risk.md#threat-path" "Threat Paths"
  click 7b "https://github.com/stuartfowler/CEMT/blob/main/Documentation/risk.md#threat-level" "Threat Levels"
  click 7c "https://github.com/stuartfowler/CEMT/blob/main/Documentation/risk.md#initial-probability" "Initial Probability"
  click 7d "https://github.com/stuartfowler/CEMT/blob/main/Documentation/risk.md#control-effectiveness" "Control Effectiveness"
  click 7e "https://github.com/stuartfowler/CEMT/blob/main/Documentation/risk.md#simulate" "Simulation"
```

### Threat Path

### Threat Level

### Initial Probability

### Control Effectiveness

### Simulate

## Risk Table

```mermaid
flowchart TB
  subgraph RA["Risk Assessment"]
    direction TB
    subgraph 8["Risk Table"]
      8a("Description") --> 8b("Simulated Probabilities") --> 8c("Risk Rating")
    end
  end
  
  click 8a "https://github.com/stuartfowler/CEMT/blob/main/Documentation/risk.md#description" "Risk Description"
  click 8b "https://github.com/stuartfowler/CEMT/blob/main/Documentation/risk.md#simulated-probabilities" "Simulated Risk Probabilities"
  click 8c "https://github.com/stuartfowler/CEMT/blob/main/Documentation/risk.md#risk-rating" "Risk Ratings"
```

### Description

### Simulated Probabilities

### Risk Rating

 > [Return to Modelling Process Flowchart](/README.md#risk-assessment)