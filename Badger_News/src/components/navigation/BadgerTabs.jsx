import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import BadgerNewsScreen from "../screens/BadgerNewsScreen";
import BadgerPreferencesScreen from "../screens/BadgerPreferencesScreen";
import BadgerNewsScreenDetails from "../screens/BadgerNewsScreenDetails";

const BadgerTab = createBottomTabNavigator();
const BadgerNewsStack = createStackNavigator();

function BadgerTabs(props) {
  return (
    <BadgerTab.Navigator>
      <BadgerTab.Screen name="News" options={{ headerShown: false }}>
        {() => (
          <BadgerNewsStack.Navigator>
            <BadgerNewsStack.Screen
              // shows the list of news articles screen
              name="NewsList"
              component={BadgerNewsScreen}
              options={{ headerShown: false }}
            />
            <BadgerNewsStack.Screen
              // shows the selected news article screen
              name="Article"
              component={BadgerNewsScreenDetails}
            />
          </BadgerNewsStack.Navigator>
        )}
      </BadgerTab.Screen>
      <BadgerTab.Screen
        // shows the Preferences screen that enables
        // users to apply news preferences
        name="Preferences"
        component={BadgerPreferencesScreen}
        options={{ headerShown: false }}
      />
    </BadgerTab.Navigator>
  );
}

export default BadgerTabs;
