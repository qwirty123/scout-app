import { Button, HelperText, IconButton, TextInput, Modal, Text, Portal, Switch } from "react-native-paper"
import React, {useContext} from "react"
import { View, Keyboard, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from "react-native"
import { ThemeContext } from "./AppContextProvider"
import * as storage from "./asyncStorage"


let serverURL = ""
export function getServerURL() {
    return serverURL
}
export function setServerURL(x) {
    // DO NOT USE THIS, only for this one specific purpose
    serverURL = x
}

let username = ""
export function getUsername() {
    return username
}
export function setUsername(x) {
    // DO NOT USE THIS, only for this one specific purpose
    serverURL = x
}


let isInitialRender = true


export function Settings({setAPI}) {
    const context = useContext(ThemeContext)
    const theme = context.theme.colors

    let [showingThemeBox, toggleThemeBox] = React.useState(false)
    let [isDarkMode, toggleDarkMode] = React.useState(context.isDarkMode)

    let [text, setText] = React.useState("")
    let [serverInput, setServerInput] = React.useState("")
    if (isInitialRender) {
        isInitialRender = false
        setText(username)
        setServerInput(serverURL)
    }
    
    function hasErrors(url) {
        if (url === "") {
            return "Enter a url"
        }
        if (!(url.startsWith("http://") || url.startsWith("https://"))) {
            return "Server endpoint should start with http:// or https://"
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: theme.background}}>
            <Portal>
                <Modal onDismiss={() => toggleThemeBox(false)} visible={showingThemeBox}
                contentContainerStyle={{backgroundColor: theme.surface, width: "80%", height: "60%", alignSelf: "center", padding: 15, borderColor: theme.tertiary, borderWidth: 2, borderRadius: 15}}>
                    <View style={{width: "100%", height: 50}}>
                        <Text style={{width: "50%", fontSize: 20, color: theme.onSurface}}>Dark Mode</Text>
                        <Switch style={{alignSelf: "flex-end", position: "absolute", top: -5}} theme={theme} value={isDarkMode} 
                            onValueChange={() => {
                                context.changeDarkMode(!isDarkMode)
                                toggleDarkMode(!isDarkMode)
                            }} />
                    </View>


                    <ScrollView>
                    {
                    Object.entries(context.listThemes())
                    .filter(([colorName, data]) => !colorName.includes("grey")) // there's both gray and grey in this list
                    .sort((color1, color2) => color1[0].localeCompare(color2[0]))
                    .map(([colorName, data]) => {
                        let lightTheme = data.light
                        let darkTheme = data.dark
                        return (
                            <TouchableOpacity key={colorName} style={{
                                height: 35, 
                                marginTop: 5, 
                                backgroundColor: context.isDarkMode ? darkTheme.colors.primary : lightTheme.colors.primary,
                                borderRadius: 10, 
                                paddingLeft: 20, 
                                justifyContent: "center"}}
                                onPress={() => {context.changeColor(colorName); toggleThemeBox(false)}}>

                                <Text style={{
                                    fontSize: 18,
                                    color: context.isDarkMode ? darkTheme.colors.onPrimary : lightTheme.colors.onPrimary
                                }}>{colorName}
                                
                                    {colorName===context.currentColor ? <Text>✔️</Text> : null}
                                </Text>
                            </TouchableOpacity>
                        )
                    })
                    }
                    </ScrollView>
                </Modal>
            </Portal>


            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{flex: 1, marginTop: 100}}>
                <Text variant="headlineLarge" style={{marginLeft: "7%", marginBottom: 10, fontWeight: "bold", color: theme.primary}}>Settings</Text>
                    <View style={{backgroundColor: context.isDarkMode ? theme.onSurfaceVariant : theme.surfaceVariant, padding: 10, width: "90%", marginLeft: "5%", borderRadius: 15}}>
                        <TextInput
                            style={{
                                width: "85%", 
                                marginLeft: "7.5%",
                                backgroundColor: context.isDarkMode ? theme.onSurfaceVariant : theme.surfaceVariant
                            }} 
                            theme={theme}
                            label="Username"
                            mode="outlined" 
                            value={text}
                            error={!text}
                            onChangeText={(text) => {
                                setText(text)
                                username = text
                                storage.storeData("username", text)
                            }} />
                        <View style={{width: "92%", marginTop: 20}}>
                            <TextInput
                                style={{
                                    width: "78%", 
                                    marginLeft: "7.5%",
                                    backgroundColor: context.isDarkMode ? theme.onSurfaceVariant : theme.surfaceVariant
                                }} 
                                theme={theme}
                                label="Server URL"
                                mode="outlined" 
                                value={serverInput} 
                                autoCorrect={false}
                                onChangeText={(newUrl) => {
                                    setServerInput(newUrl)
                                    serverURL = newUrl
                                }} />

                            <IconButton icon="check" size={30} 
                            style={{position: "absolute", alignSelf: "flex-end", borderColor: "green", borderWidth: 2, top: 5}}
                            onPress={() => {
                                if (!hasErrors(serverURL)) {
                                    storage.storeData("serverUrl", serverURL)
                                    Keyboard.dismiss()
                                    setAPI()
                                }
                            }}/>
                            <HelperText visible={hasErrors(serverURL)} style={{marginLeft: "7.5%", color: "red"}}>{hasErrors(serverURL)}</HelperText>
                        </View>
                        <Button onPress={() => toggleThemeBox(true)} icon="brush" style={{borderWidth: 2, borderColor: theme.outline, backgroundColor: theme.surface, width: "90%", marginLeft: "5%"}}><Text style={{color: theme.secondary, fontWeight: "bold"}}>Change Theme</Text></Button>
                    </View>
                </View>
            </TouchableWithoutFeedback>

        </View>
    )
}