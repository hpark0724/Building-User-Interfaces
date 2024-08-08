import { NavigationContainer } from "@react-navigation/native";

import BadgerTabs from "./navigation/BadgerTabs";
import { PreferencesProvider } from "./screens/BadgerPreferencesContext";
import CS571 from "@cs571/mobile-client";

export default function BadgerNews(props) {
  return (
    // use useContext hook to provide data to child components
    // through PreferencesProvider component
    <PreferencesProvider>
      <NavigationContainer>
        <BadgerTabs />
      </NavigationContainer>
    </PreferencesProvider>
  );
}
