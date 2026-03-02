import { Text } from "@react-navigation/elements";
import { View,ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState,useEffect,useRef } from "react";
import { TouchableOpacity } from "react-native";

const days_of_Week = ["Saturday" , "Sunday", "Monday", "Tuesday" , "Wednesday" , "Thursday" , "Friday"];

export default function ModalScreen() {

let scrollRef = useRef<ScrollView | null>(null);
let scrollY =  useRef(0);

const [activeDay,setactiveDay] = useState("");

useEffect(() => {
if(scrollRef.current) {
  scrollRef.current.scrollTo({
    x : scrollY.current,
    animated : false,
  })
}
},[activeDay])

useEffect(() => {
  let today = new Date();
  let today_day = (today.getDay() + 1) % 7;

  setactiveDay(
    days_of_Week[today_day].substring(0, 3)
  );
}, []);

function Profile() {

  return (
    <View style={styles.profile}>
        <View style={styles.profileLeft}>
        <Ionicons style={styles.profileIcon} name="person-circle" size={45} color={"#50956c"} />
        <View style={styles.ActiveUser}></View>
        <View>
        <Text style={styles.gm}>Good Morning,</Text>
        <Text style={[styles.gm, {color : "black", alignSelf : "flex-start"}]}>User!</Text>
        </View>
        </View>
        <Ionicons style={styles.notificationBell} name="notifications-circle" size={45} color={"#50956c"}/>
      </View>
  )
}

function Week() {

let today = new Date();

let start_of_week=new Date(today);

let diff_to_weekStart = today.getDay() == 6 ? 0 : today.getDay() + 1;

start_of_week.setDate(today.getDate() - diff_to_weekStart);

let week = [];

for(let i = 0; i< 7 ; i++){
week.push(
  {dayName : start_of_week.toLocaleDateString("en-US" , { weekday : "short" }),
    monthDay : start_of_week.getDate(),
  monthName : start_of_week.toLocaleDateString("en-US" , {month : "short"}),
  }
);
console.log(week);
start_of_week.setDate(start_of_week.getDate() + 1);
}

  return(
    <ScrollView contentContainerStyle={styles.fullWeekContainer}>
      <Text style={{fontWeight : "bold", fontSize : 20, textAlign: "center"}}>{months[today.getMonth()]} {today.getFullYear()}</Text>
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator = {false} onScroll={(e) => scrollY.current = e.nativeEvent.contentOffset.x}>
        {week.map((day,index) => {
          return(
            <TouchableOpacity onPress={() => setactiveDay(day.dayName)} key={index} style={[styles.weekDays, {backgroundColor : activeDay == day.dayName ? "#50956c" : "white"}]}>
              <Text style={{color : activeDay == day.dayName ? "white" :"#50956c" , fontWeight : "bold"}}>{day.dayName}</Text>
              <Text style={{fontWeight : "bold", color : activeDay == day.dayName ? "white" : "black"}}>{day.monthDay}</Text>
              <Text style={{fontWeight : "bold", color : activeDay == day.dayName ? "white" : "black"}}>{day.monthName}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </ScrollView>
  )
}
function Medecin() {
let today = new Date();
let today_name = today.toLocaleDateString("en-US" , { weekday : "short"});
let long_Active_name = days_of_Week.filter((day) => day.substring(0,3) == activeDay);
  return (
    <>
    {today_name === activeDay && 
      <Text style={{fontWeight : "bold", fontSize : 20}}>Today`s Schedule</Text>
    }
    {
      today_name !== activeDay && 
      <Text style={{fontWeight : "bold", fontSize : 20}}>{long_Active_name}`s Schedule</Text>
    }
    <View style={styles.morning_pills}>
    <Text style={{fontWeight : "bold", color : "#50956c"}}>Morning</Text>
    <View style={{width : "80%", height : 0.5, backgroundColor : "grey", position : "absolute" , top : "50%", left : "16%"}}></View>

    </View>

    <View style={styles.morning_pills}>
    <Text style={{fontWeight : "bold", color : "#50956c"}}>Afternoon</Text>
    <View style={{width : "76%", height : 0.5, backgroundColor : "grey", position : "absolute" , top : "50%", left : "20%"}}></View>
    
    </View>
    </>
  )
}
  return (
    <ScrollView contentContainerStyle={styles.whole_container}>
      <Profile />
      <Week />
      <Medecin />
    </ScrollView>
  );
}
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const styles = StyleSheet.create({
  whole_container : {
    width : "90%",
    alignSelf : "center",
    marginTop : 40,
    display : "flex",
    gap : 50,
  },
  profile : { 
    display : "flex",
    flexDirection : "row",
    justifyContent : "space-between",
  },
  profileLeft : {
    display : 'flex',
    width : "50%",
    flexDirection : "row",
  },
  ActiveUser : {
    position : "absolute",
    backgroundColor : "#50956c",
    width : 15,
    height : 15,
    borderRadius : "50%",
    borderWidth : 2,
    borderColor : "white",
    top : 30,
    left : 30,
  },
  gm : {
    color : '#50956c',
    alignSelf : "center",
    fontSize : 18,
    fontWeight : "bold",
    marginLeft : 8,
  },
  profileIcon : {
  },
  notificationBell : {
    alignSelf : "center",
  },
  fullWeekContainer : {
    display : "flex",
  },
  weekDays : {
    width : 80,
    height : 100,
    borderWidth : 0.5,
    borderRadius : 20,
    marginRight : 5,
    padding : 10,
    marginTop : 30,
    justifyContent : "center",
    alignItems : "center",
    gap : 10,
  },
  morning_pills : {
    display : "flex",
  }
})