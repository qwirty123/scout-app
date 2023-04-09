import { View } from "react-native";
import { Text, RadioButton, Checkbox } from "react-native-paper";


import { useContext } from 'react'
import { ThemeContext } from "./AppContextProvider";

export function ShortAnswer({schemeObj, responseVal}) {
    const theme = useContext(ThemeContext).theme.colors

    return (
        <View style={{marginLeft: 15}}>
            <Text variant="bodyLarge" style={{width: "100%", fontWeight: "bold", marginTop: 15, marginBottom: 5, color: theme.secondary}}>{schemeObj.label}:</Text>
            <Text variant="bodyMedium" style={{paddingLeft: 40, color: theme.tertiary}}>{responseVal}</Text>
        </View>
    )
}


export function LongAnswer({schemeObj, responseVal}) {
    const theme = useContext(ThemeContext).theme.colors

    return (
        <View style={{marginLeft: 15}}>
            <Text variant="bodyLarge" style={{width: "100%", fontWeight: "bold", marginTop: 15, marginBottom: 5, color: theme.secondary}}>{schemeObj.label}:</Text>
            <Text variant="bodyMedium" style={{paddingLeft: 40, color: theme.tertiary}}>{responseVal}</Text>
        </View>
    )
}

export function MultipleChoice({schemeObj, responseVal}) {
    const theme = useContext(ThemeContext).theme.colors

    return (
        <View style={{marginLeft: 15}}>
        <Text variant="bodyLarge" style={{width: "100%", fontWeight: "bold", marginTop: 15, marginBottom: 5, color: theme.secondary}}>{schemeObj.label}:</Text>
        <RadioButton.Group value={responseVal}>
            {
            schemeObj.choices.map((label, idx) => (
                <RadioButton.Item 
                label={label} 
                value={idx}
                position="leading"
                labelVariant="bodyMedium"
                key={Math.random()}
                labelStyle={{
                    textAlign: "left",
                    marginLeft: 10,
                    color: theme.tertiary
                }} 
                style={{
                    marginLeft: 30,
                    marginTop: -15,
                }}/>
            ))
            }
        </RadioButton.Group>
    </View>
    )
}



export function Checkboxes({schemeObj, responseVal}) {
    const theme = useContext(ThemeContext).theme.colors

    return (
        <View style={{marginLeft: 15}}>
        <Text variant="bodyLarge" style={{width: "100%", fontWeight: "bold", marginTop: 15, marginBottom: 5, color: theme.secondary}}>{schemeObj.label}:</Text>
        {schemeObj.choices.map((question, idx) => {
        return (
            <Checkbox.Item
                status={responseVal.includes(idx) ? 'checked' : 'unchecked'}
                key={Math.random()}
                style={{
                    marginLeft: 30,
                    marginTop: -15,
                }}

                label={question}
                position="leading"
                labelVariant="bodyMedium"
                labelStyle={{
                    textAlign: "left",
                    marginLeft: 10,
                    color: theme.tertiary
                }}
            />
        );
        })}
        </View>
    )
}