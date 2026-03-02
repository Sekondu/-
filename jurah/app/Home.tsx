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
          <Ionicons style={styles.profileIcon} name="person-circle" size={width * 0.12} color={"#50956c"} />
          <View style={[styles.ActiveUser, { width: width * 0.04, height: width * 0.04, top: width * 0.08, left: width * 0.08 }]}></View>
          <View>
            <Text allowFontScaling={false} style={[styles.gm, { fontSize: width * 0.045 }]}>Good Morning,</Text>
            <Text allowFontScaling={false} style={[styles.gm, { color: "black", alignSelf: "flex-start", fontSize: width * 0.045 }]}>User!</Text>
          </View>
        </View>
        <Ionicons style={styles.notificationBell} name="notifications-circle" size={width * 0.12} color={"#50956c"} />
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
        <Text style={{ fontWeight: "bold", fontSize: width * 0.05, textAlign: "center" }}>{months[today.getMonth()]} {today.getFullYear()}</Text>
        <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} onScroll={(e) => scrollY.current = e.nativeEvent.contentOffset.x}>
          {week.map((day, index) => {
            return (
              <TouchableOpacity onPress={() => {
                setactiveDay(day.dayName);
                setActiveDateKey(day.dateKey);
              }} key={index} style={[styles.weekDays, { width: width * 0.2, height: height * 0.12, marginRight: width * 0.02, marginTop: height * 0.03, padding: width * 0.02, gap: height * 0.01, backgroundColor: activeDay == day.dayName ? "#50956c" : "white" }]}>
                <Text allowFontScaling={false} style={{ color: activeDay == day.dayName ? "white" : "#50956c", fontWeight: "bold", fontSize: width * 0.04 }}>{day.dayName}</Text>
                <Text allowFontScaling={false} style={{ fontWeight: "bold", color: activeDay == day.dayName ? "white" : "black", fontSize: width * 0.04 }}>{day.monthDay}</Text>
                <Text allowFontScaling={false} style={{ fontWeight: "bold", color: activeDay == day.dayName ? "white" : "black", fontSize: width * 0.04 }}>{day.monthName}</Text>
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
          <Text style={{ fontWeight: "bold", fontSize: width * 0.05 }}>Today`s Schedule</Text>
        }
        {
          today_name !== activeDay &&
          <Text style={{ fontWeight: "bold", fontSize: width * 0.05 }}>{long_Active_name}`s Schedule</Text>
        }
        <View style={styles.morning_pills}>
          <View>
            <Text style={{ fontWeight: "bold", color: "#50956c", fontSize: width * 0.04 }}>Morning</Text>
            <View style={{ width: "70%", height: 0.5, backgroundColor: "grey", position: "absolute", top: "50%", left: "27%" }}></View>
          </View>
          {morningPillHours.map((hour) => {
            return (
              <View key={hour} style={{ marginTop: height * 0.03 }}>
                {morningPills.map(pill => {
                  return pill.time_to_take.getHours() == hour && (
                    <View key={pill.id} style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", padding: width * 0.03, alignItems: "space-around", borderWidth: 1, borderRadius: 10 }}>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Ionicons name="bandage-outline" style={{ width: width * 0.12, height: width * 0.12, borderRadius: 10, borderWidth: 1, padding: width * 0.02, backgroundColor: "lightgreen", marginRight: width * 0.03, alignSelf: "center" }} size={width * 0.06} />
                        <View style={{ alignSelf: "center" }}>
                          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: width * 0.02, marginBottom: height * 0.01 }}>
                            <Text style={{ fontWeight: "bold", fontSize: width * 0.05, }}>{pill.Name}</Text>
                            <Text allowFontScaling={false} style={{ fontSize: width * 0.03, backgroundColor: "#50956c", borderRadius: 10, padding: width * 0.015, textAlign: "center", color: "white", alignSelf: "center" }}>{pill.time_to_take.getHours() % 12} : {pill.time_to_take.getMinutes() < 10 ? "0" + pill.time_to_take.getMinutes() : pill.time_to_take.getMinutes()} PM</Text>
                          </View>
                          <Text style={{ opacity: 0.5, fontSize: width * 0.035 }}>● {pill.more_info != "" ? pill.more_info : "no extra info specified"}</Text>
                        </View>
                      </View>
                      <View style={{ alignSelf: "center" }}>
                        <Ionicons onPress={() => {
                          if (activeDateKey == realTodayKey) {
                            handleTaken(pill.id);
                          }

                        }} name="checkmark-circle" style={{ alignSelf: "center" }} size={width * 0.08} color={takenPills.has(pill.id) ? "#50956c" : "black"} />
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
            <Text style={{ fontWeight: "bold", color: "#50956c", fontSize: width * 0.04 }}>Afternoon</Text>
            <View style={{ width: "68%", height: 0.5, backgroundColor: "grey", position: "absolute", top: "50%", left: "32%" }}></View>
          </View>
          {eveningPillHours.map((hour) => {
            return (
              <View key={hour} style={{ marginTop: height * 0.03 }}>
                {eveningPills.map(pill => {
                  return pill.time_to_take.getHours() == hour && (
                    <View key={pill.id} style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", padding: width * 0.03, alignItems: "space-around", borderWidth: 1, borderRadius: 10 }}>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Ionicons name="bandage-outline" style={{ width: width * 0.12, height: width * 0.12, borderRadius: 10, borderWidth: 1, padding: width * 0.02, backgroundColor: "lightgreen", marginRight: width * 0.03, alignSelf: "center" }} size={width * 0.06} />
                        <View style={{ alignSelf: "center" }}>
                          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: width * 0.02, marginBottom: height * 0.01 }}>
                            <Text style={{ fontWeight: "bold", fontSize: width * 0.05, }}>{pill.Name}</Text>
                            <Text allowFontScaling={false} style={{ fontSize: width * 0.03, backgroundColor: "#50956c", borderRadius: 10, padding: width * 0.015, textAlign: "center", color: "white", alignSelf: "center" }}>{pill.time_to_take.getHours() % 12} : {pill.time_to_take.getMinutes() < 10 ? "0" + pill.time_to_take.getMinutes() : pill.time_to_take.getMinutes()} PM</Text>
                          </View>
                          <Text style={{ opacity: 0.5, fontSize: width * 0.035 }}>● {pill.more_info != "" ? pill.more_info : "no extra info specified"}</Text>
                        </View>
                      </View>
                      <View style={{ alignSelf: "center" }}>
                        <Ionicons onPress={() => {
                          if (activeDateKey == realTodayKey) {
                            handleTaken(pill.id);
                          }

                        }} name="checkmark-circle" size={width * 0.08} color={takenPills.has(pill.id) ? "#50956c" : "black"} />
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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, width: "90%", alignSelf: "center", paddingTop: height * 0.05, paddingBottom: height * 0.1, display: "flex", gap: height * 0.06 }}>
        <Profile />
        <Week />
        <Medecin />
      </ScrollView>
    </View>
  );
}
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const styles = StyleSheet.create({
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
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
  },
  gm: {
    color: '#50956c',
    alignSelf: "center",
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
    borderWidth: 0.5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  morning_pills: {
    display: "flex",
  }
})