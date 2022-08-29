# Macros

## Activities

This macro is used to check that the activities that define `AggregatedAction`s are correctly stereotyped as `MalActivity`s. It is primarily used during the [Detailed Mal-Activity Diagrams](../Documentation/threat-modelling.md#detailed-mal-activity-diagrams) step of the threat modelling phase. It can also be used if the modeller wants to change the name of a `ThreatInput` or `ThreatOutput` pin as the macro will update all the related elements to ensure the expected behaviour of having the `ActivityParameterNode`s having a consistent name with the pins.

Specifically, the macro performs the following steps:
 - Check whether the activity that defines the behaviour of an `AggregatedAction` is stereotyped as a `MalActivity`
   - If it is not, set the `MalActivity` stereotype
 - Check if the relevant `MisuseCase` is the `Owner` of the `MalActivity`
   - If it is not, set the `MisuseCase` as the `Owner`
 - Check if the `MalActivity` name matches the `AggregatedAction`
   - If it is not, set the `MalActivity` name to match the `AggregatedAction`
 - Ensure that all `ActivityParameterNode`s within the `MalActivity` are set as a Control Type
 - Ensure that the `Pin`s, `Parameter`s and `ActivityParameterNode`s have matching names, with the `Pin` determining the desired name

If one of more `AggregatedAction` is selected in the containment tree, only those actions are processed.

When nothing is selected in the containment tree, all `AggregatedAction`s in the model are processed. 

## Controls

This macro is used to create `SecurityProperty`s from the `Asset`s and `SecurityControl`s allocated to `ThreatAction`s and `DetectionAction`s. It also creates `SecurityProperty`s from the `SecurityConstraint`s allocated to `Asset`s. It is primarily used during the [Security Properties](../Documentation/threat-mitigation.md#security-properties) step of the threat mitigation phase.


Specifically, the macro performs the following steps:
 - Check if the `ThreatAction` or `DetectionAction` has linked `Asset`s and `SecurityControl`s
   - If so, create a `SecurityProperty` owned by the `Asset` which is typed by the `SecurityControl`
     - Set the `SecurityProperty`s Implementation Status to `Not Assessed`
   - In the case where a [`NoneControl`](../Documentation/stereotypes.md#nonecontrol) is linked, create a `SecurityProperty` under the [`System`](../Documentation/stereotypes.md#system) block typed as the `NoneControl`
     - Set this `SecurityProperty`s Implementation Status to `Not Implemented`
 - Check if the `SecurityConstraint` has any applicable `Asset`s
   - If so, create a `SecurityProperty` owned by the `Asset` which is typed by the `SecurityConstraint`
     - Set the `SecurityProperty`s Implementation Status to `Not Assessed`
   - In the case where a [`NoneAsset`](../Documentation/stereotypes.md#noneasset) is linked, skip this `SecurityConstraint`

If one of more `ThreatAction`, `DetectionAction` or `SecurityConstraint` is selected in the containment tree, only those actions and constraints are processed.

When nothing is selected in the containment tree, all `ThreatAction`s, `DetectionAction`s and `SecurityConstraint`s in the model are processed. 

## Filter

This macro is used to quickly manipulate the filters for the [Summary Diagrams](../Documentation/risk.md#summary-diagrams) by adding the selected `Asset`s, `ThreatAction`s, `ThreatImpactSignal`s and/or `MisuseCase`s to the appropriate filters for the Bowtie Diagrams and Attack Trees. This macro can be used as a shortcut when added objects to these filters instead of dragging and dropping the object in the model.

Specifically, the macro performs the following steps:
 - If an `Asset` is selected, add it to the Asset Filter
 - If a `ThreatAction` is selected, add it to the Action Filter
 - If a `ThreatImpactSignal` is selected, add it to the Impact Filter
 - If a `MisuseCase` is selected, add it to the Misuse Case Filter

If one of more `Asset`, `ThreatAction`, `ThreatImpactSignal` or `MisuseCase` is selected in the containment tree, only those assets, actions, signals and misuse cases are processed and added to their respective filters.

When nothing is selected in the containment tree, the script will not make any modifications. 

## Misuse

This macro ensures that activities under `MisuseCase`s are appropriate stereotyped as `MalActivity`s. It is primarily used during the [Intermediate Mal-Activity Diagrams](../Documentation/threat-modelling.md#intermediate-mal-activity-diagrams) step of the threat modelling phase. 

Specifically, the macro performs the following steps:
 - Check whether the activity that defines the behaviour of a `MisuseCase` is stereotyped as a `MalActivity`
   - If it is not, set the `MalActivity` stereotype
 - Check if the `MisuseCase` is the `Owner` of the `MalActivity`
   - If it is not, set the `MisuseCase` as the `Owner`
 - Check if the `MalActivity` name matches the `MisuseCase`
   - If it is not, set the `MalActivity` name to match the `MisuseCase`

If one of more `MisuseCase` is selected in the containment tree, only those misuse cases are processed.

When nothing is selected in the containment tree, all `MisuseCase`s in the model are processed. 

## Properties

This macro updates Security Properties to ensure they fit the "\<Asset Name\> - \<Control Name\>" format.

This macro is not required during the normal modelling process, but should be run if the modeller changes the name of a `SecurityControl` or an `Asset` to ensure that the name of the `SecurityProperty`s remain consistent.

If one of more `SecurityProperty` is selected in the containment tree, only those properties are processed.

When nothing is selected in the containment tree, all `SecurityProperty`s in the model are processed. 

## Risk

This macro is used to create risk assessment simulations for a given attack tree path. When a full branch of the attack tree is selected in the containment tree, a SysML Parametric Diagram will be generated, along with a simulation for that parametric diagram. It is primarily used during the [Parametric Risk Diagrams](../Documentation/risk.md#parametric-risk-diagrams) step of the risk phase.

Specifically, the macro performs the following steps:
 - Create a `SecurityRisk` and an associated SysML Parametric Diagram
 - Create and draw the [`InitialProbability`](../Documentation/stereotypes.md#initialprobability) value property
 - Create and draw the [`ThreatLevel`](../Documentation/stereotypes.md#threatlevel) value property, the [`Difficulty`](../Documentation/stereotypes.md#difficultyconstraint) constraint property and the associated value properties for the Difficulty levels
 - For each `ThreatAction` in the threat path
    - Create and draw the [`Threat`](../Documentation/stereotypes.md#threatconstraint) constraint block
    - Create and draw the [`MitigationControlEffectiveness`](../Documentation/stereotypes.md#mitigationcontroleffectiveness) value property
    - Draw the `SecurityProperty`s associated with the `ThreatAction`
 - For each `DetectionAction` associated with the threat path
    - Create and draw the [`Detect`](../Documentation/stereotypes.md#detectconstraint) constraint block
    - Create and draw the [`DetectionControlEffectiveness`](../Documentation/stereotypes.md#detectioncontroleffectiveness) value property
    - Draw the `SecurityProperty`s associated with the `DetectionAction`
 - Create and draw the [`ResidualProbability`](../Documentation/stereotypes.md#residualprobability) value property
 - Create and draw the [`Difficulty`](../Documentation/stereotypes.md#difficultyconstraint) constraint block
 - Create and draw the [`DetectionProbability`](../Documentation/stereotypes.md#detectionprobability) value property
 - Link up all of the objects with binding connectors to allow the parameters to propagate through the parametric diagram
 - Create a simulation associated with the parametric diagram

To run the macro, a `ThreatStart`, `ThreatImpactSignal` and a series of `ThreatAction`s that form a complete branch of the attack tree must be selected in the containment tree. This can be achieved by selecting all of those nodes in the attack tree and then pressing `Alt + B` to select those objects in the containment tree. 

