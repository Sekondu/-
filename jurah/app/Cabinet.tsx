import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Touchable, Pressable, useWindowDimensions } from "react-native";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { PillContext } from "./PillContext";

export default function Cabinet({ navigation }) {
    const { width, height } = useWindowDimensions();
    const { state, dispatch } = useContext(PillContext);
    const [addMedecine, setAddMedecine] = useState(false);
    console.log(state);

    return <ScrollView style={{ backgroundColor: "white" }} contentContainerStyle={[{ flexGrow: 1 }, styles.whole_container]}>
        <Text allowFontScaling={false} style={{ textAlign: "center", fontWeight: "bold", fontSize: width * 0.06, color: "#50956c" }}>My Cabinet</Text>
        <TouchableOpacity onPress={() => navigation.navigate("add_medecine")} style={{ position: "absolute", left: "90%", width: "100%", top: 0, }}><Ionicons name="add" size={width * 0.08} color={"#50956c"} /></TouchableOpacity>
        <View style={styles.search_container}>
            <Ionicons name="search" size={width * 0.06} color={"grey"} style={{}} />
            <TextInput allowFontScaling={false} style={{ width: "100%", height: height * 0.06, borderRadius: 15, fontWeight: "bold", opacity: 0.6, fontSize: width * 0.04 }} placeholder="Search Medications..." placeholderTextColor={"grey"} />
        </View>
        <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ width: "50%" }}>
                <View style={{ width: "90%", borderWidth: 0.5, borderRadius: 15, padding: 20 }}>
                    <View style={{ display: "flex", justifyContent: "space-between", width: "100%", flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Ionicons name="medkit-outline" color={"#50956c"} size={width * 0.08} style={{ display: "flex", justifyContent: "center", paddingTop: height * 0.01, textAlign: "center", backgroundColor: "lightgreen", width: width * 0.12, height: width * 0.12, borderRadius: 10 }} />
                        <Text allowFontScaling={false} adjustsFontSizeToFit={true} numberOfLines={1} style={{ color: "#50956c", fontWeight: "bold", backgroundColor: "lightgreen", width: width * 0.18, height: height * 0.04, borderRadius: 10, textAlign: "center", textAlignVertical: "center", fontSize: width * 0.035 }}>Active</Text>
                    </View>
                    <Text allowFontScaling={false} style={{ marginTop: height * 0.01, fontSize: width * 0.05, color: "grey" }}>Total Meds</Text>
                    <Text allowFontScaling={false} style={{ fontWeight: "bold", fontSize: width * 0.06 }}>{state.length}</Text>
                </View>
            </View>
            <View style={{ width: "50%" }}>
                <View style={{ width: "90%", borderWidth: 0.5, borderRadius: 15, padding: 20, alignSelf: "flex-end" }}>
                    <View style={{ display: "flex", justifyContent: "space-between", width: "100%", flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Ionicons name="warning" color={"#a56133"} size={width * 0.08} style={{ display: "flex", justifyContent: "center", paddingTop: height * 0.01, textAlign: "center", backgroundColor: "#e7bba1", width: width * 0.12, height: width * 0.12, borderRadius: 10 }} />
                        <Text allowFontScaling={false} adjustsFontSizeToFit={true} numberOfLines={1} style={{ color: "#a56133", fontWeight: "bold", backgroundColor: "#e7bba1", width: width * 0.18, height: height * 0.04, borderRadius: 10, textAlign: "center", textAlignVertical: "center", fontSize: width * 0.035 }}>Action</Text>
                    </View>
                    <Text allowFontScaling={false} style={{ marginTop: height * 0.01, fontSize: width * 0.05, color: "grey" }}>Low Stock</Text>
                    <Text allowFontScaling={false} style={{ fontWeight: "bold", fontSize: width * 0.06 }}>{state.filter(medecine => medecine.pillCount <= 5).length}</Text>
                </View>
            </View>
        </View>
        <View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Text allowFontScaling={false} style={{ fontWeight: "bold", fontSize: width * 0.06 }}>Needs Refill</Text>
                <Text allowFontScaling={false} adjustsFontSizeToFit={true} numberOfLines={1} style={{ backgroundColor: "#e7bba1", padding: 5, borderRadius: 16, width: width * 0.08, height: width * 0.08, fontWeight: "bold", fontSize: width * 0.035, marginLeft: 5, textAlign: "center", textAlignVertical: "center" }}>{state.filter(medecine => medecine.pillCount <= 5).length}</Text>
            </View>
            <View>
                {state.filter(medecine => medecine.pillCount <= 5).length === 0 &&
                    <View>
                        <Text style={{ width: "100%", textAlign: "center", marginTop: height * 0.04, fontWeight: "bold", fontSize: width * 0.045 }}>All Medecines are good!</Text>
                    </View>}
                {state.filter(medecine => medecine.pillCount <= 5).length > 0 &&
                    <View style={{ marginTop: height * 0.02, display: "flex", width: "100%", gap: height * 0.02 }}>
                        {state.map(medecine => {
                            return (medecine.pillCount <= 5 && <TouchableOpacity key={medecine.id} style={{ display: "flex", flexDirection: "row", height: height * 0.12, width: "100%", justifyContent: "space-between", padding: width * 0.03, alignItems: "center", borderWidth: 0.3, borderColor: "red", borderRadius: 10 }}>
                                <View style={{ display: "flex", flexDirection: "row", width: "70%" }}>
                                    <Ionicons name="bandage-outline" style={{ width: width * 0.1, height: width * 0.1, borderRadius: 10, borderWidth: 1, padding: width * 0.020, backgroundColor: "lightgreen", marginRight: 10 }} size={width * 0.05} />
                                    <View style={{ alignSelf: "center", flexShrink: 1 }}>
                                        <Text style={{ fontWeight: "bold", fontSize: width * 0.05, }}>{medecine.Name}</Text>
                                        <Text style={{ opacity: 0.5, fontSize: width * 0.030 }} numberOfLines={1}>{medecine.more_info != "" ? medecine.more_info : "no extra info specified"}</Text>
                                    </View>
                                </View>
                                <View style={{ alignSelf: "center", width: "20%" }}>
                                    <Text style={{ textAlign: "center", fontSize: width * 0.04 }}>{medecine.pillCount}</Text>
                                    <Text style={{ textAlign: "center", fontSize: width * 0.035 }}>Left</Text>
                                </View>
                                <View style={{ position: "absolute", height: "130%", width: 10, backgroundColor: "red", left: -1, top: 0, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}></View>
                            </TouchableOpacity>)
                        })}
                    </View>
                }
            </View>
        </View>
        <View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Text allowFontScaling={false} style={{ fontWeight: "bold", fontSize: width * 0.06 }}>All Medications</Text>
                <Text allowFontScaling={false} style={{ backgroundColor: "lightgreen", padding: 5, borderRadius: 16, width: width * 0.08, height: width * 0.08, fontWeight: "bold", fontSize: width * 0.045, marginLeft: 5, textAlign: "center" }}>{state.length}</Text>
            </View>
            <View>
                {state.length === 0 &&
                    <View>
                        <TouchableOpacity onPress={(() => navigation.navigate("add_medecine"))}>
                            <Text style={{ width: width * 0.5, textAlign: "center", marginTop: height * 0.04, fontWeight: "bold", fontSize: width * 0.045, backgroundColor: "lightgreen", alignSelf: "center", borderRadius: 10, padding: 10 }}>Add yout first Medecine</Text>
                        </TouchableOpacity>
                    </View>}
                {state.length > 0 &&
                    <View style={{ marginTop: height * 0.02, display: "flex", width: "100%", gap: height * 0.02 }}>
                        {state.map(medecine => {
                            return (<TouchableOpacity key={medecine.id} onPress={() => navigation.navigate("update_medecine", { id: medecine.id })} style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", padding: width * 0.03, alignItems: "space-around", borderWidth: 1, borderRadius: 10 }}>
                                <View style={{ display: "flex", flexDirection: "row", width: "70%" }}>
                                    <Ionicons name="bandage-outline" style={{ width: width * 0.1, height: width * 0.1, borderRadius: 10, borderWidth: 1, padding: width * 0.020, backgroundColor: "lightgreen", marginRight: 10 }} size={width * 0.05} />
                                    <View style={{ alignSelf: "center", flexShrink: 1 }}>
                                        <Text style={{ fontWeight: "bold", fontSize: width * 0.05, }}>{medecine.Name}</Text>
                                        <Text style={{ opacity: 0.5, fontSize: width * 0.030 }} numberOfLines={1}>{medecine.more_info != "" ? medecine.more_info : "no extra info specified"}</Text>
                                    </View>
                                </View>
                                <View style={{ alignSelf: "flex-end", width: "20%" }}>
                                    <Text style={{ textAlign: "center", fontSize: width * 0.04 }}>{medecine.pillCount}</Text>
                                    <Text style={{ textAlign: "center", fontSize: width * 0.035 }}>Left</Text>
                                </View>
                            </TouchableOpacity>)
                        })}
                    </View>
                }
            </View>
        </View>
        <View>

        </View>
    </ScrollView>

}



const styles = StyleSheet.create({
    whole_container: {
        width: "90%",
        alignSelf: "center",
        marginTop: 40,
        display: "flex",
        gap: 30,
        paddingBottom: 50
    },
    search_container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 50,
        borderRadius: 15,
        borderColor: "grey",
        borderWidth: 1,
        paddingLeft: 10,
        gap: 10
    }
})