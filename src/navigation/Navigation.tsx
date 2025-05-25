import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import MainNavigation from "./MainNavigation";
import { navigationRef } from "../utils/NavigationUtils";


const Navigation:React.FC = () =>{
    return(
        <NavigationContainer ref={navigationRef}>
            <MainNavigation/>
        </NavigationContainer>
    )
}

export default Navigation;