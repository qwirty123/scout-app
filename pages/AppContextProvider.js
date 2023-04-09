import React from 'react';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import Themes from './themes.json'
import { useCombineCallbacks } from './util';
import * as storage from "./asyncStorage"

/** This wraps the main an a 'context' so that all the children can access the theme */
export const ThemeContext = React.createContext();

Themes.MD3 = {
    "light": {
        "colors": MD3LightTheme.colors
    } ,
    "dark": {
        "colors": MD3DarkTheme.colors
    }
}

Themes.Default = {
    "light": {
        "colors": {
            "surface": "#ffffff",
            "outline": "#000000"
        }
    },
    "dark": {
        "colors": {
            ...MD3DarkTheme.colors,
            "primary": "#ffffff",
            "secondary": "#ffffff",
            "tertiary": "#ffffff",
            "onSurfaceVariant": "#ffffff",
            "onSurface": "#ffffff",
            "primaryContainer": "#505050"
        }
    }
}


themeState = {
    currentColor: "aquamarine", // default
    isDarkMode: false,

    theme: null,
    getAsTheme: () => {
        return {
            ...MD3LightTheme,
            myOwnProperty: true,
            colors: themeState.theme
        };
    },

    changeColor: (color) => {
        themeState.currentColor = color
        themeState._update()
    },
    changeDarkMode: (isDark) => {
        themeState.isDarkMode = isDark
        themeState._update()
    },
    _update: () => {
        console.log("Changed theme to", themeState.currentColor, themeState.isDarkMode ? "dark" : "light")
        themeState.theme = Themes[themeState.currentColor][themeState.isDarkMode ? "dark" : "light"]
        themeState.updaters.forEach(x => x())

        storage.storeData("isDarkMode", themeState.isDarkMode.toString())
        storage.storeData("currentColor", themeState.currentColor)
    }, 
    _load: () => {
        console.log("loading theme", themeState.currentColor, themeState.isDarkMode ? "dark" : "light")
        themeState.theme = Themes[themeState.currentColor][themeState.isDarkMode ? "dark" : "light"]
        themeState.updaters.forEach(x => x())
    },

    listThemes: () => Themes,
    updaters: []
}

themeState._load()

const combineCallbacks = useCombineCallbacks(2, themeState._load)
storage.getData("isDarkMode", (isDark) => {
    themeState.isDarkMode = (isDark === "true")
    combineCallbacks()
})
storage.getData("currentColor", (color) => {
    themeState.currentColor = color
    combineCallbacks()
})


export function AppContextProvider(props) {

    return (
        <ThemeContext.Provider value={themeState} >
            {props.children}
        </ThemeContext.Provider>
    )
}