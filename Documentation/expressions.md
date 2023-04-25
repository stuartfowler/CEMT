# Derived Property Expressions

## NextThreatAction

This derived property traverses the relationships created in the CEMT Mal-Activity Diagrams to identify the next `ThreatAction`s in the attack tree.

`NextThreatAction` contains seventy-seven expressions using metachain navigation:
 - Direct - which identifies the `ThreatFlow` leaving the current node and the `Target` of that `ThreatFlow`;
 - Direct-DownOne - which also traverses a `ThreatInput` pin to return the `Target` of the first `ThreatFlow` within an `AggregatedAction`;
 - Direct-DownTwo - which traverses two levels of `AggregatedAction` before returning the `Target` of the first `ThreatFlow` within the `AggregatedAction`;
 - Direct-DownThree - which traverses three levels of `AggregatedAction` before returning the `Target` of the first `ThreatFlow` within the `AggregatedAction`;
 - Direct-DownFour - which traverses four levels of `AggregatedAction` before returning the `Target` of the first `ThreatFlow` within the `AggregatedAction`;
 - Direct-DownFive - which traverses five levels of `AggregatedAction` before returning the `Target` of the first `ThreatFlow` within the `AggregatedAction`;
 - Direct-Through-Direct - which acts like the Direct expression, but also traverses a `ThreatSendSignal` to associated `ThreatAcceptEvent`s before returning the `Target` of the `ThreatFlow`;
 - Direct-Through-DownOne - which acts like a combination of the Direct-Through-Direct expression and the Direct-DownOne expression;
 - Direct-Through-DownTwo - which acts like a combination of the Direct-Through-Direct expression and the Direct-DownTwo expression;
 - Direct-Through-DownThree - which acts like a combination of the Direct-Through-Direct expression and the Direct-DownThree expression;
 - Direct-Through-DownFour - which acts like a combination of the Direct-Through-Direct expression and the Direct-DownFour expression;
 - Direct-Through-DownFive - which acts like a combination of the Direct-Through-Direct expression and the Direct-DownFive expression;
 - UpOne-Direct - which traverses a `ThreatOutput` pin from inside an `AggregatedAction` to return the `Target` of the first `ThreatFlow` connected to that `ThreatOutput` pin;
 - UpOne-ThreatImpact - which acts like the UpOne-Direct expression, but also checks if the `Target` is a `ThreatImpact` and if so, returns its `Signal`;
 - UpOne-DownOne - which acts like a combination of the UpOne-Direct expression and the Direct-DownOne expression;
 - UpOne-DownTwo - which acts like a combination of the UpOne-Direct expression and the Direct-DownTwo expression;
 - UpOne-DownThree - which acts like a combination of the UpOne-Direct expression and the Direct-DownThree expression;
 - UpOne-DownFour - which acts like a combination of the UpOne-Direct expression and the Direct-DownFour expression;
 - UpOne-DownFive - which acts like a combination of the UpOne-Direct expression and the Direct-DownFive expression;
 - UpOne-Through-Direct - which acts like the UpOne-Direct expression, but also traverses a `ThreatSendSignal` to associated `ThreatAcceptEvent`s before returning the `Target` of the first `ThreatFlow`;
 - UpOne-Through-DownOne - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownOne expression;
 - UpOne-Through-DownTwo - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownTwo expression;
 - UpOne-Through-DownThree - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownThree expression;
 - UpOne-Through-DownFour - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownFour expression;
 - UpOne-Through-DownFive - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownFive expression;
 - UpTwo-Direct - which traverses a `ThreatOutput` pin from inside an `AggregatedAction` twice and then returns the `Target` of the first `ThreatFlow` connected to that last `ThreatOutput` pin;
 - UpTwo-ThreatImpact - which acts like the UpTwo-Direct expression, but also checks if the `Target` is a `ThreatImpact` and if so, returns its `Signal`;
 - UpTwo-DownOne - which acts like a combination of the UpTwo-Direct expression and the Direct-DownOne expression;
 - UpTwo-DownTwo - which acts like a combination of the UpTwo-Direct expression and the Direct-DownTwo expression;
 - UpTwo-DownThree - which acts like a combination of the UpTwo-Direct expression and the Direct-DownThree expression;
 - UpTwo-DownFour - which acts like a combination of the UpTwo-Direct expression and the Direct-DownFour expression;
 - UpTwo-DownFive - which acts like a combination of the UpTwo-Direct expression and the Direct-DownFive expression;
 - UpTwo-Through-Direct - which acts like the UpTwo-Direct expression, but also traverses a `ThreatSendSignal` to associated `ThreatAcceptEvent`s before returning the `Target` of the first `ThreatFlow`;
 - UpTwo-Through-DownOne - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownOne expression;
 - UpTwo-Through-DownTwo - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownTwo expression;
 - UpTwo-Through-DownThree - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownThree expression;
 - UpTwo-Through-DownFour - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownFour expression;
 - UpTwo-Through-DownFive - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownFive expression;
 - UpThree-Direct - which traverses a `ThreatOutput` pin from inside an `AggregatedAction` three times and then returns the `Target` of the first `ThreatFlow` connected to that last `ThreatOutput` pin;
 - UpThree-ThreatImpact - which acts like the UpThree-Direct expression, but also checks if the `Target` is a `ThreatImpact` and if so, returns its `Signal`;
 - UpThree-DownOne - which acts like a combination of the UpThree-Direct expression and the Direct-DownOne expression;
 - UpThree-DownTwo - which acts like a combination of the UpThree-Direct expression and the Direct-DownTwo expression;
 - UpThree-DownThree - which acts like a combination of the UpThree-Direct expression and the Direct-DownThree expression;
 - UpThree-DownFour - which acts like a combination of the UpThree-Direct expression and the Direct-DownFour expression;
 - UpThree-DownFive - which acts like a combination of the UpThree-Direct expression and the Direct-DownFive expression;
 - UpThree-Through-Direct - which acts like the UpThree-Direct expression, but also traverses a `ThreatSendSignal` to associated `ThreatAcceptEvent`s before returning the `Target` of the first `ThreatFlow`;
 - UpThree-Through-DownOne - which acts like a combination of the UpThree-Through-Direct expression and the Direct-DownOne expression;
 - UpThree-Through-DownTwo - which acts like a combination of the UpThree-Through-Direct expression and the Direct-DownTwo expression;
 - UpThree-Through-DownThree - which acts like a combination of the UpThree-Through-Direct expression and the Direct-DownThree expression;
 - UpThree-Through-DownFour - which acts like a combination of the UpThree-Through-Direct expression and the Direct-DownFour expression;
 - UpThree-Through-DownFive - which acts like a combination of the UpThree-Through-Direct expression and the Direct-DownFive expression;
 - UpFour-Direct - which traverses a `ThreatOutput` pin from inside an `AggregatedAction` four times and then returns the `Target` of the first `ThreatFlow` connected to that last `ThreatOutput` pin;
 - UpFour-ThreatImpact - which acts like the UpFour-Direct expression, but also checks if the `Target` is a `ThreatImpact` and if so, returns its `Signal`;
 - UpFour-DownOne - which acts like a combination of the UpFour-Direct expression and the Direct-DownOne expression;
 - UpFour-DownTwo - which acts like a combination of the UpFour-Direct expression and the Direct-DownTwo expression;
 - UpFour-DownThree - which acts like a combination of the UpFour-Direct expression and the Direct-DownThree expression;
 - UpFour-DownFour - which acts like a combination of the UpFour-Direct expression and the Direct-DownFour expression;
 - UpFour-DownFive - which acts like a combination of the UpFour-Direct expression and the Direct-DownFive expression;
 - UpFour-Through-Direct - which acts like the UpFour-Direct expression, but also traverses a `ThreatSendSignal` to associated `ThreatAcceptEvent`s before returning the `Target` of the first `ThreatFlow`;
 - UpFour-Through-DownOne - which acts like a combination of the UpFour-Through-Direct expression and the Direct-DownOne expression;
 - UpFour-Through-DownTwo - which acts like a combination of the UpFour-Through-Direct expression and the Direct-DownTwo expression;
 - UpFour-Through-DownThree - which acts like a combination of the UpFour-Through-Direct expression and the Direct-DownThree expression;
 - UpFour-Through-DownFour - which acts like a combination of the UpFour-Through-Direct expression and the Direct-DownFour expression;
 - UpFour-Through-DownFive - which acts like a combination of the UpFour-Through-Direct expression and the Direct-DownFive expression;
 - UpFive-Direct - which traverses a `ThreatOutput` pin from inside an `AggregatedAction` five times and then returns the `Target` of the first `ThreatFlow` connected to that last `ThreatOutput` pin;
 - UpFive-ThreatImpact - which acts like the UpFive-Direct expression, but also checks if the `Target` is a `ThreatImpact` and if so, returns its `Signal`;
 - UpFive-DownOne - which acts like a combination of the UpFive-Direct expression and the Direct-DownOne expression;
 - UpFive-DownTwo - which acts like a combination of the UpFive-Direct expression and the Direct-DownTwo expression;
 - UpFive-DownThree - which acts like a combination of the UpFive-Direct expression and the Direct-DownThree expression;
 - UpFive-DownFour - which acts like a combination of the UpFive-Direct expression and the Direct-DownFour expression;
 - UpFive-DownFive - which acts like a combination of the UpFive-Direct expression and the Direct-DownFive expression;
 - UpFive-Through-Direct - which acts like the UpFive-Direct expression, but also traverses a `ThreatSendSignal` to associated `ThreatAcceptEvent`s before returning the `Target` of the first `ThreatFlow`;
 - UpFive-Through-DownOne - which acts like a combination of the UpFive-Through-Direct expression and the Direct-DownOne expression;
 - UpFive-Through-DownTwo - which acts like a combination of the UpFive-Through-Direct expression and the Direct-DownTwo expression;
 - UpFive-Through-DownThree - which acts like a combination of the UpFive-Through-Direct expression and the Direct-DownThree expression;
 - UpFive-Through-DownFour - which acts like a combination of the UpFive-Through-Direct expression and the Direct-DownFour expression; and
 - UpFive-Through-DownFive - which acts like a combination of the UpFive-Through-Direct expression and the Direct-DownFive expression.

> **Note**: These expressions only cover the scenarios where the attack tree is only traversing up and down five levels of nested `AggregatedAction`s. While the tool will let you model many more levels of nested complexity than that, this lookup will not work with more than 6 levels (each level is at max 5 layers away from each other). If you model requires more nested layers than that, this expression will need to be modified to account for those extra layers, by following the pattern to create a set of expressions for 'UpSix' and 'DownSix'.

## PreviousThreatAction

This derived property traverses the relationships created in the CEMT Mal-Activity Diagrams to identify the previous `ThreatAction`s in the attack tree.

`PreviousThreatAction` contains seventy-two expressions using metachain navigation:
 - Direct - which identifies the `ThreatFlow` coming into the current node and the `Source` of that `ThreatFlow`;
 - Direct-DownOne - which also traverses a `ThreatOuput` pin to return the `Source` of the final `ThreatFlow` within an `AggregatedAction`;
 - Direct-DownTwo - which traverses two levels of `AggregatedAction` before returning the `Source` of the final `ThreatFlow` within the `AggregatedAction`;
 - Direct-DownThree - which traverses three levels of `AggregatedAction` before returning the `Source` of the final `ThreatFlow` within the `AggregatedAction`;
 - Direct-DownFour - which traverses four levels of `AggregatedAction` before returning the `Source` of the final `ThreatFlow` within the `AggregatedAction`;
 - Direct-DownFive - which traverses five levels of `AggregatedAction` before returning the `Source` of the final `ThreatFlow` within the `AggregatedAction`;
 - Direct-Through-Direct - which acts like the Direct expression, but also traverses a `ThreatAcceptEvent` to associated `ThreatSendSignal`s before returning the `Source` of the `ThreatFlow`;
 - Direct-Through-DownOne - which acts like a combination of the Direct-Through-Direct expression and the Direct-DownOne expression;
 - Direct-Through-DownTwo - which acts like a combination of the Direct-Through-Direct expression and the Direct-DownTwo expression;
 - Direct-Through-DownThree - which acts like a combination of the Direct-Through-Direct expression and the Direct-DownThree expression;
 - Direct-Through-DownFour - which acts like a combination of the Direct-Through-Direct expression and the Direct-DownFour expression;
 - Direct-Through-DownFive - which acts like a combination of the Direct-Through-Direct expression and the Direct-DownFive expression;
 - UpOne-Direct - which traverses a `ThreatInput` pin from inside an `AggregatedAction` to return the `Source` of the final `ThreatFlow` connected to that `ThreatInput` pin;
 - UpOne-DownOne - which acts like a combination of the UpOne-Direct expression and the Direct-DownOne expression;
 - UpOne-DownTwo - which acts like a combination of the UpOne-Direct expression and the Direct-DownTwo expression;
 - UpOne-DownThree - which acts like a combination of the UpOne-Direct expression and the Direct-DownThree expression;
 - UpOne-DownFour - which acts like a combination of the UpOne-Direct expression and the Direct-DownFour expression;
 - UpOne-DownFive - which acts like a combination of the UpOne-Direct expression and the Direct-DownFive expression;
 - UpOne-Through-Direct - which acts like the UpOne-Direct expression, but also traverses a `ThreatAcceptEvent` to associated `ThreatSendSignal`s before returning the `Source` of the `ThreatFlow`;
 - UpOne-Through-DownOne - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownOne expression;
 - UpOne-Through-DownTwo - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownTwo expression;
 - UpOne-Through-DownThree - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownThree expression;
 - UpOne-Through-DownFour - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownFour expression;
 - UpOne-Through-DownFive - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownFive expression;
 - UpTwo-Direct - which traverses a `ThreatInput` pin from inside an `AggregatedAction` twice and then returns the `Source` of the final `ThreatFlow` connected to that last `ThreatInput` pin;
 - UpTwo-DownOne - which acts like a combination of the UpTwo-Direct expression and the Direct-DownOne expression;
 - UpTwo-DownTwo - which acts like a combination of the UpTwo-Direct expression and the Direct-DownTwo expression;
 - UpTwo-DownThree - which acts like a combination of the UpTwo-Direct expression and the Direct-DownThree expression;
 - UpTwo-DownFour - which acts like a combination of the UpTwo-Direct expression and the Direct-DownFour expression;
 - UpTwo-DownFive - which acts like a combination of the UpTwo-Direct expression and the Direct-DownFive expression;
 - UpTwo-Through-Direct - which acts like the UpTwo-Direct expression, but also traverses a `ThreatAcceptEvent` to associated `ThreatSendSignal`s before returning the `Source` of the first `ThreatFlow`;
 - UpTwo-Through-DownOne - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownOne expression;
 - UpTwo-Through-DownTwo - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownTwo expression;
 - UpTwo-Through-DownThree - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownThree expression;
 - UpTwo-Through-DownFour - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownFour expression;
 - UpTwo-Through-DownFive - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownFive expression;
 - UpThree-Direct - which traverses a `ThreatInput` pin from inside an `AggregatedAction` three times and then returns the `Source` of the final `ThreatFlow` connected to that last `ThreatInput` pin;
 - UpThree-DownOne - which acts like a combination of the UpThree-Direct expression and the Direct-DownOne expression;
 - UpThree-DownTwo - which acts like a combination of the UpThree-Direct expression and the Direct-DownTwo expression;
 - UpThree-DownThree - which acts like a combination of the UpThree-Direct expression and the Direct-DownThree expression;
 - UpThree-DownFour - which acts like a combination of the UpThree-Direct expression and the Direct-DownFour expression;
 - UpThree-DownFive - which acts like a combination of the UpThree-Direct expression and the Direct-DownFive expression;
 - UpThree-Through-Direct - which acts like the UpThree-Direct expression, but also traverses a `ThreatAcceptEvent` to associated `ThreatSendSignal`s before returning the `Source` of the first `ThreatFlow`;
 - UpThree-Through-DownOne - which acts like a combination of the UpThree-Through-Direct expression and the Direct-DownOne expression;
 - UpThree-Through-DownTwo - which acts like a combination of the UpThree-Through-Direct expression and the Direct-DownTwo expression;
 - UpThree-Through-DownThree - which acts like a combination of the UpThree-Through-Direct expression and the Direct-DownThree expression;
 - UpThree-Through-DownFour - which acts like a combination of the UpThree-Through-Direct expression and the Direct-DownFour expression;
 - UpThree-Through-DownFive - which acts like a combination of the UpThree-Through-Direct expression and the Direct-DownFive expression;
 - UpFour-Direct - which traverses a `ThreatInput` pin from inside an `AggregatedAction` four times and then returns the `Source` of the final `ThreatFlow` connected to that last `ThreatInput` pin;
 - UpFour-DownOne - which acts like a combination of the UpFour-Direct expression and the Direct-DownOne expression;
 - UpFour-DownTwo - which acts like a combination of the UpFour-Direct expression and the Direct-DownTwo expression;
 - UpFour-DownThree - which acts like a combination of the UpFour-Direct expression and the Direct-DownThree expression;
 - UpFour-DownFour - which acts like a combination of the UpFour-Direct expression and the Direct-DownFour expression;
 - UpFour-DownFive - which acts like a combination of the UpFour-Direct expression and the Direct-DownFive expression;
 - UpFour-Through-Direct - which acts like the UpFour-Direct expression, but also traverses a `ThreatAcceptEvent` to associated `ThreatSendSignal`s before returning the `Source` of the first `ThreatFlow`;
 - UpFour-Through-DownOne - which acts like a combination of the UpFour-Through-Direct expression and the Direct-DownOne expression;
 - UpFour-Through-DownTwo - which acts like a combination of the UpFour-Through-Direct expression and the Direct-DownTwo expression;
 - UpFour-Through-DownThree - which acts like a combination of the UpFour-Through-Direct expression and the Direct-DownThree expression;
 - UpFour-Through-DownFour - which acts like a combination of the UpFour-Through-Direct expression and the Direct-DownFour expression;
 - UpFour-Through-DownFive - which acts like a combination of the UpFour-Through-Direct expression and the Direct-DownFive expression;
 - UpFive-Direct - which traverses a `ThreatInput` pin from inside an `AggregatedAction` five times and then returns the `Source` of the final `ThreatFlow` connected to that last `ThreatInput` pin;
 - UpFive-DownOne - which acts like a combination of the UpFive-Direct expression and the Direct-DownOne expression;
 - UpFive-DownTwo - which acts like a combination of the UpFive-Direct expression and the Direct-DownTwo expression;
 - UpFive-DownThree - which acts like a combination of the UpFive-Direct expression and the Direct-DownThree expression;
 - UpFive-DownFour - which acts like a combination of the UpFive-Direct expression and the Direct-DownFour expression;
 - UpFive-DownFive - which acts like a combination of the UpFive-Direct expression and the Direct-DownFive expression;
 - UpFive-Through-Direct - which acts like the UpFive-Direct expression, but also traverses a `ThreatAcceptEvent` to associated `ThreatSendSignal`s before returning the `Source` of the first `ThreatFlow`;
 - UpFive-Through-DownOne - which acts like a combination of the UpFive-Through-Direct expression and the Direct-DownOne expression;
 - UpFive-Through-DownTwo - which acts like a combination of the UpFive-Through-Direct expression and the Direct-DownTwo expression;
 - UpFive-Through-DownThree - which acts like a combination of the UpFive-Through-Direct expression and the Direct-DownThree expression;
 - UpFive-Through-DownFour - which acts like a combination of the UpFive-Through-Direct expression and the Direct-DownFour expression; and
 - UpFive-Through-DownFive - which acts like a combination of the UpFive-Through-Direct expression and the Direct-DownFive expression.

> **Note**: These expressions only cover the scenarios where the attack tree is only traversing up and down five levels of nested `AggregatedAction`s. While the tool will let you model many more levels of nested complexity than that, this lookup will not work with more than 6 levels (each level is at max 5 layers away from each other). If you model requires more nested layers than that, this expression will need to be modified to account for those extra layers, by following the pattern to create a set of expressions for 'UpSix' and 'DownSix'.

## DetectionAction

This derived property traverses the relationships created in the CEMT Mal-Activity Diagrams to identify the `DetectionAction` associated with a particular `ThreatAction`.

`PreviousThreatAction` contains one expression using metachain navigation:
 - Direct - which identifies the `DetectionFlow` leaving the current node and the `Target` of that `DetectionFlow`.

## PreviousDetectionAction

This derived property traverses the relationships created in the CEMT Mal-Activity Diagrams to identify the previous `DetectionAction` linked to a `ThreatDetectionSignal`.

`PreviousDetectionAction` contains six expressions using metachain navigation:
 - Direct - which identifies the `ThreatDetection` associated with a `ThreatDetectionSignal`, the `DetectionFlow` leaving that `ThreatDetection` and then the `Source` of the `DetectionFlow` coming into that `ThreatDetection`;
 - Direct-DownOne - which also traverses a `ThreatOuput` pin to return the `Source` of the final `DetectionFlow` within an `AggregatedAction`;
 - Direct-DownTwo - which traverses two levels of `AggregatedAction` before returning the `Source` of the final `DetectionFlow` within the `AggregatedAction`;
 - Direct-DownThree - which traverses three levels of `AggregatedAction` before returning the `Source` of the final `DetectionFlow` within the `AggregatedAction`;
 - Direct-DownFour - which traverses four levels of `AggregatedAction` before returning the `Source` of the final `DetectionFlow` within the `AggregatedAction`; and
 - Direct-DownFive - which traverses five levels of `AggregatedAction` before returning the `Source` of the final `DetectionFlow` within the `AggregatedAction`.

> **Note**: These expressions only cover the scenarios where the attack tree is only traversing up and down five levels of nested `AggregatedAction`s. While the tool will let you model many more levels of nested complexity than that, this lookup will not work with more than 6 levels (each level is at max 5 layers away from each other). If you model requires more nested layers than that, this expression will need to be modified to account for those extra layers, by following the pattern to create a set of expressions for 'DownSix'.