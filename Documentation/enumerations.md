# Enumerations

## Difficulty

The `Difficulty` enumeration is used as a qualitative rating for the difficulty of a `ThreatAction` irrespective of any mitigating controls that are in place.

The enumeration options are:
 - Trivial;
 - Low;
 - Medium;
 - High; and
 - Extreme.

These qualitative ratings impact the quantitative residual risk calculation in the simulation of a `SecurityRisk`. You can review and/or modify the transforms between the `Difficulty` enumeration and the quantitative risk calculations in the [`Difficulty`](./constraints.md#difficulty) constraint block. The absolute definition of each `Difficulty` rating is not as important, as the modeller has the ability to define how the quantitative calculations are derived from these ratings. It is more important that your relative ratings between `ThreatAction`s are consistent.

## Likelihood

The `Likelihood` enumeration is used as a qualitative rating for the likelihood of a `SecurityRisk` being realised.

The enumeration options are:
 - Negligible - there is no indication of any threat to the system, and action is assessed as very unlikely;
 - Very Low - credible intelligence indicates that threat sources have little capability or intent to target the system, and action is assessed as unlikely;
 - Low - credible intelligence indicates that the system is a possible target of threat sources with limited intent or limited capability, and action is assessed as possible but not expected;
 - Medium - credible intelligence indicates that the system is a potential target of threat sources with an intention and capability, and action is assessed as feasible and could well occur;
 - High - credible intelligence indicates a current intention and capability to conduct action against the system, and action is assessed as likely; and
 - Extreme - credible specific intelligence indicates a current intention, capability and planning to conduct an action against the system, and action is certain.

These qualitative ratings are based on the 6x6 security risk matrix reproduced [here](./risk.md#risk-rating).

## Consequence

The `Consequence` enumeration is used as a qualitative rating for the consequence of a `SecurityRisk` being realised.

The enumeration options are:
 - Minimal - no effect on capability and impacts can be handled with local resources;
 - Minor - limited effect on capability to carry out an organisation's function;
 - Moderate - damage reducing but not denying availability of a function;
 - Major - partial loss of, or damage to, a capability for which alternative solutions are readily available;
 - Severe - substantial loss ro damage to a key capability which can not be replaced for a protraqcted period; and
 - Catastrophic - loss of key operational capability sufficient to disrupt an organisation's delivery of outcomes for a protracted period.

These qualitative ratings are based on the 6x6 security risk matrix reproduced [here](./risk.md#risk-rating). The summary description of each consequence rating above is based on a loss of capability, but similar rating levels can be derived for a confidentiality or integrity loss.

## Implementation

The `Implementation` enumeration is used to capture the implementation status of a `SecurityProperty`.

The enumeration options are:
 - Implemented;
 - Not Implemented;
 - Partially Implemented; and
 - Not Assessed.

The default value for this enumeration is `Not Assessed`, and active validation constraints are used to highlight where this field has not been set.

## Risk

The `Risk` enumeration is used as a qualitative rating for the overall risk of a `SecurityRisk` being realised, derived from a combination of the `Likelihood` and `Consequence`.

The enumeration options are:
 - Low - risk is acceptable given the mitigation strategies in place, no additional controls or resources are required;
 - Moderate - risk is acceptable given the mitigation strategies in place, additional controls could be considered and additional resources may be required;
 - Significant - risk should be managed by mitigation strategies as resources allow, additional controls could be considered and additional resources may be required;
 - High - risk is probably too high and should be promptly managed by mitigation strategies, additional controls and resources are required; and
 - Extreme - risk is too high and must be immediately managed by mitigation strategies, additional controls and resources are urgently required.

These qualitative ratings are based on the 6x6 security risk matrix reproduced [here](./risk.md#risk-rating).

## Threat

The `Threat` enumeration is used to capture the capability of a threat actor used in a `SecurityRisk` simulation.

The enumeration options are:
 - Novice;
 - Intermediate;
 - Activist; and
 - Nation State.

These qualitative ratings impact the quantitative residual risk calculation in the simulation of a `SecurityRisk`. You can review and/or modify the transforms between the `Threat` enumeration and the quantitative risk calculations in the [`Difficulty`](./constraints.md#difficulty) constraint block.

## Maturity

The `Maturity` enumeration is used to identify the phase of the system development process during which the risk assessment is being conducted. 

The enumeration options are:
 - Proposed;
 - Designed; and
 - Verified.

These ratings are used to determine which [Implementation Status](./threat-mitigation.md#implementation-status) is used during the risk assessment process and which risk results are displayed in the [Risk Summary Table](./risk.md#risk-assessment-tables).
