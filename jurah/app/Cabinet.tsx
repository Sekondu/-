import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Touchable, Pressable, useWindowDimensions } from "react-native";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { PillContext } from "./PillContext";

export default function Cabinet({ navigation }) {
    const { width, height } = useWindowDimensions();
    const { state, dispatch } = useContext(PillContext);
    const [addMedecine, setAddMedecine] = useState(false);
    console.log(state);

    return <ScrollView style={{ backgroundColor: "white" }} contentContainerStyle={styles.whole_container}>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 25, color: "#50956c" }}>My Cabinet</Text>
        <TouchableOpacity onPress={() => navigation.navigate("add_medecine")} style={{ position: "absolute", left: "90%", width: "100%", top: 0, }}><Ionicons name="add" size={30} color={"#50956c"} /></TouchableOpacity>
        <View style={styles.search_container}>
            <Ionicons name="search" size={25} color={"grey"} style={{}} />
            <TextInput style={{ width: "100%", height: 50, borderRadius: 15, fontWeight: "bold", opacity: 0.6 }} placeholder="Search Medications..." placeholderTextColor={"grey"} />
        </View>
        <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ width: "50%" }}>
                <View style={{ width: "90%", borderWidth: 0.5, borderRadius: 15, padding: 20 }}>
                    <View style={{ display: "flex", justifyContent: "space-between", width: "100%", flexDirection: "row" }}>
                        <Ionicons name="medkit-outline" color={"#50956c"} size={30} style={{ display: "flex", justifyContent: "center", paddingTop: 7, textAlign: "center", backgroundColor: "lightgreen", width: 50, height: 50, borderRadius: 10 }} />
                        <Text style={{ color: "#50956c", fontWeight: "bold", backgroundColor: "lightgreen", width: width * 0.15, padding: 5, height: height * 0.04, borderRadius: 10, textAlign: "center" }}>Active</Text>
                    </View>
                    <Text style={{ marginTop: 10, fontSize: 20, color: "grey" }}>Total Meds</Text>
                    <Text style={{ fontWeight: "bold", fontSize: 24 }}>{state.length}</Text>
                </View>
            </View>
            <View style={{ width: "50%" }}>
                <View style={{ width: "90%", borderWidth: 0.5, borderRadius: 15, padding: 20, alignSelf: "flex-end" }}>
                    <View style={{ display: "flex", justifyContent: "space-between", width: "100%", flexDirection: "row" }}>
                        <Ionicons name="warning" color={"#a56133"} size={30} style={{ display: "flex", justifyContent: "center", paddingTop: 7, textAlign: "center", backgroundColor: "#e7bba1", width: 50, height: 50, borderRadius: 10 }} />
                        <Text style={{ color: "#a56133", fontWeight: "bold", backgroundColor: "#e7bba1", width: width * 0.15, padding: 5, height: height * 0.04, borderRadius: 10, textAlign: "center" }}>Action</Text>
                    </View>
                    <Text style={{ marginTop: 10, fontSize: 20, color: "grey" }}>Low Stock</Text>
                    <Text style={{ fontWeight: "bold", fontSize: 24 }}>{state.filter(medecine => medecine.pillCount <= 5).length}</Text>
                </View>
            </View>
        </View>
        <View>
            <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold", fontSize: 24, alignSelf: "center" }}>Needs Refill</Text>
                <Text style={{ backgroundColor: "#e7bba1", padding: 5, borderRadius: 16, width: 32, height: 32, fontWeight: "bold", fontSize: 18, marginLeft: 5, textAlign: "center" }}>{state.filter(medecine => medecine.pillCount <= 5).length}</Text>
            </View>
            <View>
                {state.filter(medecine => medecine.pillCount <= 5).length === 0 &&
                    <View>
                        <Text style={{ width: "100%", textAlign: "center", marginTop: 30, fontWeight: "bold", fontSize: 18 }}>All Medecines are good!</Text>
                    </View>}
                {state.filter(medecine => medecine.pillCount <= 5).length > 0 &&
                    <View style={{ marginTop: 20, display: "flex", width: "100%", gap: 20 }}>
                        {state.map(medecine => {
                            return (medecine.pillCount <= 5 && <TouchableOpacity style={{ display: "flex", flexDirection: "row", height: 100, width: "100%", justifyContent: "space-between", padding: 10, alignItems: "center", borderWidth: 0.3, borderColor: "red", borderRadius: 10 }}>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Ionicons name="bandage-outline" style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1, padding: 9, backgroundColor: "lightgreen", marginRight: 10 }} size={20} />
                                    <View style={{ alignSelf: "center" }}>
                                        <Text style={{ fontWeight: "bold", fontSize: 20, }}>{medecine.Name}</Text>
                                        <Text style={{ opacity: 0.5 }}>{medecine.more_info != "" ? medecine.more_info : "no extra info specified"}</Text>
                                    </View>
                                </View>
                                <View style={{ alignSelf: "center" }}>
                                    <Text style={{ textAlign: "center" }}>{medecine.pillCount}</Text>
                                    <Text style={{ textAlign: "center" }}>Left</Text>
                                </View>
                                <View style={{ position: "absolute", height: 100, width: 10, backgroundColor: "red", left: -5, top: 0, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}></View>
                            </TouchableOpacity>)
                        })}
                    </View>
                }
            </View>
        </View>
        <View>
            <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold", fontSize: 24, alignSelf: "center" }}>All Medications</Text>
                <Text style={{ backgroundColor: "lightgreen", padding: 5, borderRadius: 16, width: 32, height: 32, fontWeight: "bold", fontSize: 18, marginLeft: 5, textAlign: "center" }}>{state.length}</Text>
            </View>
            <View>
                {state.length === 0 &&
                    <View>
                        <TouchableOpacity onPress={(() => navigation.navigate("add_medecine"))}>
                            <Text style={{ width: width * 0.5, textAlign: "center", marginTop: 30, fontWeight: "bold", fontSize: 18, backgroundColor: "lightgreen", alignSelf: "center", borderRadius: 10, padding: 10 }}>Add yout first Medecine</Text>
                        </TouchableOpacity>
                    </View>}
                {state.length > 0 &&
                    <View style={{ marginTop: 20, display: "flex", width: "100%", gap: 20 }}>
                        {state.map(medecine => {
                            return (<TouchableOpacity key={medecine.id} onPress={() => navigation.navigate("update_medecine", { id: medecine.id })} style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", padding: 10, alignItems: "space-around", borderWidth: 1, borderRadius: 10 }}>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Ionicons name="bandage-outline" style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1, padding: 9, backgroundColor: "lightgreen", marginRight: 10 }} size={20} />
                                    <View style={{ alignSelf: "center" }}>
                                        <Text style={{ fontWeight: "bold", fontSize: 20, }}>{medecine.Name}</Text>
                                        <Text style={{ opacity: 0.5 }}>{medecine.more_info != "" ? medecine.more_info : "no extra info specified"}</Text>
                                    </View>
                                </View>
                                <View style={{ alignSelf: "flex-end" }}>
                                    <Text style={{ textAlign: "center" }}>{medecine.pillCount}</Text>
                                    <Text style={{ textAlign: "center" }}>Left</Text>
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
        gap: 50,
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