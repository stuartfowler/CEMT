# Derived Property Expressions

## NextThreatAction

This derived property traverses the relationships created in the CEMT Mal-Activity Diagrams to identify the next `ThreatAction`s in the attack tree.

`NextThreatAction` contains eighteen expressions using metachain navigation:
 - Direct - which identifies the `ThreatFlow` leaving the current node and the `Target` of that `ThreatFlow`;
 - Direct-DownOne - which also traverses a `ThreatInput` pin to return the `Target` of the first `ThreatFlow` within an `AggregatedAction`;
 - Direct-DownTwo - which traverses two levels of `AggregatedAction` before returning the `Target` of the first `ThreatFlow` within the `AggregatedAction`;
 - Driect-Through-Direct - which acts like the Direct expression, but also traverses a `ThreatSendSignal` to associated `ThreatAcceptEvent`s before returning the `Target` of the `ThreatFlow`;
 - UpOne-Direct - which traverses a `ThreatOutput` pin from inside an `AggregatedAction` to return the `Target` of the first `ThreatFlow` connected to that `ThreatOutput` pin;
 - UpOne-ThreatImpact - which acts like the UpOne-Direct expression, but also checks if the `Target` is a `ThreatImpact` and if so, returns its `Signal`;
 - UpOne-DownOne - which acts like a combination of the UpOne-Direct expression and the Direct-DownOne expression;
 - UpOne-DownTwo - which acts like a combination of the UpOne-Direct expression and the Direct-DownTwo expression;
 - UpOne-Through-Direct - which acts like the UpOne-Direct expression, but also traverses a `ThreatSendSignal` to associated `ThreatAcceptEvent`s before returning the `Target` of the first `ThreatFlow`;
 - UpOne-Through-DownOne - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownOne expression;
 - UpOne-Through-DownTwo - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownTwo expression;
 - UpTwo-Direct - which traverses a `ThreatOutput` pin from inside an `AggregatedAction` twice and then returns the `Target` of the first `ThreatFlow` connected to that last `ThreatOutput` pin;
 - UpTwo-ThreatImpact - which acts like the UpTwo-Direct expression, but also checks if the `Target` is a `ThreatImpact` and if so, returns its `Signal`;
 - UpTwo-DownOne - which acts like a combination of the UpTwo-Direct expression and the Direct-DownOne expression;
 - UpTwo-DownTwo - which acts like a combination of the UpTwo-Direct expression and the Direct-DownTwo expression;
 - UpTwo-Through-Direct - which acts like the UpTwo-Direct expression, but also traverses a `ThreatSendSignal` to associated `ThreatAcceptEvent`s before returning the `Target` of the first `ThreatFlow`;
 - UpTwo-Through-DownOne - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownOne expression;
 - UpTwo-Through-DownTwo - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownTwo expression;

> **Note**: These expressions only cover the scenarios where the attack tree is only traversing up and down two levels of nested `AggregatedAction`s. While the tool will let you model many more levels of nested complexity than that, this lookup will not work with more than 3 levels (each level is at max 2 layers away from each other). If you model requires more nested layers than that, this expression will need to be modified to account for those extra layers, by following the pattern to create a set of expressions for 'UpThree' and 'DownThree'.

## PreviousThreatAction

This derived property traverses the relationships created in the CEMT Mal-Activity Diagrams to identify the previous `ThreatAction`s in the attack tree.

`PreviousThreatAction` contains sixteen expressions using metachain navigation:
 - Direct - which identifies the `ThreatFlow` coming into the current node and the `Source` of that `ThreatFlow`;
 - Direct-DownOne - which also traverses a `ThreatOuput` pin to return the `Source` of the final `ThreatFlow` within an `AggregatedAction`;
 - Direct-DownTwo - which traverses two levels of `AggregatedAction` before returning the `Source` of the final `ThreatFlow` within the `AggregatedAction`;
 - Driect-Through-Direct - which acts like the Direct expression, but also traverses a `ThreatAcceptEvent` to associated `ThreatSendSignal`s before returning the `Source` of the `ThreatFlow`;
 - UpOne-Direct - which traverses a `ThreatInput` pin from inside an `AggregatedAction` to return the `Source` of the final `ThreatFlow` connected to that `ThreatInput` pin;
 - UpOne-DownOne - which acts like a combination of the UpOne-Direct expression and the Direct-DownOne expression;
 - UpOne-DownTwo - which acts like a combination of the UpOne-Direct expression and the Direct-DownTwo expression;
 - UpOne-Through-Direct - which acts like the UpOne-Direct expression, but also traverses a `ThreatAcceptEvent` to associated `ThreatSendSignal`s before returning the `Source` of the `ThreatFlow`;
 - UpOne-Through-DownOne - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownOne expression;
 - UpOne-Through-DownTwo - which acts like a combination of the UpOne-Through-Direct expression and the Direct-DownTwo expression;
 - UpTwo-Direct - which traverses a `ThreatInput` pin from inside an `AggregatedAction` twice and then returns the `Source` of the final `ThreatFlow` connected to that last `ThreatInput` pin;
 - UpTwo-DownOne - which acts like a combination of the UpTwo-Direct expression and the Direct-DownOne expression;
 - UpTwo-DownTwo - which acts like a combination of the UpTwo-Direct expression and the Direct-DownTwo expression;
 - UpTwo-Through-Direct - which acts like the UpTwo-Direct expression, but also traverses a `ThreatAcceptEvent` to associated `ThreatSendSignal`s before returning the `Source` of the first `ThreatFlow`;
 - UpTwo-Through-DownOne - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownOne expression;
 - UpTwo-Through-DownTwo - which acts like a combination of the UpTwo-Through-Direct expression and the Direct-DownTwo expression;

> **Note**: These expressions only cover the scenarios where the attack tree is only traversing up and down two levels of nested `AggregatedAction`s. While the tool will let you model many more levels of nested complexity than that, this lookup will not work with more than 3 levels (each level is at max 2 layers away from each other). If you model requires more nested layers than that, this expression will need to be modified to account for those extra layers, by following the pattern to create a set of expressions for 'UpThree' and 'DownThree'.

## DetectionAction

This derived property traverses the relationships created in the CEMT Mal-Activity Diagrams to identify the `DetectionAction` associated with a particular `ThreatAction`.

`PreviousThreatAction` contains one expression using metachain navigation:
 - Direct - which identifies the `DetectionFlow` leaving the current node and the `Target` of that `DetectionFlow`.

## LinkedDiagram

This derived property traverses the relationships created in the CEMT Mal-Activity Diagrams to identify the diagrams where a particular `ThreatSendSignal` or `ThreatAcceptEvent` are sending their signal or receiving a signal from, respectively.

`LinkedDiagram` contains one expression using metachain navigation:
 - LinkedDiagram - which identifies the diagrams that contain the `ThreatSendSignals` associated with a particular `ThreatAcceptEvent` and vice-versa.

## PreviousDetectionAction

This derived property traverses the relationships created in the CEMT Mal-Activity Diagrams to identify the previous `DetectionAction` linked to a `ThreatDetectionSignal`.

`PreviousDetectionAction` contains three expressions using metachain navigation:
 - Direct - which identifies the `ThreatDetection` associated with a `ThreatDetectionSignal`, the `DetectionFlow` leaving that `ThreatDetection` and then the `Source` of the `DetectionFlow` coming into that `ThreatDetection`;
 - Direct-DownOne - which also traverses a `ThreatOuput` pin to return the `Source` of the final `DetectionFlow` within an `AggregatedAction`;
 - Direct-DownTwo - which traverses two levels of `AggregatedAction` before returning the `Source` of the final `DetectionFlow` within the `AggregatedAction`;

> **Note**: These expressions only cover the scenarios where the attack tree is only traversing up and down two levels of nested `AggregatedAction`s. While the tool will let you model many more levels of nested complexity than that, this lookup will not work with more than 3 levels (each level is at max 2 layers away from each other). If you model requires more nested layers than that, this expression will need to be modified to account for those extra layers, by following the pattern to create a set of expressions for 'DownThree'.