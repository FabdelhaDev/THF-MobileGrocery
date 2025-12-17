import {StyleSheet, Text, View, Button} from "react-native";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTutorial } from "../context/TutorialContext";

function WelcomeScreen() {  
    
    console.log("WelcomeScreen is rendering!");

    const navigation = useNavigation();
    const { state: tutorialState } = useTutorial();
    
    // function to handle the go to tabs button  TODO:  Need to finish proper implementation.
    function handleGoToTabs() {
        if (tutorialState.isActive) {
            navigation.navigate("Tabs");
        } else {
            navigation.navigate("Tabs"); 
        }
    }

    return (
        <View style={styles.rootcontainer}>
            <Text style={styles.title}>You have successfully authenticated... Welcome to Grocery App!</Text>
            <Text style={styles.subtitle}>Your personal grocery list manager.</Text>
            <Button title="Go to Tabs" onPress={() => navigation.navigate("Tabs")} />
        </View>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    rootcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        padding: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});
