import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { ThemeContext } from './AppContextProvider';
import { useContext } from 'react';
import { useForceUpdate } from './util';


export function ErrorPage({message}) {
    const theme = useContext(ThemeContext).theme.colors

    return (
        <View style={{ 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background}}>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: theme.error,
                borderWidth: 8,
                padding: 30,
                borderRadius: 10
            }}>
                <Text style={{
                    fontWeight: 800,
                    fontSize: 45,
                    color: theme.error
                }}>Error</Text>
                
                <Text style={{
                    fontSize: 20,
                    marginTop: 0,
                    width: 200,
                    color: theme.onErrorContainer,
                    textAlign: "center"
                }}>{message}</Text>
            </View>

        </View>
    )
}

export function InfoPage({message}) {
    const theme = useContext(ThemeContext).theme.colors
    useContext(ThemeContext).updaters.push(useForceUpdate())


    return (
        <View style={{ 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background}}>

            <Text style={{
                fontWeight: 800,
                fontSize: 45,
                color: theme.primary
            }}>Info</Text>
            
            <Text style={{
                fontSize: 16,
                marginTop: 0,
                width: 200,
                color: theme.secondary
            }}>{message}</Text>

        </View>
    )
}