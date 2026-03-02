import { useContext,useState } from "react"
import { View,Text,TextInput,TouchableWithoutFeedback, Keyboard, Button, TouchableOpacity, Platform, KeyboardAvoidingView,ScrollView } from "react-native"
import { PillContext } from "./PillContext"
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from "@expo/vector-icons"
import {v4 as uuidv4 } from 'uuid'
import 'react-native-get-random-values';
export function Add_medecine({ navigation }){

    const {state,dispatch} = useContext(PillContext);
    const [Name,setName] = useState("");
    const [pillCount, setPillCount] = useState(null);
    const [nameError, setNameError] = useState(false);

    const [openTime , setOpenTime] = useState(false);
    const [time , setTime] = useState(new Date());

    const [missingName , setMissingName] = useState(false);
    const [missingPill , setMissingPill] = useState(false);

    const [moreInfo , setmoreInfo] = useState("");


    function check_name(name){
        return state.some(pill => pill.Name.toLowerCase() == name.toLowerCase());
    }

    const onChange = (event , selectedTime) => {
        setOpenTime(Platform.OS === "ios");
        if(selectedTime){
            setTime(selectedTime);
        }
    }

    const handleSubmit = () => {
        if(Name.length === 0){
            setMissingName(true);
        }
        if(!pillCount){
            setMissingPill(true);
        }
        if(!missingName && !missingPill){
            const payload = {
                id : uuidv4(),
                Name : Name,
                pillCount : pillCount,
                time_to_take : time,
                more_info : moreInfo,
            }
            dispatch({ type : "add_medecine" , payload});
            navigation.navigate("Cabinet");
        }
    }

    return <View style={{flex : 1, backgroundColor : "transparent"}}>
        <KeyboardAvoidingView style={{ flex : 1,backgroundColor : "transparent" }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible = {false}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom : 100, borderRadius : 20 , backgroundColor : "lightgreen", zIndex : 1, display : "flex", gap : 10}}>
        <Text style={{fontWeight : "bold", textAlign : "center", marginTop : 30, fontSize : 24}}>Add Medication</Text>
        <View style={{display : "flex", flexDirection : "row", width : "70%", alignSelf : "center", marginTop : 40}}>
            <View>
                <Text style={{marginBottom : 10, fontWeight : "bold", fontSize :18,}}>Medication Name</Text>
            <TextInput onChangeText={
                (text) => {
                    setName(text);
                    setMissingName(Name.length > 0 ? false : true);
                    let checker = check_name(text);
                    if(checker){
                        setNameError(true);
                    }else{
                        setNameError(false);
                    }
                }
            } placeholder="eg. Panadol" placeholderTextColor={"grey"} style={{backgroundColor : "white", width : 250,height : 50, borderRadius : 20, padding : 5}} />
            {nameError && <Text style={{fontSize : 15, marginTop : 5, marginLeft : 5, fontWeight : "bold", color : "red"}}>Name Already Used!</Text>}
            {!nameError && Name.length>0 && <Text style={{fontSize : 15, marginTop : 5, marginLeft : 5, fontWeight : "bold"}}>Name is Available!</Text>}
            {missingName && <Text style={{fontSize : 15, marginTop : 5, marginLeft : 5, fontWeight : "bold", color : "red"}}>This field is Mandatory!</Text>}
            </View>
        </View>

        <View style={{display : "flex", flexDirection : "row", width : "70%", alignSelf : "center", marginTop : 40}}>
            <View>
                <Text style={{marginBottom : 10, fontWeight : "bold", fontSize :18,}}>Number of Pills</Text>
            <TextInput keyboardType="numeric" onChangeText={
                (text) => {
                    setPillCount(Number(text));
                    setMissingPill(Number(text) >=0 ? false : true);
                }
            } placeholder="eg. 20" placeholderTextColor={"grey"} style={{backgroundColor : "white", width : 250,height : 50, borderRadius : 20, padding : 5}} />
            {missingPill && <Text style={{fontSize : 15, marginTop : 5, marginLeft : 5, fontWeight : "bold", color : "red"}}>This field is Mandatory!</Text>}
            </View>
        </View>
        <View style={{display : "flex", flexDirection : "row", width : "70%",alignSelf : "center", marginTop : 40}}>
            <TouchableOpacity onPress={() => {setOpenTime(true)}}>
                <Text style={{fontWeight : "bold" , backgroundColor : "#50956c", padding : 15,alignSelf : "center", borderRadius : 15, color : "white"}}>Pick Time for Notification</Text>
            </TouchableOpacity>
        </View>
        {openTime && (
  <TouchableWithoutFeedback onPress={() => {setOpenTime(false)}}>
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "transparent",
        justifyContent: "flex-end",
      }}
    >
      <View style={{ backgroundColor: "#50956c" }}>
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
        <View style={{display : "flex", flexDirection : "row", width : "70%",alignSelf : "center", marginTop : -10, zIndex : -1,}}>
            <View style={{
            alignSelf : "center",
             marginLeft : 3, 
             marginTop : -8 , 
             width : 200,
             height : 30, 
             backgroundColor : "white",
             display : "flex",
             justifyContent : "flex-end",
             borderBottomLeftRadius: 15,
             borderBottomRightRadius : 15
            }}>
        <Text style={{
             textAlign : "center",
             textAlignVertical : "bottom",
             fontWeight : "bold"}}>{time.getHours() % 12} :{time.getMinutes() < 10 ? 0 : ""}{time.getMinutes()} {time.getHours() < 12 ? "AM" : "PM"}</Text>
             </View>
        </View>
        <View style={{display : "flex", flexDirection : "row", width : "70%", alignSelf : "center", marginTop : 40}}>
            <View>
                <Text style={{marginBottom : 10, fontWeight : "bold", fontSize :18,marginLeft : 5}}>Extra Info</Text>
            <TextInput onChangeText={
                (text) => {
                    setmoreInfo(text);
                }
            } placeholder="eg. Before Meal" placeholderTextColor={"grey"} style={{backgroundColor : "white", width : 250,height : 50, borderRadius : 20, padding : 5}} />
            </View>
        </View>
        <TouchableOpacity onPress={handleSubmit} style={{width : "70%", alignSelf : "center", height : 70, backgroundColor : "green", marginTop : "40%", display : "flex", justifyContent : "center",alignItems : "center",flexDirection : "row", borderRadius : 20, gap : 10}}>
          <Ionicons name="checkmark" size={24} style={{alignSelf : "center",textAlign : "center"}}/><Text style={{textAlign : "center", fontSize : 20}}>Save Changes</Text>
        </TouchableOpacity>
        <View style={{display : "flex", flexDirection : "row", width : "70%", alignSelf : "center", marginTop : 40}}>
        </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </View>
}