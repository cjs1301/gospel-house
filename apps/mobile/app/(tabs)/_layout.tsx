import React from "react";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import Colors from "@/constants/Colors";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colorScheme === "dark" ? "#fff" : "#000",
                tabBarStyle: {
                    backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
                },
                headerShown: useClientOnlyValue(false, true),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "홈",
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="worship"
                options={{
                    title: "예배",
                    tabBarIcon: ({ color }) => <TabBarIcon name="music" color={color} />,
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: "커뮤니티",
                    tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "프로필",
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                }}
            />
        </Tabs>
    );
}
