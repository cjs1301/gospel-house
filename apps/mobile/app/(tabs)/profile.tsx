import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>프로필</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <Text style={styles.text}>내 정보를 관리하세요.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
    text: {
        fontSize: 16,
    },
});
