import { Appbar } from 'react-native-paper';
import { View } from 'react-native';
import React from 'react'

import { GenerateJSXAnswers } from './QuestionJSXGenerator';
import { useForceUpdate } from './util';

import { useContext } from 'react'
import { ThemeContext } from "./AppContextProvider";



let uniqueKey = 0   // using a unique key causes the element to reset https://stackoverflow.com/q/21749798
let regenerateUniqueKey = () => uniqueKey = (Math.random())

let scheme1, meta1, teamData1
let isReloadAndNotInitialRender = false // I am a good programmer

export function Records({scheme, meta, teamData, reloadData}) {
    let forceRerender = useForceUpdate()

    let theme = useContext(ThemeContext)
    theme.updaters.push(forceRerender)
    theme = theme.theme.colors
    
    if (!isReloadAndNotInitialRender) {
        [scheme1, meta1, teamData1] = [scheme, meta, teamData];
    }
    return(
        <View key={uniqueKey}>
            <Appbar.Header style={{backgroundColor: theme.surfaceVariant}}>
                <Appbar.Content style={{marginLeft: 30, width: "60%"}} title={meta.name} titleStyle={{color: theme.primary}}/>
                <Appbar.Action style={{marginRight: 30}} icon="reload" iconColor={theme.primary} onPress={() => {
                    reloadData((newScheme, newMeta, newTeamData) => {
                        [scheme1, meta1, teamData1] = [newScheme, newMeta, newTeamData];
                        isReloadAndNotInitialRender = true
                        regenerateUniqueKey()
                        //reRenderRecords()
                        forceRerender()
                    })
                }} />
            </Appbar.Header>
            <GenerateJSXAnswers scheme={scheme1} teamData={teamData1}/>
        </View>
    )
}