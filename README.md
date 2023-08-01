# Cyberworthiness Evaluation and Management Toolkit (CEMT)

## Background

CEMT is a tool for developing cyberworthiness assessments of complex systems. It has been created as part of a Higher Degree by Reserach (HDR) through the University of New South Wales (UNSW) Canberra to address the need for a consistent and comprehensive approach for assessing the cyberworthiness of complex systems within the Australian Government Department of Defence. 

Traditional cybersecurity assessment methodologies that leverage lists of mitigation strategies that have been compiled from historical best practice are important tools for hardening engineered systems, but their usefulness is limited when applied to bespoke systems that do not share the same operational profile or environmental context of the systems from which these best practices were derived. The CEMT provides a first-principles approach to evaluating the cyberworthiness of a system, facilitating a transparent and explainable risk assessment which is inherently scoped to the context of the system being evaluated. This delivers a comprehensive justification that can underpin a claim of cyberworthiness with the necessary level of engineering assurance.

### Cyberworthiness

Cyberworthiness is the ability for a system to continue to operate safely and effectively in a contested cyber environment. Given this explicit focus on continued operation, it has an inherent bias towards ensuring the integrity and availability of the system and its functions when faced with a cyber threat.

The inclusion of the worthiness construct is a reference to the established technical assurance frameworks that underpin concepts such as airworthiness and seaworthiness. This requires a level of rigour in the engineering analysis that provides confidence and assurance that the claim of worthiness is accurate, complete and supported by evidence. The primary guiding principles that were adopted for the development of the CEMT are based on the *Principles for Governance of Seaworthiness* from the [Defence Seaworthiness Management System Manual](https://www.defence.gov.au/sites/default/files/2021-01/SeaworthinessMgmtSystemManual.pdf):

> 2.10 The seaworthiness governance principles require that seaworthiness decisions are made:
> 
> a. **mindfully** – decisions are more effective and less likely to have unintended consequences when they are made with a thorough understanding of the context, the required outcome, the options available, and their implications now and in the future
>
> b. **collaboratively** – obtaining input from all stakeholders and engaging in joint problem-solving results in better decisions (bearing in mind that collaboration does not necessarily require consensus)
> 
> c. **accountably** – decisions only become effective when people take accountability for making them happen
>
> d. **transparently** – decisions are more effective when everyone understands what has been decided and why.

CEMT approaches cyberworthiness from the perspective that the overall objective is to create a cybersecurity evaluation for mission critical and safety critical systems that are mindful of the context in which the system is operating, is intuitive enough to facilitate collaboration between all stakeholders, is understandable by key decisions makers so that they can reasonably take accountability for their decisions and is transparent in terms of how the conclusions trace to the analysis.

## Installation

### Dependencies

The CEMT is distributed as an importable profile for [CAMEO Systems Modeler](https://www.3ds.com/products-services/catia/products/no-magic/cameo-systems-modeler/), which is a commercially available MBSE environment. The CEMT requires a licensed install of CAMEO Systems Modeler to function.

The simulated risk assessment portion of the CEMT also requires the [CAMEO Simulation Toolkit](https://www.3ds.com/products-services/catia/products/no-magic/cameo-simulation-toolkit/) which is a feature of CAMEO System Modeler that is included as part of the *Enterprise Edition* of CAMEO Systems Modeler - it is not included in the entry level *Architect Edition*. Without this feature installed, there may be unexpected errors in some of the CEMT functionality.

> The latest releases of the CEMT are now supported for CATIA Magic Cyber Systems Engineer from version 2022x as the product is being rebranded from CAMEO Systems Modeler. CATIA Magic Cyber Systems Engineer with the CATIA Magic Model Analyzer plugin include all of the necssary modules to use the CEMT.

### Install as Plugin Package

The [releases](https://github.com/stuartfowler/CEMT/releases) page hosts the self-contained plugins which can be imported into the Resource Manager of CAMEO Systems Modeler.

These plugin packages can be installed by downloading the .zip file contained in a particular release, selecting `Help -> Resource/Plugin Manager` menu in CAMEO System Modeler, clicking `Import` and then selecting the .zip file you downloaded from the relase page.

This will automatically install the following resources:
 - `Cyber_Profile.mdzip`, the latest ISM profile and the profile for Australian Government Data Markings will be installed into your local `profiles` directory;
 - `CEMT_sample.mdzip` will be installed into your local `samples` directory;
 - the [Custom CEMT Diagrams](#custom-diagrams) will be installed into your local CAMEO environment; and
 - a CEMT_template will be installed into your local `template` directory.

You will need to restart your CAMEO application, as prompted, to complete the install.

> The `Data Markings and Classification` plugin is a pre-requisite for the CEMT. This is a standard plugin that is distributed with CATIA Magic Cyber Systems Engineer, but it is not enabled by default. This plugin must be enabled is the Plugin Manager.

https://user-images.githubusercontent.com/7237737/188266915-c1b44035-d83e-4245-95e4-c5560ff38c44.mp4

#### Quick Start with a Template

Installing the plugin will also install a template that can be used as a quick start for a new model. When creating a new project, the `CEMT_template.mdzip` can be selected from the default template directory. This completes some of the basic steps in setting up a project from scratch, including:
 - Including the `Cyber_Profile` and `Simulation` profiles into the project;
 - Copying the necessary Macros, Summary Diagrams and Matrices from the `Cyber_Profile` into the local project;
 - Creating a navigation `Content Diagram` for easy access to common views;
 - Creating a suggested package hierarchy to organise the model; and
 - Creating a blank `CEMT Asset Definition Diagram` and `CEMT Misuse Case Diagram` to get you started.

https://user-images.githubusercontent.com/7237737/188266737-f5af546d-4f19-454c-8ab6-19d3e25f35c0.mp4

> **Note**: Many of the steps and tutorials in this documentation set show how to build a model from scratch. If you start from this template, several of the steps will have already been done for you, and there is no need to repeat them. Crucially though, the template does not automatically include any optional [ISM Profiles](#information-security-manual-ism). These must still be manually including if you wish to use them.

### Install from Source

The CEMT can be installed manually from source by copying the `Cyber_Profile.mdzip` file into the `profiles` directory of your CAMEO install directory (this defaults to `C:\Program Files\Cameo Systems Modeler\profiles\`). Once the mdzip file has been placed into the `profiles` folder, you should be able to import the model via the Options > Project Usages menu, as shown in the video below. It is recommended that you import the profile as Read-Only to prevent accidental modification of the library.

https://user-images.githubusercontent.com/7237737/174941526-18245b64-b436-40c3-be4a-6464bf09f30f.mp4

This imports all of the necessary stereotypes and attributes of the CEMT, as well as macros it relies upon. The source code for these JavaScript macros is captured in this GitHub repo, but can also be viewed inside CAMEO itself if you would like to validate it. These documentation for these macros can be found at these locations:
 - [Activities.js](./Macros/README.md#activities)
 - [Controls.js](./Macros/README.md#controls)
 - [Filter.js](./Macros/README.md#filter)
 - [Misuse.js](./Macros/README.md#misuse)
 - [Properties.js](./Macros/README.md#properties)
 - [Risk.js](./Macros/README.md#risk)

A short description of what each of these macros does can be found in the header of the macro source code.

There are also anumber of standard tables, matrices and summary diagrams that must be copied across from the Cyber profile into the model you are creating, as shown below.

https://user-images.githubusercontent.com/7237737/177059450-a97e0c5d-5020-4f10-9a62-4c394498e6b6.mp4

> **Note**: You will also need to ensure that `SimulationProfile.mdzip` is also imported into your project. This comes as part of the CAMEO Simulation Toolkit, and it should default into the same default `profiles` directory. Just follow the same process as used to import `Cyber_Profile.mdzip` but scroll down until you find `SimulationProfile.mdzip`.

#### Custom Diagrams

While the CEMT supports models being created with the the standard SysML Use Case Diagrams, Activity Diagrams, Block Definition Diagrams, Parametric Diagrams and Relation Maps, custom variants of these diagrams have been created with modified drawing pallettes to simplify the process of developing a cyberworthiness model. 

These diagrams can be found at these locations:
 - [CEMT Asset Definition Diagram](./Diagrams/CEMT%20Asset%20Definition%20Diagram%20descriptor.xml) - Can be used to define Asset hierarchies instead of using the standard SysML Block Definition Diagrams.
 - [CEMT Mal-Activity Diagram](./Diagrams/CEMT%20Mal-Activity%20Diagram%20descriptor.xml) - Can be used to model threat and detection flows instead of using the standard SysML Activity Diagrams.
 - [CEMT Misuse Case Diagram](./Diagrams/CEMT%20Misuse%20Case%20Diagram%20descriptor.xml) - Can be used to model misuse cases instead of using the standard SysML Use Case Diagrams.
 - [CEMT Parametric Risk Diagram](./Diagrams/CEMT%20Parametric%20Risk%20Diagram%20descriptor.xml) - Can be used to model security risks instead of using the standard SysML Parametric Risk Diagrams.
 - [CEMT Attack Tree - Forward](./Diagrams/CEMT%20Attack%20Tree%20-%20Forward%20Diagram%20descriptor.xml) - Can be used to create custom attack trees instead of using the built-in attack tree using SmartPackages.
 - [CEMT Attack Tree - Reverse](./Diagrams/CEMT%20Attack%20Tree%20-%20Reverse%20Diagram%20descriptor.xml) - Can be used to create custom attack trees instead of using the built-in attack tree using SmartPackages.
 - [CEMT Mitigation Tree](./Diagrams/CEMT%20Mitigation%20Tree%20Diagram%20descriptor.xml) - Can be used to create custom mitigation trees instead of using the built-in mitigation tree using SmartPackages.

The diagrams can be imported into your model in the following manner:

https://user-images.githubusercontent.com/7237737/177089770-5f734733-ed71-44fe-a073-71a4f998a2b1.mp4

#### Information Security Manual (ISM)

While the CEMT primarily implements a first-principles threat modelling approach, rather than one built upon compliance to best-practice mitigation lists, it does also accommodate those assessments if a hybrid approach is desired by the assessor. This has initially been implemented for the Information Security Manual (ISM) that is published by the Australian Cyber Security Centre (ACSC). The `ISM_MMM-YYYY_Profile.mdzip` files contain profiles that include the entire list of ISM controls imported as a set of objects that can be incorporated into the CEMT. These can be imported into a project in the same way described above for the main CEMT package.

It is recommended that once you import the profile, you copy and paste the contents across into your model and then remove the profile. The attributes and stereotypes that are relied upon by these ISM controls are already contained within the main CEMT package, so there is no need to keep it loaded at all times. 

## Modelling Process

The high-level process to be taken through the modelling process is fairly standard. It begins with a Threat Modelling activity, then a Threat Mitigation step and finally a Risk Assessment. 

```mermaid
flowchart LR
1("Threat Modelling") --> 2("Threat Mitigation") --> 3("Risk Assessment")
click 1 "https://github.com/stuartfowler/CEMT#threat-modelling" "Threat Modelling"
click 2 "https://github.com/stuartfowler/CEMT#threat-mitigation" "Threat Mitigation"
click 3 "https://github.com/stuartfowler/CEMT#risk-assessment" "Risk Assessment"
```

The CEMT is primarily focused on providing a high level of assurance for the likelihood of a given threat or risk. It does not aid in the identification of risks or threats and it does not assist in determining the consequence of that risk or threat being realised. The top level threats to the system need to be determined and captured in the model, but the CEMT does not provide any tools, techniques or guidance to assist in the identification of these threats. There are a number of existing threat identification methods that can be used to generate a list of top level threats to the system you are evaluating. Similarly, the consequence of a particular risk or threat is captured in the tool, but the focus of the CEMT is in determining the likelihood of a risk, not the consequence. A criticality assessment should be conducted on each asset to inform the consequence of a risk or threat to that asset. 

The focus on providing assurance of the likelihood value is a deliberate choice. Discussions regarding criticality and consequence of cybersecurity risks are typically less opaque and less subjective, while top level threats to most systems are typically well documented in best-practice literature and therefore reasonably well understood. Traditionally, it is the likelihood determination where there is most subjectivity and opaque reasoning, and hence this determination is the primary focus of the CEMT.

### [Threat Modelling](./Documentation/threat-modelling.md)

The threat modelling stage involves the use of Misuse Case Diagrams and Mal-Activity Diagrams to model the way threat actors interact with the attack surface to achieve their malicious intent. The purpose of this activity is to enumerate the paths that an attacker must take to compromise the system. Click on the links below to see additional detail and instructions:

 - [Misuse Case Diagrams](./Documentation/threat-modelling.md#misuse-case-diagrams)
 - [Intermediate Mal-Activity Diagrams](./Documentation/threat-modelling.md#intermediate-mal-activity-diagrams)
 - [Detailed Mal-Activity Diagrams](./Documentation/threat-modelling.md#detailed-mal-activity-diagrams)

```mermaid
flowchart TB
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
```

### [Threat Mitigation](./Documentation/threat-mitigation.md)

The threat mitigation stage involves the use of Asset Definition Diagrams and Dependency Matrices to tie the threat paths generated during the threat modelling stage to the Assets within the system and potential security mitigations. The purpose of this activity is to provide traceability between system components, security controls and malicious actions. Click on the links below to see additional detail and instructions.

 - [Asset Definition Diagrams](./Documentation/threat-mitigation.md#asset-definition-diagrams)
 - [Security Mitigations](./Documentation/threat-mitigation.md#security-mitigations)
 - [Dependency Matrices](./Documentation/threat-mitigation.md#dependency-matrices)

```mermaid
flowchart TB
    direction TB
    subgraph 4["Asset Definition Diagrams"]
      4a("System of Interest") --> 4d("Directed Associations")
      4b("Assets") --> 4d
      4c("Contextual Assets") --> 4d
    end
    subgraph 6["Security Mitigations"]
      6a("Security Controls")
      6c("Security Constraints")
    end
    subgraph 5["Dependency Matrices"]
      5d("Link Assets") --> 5c("Security Properties") --> 5g("Implementation Status")
      5b("Link Controls") --> 5c
      5f("Link Constraints") --> 5c
    end
    4 --> 6 --> 5
```

### [Risk Assessment](./Documentation/risk.md)

The risk assessment stage involves the use of Relationship Maps and Parametric Diagrams to assess the likelihood of a particular threat succeeding. The purpose of this activity is to provide determine a risk rating for key threat paths identified in the earlier stages. Click on the links below to see additional detail and instructions.

 - [Summary Diagrams](./Documentation/risk.md#summary-diagrams)
 - [Parametric Risk Diagrams](./Documentation/risk.md#parametric-risk-diagrams)
 - [Risk Assessment Tables](./Documentation/risk.md#risk-assessment-tables)

```mermaid
flowchart TB
    direction TB
    subgraph 6["Summary Diagrams"]
      6c("Mitigation Trees")
      6b("Attack Trees")
      6a("Bowties")
    end
    subgraph 7["Parametric Risk Diagrams"]
      7a("Threat Path") --> 7b("Threat Level") --> 7e("Simulate")
      7a --> 7c("Initial Probability") --> 7e
      7a --> 7d("Control Effectiveness") --> 7e
    end
    subgraph 8["Risk Assessment Tables"]
      8a("Risk Lists")
      8b("Risk Summary")
    end
    6 --> 7 --> 8
```

## Samples

A [sample threat model](./sample/CEMT_sample.mdzip) can be found in this GitHub repository. It contains an example of the CEMT being applied against a generic system. The example is incomplete, providing detail primarily in the Insider Threat misuse case, but this misuse case does contain an instantiation of most of the functionality in the CEMT.

> **Note**: This sample threat model uses the optional [Custom Diagrams](#custom-diagrams). You will get a number of non-breaking errors if you load the sample model without first importing the custom diagrams.
