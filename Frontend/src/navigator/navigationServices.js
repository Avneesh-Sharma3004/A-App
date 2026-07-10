// src/navigation/navigationServices.js
import React from "react";
import { StackActions, CommonActions } from "@react-navigation/native";

export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();

/** Universal helper: only run navigation if ready */
function runIfReady(action) {
    if (isReadyRef.current && navigationRef.current) {
        action();
    }
}

/* Simple actions */
function navigate(name, params) {
    runIfReady(() => navigationRef.current.navigate(name, params));
}

function goBack() {
    runIfReady(() => navigationRef.current.goBack());
}

function push(name, params) {
    runIfReady(() => navigationRef.current.dispatch(StackActions.push(name, params)));
}

function pop(count = 1) {
    runIfReady(() => navigationRef.current.dispatch(StackActions.pop(count)));
}

function replace(name, params) {
    runIfReady(() => navigationRef.current.dispatch(StackActions.replace(name, params)));
}

/* Reset actions */
function reset(state) {
    runIfReady(() => navigationRef.current.dispatch(CommonActions.reset(state)));
}

function resetTo(routeName, params) {
    reset({
        index: 0,
        routes: [{ name: routeName, params }],
    });
}

/** Reset to Bottom Tab + open specific tab */
function resetToTab(tabName, tabParams) {
    const params =
        tabParams != null
            ? { screen: tabName, params: tabParams }
            : { screen: tabName };

    reset({
        index: 0,
        routes: [
            {
                name: "BottomNavigation",
                params,
            },
        ],
    });
}

export default {
    navigate,
    goBack,
    push,
    pop,
    replace,
    reset,
    resetTo,
    resetToTab,
    getNavigator: () => navigationRef,
};