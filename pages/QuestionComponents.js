import { TextInput, Checkbox, Text, RadioButton, HelperText, Button } from 'react-native-paper';
import React from 'react'
import { View } from 'react-native';

import { useContext } from 'react'
import { ThemeContext } from "./AppContextProvider";

export function ShortAnswer({questionObj, inputValues}) {
    const isDark = useContext(ThemeContext).isDarkMode
    const theme = useContext(ThemeContext).theme.colors

    let [text, setText] = React.useState("")
    inputValues[questionObj.id] = () => text    // value supplier
    return (
        <View>
            <Text style={{
                width: "80%",
                marginLeft: "10%",
                paddingBottom: 10,
                fontSize: 15,
                fontWeight: 700,
                color: theme.secondary
            }}>{questionObj.label}</Text>
            <TextInput
                style={{
                    width: "85%", 
                    marginLeft: "7.5%",
                    backgroundColor: isDark ? theme.onSurface : theme.surface
                }} 
                theme={theme}
                label=""
                mode="outlined" 
                value={text} 
                onChangeText={setText} 
                key={questionObj.id}/>
        </View>
    )
}

export function LongAnswer({questionObj, inputValues}) {
    const theme = useContext(ThemeContext).theme.colors
    const isDark = useContext(ThemeContext).isDarkMode

    let [text, setText] = React.useState("")
    inputValues[questionObj.id] = () => text    // value supplier
    return (
        <View>
            <Text style={{
                width: "80%",
                marginLeft: "10%",
                paddingBottom: 10,
                fontSize: 15,
                fontWeight: 700,
                color: theme.secondary
            }}>{questionObj.label}</Text>
            <TextInput multiline={true} 
                style={{
                    width: "85%", 
                    marginLeft: "7.5%",
                    backgroundColor: isDark ? theme.onSurface : theme.surface
                }} 
                label="" 
                mode="outlined"
                theme={theme} 
                value={text} 
                onChangeText={setText} 
                key={questionObj.id}/>
        </View>
    )
}

export function Checkboxes({questionObj, inputValues}) {
    const theme = useContext(ThemeContext).theme.colors

    let checkedBoxesSupplier = {}

    inputValues[questionObj.id] = () => Object.entries(checkedBoxesSupplier)
                                            .filter(([index, value]) => value)
                                            .map(([index, value]) => parseInt(index))    // value supplier

    let boxes = questionObj.choices.map((question, idx) => {
        const [checked, setChecked] = React.useState(false);

        checkedBoxesSupplier[idx] = checked // idk this is the only way this works, I tried using a list but you have to use an obj
    
        return (
            <Checkbox.Item
                status={checked ? 'checked' : 'unchecked'}
                onPress={ () => { setChecked(!checked) }}
                key={`${questionObj.id}-${idx}`}
                
                style={{
                    marginLeft: 50,
                    marginTop: -13,
                }}
                theme={theme}

                label={question}
                position="leading"
                labelStyle={{
                    textAlign: "left",
                    marginLeft: 10,
                    fontSize: 15,
                    color: theme.tertiary
                }}
            />
        );
    })
    return (
        <View>
            <Text style={{
                width: "80%",
                marginLeft: "10%",
                paddingBottom: 13,
                fontSize: 15,
                fontWeight: 700,
                color: theme.secondary
            }}>{questionObj.label}</Text>
            {boxes}
        </View>
    )
}

export function MultipleChoice({questionObj, inputValues}) {
    const theme = useContext(ThemeContext).theme.colors

    const [value, setValue] = React.useState();
    inputValues[questionObj.id] = () => value   // value supplier

    let options = questionObj.choices.map((label, idx) => (
        <RadioButton.Item 
        label={label} 
        value={idx}
        key={`${questionObj.id}-${idx}`}
        position="leading"
        labelStyle={{
            textAlign: "left",
            marginLeft: 10,
            fontSize: 15,
            color: theme.tertiary
        }} 
        style={{
            marginLeft: 50,
            marginTop: -13,
        }}
        theme={theme}
        />
    ))

    return (
        <View>
             <Text style={{
                width: "80%",
                marginLeft: "10%",
                paddingBottom: 13,
                fontSize: 15,
                fontWeight: 700,
                color: theme.secondary
            }}>{questionObj.label}</Text>
            <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
                {options}
            </RadioButton.Group>
        </View>
    );
}



export function TeamNumInput({teamNumCallback, teamsList, addError, updateError}) {
    const theme = useContext(ThemeContext).theme.colors
    const themeContext = useContext(ThemeContext)

    let [text, setText] = React.useState("")
    teamNumCallback["team_num"] = () => text    // value supplier

    function hasErrors() {  // idk it doesn't work as an inline anonymous fucntion for some reason
        return !teamsList.includes(text)
    }

    return (
        <View style={{backgroundColor: themeContext.isDarkMode ? theme.onSurfaceVariant : theme.surfaceVariant, padding: 5, width: "90%", marginLeft: "5%", borderRadius: 15}}>
            <TextInput
            style={{
                width: "90%", 
                marginLeft: "5%",
                backgroundColor: themeContext.isDarkMode ? theme.onSurfaceVariant : theme.surfaceVariant
            }} 
            label="Team Number"
            mode="outlined" 
            
            value={text} 
            onChangeText={(text) => {
                text = text.replace(/[^0-9]/g, '')

                addError["team_num"] = !teamsList.includes(text)    // I don't care anymore
                updateError()   // after you add the error, call this to update the submit button (idk i gave up on this)
                setText(text)
            }} 
            error={hasErrors()}/>
            <HelperText type="error" theme={theme} visible={hasErrors()} style={{marginLeft: 25}}>
                Team is not in this event
            </HelperText>
        </View>
    )
}



export function SubmitButton({onPress, disabled}) {
    const theme = useContext(ThemeContext).theme.colors

    return (
        <Button 
        theme={theme}
        icon="content-save" 
        mode="contained" 
        style={{
            width: "85%",
            marginLeft: "7.5%",
            marginTop: 15,
            marginBottom: 5,
            backgroundColor: disabled ? "#EBEBE4" : theme.primaryContainer,
            borderWidth: 2,
            borderColor: disabled ? "#BBBBBB" : theme.outline
        }}
        labelStyle={{
            color: disabled ? "#AAAAAA" : theme.primary
        }}
        onPress={onPress}
        disabled={disabled}>
            Submit
        </Button>
    )
}