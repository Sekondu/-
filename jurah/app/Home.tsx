import { Text } from "@react-navigation/elements";
import { View, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef, useContext } from "react";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { PillContext } from "./PillContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const days_of_Week = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function ModalScreen() {
  const { width, height } = useWindowDimensions();

  let scrollRef = useRef<ScrollView | null>(null);
  let scrollY = useRef(0);

  const { state, dispatch } = useContext(PillContext);

  const [activeDay, setactiveDay] = useState("");
  const [activeDateKey, setActiveDateKey] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [takenPills, setTakenPills] = useState(new Set<string>());

  const morningPills = state.filter(pill => pill.time_to_take.getHours() < 12);
  const eveningPills = state.filter(pill => pill.time_to_take.getHours() >= 12);

  const todayKey = `taken_${new Date().toISOString().split("T")[0]}`;

  useEffect(() => {
    AsyncStorage.getItem(`taken_${activeDateKey}`).then(data => {
      setTakenPills(data ? new Set(JSON.parse(data)) : new Set());
    });
  }, [activeDateKey]);

  const realTodayKey = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Don't overwrite past days when browsing history
    if (activeDateKey === realTodayKey) {
      AsyncStorage.setItem(`taken_${activeDateKey}`, JSON.stringify([...takenPills]));
    }
  }, [takenPills]);


  useEffect(() => {
    AsyncStorage.setItem(todayKey, JSON.stringify([...takenPills]));
  }, [takenPills]);


  const morningPillHours = [...new Set(morningPills.map(pill => pill.time_to_take.getHours()))].sort((a, b) => a - b);
  const eveningPillHours = [...new Set(eveningPills.map(pill => pill.time_to_take.getHours()))].sort((a, b) => a - b);

  function handleTaken(id: string) {
    if (takenPills.has(id)) {
      setTakenPills(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      let pill = state.find(pill => pill.id == id);
      dispatch({ type: "update_medecine", payload: { id: id, pillCount: pill.pillCount + 1, Name: pill.Name, time_to_take: pill.time_to_take, more_info: pill.more_info } });
    } else {
      setTakenPills(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      let pill = state.find(pill => pill.id == id);
      dispatch({ type: "update_medecine", payload: { id: id, pillCount: pill.pillCount > 0 ? pill.pillCount - 1 : 0, Name: pill.Name, time_to_take: pill.time_to_take, more_info: pill.more_info } });
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: scrollY.current,
        animated: false,
      })
    }
  }, [activeDay])

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
            <Text style={[styles.gm, { color: "black", alignSelf: "flex-start" }]}>User!</Text>
          </View>
        </View>
        <Ionicons style={styles.notificationBell} name="notifications-circle" size={45} color={"#50956c"} />
      </View>
    )
  }

  function Week() {

    let today = new Date();

    let start_of_week = new Date(today);

    let diff_to_weekStart = today.getDay() == 6 ? 0 : today.getDay() + 1;

    start_of_week.setDate(today.getDate() - diff_to_weekStart);

    let week = [];

    for (let i = 0; i < 7; i++) {
      week.push(
        {
          dayName: start_of_week.toLocaleDateString("en-US", { weekday: "short" }),
          monthDay: start_of_week.getDate(),
          monthName: start_of_week.toLocaleDateString("en-US", { month: "short" }),
          dateKey: start_of_week.toISOString().split("T")[0],
        }
      );
      console.log(week);
      start_of_week.setDate(start_of_week.getDate() + 1);
    }

    return (
      <ScrollView contentContainerStyle={styles.fullWeekContainer}>
        <Text style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}>{months[today.getMonth()]} {today.getFullYear()}</Text>
        <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} onScroll={(e) => scrollY.current = e.nativeEvent.contentOffset.x}>
          {week.map((day, index) => {
            return (
              <TouchableOpacity onPress={() => {
                setactiveDay(day.dayName);
                setActiveDateKey(day.dateKey);
              }} key={index} style={[styles.weekDays, { width: width * 0.2, height: height * 0.12, backgroundColor: activeDay == day.dayName ? "#50956c" : "white" }]}>
                <Text style={{ color: activeDay == day.dayName ? "white" : "#50956c", fontWeight: "bold" }}>{day.dayName}</Text>
                <Text style={{ fontWeight: "bold", color: activeDay == day.dayName ? "white" : "black" }}>{day.monthDay}</Text>
                <Text style={{ fontWeight: "bold", color: activeDay == day.dayName ? "white" : "black" }}>{day.monthName}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </ScrollView>
    )
  }
  function Medecin() {
    let today = new Date();
    let today_name = today.toLocaleDateString("en-US", { weekday: "short" });
    let long_Active_name = days_of_Week.filter((day) => day.substring(0, 3) == activeDay);
    return (
      <>
        {today_name === activeDay &&
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Today`s Schedule</Text>
        }
        {
          today_name !== activeDay &&
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>{long_Active_name}`s Schedule</Text>
        }
        <View style={styles.morning_pills}>
          <View>
            <Text style={{ fontWeight: "bold", color: "#50956c" }}>Morning</Text>
            <View style={{ width: "80%", height: 0.5, backgroundColor: "grey", position: "absolute", top: "50%", left: "16%" }}></View>
          </View>
          {morningPillHours.map((hour) => {
            return (
              <View key={hour} style={{ marginTop: 20 }}>
                {morningPills.map(pill => {
                  return pill.time_to_take.getHours() == hour && (
                    <View key={pill.id} style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", padding: 10, alignItems: "space-around", borderWidth: 1, borderRadius: 10 }}>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Ionicons name="bandage-outline" style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1, padding: 9, backgroundColor: "lightgreen", marginRight: 10, alignSelf: "center" }} size={20} />
                        <View style={{ alignSelf: "center" }}>
                          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 5 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 20, }}>{pill.Name}</Text>
                            <Text style={{ fontSize: 12, backgroundColor: "#50956c", borderRadius: 10, padding: 5, textAlign: "center", color: "white", height: 25, alignSelf: "center" }}>{pill.time_to_take.getHours() % 12} : {pill.time_to_take.getMinutes() < 10 ? "0" + pill.time_to_take.getMinutes() : pill.time_to_take.getMinutes()} PM</Text>
                          </View>
                          <Text style={{ opacity: 0.5 }}>● {pill.more_info != "" ? pill.more_info : "no extra info specified"}</Text>
                        </View>
                      </View>
                      <View style={{ alignSelf: "center" }}>
                        <Ionicons onPress={() => {
                          if (activeDateKey == realTodayKey) {
                            handleTaken(pill.id);
                          }

                        }} name="checkmark-circle" style={{ alignSelf: "center" }} size={30} color={takenPills.has(pill.id) ? "#50956c" : "black"} />
                      </View>
                    </View>
                  )
                })}
              </View>
            )
          })}

        </View>

        <View style={styles.morning_pills}>
          <View>
            <Text style={{ fontWeight: "bold", color: "#50956c" }}>Afternoon</Text>
            <View style={{ width: "76%", height: 0.5, backgroundColor: "grey", position: "absolute", top: "50%", left: "20%" }}></View>
          </View>
          {eveningPillHours.map((hour) => {
            return (
              <View key={hour} style={{ marginTop: 20 }}>
                {eveningPills.map(pill => {
                  return pill.time_to_take.getHours() == hour && (
                    <View key={pill.id} style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", padding: 10, alignItems: "space-around", borderWidth: 1, borderRadius: 10 }}>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Ionicons name="bandage-outline" style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1, padding: 9, backgroundColor: "lightgreen", marginRight: 10, alignSelf: "center" }} size={20} />
                        <View style={{ alignSelf: "center" }}>
                          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 5 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 20, }}>{pill.Name}</Text>
                            <Text style={{ fontSize: 12, backgroundColor: "#50956c", borderRadius: 10, padding: 5, textAlign: "center", color: "white", height: 25, alignSelf: "center" }}>{pill.time_to_take.getHours() % 12} : {pill.time_to_take.getMinutes() < 10 ? "0" + pill.time_to_take.getMinutes() : pill.time_to_take.getMinutes()} PM</Text>
                          </View>
                          <Text style={{ opacity: 0.5 }}>● {pill.more_info != "" ? pill.more_info : "no extra info specified"}</Text>
                        </View>
                      </View>
                      <View style={{ alignSelf: "center" }}>
                        <Ionicons onPress={() => {
                          if (activeDateKey == realTodayKey) {
                            handleTaken(pill.id);
                          }

                        }} name="checkmark-circle" size={30} color={takenPills.has(pill.id) ? "#50956c" : "black"} />
                      </View>
                    </View>
                  )
                })}
              </View>
            )
          })}

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
  whole_container: {
    width: "90%",
    alignSelf: "center",
    marginTop: 40,
    display: "flex",
    gap: 50,
  },
  profile: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileLeft: {
    display: 'flex',
    width: "50%",
    flexDirection: "row",
  },
  ActiveUser: {
    position: "absolute",
    backgroundColor: "#50956c",
    width: 15,
    height: 15,
    borderRadius: "50%",
    borderWidth: 2,
    borderColor: "white",
    top: 30,
    left: 30,
  },
  gm: {
    color: '#50956c',
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  profileIcon: {
  },
  notificationBell: {
    alignSelf: "center",
  },
  fullWeekContainer: {
    display: "flex",
  },
  weekDays: {
    width: 80,
    height: 100,
    borderWidth: 0.5,
    borderRadius: 20,
    marginRight: 5,
    padding: 10,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  morning_pills: {
    display: "flex",
  }
})