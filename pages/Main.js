import React from 'react'
import { BottomNavigation } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';


import { ErrorPage, InfoPage } from './ErrorPage';
import { checkOnline, httpRequest, setApiEndpoint } from './server'
import { Records } from './Records';
import { Scout } from './Scout';
import { Settings, getServerURL, setServerURL, getUsername, setUsername } from './Settings';
import { useCombineCallbacks, useForceUpdate } from './util';

import * as storage from "./asyncStorage"


import { useContext } from 'react'
import { ThemeContext } from "./AppContextProvider";



let scheme, meta, teamData
let state, changeState;

function getDataFromServer(callback) {
  checkOnline((isOnline) => {
    if (isOnline) {
      let checkIfFinishedRequestingAll = useCombineCallbacks(3, () => {
        console.log("Finished updating data")
        callback(scheme, meta, teamData)
      })

      httpRequest("/scheme.json", (data) => {scheme = JSON.parse(data); checkIfFinishedRequestingAll()})
      httpRequest("/meta.json", (data) => {meta = JSON.parse(data); checkIfFinishedRequestingAll()})
      httpRequest("/teamData", (data) => {teamData = JSON.parse(data); checkIfFinishedRequestingAll()})
    } else {
      changeState("networkerr")
    }
  })
}


const settingsPage = () => <Settings setAPI={setAPI} />;
let scoutPage // putting it outside render function so that it saves the page when using BottomNavigation
let recordsPage

function initialLoad() {
  getDataFromServer(() => {
    scoutPage = () =>  <Scout scheme={scheme} meta={meta} teamData={teamData} usernameSupplier={getUsername} />
    recordsPage = () => <Records scheme={scheme} meta={meta} teamData={teamData} reloadData={getDataFromServer}/>
    changeState("showing")
  })
}


function setAPI() {
  setApiEndpoint(getServerURL())
  initialLoad()
}

let initialState
if (getServerURL()) {
  initialState = "loading"
  setAPI()
} else {
  initialState = "noapi"
}

storage.getData("username", (text) => setUsername(text))
storage.getData("serverUrl", (url) => {
    setServerURL(url)
    setAPI()
})

export default function Main() {
  // console.log(useContext)
  // let themeState = useContext(ThemeContext)
  // let forceUpdate = useForceUpdate()
  // themeState.updaters.push(forceUpdate)

  [state, changeState] = React.useState(initialState)  // loading, networkerr, showing, noapi

  
  if (state === "loading") {
    scoutPage = () => <ActivityIndicator animating={true} size="large" style={{ display: 'flex', flex: 1 }} />
    recordsPage = () => <ActivityIndicator animating={true} size="large" style={{ display: 'flex', flex: 1 }} />
  } else if (state === "networkerr") {
    scoutPage = () => <ErrorPage message="Server is not online"/>
    recordsPage = () => <ErrorPage message="Server is not online" />
  } else if (state === "showing") {
    
  } else if (state === "noapi") {
    scoutPage = () => <InfoPage message="No server endpoint set. Please set one in Settings."/>
    recordsPage = () => <InfoPage message="No server endpoint set. Please set one in Settings."/>
  }


  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'scout', title: 'Scout', focusedIcon: 'clipboard-edit-outline'},
    { key: 'records', title: 'Records', focusedIcon: 'database-search' },
    { key: 'settings', title: 'Settings', focusedIcon: 'cogs' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    scout: scoutPage,
    records: recordsPage,
    settings: settingsPage,
  });


  return (
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        
      />
    </SafeAreaProvider>
  );
}