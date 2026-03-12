import { useContext, useState } from "react"
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, useWindowDimensions } from "react-native"
import { PillContext } from "./PillContext"
import { ScheduleContext } from "./ScheduleContext"
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from "@expo/vector-icons"
import { v4 as uuidv4 } from 'uuid'
import 'react-native-get-random-values';
import { SchedulePillNotification } from './Notifications';
import { Picker } from '@react-native-picker/picker';
import { LanguageContext } from "./LanguageContext";
import i18n from "./i18n";

export function Add_schedule({ navigation }) {

    const { state, dispatch } = useContext(PillContext);
    const { Schedulestate, Scheduledispatch } = useContext(ScheduleContext);
    const { width, height } = useWindowDimensions();
    const { language, changeLanguage } = useContext(LanguageContext);

    const [selectedPillId, setSelectedPillId] = useState(state.length > 0 ? state[0].id : null);
    const [dosage, setDosage] = useState("");
    const [moreInfo, setmoreInfo] = useState("");

    const [openTime, setOpenTime] = useState(false);
    const [time, setTime] = useState(new Date());

    const [missingPill, setMissingPill] = useState(false);
    const [missingDosage, setMissingDosage] = useState(false);

    const [alreadyAdded, setAlreadyAdded] = useState(false);


    const onChange = (event, selectedTime) => {
        setOpenTime(Platform.OS === "ios");
        if (selectedTime) {
            setTime(selectedTime);
        }
    }

    const handleSubmit = () => {
        if (!selectedPillId) {
            setMissingPill(true);
            return;
        }
        if (!dosage || Number(dosage) <= 0) {
            setMissingDosage(true);
            return;
        }

        const selectedMedicine = state.find(p => p.id === selectedPillId);
        console.log(selectedMedicine.id);
        console.log(selectedPillId);

        const alreadyScheduled = Schedulestate.find(schedule => schedule.medicineId === selectedPillId &&
            schedule.time_to_take.getHours() == time.getHours() &&
            schedule.time_to_take.getMinutes() == time.getMinutes())

        if (!alreadyScheduled) {
            const payload = {
                id: uuidv4(),
                medicineId: selectedPillId,
                pillName: selectedMedicine.Name,
                dosage: Number(dosage),
                time_to_take: time,
                more_info: moreInfo,
            }

            Scheduledispatch({ type: "add_schedule", payload });
            SchedulePillNotification(payload, language);
            navigation.goBack();
        }
        setAlreadyAdded(false);
    }

    return <ScrollView contentContainerStyle={{ paddingBottom: height * 0.1, borderRadius: 20, backgroundColor: "#F9F9F9", display: "flex", gap: height * 0.04 }}>
        <Text allowFontScaling={false} style={{ fontFamily: "ZillaSlab_700Bold", textAlign: "center", marginTop: height * 0.04, fontSize: width * 0.07 }}>{language === "ar" ? "موعد جديد" : "Schedule a Pill"}</Text>

        {/* Pill Picker */}
        <View style={{ width: "70%", alignSelf: "center", zIndex: 10 }}>
            <Text allowFontScaling={false} style={{ fontFamily: language === "ar" ? undefined : "SpaceMono_400Regular", fontSize: width * 0.04, color: "grey", marginBottom: 10, textAlign: language === "ar" ? "right" : "left", marginRight: language === "ar" ? "20" : "0" }}>{language === "ar" ? "اختر الدواء" : "Select Pill from Cabinet"}</Text>
            {state.length === 0
                ? <Text style={{ fontFamily: "SpaceMono_400Regular", color: "red", fontSize: width * 0.035 }}>{language === "ar" ? "لا يوجد ادوية في الصيدلية. أضف واحد أولاً." : "No pills in cabinet. Add one first."}</Text>
                : <Picker
                    selectedValue={selectedPillId}
                    onValueChange={(itemValue) => {
                        setSelectedPillId(itemValue);
                        setMissingPill(false);
                    }}
                    style={{ fontFamily: "SpaceMono_400Regular", backgroundColor: "#2D3436", padding: 15, borderRadius: 15, color: "white", textAlign: "center", width: width * 0.65 }}
                    dropdownIconColor="black"
                >
                    {state.map(pill =>
                        <Picker.Item style={{ fontFamily: "SpaceMono_400Regular" }} key={pill.id} label={`${pill.Name}  (${pill.pillCount} left)`} color={"white"} value={pill.id} />
                    )}
                </Picker>
            }
        </View>
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "transparent" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={{ display: "flex", gap: height * 0.04 }}>
                    {/* Dosage */}
                    <View style={{ width: "70%", alignSelf: "center" }}>
                        <Text allowFontScaling={false} style={{ fontFamily: language === "ar" ? undefined : "SpaceMono_400Regular", marginBottom: height * 0.01, fontSize: width * 0.04, color: "grey", textAlign: language === "ar" ? "right" : "left", marginRight: language === "ar" ? "20" : '0' }}>{language === "ar" ? "الجرعة" : "Dosage (pills per intake)"}</Text>
                        <TextInput
                            allowFontScaling={false}
                            keyboardType="numeric"
                            textAlign={language === "ar" ? "right" : "left"}
                            onChangeText={(text) => {
                                setDosage(text);
                                setMissingDosage(false);
                            }}
                            placeholder={language === "ar" ? "مثال : 1" : "eg. 1"}
                            placeholderTextColor="grey"
                            style={{ fontFamily: language === "ar" ? undefined : "ZillaSlab_400Regular", backgroundColor: "white", width: width * 0.65, height: height * 0.08, padding: 5, fontSize: width * 0.05, borderBottomWidth: 0.3, borderBottomColor: "grey" }}
                        />
                        {missingDosage && <Text style={{ fontFamily: language === "ar" ? undefined : "SpaceMono_400Regular", textAlign: language === "ar" ? "right" : "left", fontSize: width * 0.033, color: "red", marginTop: 4, marginRight: language === "ar" ? "20" : "0" }}>{language === "ar" ? "الرجاء اضافة جرعة" : "Please enter a dosage"}</Text>}
                    </View>

                    {/* Time Picker */}
                    <View style={{ width: "70%", alignSelf: "center" }}>
                        <TouchableOpacity onPress={() => setOpenTime(!openTime)}>
                            <Text allowFontScaling={false} style={{ fontFamily: language === "ar" ? undefined : "SpaceMono_400Regular", backgroundColor: "#2D3436", padding: 15, borderRadius: 15, color: "white", textAlign: "center", width: width * 0.65 }}>
                                {language === "ar" ? "اختر الوقت" : "Pick Time"}  ·  {time.getHours() % 12 || 12}:{time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()} {time.getHours() < 12 ? "AM" : "PM"}
                            </Text>
                            {alreadyAdded && <Text style={{ fontFamily: language === "ar" ? undefined : "SpaceMono_400Regular", textAlign: language === "ar" ? "right" : "left", fontSize: width * 0.033, color: "red", marginTop: 4 }}>{language === "ar" ? "الموعد مضاف مسبقا" : "Already Scheduled!"}</Text>}
                        </TouchableOpacity>
                    </View>

                    {openTime && (
                        <View style={{ backgroundColor: "#2D3436", marginHorizontal: "15%" }}>
                            <DateTimePicker
                                value={time}
                                mode="time"
                                display="spinner"
                                is24Hour={false}
                                onChange={onChange}
                            />
                        </View>
                    )}

                    {/* Extra Info */}
                    <View style={{ width: "70%", alignSelf: "center" }}>
                        <Text allowFontScaling={false} style={{ fontFamily: language === "ar" ? undefined : "SpaceMono_400Regular", marginBottom: height * 0.01, color: "grey", fontSize: width * 0.04, marginLeft: 5, textAlign: language === "ar" ? "right" : "left", marginRight: language === "ar" ? "20" : "0" }}>{language === "ar" ? "معلومات اضافية (اختياري)" : "Extra Info (optional)"}</Text>
                        <TextInput
                            allowFontScaling={false}
                            onChangeText={(text) => setmoreInfo(text)}
                            placeholder={language === "ar" ? "مثال : بعد الغداء" : "eg. After Meal"}
                            placeholderTextColor="grey"
                            textAlign={language === "ar" ? "right" : "left"}
                            style={{ fontFamily: language === "ar" ? undefined : "ZillaSlab_400Regular", backgroundColor: "white", width: width * 0.65, height: height * 0.08, padding: 5, borderBottomWidth: 0.3, borderBottomColor: "grey" }}
                        />
                    </View>

                    {/* Submit */}
                    <View style={{ display: "flex", flexDirection: "row", width: "70%", alignSelf: "center" }}>
                        <TouchableOpacity onPress={handleSubmit} style={{ width: width * 0.65, alignSelf: "center", height: height * 0.08, backgroundColor: "white", marginTop: height * 0.01, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 10, boxShadow: "0px 0px 5px lightgrey" }}>
                            <Ionicons name="checkmark" size={width * 0.06} style={{ alignSelf: "center", textAlign: "center" }} /><Text allowFontScaling={false} style={{ fontFamily: "ZillaSlab_400Regular", textAlign: "center", fontSize: width * 0.05 }}>{i18n.t("save_medecine", { locale: language })}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </ScrollView >
}