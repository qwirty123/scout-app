import { ScrollView, View } from "react-native";
import { Text, Divider, HelperText, Snackbar, IconButton } from "react-native-paper";
import React from 'react'

import { GenerateJSXQuestions } from "./QuestionJSXGenerator";
import { TeamNumInput, SubmitButton } from "./QuestionComponents";
import { submitPOST } from "./server";
import { useForceUpdate } from "./util";

import { useContext } from 'react'
import { ThemeContext } from "./AppContextProvider";




let uniqueKey = 0   // using a unique key causes the element to reset https://stackoverflow.com/q/21749798
let regenerateUniqueKey = () => uniqueKey = (Math.random())

export function Scout({scheme, meta, teamData, usernameSupplier}) {
    let forceRerender = useForceUpdate()

    let theme = useContext(ThemeContext)
    theme.updaters.push(forceRerender)
    theme = theme.theme.colors


    let scoutedDataSuppliers = {
        "answers": {},
        "team_num": null
    }


    let error = {}
    let [submitDisabled, toggleSubmitDisabled] = React.useState(true)   // disabled at start because teamNum is required
    function hasError() {
        let isError = Object.values(error).some((x) => x)
        toggleSubmitDisabled(isError)
        return isError
    }


    const [missingUsernameSnackbar, changeUsernameSnackbar] = React.useState(false)
    const [finishedSubmitting, changeFinishedSubmitting] = React.useState(false)
    const [errSubmitting, changeErrSubmitting] = React.useState(false)




    function submit() {
        console.log("submitted")
        if (usernameSupplier() === "" || usernameSupplier() === undefined) {
            console.log("error: no username")
            changeUsernameSnackbar(true)
            setTimeout(() => {
                changeUsernameSnackbar(false)
            }, 5000);
            return
        }
        
        let finalValues = {
            "answers": Object.fromEntries(
                Object.entries(scoutedDataSuppliers["answers"])
                .map(([questionID, valueSupplier]) => ([questionID, (valueSupplier()!==undefined ? valueSupplier() : null)]))
            ),
            "team_num": scoutedDataSuppliers["team_num"]()
        }

        submitPOST(usernameSupplier(), JSON.stringify(finalValues), (err) => {
            if (err === false) {
                console.log("showing finished message")
                changeFinishedSubmitting(true)
                setTimeout(() => {
                    console.log("clearing")
                    changeFinishedSubmitting(false)
                    regenerateUniqueKey()
                    forceRerender()
                }, 1000)
            } else {
                console.log("showing error message")
                changeErrSubmitting(true)
                setTimeout(() => {
                    changeErrSubmitting(false)
                }, 5000);
            }
        })
    }
    

    return (
        <ScrollView style={{overflow: "scroll", backgroundColor: theme.background}} key={uniqueKey}>
            <View style={{width: "80%", marginLeft: "10%", marginTop: 70}}>
                    <Text variant="headlineLarge" style={{alignSelf: "flex-start", fontWeight: "bold", width: "50%", color: theme.primary}}>{meta.name}</Text>
                    <IconButton style={{alignSelf: "flex-end", position: "absolute", top: -10}} icon="delete-circle" size={45} iconColor="#e8593c" onPress={() => {regenerateUniqueKey(); forceRerender()} } />

                <Text variant="bodySmall" style={{fontWeight: "bold", marginTop: 10, color: theme.onBackground}}>{meta.key}</Text>
            </View>
            <Divider horizontalInset={true} style={{marginTop: 10, marginBottom: 20}} />
            <TeamNumInput teamNumCallback={scoutedDataSuppliers} teamsList={Object.keys(teamData)} addError={error} updateError={hasError}/>
            <Divider horizontalInset={true} style={{marginTop: 10, marginBottom: 20}} />
            <GenerateJSXQuestions scheme={scheme} inputValues={scoutedDataSuppliers["answers"]}/>
            <SubmitButton onPress={submit} disabled={submitDisabled}/>
            <HelperText visible={submitDisabled} style={{marginLeft: 30, marginBottom: 25, color: theme.error}}>Input a valid Team Number</HelperText>
            <Snackbar visible={missingUsernameSnackbar}><Text style={{color: "red", fontWeight: "bold"}}>Error: Add an username in Settings</Text></Snackbar>
            <Snackbar visible={finishedSubmitting}>Success!</Snackbar>
            <Snackbar visible={errSubmitting}><Text style={{color: "red", fontWeight: "bold"}}>Error Submitting!</Text></Snackbar>
        </ScrollView>
    )
    //console.log(scheme, meta, teamData)
}