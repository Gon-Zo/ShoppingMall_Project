import React , {useEffect} from 'react'
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from "@react-navigation/stack";
const BottomNav = createMaterialBottomTabNavigator();
import Ionicons from "react-native-vector-icons/Ionicons";
import {APP_OS} from "../public/comm";
import {useDispatch, useSelector} from "react-redux";
import {BasketButton} from "./common/button";
import AsyncStorage from '@react-native-community/async-storage';
import * as Screen from './index'
import {onIsTheme, updateLoginData} from "../actions/statics";
import {GET_COLOR, THEME} from "../public/colors";

const BottomNavigation = ({navigation}) => {

    const initData = useSelector(state=>state.Statics , [])

    React.useLayoutEffect(() => {

        navigation.setOptions({
            headerRight: () => (
                <BasketButton navigation={navigation} isLogin={initData.isLogin}/>
            ),
        });

    }, [navigation]);

    const color = GET_COLOR()

    return (
            <BottomNav.Navigator
                initialRouteName="Home"
                activeColor={color.ACTIVE_COLOR}
                inactiveColor={color.INACTIVE_COLOR}
                barStyle={{backgroundColor: color.FG1}}>

                <BottomNav.Screen name="Home"
                                  component={Screen.Home}
                                  options={{
                                      tabBarLabel: "Home",
                                      tabBarIcon: ({color}) => (<Ionicons name={`${APP_OS}-home`} color={color} size={24}/>)
                                  }}
                />

                <BottomNav.Screen name="Store"
                                  component={Screen.Store}
                                  options={{
                                      tabBarLabel: "Store",
                                      tabBarIcon: ({color}) => (<Ionicons name={`${APP_OS}-business`} color={color} size={24}/>)
                                  }}
                />

                <BottomNav.Screen name="Setting"
                                  component={Screen.Setting}
                                  options={{
                                      tabBarLabel: 'Setting',
                                      tabBarIcon: ({color}) => (<Ionicons name={`${APP_OS}-cog`} color={color} size={24}/>),
                                  }}/>

            </BottomNav.Navigator>
    );
};

const Stack = createStackNavigator()

const Router = () => {

    const dispatch = useDispatch()

    useEffect(() => {

        AsyncStorage.getItem('token')
            .then(res => updateLoginData(dispatch, res !== null))
            .catch(err => console.log(err))

        AsyncStorage.getItem("theme")
            .then(res => {
                const text = res == null ? THEME.L : res
                AsyncStorage.setItem("theme", text)
                onIsTheme(dispatch, text == THEME.D)
            })
            .catch(err => console.log(err))

    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Main" component={BottomNavigation}/>
                <Stack.Screen name="Basket" component={Screen.Basket}/>
                <Stack.Screen name="Login" component={Screen.Login}/>
                <Stack.Screen name="SignUp" component={Screen.SignUp}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Router

