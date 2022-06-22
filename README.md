# Cyberworthiness Evaluation and Management Toolkit (CEMT)

## Contents

 - [Background](#background)

   - [Cyberworthiness](#cyberworthiness)

 - [Summary](#summary)

 - [Installation](#installation)

 - [Examples](#examples)

## Background

CEMT is a tool for developing cyberworthiness assessments of complex systems. It has been created as part of a Higher Degree by Reserach (HDR) through the University of New South Wales (UNSW) Canberra to address the need for a consistent and comprehensive approach for assessing the cyberworthiness of complex systems within the Australian Government Department of Defence. Traditional cybersecurity assessment methodologies that leverage lists of mitigation strategies that have been compiled from historical best practice are important tools for hardening engineered systems, but their usefulness is limited when applied to bespoke systems that do not share the same operational profile or environmental context of the systems from which these best practices were derived. The CEMT provides a first-principles approach to evaluating the cyberworthiness of a system, facilitating a transparent and explainable risk assessment which inherently scoped to the context of the system being evaluated. This delivers a comprehensive justification that can underpin a claim of cyberworthiness with the necessary level of engineering assurance.

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

## Summary



 - What is it used for
 - High Level Process

## Installation

The CEMT is distributed as an importable profile for [CAMEO Systems Modeler](https://www.3ds.com/products-services/catia/products/no-magic/cameo-systems-modeler/), which is a commercially available MBSE environment. The CEMT requires a licensed install of CAMEO Systems Modeler to function.

The simulated risk assessment portion of the CEMT also requires the [CAMEO Simulation Toolkit](https://www.3ds.com/products-services/catia/products/no-magic/cameo-simulation-toolkit/) which is a feature of CAMEO System Modeler that is included as part of the *Enterprise Edition* of CAMEO Systems Modeler - it is not included in the entry level *Architect Edition*. Without this feature installed, there may be unexpected errors in some of the CEMT functionality.

The CEMT is can be installed by copying the `Cyber_Profile.mdzip` file into the `profiles` directory of your CAMEO install directory (this defaults to `C:\Program Files\Cameo Systems Modeler\profiles\`). Once the mdzip file has been placed into the `profiles` folder, you should be able to import the model via the Options > Project Usages menu, as shown in the video below. It is recommended that you import the profile as Read-Only to prevent accidental modification of the library.

https://user-images.githubusercontent.com/7237737/174941526-18245b64-b436-40c3-be4a-6464bf09f30f.mp4

This imports all of the necessary stereotypes and attributes of the CEMT, as well as macros it relies upon. The source code for these JavaScript macros is captured in this GitHub repo, but can also be viewed inside CAMEO itself if you would like to validate it.

> Note: You will also need to ensure that `SimulationProfile.mdzip` is also imported into your project. This comes as part of the CAMEO Simulation Toolkit, and it should default into the same default `profiles` directory. Just follow the same process as used to import `Cyber_Profile.mdzip` but scroll down until you find `SimulationProfile.mdzip`.

<mark>Diagrams</mark>

## Examples

<mark>Threat Model Example</mark>

## Usage

 - Detailed walkthrough for creating diagram suite

### Misuse Cases

 - Animated gifs and instructions

### Mal-Activity Diagram

 - Animated gifs and instructions
 
### Matrices

 - Animated gifs and instructions
 
### Summary Diagrams

 - Animated gifs and instructions
 
### Risk Assessments

 - Animated gifs and instructions
 
## Stereotype Details
<mark>Add links to detailed documentation for each stereotype in the Cyber_Profile</mark>
