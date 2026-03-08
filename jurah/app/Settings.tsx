import { Text, View, TouchableOpacity, useWindowDimensions, StyleSheet, ScrollView } from "react-native";
import i18n from "./i18n";
import { useContext } from "react";
import { LanguageContext } from "./LanguageContext";

export default function Settings() {

    const { width, height } = useWindowDimensions();
    const { language, changeLanguage } = useContext(LanguageContext);

    return (
        <ScrollView style={{ backgroundColor: "#F9F9F9" }} contentContainerStyle={[{ flexGrow: 1 }, styles.whole_container]}>
            <Text allowFontScaling={false} style={{ fontFamily: language === 'ar' ? undefined : "RobotoSlab_400Regular", textAlign: "center", fontWeight: "bold", fontSize: width * 0.09, color: "#2D3436" }}>{i18n.t("settings", { locale: language })}</Text>
            <View style={{ display: "flex", flexDirection: language === "ar" ? "row-reverse" : "row", width: "80%", justifyContent: "space-between", alignSelf: "center" }}>
                <Text>{i18n.t("language", { locale: language })}</Text>
                <TouchableOpacity onPress={() => changeLanguage(language === 'en' ? 'ar' : 'en')}>
                    <Text>{language === 'en' ? i18n.t("english", { locale: language }) : i18n.t("arabic", { locale: language })}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    whole_container: {
        width: "90%",
        alignSelf: "center",
        marginTop: 40,
        display: "flex",
        gap: 50,
        paddingBottom: 50
    }
})