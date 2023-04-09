import { DataTable, Divider, Text } from 'react-native-paper';
import { View, ScrollView } from 'react-native';
import React from 'react'


import * as QuestionComponent from './QuestionComponents'
import * as RecordComponent from './RecordComponents'


import { useContext } from 'react'
import { ThemeContext } from "./AppContextProvider";


export function GenerateJSXQuestions({scheme, inputValues}) {
    

    let formBuilderList = scheme.map((questionObj) => {
        if (!Object.hasOwn(questionObj, "label")) {
            console.log("Invalid question in scheme, does not have label: ", questionObj)
            return
        }
        if (!Object.hasOwn(questionObj, "id")) {
            console.log("Invalid question in scheme, does not have id: ", questionObj)
            return
        }

        switch (questionObj.type) {
            case "shortAnswer": {
                return <QuestionComponent.ShortAnswer questionObj={questionObj} inputValues={inputValues} key={questionObj.id} />}
            case "longAnswer": {
                return <QuestionComponent.LongAnswer questionObj={questionObj} inputValues={inputValues} key={questionObj.id} />}
            case "multipleChoice": {
                return <QuestionComponent.MultipleChoice questionObj={questionObj} inputValues={inputValues} key={questionObj.id} />}
            case "checkbox": {
                return <QuestionComponent.Checkboxes questionObj={questionObj} inputValues={inputValues} key={questionObj.id} />}

            default:
                console.log(`Invalid question in scheme, type '${questionObj.type}' does not exist: `, questionObj)
                break;
        }
    })
    .filter((x) => (x !== undefined))
    .flatMap((elem) => [elem, <Divider horizontalInset={true} style={{marginTop: 20, marginBottom: 10}} 
        key={Math.random()}/>]) // Add dividers between questions
        // ^ Dear React, please shut up about 'Warning: Each child in a list should have a unique "key" prop.'


    return (
        <>{formBuilderList}</>
    )
}


export function GenerateJSXAnswers({scheme, teamData}) {
    const theme = useContext(ThemeContext).theme.colors

    let schemeToObj = Object.fromEntries(scheme.map((obj) => [obj.id, obj]))

    let dataJSX = Object.values(teamData)
        .sort((team1, team2) => team1.team_number - team2.team_number)
        .map((team) => {
            if (team.responses.length === 0) { // If no responses, grey out
                return (
                    <DataTable.Row key={Math.random()}>
                        <DataTable.Cell style={{marginLeft: 40, flex: 0.5}}><Text style={{color: "#bdbdb7"}}>{team.team_number}</Text></DataTable.Cell>
                        <DataTable.Cell style={{flex: 1}}><Text style={{color: "#bdbdb7"}}>{team.nickname}</Text></DataTable.Cell>
                    </DataTable.Row>
                )
            }

            let [showingDetails, toggleDetails] = React.useState(false)

            return (
                <View key={Math.random()}>
                    <DataTable.Row onPress={() => toggleDetails(!showingDetails)}>
                        <DataTable.Cell style={{marginLeft: 40, flex: 0.5}}><Text style={{color: theme.primary, fontWeight: showingDetails ? "bold":null}}>{team.team_number}</Text></DataTable.Cell>
                        <DataTable.Cell style={{flex: 1}}><Text style={{color: theme.primary, fontWeight: showingDetails ? "bold":null}}>{team.nickname}</Text></DataTable.Cell>
                    </DataTable.Row>
                    {!showingDetails ? null : (
                        <View style={{paddingLeft: 60}}>
                            {
                                team.responses
                                .sort((response1, response2) => response1.timestamp - response2.timestamp)  // sort by time
                                .map((response) => (
                                <View key={Math.random()}>
                                    <DataTable.Row>
                                        <DataTable.Cell><Text style={{fontWeight: "bold", color: theme.secondary}}>User</Text></DataTable.Cell>
                                        <DataTable.Cell><Text style={{color: theme.tertiary}}>{response.author}</Text></DataTable.Cell>
                                    </DataTable.Row>
                                    <DataTable.Row>
                                        <DataTable.Cell><Text style={{fontWeight: "bold", color: theme.secondary}}>Date</Text></DataTable.Cell>
                                        <DataTable.Cell><Text style={{color: theme.tertiary}}>{new Date(response.timestamp).toLocaleString()}</Text></DataTable.Cell>
                                    </DataTable.Row>
                                    <View>
                                    {
                                    Object.entries(response)
                                        .filter(([key, value]) => !["author", "timestamp"].includes(key))
                                        .map(([key, value]) => {
                                            let questionScheme = schemeToObj[key]
                                            switch (questionScheme.type) {
                                                case "shortAnswer":
                                                    return <RecordComponent.ShortAnswer schemeObj={questionScheme} responseVal={value} key={Math.random()}/>
                                                case "longAnswer":
                                                    return <RecordComponent.LongAnswer schemeObj={questionScheme} responseVal={value} key={Math.random()}/>
                                                case "multipleChoice":
                                                    return <RecordComponent.MultipleChoice schemeObj={questionScheme} responseVal={value} key={Math.random()}/>
                                                case "checkbox":
                                                    return <RecordComponent.Checkboxes schemeObj={questionScheme} responseVal={value} key={Math.random()}/>
                                            }
                                        })
                                        .flatMap((answer) => [answer, <Divider style={{marginLeft: 10, marginTop: 10}} key={Math.random()}/>])
                                    }
                                    </View>
                                </View>
                                ))
                                .flatMap((response) => [response, <Divider bold={true} style={{marginLeft: -20}} key={Math.random()}/>])
                            }
                        </View>
                    )}
                </View>
            )
        })
    return (
        <ScrollView style={{backgroundColor: theme.background}}>
            {dataJSX}
        </ScrollView>
    )
}