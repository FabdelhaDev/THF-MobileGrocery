import {Stylesheet, Text, View} from "react-native";

function WelcomeScreen() {  
    return (
        <View style={styles.rootcontainer}>
            <Text style={styles.title}>You have successfully authenticated... Welcome to Grocery App!</Text>
            <Text style={styles.subtitle}>Your personal grocery list manager.</Text>
        </View>
    );
}

export default WelcomeScreen;

const styles = Stylesheet.create({
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
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});
