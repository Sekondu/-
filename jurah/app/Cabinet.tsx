import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Touchable, Pressable, useWindowDimensions } from "react-native";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { PillContext } from "./PillContext";

export default function Cabinet({ navigation }) {
    const { width, height } = useWindowDimensions();
    const { state, dispatch } = useContext(PillContext);
    const [addMedecine, setAddMedecine] = useState(false);
    console.log(state);

    return <ScrollView style={{ backgroundColor: "#F9F9F9" }} contentContainerStyle={[{ flexGrow: 1 }, styles.whole_container]}>
        <Text allowFontScaling={false} style={{ fontFamily: "RobotoSlab_400Regular", textAlign: "center", fontWeight: "bold", fontSize: width * 0.09, color: "#2D3436" }}>Cabinet</Text>
        <TouchableOpacity onPress={() => navigation.navigate("add_medecine")} style={{ position: "absolute", left: "90%", width: "100%", top: `${height * 0.0012}%`, }}><Ionicons name="add" size={width * 0.09} color={"#2D3436"} /></TouchableOpacity>
        <View style={styles.search_container}>
            <Ionicons name="search" size={width * 0.06} color={"grey"} style={{}} />
            <TextInput allowFontScaling={false} style={{ fontFamily: "SpaceMono_400Regular", width: "100%", height: height * 0.06, borderWidth: 0, fontWeight: "bold", opacity: 0.6, fontSize: width * 0.04 }} placeholder="Search Medications..." placeholderTextColor={"grey"} />
        </View>
        <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 0.3, borderBottomColor: "grey" }}>
                <View style={{ width: "50%", padding: 20 }}>
                    <View style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "start", gap: 5 }}>
                        <Text allowFontScaling={false} adjustsFontSizeToFit={true} numberOfLines={1} style={{ fontFamily: "SpaceMono_400Regular", color: "grey", fontWeight: "bold", width: width * 0.15, height: height * 0.022, borderRadius: 10, fontSize: width * 0.035 }}>Active</Text>
                        <Text allowFontScaling={false} style={{ fontFamily: "SpaceMono_400Regular", fontWeight: "bold", fontSize: width * 0.06, paddingLeft: width * 0.02 }}>{state.length}</Text>
                    </View>
                </View>
                <View style={{ width: "50%", padding: 20 }}>
                    <View style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "flex-end", gap: 5 }}>
                        <Text allowFontScaling={false} adjustsFontSizeToFit={true} numberOfLines={1} style={{ fontFamily: "SpaceMono_400Regular", color: "grey", fontWeight: "bold", width: width * 0.15, height: height * 0.022, borderRadius: 10, fontSize: width * 0.035 }}>Action</Text>
                        <Text allowFontScaling={false} style={{ fontFamily: "SpaceMono_400Regular", fontWeight: "bold", fontSize: width * 0.06, paddingRight: width * 0.07, color: "red" }}>{state.filter(medecine => medecine.pillCount <= 5).length}</Text>
                    </View>
                </View>
            </View>
        </View>
        <View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: `${height * 0.05}` }}>
                <Text allowFontScaling={false} style={{ fontFamily: "SpaceMono_700Bold", fontWeight: "bold", fontSize: width * 0.04 }}>Priority Refills</Text>
            </View>
            <View>
                {state.filter(medecine => medecine.pillCount <= 5).length === 0 &&
                    <View>
                        <Text style={{ fontFamily: "SpaceMono_400Regular", width: "100%", color: "grey", textAlign: "center", marginTop: height * 0.04, fontSize: width * 0.035 }}>No Medecines To Refill!</Text>
                    </View>}
                {state.filter(medecine => medecine.pillCount <= 5).length > 0 &&
                    <View style={{ marginTop: height * 0.02, display: "flex", width: "100%" }}>
                        {state.map(medecine => {
                            return (medecine.pillCount <= 5 && <TouchableOpacity onPress={() => navigation.navigate("update_medecine", { id: medecine.id })} key={medecine.id} style={{ display: "flex", flexDirection: "row", height: height * 0.12, width: "100%", justifyContent: "space-between", padding: width * 0.03, alignItems: "center", borderLeftColor: `${medecine.pillCount <= 3 ? "red" : "orange"}`, borderLeftWidth: 2, borderBottomColor: `${medecine.pillCount <= 3 ? "red" : "orange"}`, borderBottomWidth: 0.5 }}>
                                <View style={{ display: "flex", flexDirection: "row", width: "70%" }}>
                                    <View style={{ alignSelf: "center", flexShrink: 1 }}>
                                        <Text style={{ fontFamily: "NotoSerif_400Regular", fontWeight: "bold", fontSize: width * 0.05, }}>{medecine.Name}</Text>
                                        <Text style={{ fontFamily: "SpaceMono_400Regular", opacity: 0.5, fontSize: width * 0.030 }} numberOfLines={1}>{medecine.more_info != "" ? medecine.more_info : "no extra info specified"}</Text>
                                    </View>
                                </View>
                                <View style={{ display: "flex", justifyContent: "center", alignSelf: "center", width: "25%", gap: 10 }}>
                                    <Text style={{ fontFamily: "SpaceMono_400Regular", fontSize: width * 0.03, width: width * 0.5, textAlign: "start", color: `${medecine.pillCount <= 3 ? "red" : "orange"}` }}>{medecine.pillCount} doses left</Text>
                                    <View>
                                        <Text style={{ fontFamily: "SpaceMono_400Regular", alignSelf: "flex-end", fontSize: width * 0.03 }}>Refill</Text>
                                        <View style={{ position: "absolute", top: "100%", left: "45%", width: width * 0.12, height: 2, backgroundColor: "green" }}></View>
                                    </View>
                                </View>
                            </TouchableOpacity>)
                        })}
                    </View>
                }
            </View>
        </View>
        <View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Text allowFontScaling={false} style={{ fontFamily: "SpaceMono_700Bold", fontWeight: "bold", fontSize: width * 0.04 }}>Priority Refills</Text>
            </View>
            <View>
                {state.length === 0 &&
                    <View>
                        <TouchableOpacity onPress={(() => navigation.navigate("add_medecine"))}>
                            <Text style={{ width: width * 0.5, textAlign: "center", marginTop: height * 0.04, fontWeight: "bold", fontSize: width * 0.045, backgroundColor: "lightgreen", alignSelf: "center", borderRadius: 10, padding: 10 }}>Add yout first Medecine</Text>
                        </TouchableOpacity>
                    </View>}
                {state.length > 0 &&
                    <View style={{ marginTop: height * 0.02, display: "flex", width: "100%" }}>
                        {state.map(medecine => {
                            return (<TouchableOpacity onPress={() => navigation.navigate("update_medecine", { id: medecine.id })} key={medecine.id} style={{ display: "flex", flexDirection: "row", height: height * 0.12, width: "100%", justifyContent: "space-between", padding: width * 0.03, alignItems: "center", borderLeftColor: `lightgreen`, borderLeftWidth: 2, borderBottomColor: `lightgreen`, borderBottomWidth: 0.5 }}>
                                <View style={{ display: "flex", flexDirection: "row", width: "70%" }}>
                                    <View style={{ alignSelf: "center", flexShrink: 1 }}>
                                        <Text style={{ fontFamily: "NotoSerif_400Regular", fontWeight: "bold", fontSize: width * 0.05, }}>{medecine.Name}</Text>
                                        <Text style={{ fontFamily: "SpaceMono_400Regular", opacity: 0.5, fontSize: width * 0.030 }} numberOfLines={1}>{medecine.more_info != "" ? medecine.more_info : "no extra info specified"}</Text>
                                    </View>
                                </View>
                                <View style={{ display: "flex", justifyContent: "center", alignSelf: "center", width: "10%", gap: 10 }}>
                                    <Text style={{ fontFamily: "SpaceMono_400Regular", fontSize: width * 0.06, width: width * 0.5, textAlign: "end", color: `lightgreen` }}>{medecine.pillCount}</Text>
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
        borderBottomColor: "grey",
        borderBottomWidth: 0.3,
        paddingLeft: 10,
        gap: 10
    }
})