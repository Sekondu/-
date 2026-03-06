import { useContext, useState } from "react"
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Button, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, useWindowDimensions } from "react-native"
import { PillContext } from "./PillContext"
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from "@expo/vector-icons"
import { v4 as uuidv4 } from 'uuid'
import 'react-native-get-random-values';
import { SchedulePillNotification } from './Notifications';

export function Add_medecine({ navigation }) {

    const { state, dispatch } = useContext(PillContext);
    const { width, height } = useWindowDimensions();
    const [Name, setName] = useState("");
    const [pillCount, setPillCount] = useState(null);
    const [nameError, setNameError] = useState(false);

    const [openTime, setOpenTime] = useState(false);
    const [time, setTime] = useState(new Date());

    const [missingName, setMissingName] = useState(false);
    const [missingPill, setMissingPill] = useState(false);

    const [moreInfo, setmoreInfo] = useState("");


    function check_name(name) {
        return state.some(pill => pill.Name.toLowerCase() == name.toLowerCase());
    }

    const onChange = (event, selectedTime) => {
        setOpenTime(Platform.OS === "ios");
        if (selectedTime) {
            setTime(selectedTime);
        }
    }

    const handleSubmit = () => {
        if (Name.length === 0) {
            setMissingName(true);
            return;
        }
        if (!pillCount) {
            setMissingPill(true);
            return;
        }
        if (!missingName && !missingPill) {
            const payload = {
                id: uuidv4(),
                Name: Name,
                pillCount: pillCount,
                time_to_take: time,
            }
            dispatch({ type: "add_medecine", payload });
            navigation.goBack();
        }
    }

    return <View style={{ flex: 1, backgroundColor: "transparent" }}>
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "transparent" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingBottom: height * 0.1, borderRadius: 20, backgroundColor: "#F9F9F9", zIndex: 1, display: "flex", gap: height * 0.012 }}>
                    <Text allowFontScaling={false} style={{ fontFamily: "ZillaSlab_700Bold", textAlign: "center", marginTop: height * 0.04, fontSize: width * 0.07 }}>Add Medication</Text>
                    <View style={{ display: "flex", flexDirection: "row", width: "70%", alignSelf: "center", marginTop: height * 0.05 }}>
                        <View>
                            <Text allowFontScaling={false} style={{ fontFamily: "SpaceMono_400Regular", marginBottom: height * 0.012, fontWeight: "bold", fontSize: width * 0.045, color: "grey" }}>Name</Text>
                            <TextInput allowFontScaling={false} onChangeText={
                                (text) => {
                                    setName(text);
                                    setMissingName(Name.length > 0 ? false : true);
                                    let checker = check_name(text);
                                    if (checker) {
                                        setNameError(true);
                                    } else {
                                        setNameError(false);
                                    }

                                }
                            } placeholder="eg. Panadol" placeholderTextColor={"grey"} style={{ fontFamily: "ZillaSlab_400Regular", backgroundColor: "white", width: width * 0.65, height: height * 0.08, padding: 5, fontSize: width * 0.05, borderBottomWidth: 0.3, borderBottomColor: "grey" }} />
                            {nameError && <Text style={{ fontFamily: "SpaceMono_400Regular", fontSize: width * 0.038, marginTop: height * 0.006, marginLeft: width * 0.01, fontWeight: "bold", color: "red" }}>Name Already Used!</Text>}
                            {!nameError && Name.length > 0 && <Text style={{ fontFamily: "SpaceMono_400Regular", fontSize: width * 0.038, marginTop: height * 0.006, marginLeft: width * 0.01, fontWeight: "bold" }}>Name is Available!</Text>}
                            {missingName && <Text style={{ fontFamily: "SpaceMono_400Regular", fontSize: width * 0.038, marginTop: height * 0.006, marginLeft: width * 0.01, fontWeight: "bold", color: "red" }}>This field is Mandatory!</Text>}
                        </View>
                    </View>

                    <View style={{ display: "flex", flexDirection: "row", width: "70%", alignSelf: "center", marginTop: height * 0.05 }}>
                        <View>
                            <Text allowFontScaling={false} style={{ fontFamily: "SpaceMono_400Regular", marginBottom: height * 0.012, fontWeight: "bold", fontSize: width * 0.045, color: "grey" }}>Number of Pills</Text>
                            <TextInput allowFontScaling={false} keyboardType="numeric" onChangeText={
                                (text) => {
                                    setPillCount(Number(text));
                                    setMissingPill(Number(text) >= 0 ? false : true);
                                }
                            } placeholder="eg. 20" placeholderTextColor={"grey"} style={{ fontFamily: "ZillaSlab_400Regular", backgroundColor: "white", width: width * 0.65, height: height * 0.08, padding: 5, fontSize: width * 0.05, borderBottomWidth: 0.3, borderBottomColor: "grey" }} />
                            {missingPill && <Text style={{ fontFamily: "SpaceMono_400Regular", fontSize: width * 0.038, marginTop: height * 0.006, marginLeft: width * 0.01, fontWeight: "bold", color: "red" }}>This field is Mandatory!</Text>}
                        </View>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", width: "70%", alignSelf: "center", marginTop: height * 0.05 }}>
                        <TouchableOpacity onPress={() => { setOpenTime(!openTime) }}>
                            <Text allowFontScaling={false} style={{ fontFamily: "SpaceMono_400Regular", fontWeight: "bold", backgroundColor: "#2D3436", padding: 15, alignSelf: "center", borderRadius: 15, color: "white", width: width * 0.65, textAlign: "center" }}>Pick Time for Notification</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", width: "70%", alignSelf: "center", marginTop: -20, zIndex: -1, }}>
                        <View style={{
                            alignSelf: "center",
                            marginLeft: 3,
                            marginTop: -8,
                            width: width * 0.65,
                            height: height * 0.05,
                            backgroundColor: "white",
                            display: "flex",
                            justifyContent: "flex-end",
                            borderBottomLeftRadius: 15,
                            borderBottomRightRadius: 15
                        }}>
                            <Text allowFontScaling={false} style={{
                                fontFamily: "SpaceMono_400Regular",
                                textAlign: "center",
                                textAlignVertical: "bottom",
                                fontWeight: "bold",
                                fontSize: width * 0.035,
                                width: width * 0.65,
                            }}>{time.getHours() % 12} :{time.getMinutes() < 10 ? 0 : ""}{time.getMinutes()} {time.getHours() < 12 ? "AM" : "PM"}</Text>
                        </View>
                    </View>
                    {openTime && (
                        <TouchableWithoutFeedback onPress={() => { setOpenTime(false) }}>
                            <View
                                style={{
                                    //position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: "transparent",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <View style={{ backgroundColor: "#2D3436" }}>
                                    <DateTimePicker
                                        value={time}
                                        mode="time"
                                        display="spinner"
                                        is24Hour={true}
                                        onChange={onChange}
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    <View style={{ display: "flex", flexDirection: "row", width: "70%", alignSelf: "center" }}>
                        <TouchableOpacity onPress={handleSubmit} style={{ width: width * 0.65, alignSelf: "center", height: height * 0.08, backgroundColor: "white", marginTop: height * 0.05, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 10, boxShadow: "0px 0px 5px lightgrey" }}>
                            <Ionicons name="checkmark" size={width * 0.06} style={{ alignSelf: "center", textAlign: "center" }} /><Text allowFontScaling={false} style={{ fontFamily: "ZillaSlab_400Regular", textAlign: "center", fontSize: width * 0.05 }}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", width: width * 0.65, alignSelf: "center", marginTop: 40 }}>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </View>
}