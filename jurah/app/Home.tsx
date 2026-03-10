import { Text } from "@react-navigation/elements";
import { View, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef, useContext } from "react";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { PillContext } from "./PillContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScheduleContext } from "./ScheduleContext";
import { LanguageContext } from "./LanguageContext";
import i18n from "./i18n";

const days_of_Week = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const days_of_Week_arabic = ["السبت", "الاحد", "الاثنين", "الثلثاء", "الاربعاء", "الخميس", "الجمعة"];

export default function ModalScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  let scrollRef = useRef<ScrollView | null>(null);
  let scrollY = useRef(0);

  const { state, dispatch } = useContext(PillContext);

  const { Schedulestate, Scheduledispatch } = useContext(ScheduleContext);

  const { language, changeLanguage } = useContext(LanguageContext);

  const [activeDay, setactiveDay] = useState("");
  const [activeDateKey, setActiveDateKey] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [takenPills, setTakenPills] = useState(new Set<string>());


  const sorted_pills = [...Schedulestate].sort((a, b) => a.time_to_take.getHours() - b.time_to_take.getHours());

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

  function getWeekNumber(date: Date = new Date()): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7; // Make Sunday = 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum); // Set to nearest Thursday
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }


  function handleTaken(id: string) {
    if (takenPills.has(id)) {
      setTakenPills(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      let scheduledPill = Schedulestate.find(pill => pill.id == id);
      if (!scheduledPill) return;
      console.log(scheduledPill);
      let pill = state.find(pill => pill.id == scheduledPill.medicineId);
      if (!pill) return;
      console.log(pill);
      dispatch({ type: "update_medecine", payload: { id: pill.id, pillCount: pill.pillCount + scheduledPill.dosage, Name: pill.Name, more_info: pill.more_info } });
    } else {
      setTakenPills(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      let scheduledPill = Schedulestate.find(pill => pill.id == id);
      if (!scheduledPill) return;
      console.log(scheduledPill);
      let pill = state.find(pill => pill.id == scheduledPill.medicineId);
      if (!pill) return;
      console.log(pill);
      dispatch({ type: "update_medecine", payload: { id: pill.id, pillCount: pill.pillCount > 0 && pill.pillCount - scheduledPill.dosage > 0 ? pill.pillCount - scheduledPill.dosage : 0, Name: pill.Name, more_info: pill.more_info } });
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
        <Text style={{ fontFamily: "ZillaSlab_700Bold", fontSize: width * 0.1, textAlign: "center" }}>{i18n.t("home_header", { locale: language })}</Text>
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
      console.log(activeDateKey);
      start_of_week.setDate(start_of_week.getDate() + 1);
    }

    return (
      <View style={[styles.fullWeekContainer, { flexGrow: 0 }]}>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexGrow: 0 }}>
          <Text style={{ fontFamily: language === "ar" ? undefined : "SpaceMono_400Regular", fontSize: width * 0.04, textAlign: "center" }}>{today.toLocaleDateString(language === "ar" ? "ar" : "en-US", { month: "long" })} {today.getFullYear()}</Text>
          <Text style={{ fontFamily: language === "ar" ? undefined : "SpaceMono_400Regular", fontSize: width * 0.04, textAlign: "center" }}>{language === "ar" ? "الاسبوع" : "week"} {getWeekNumber()}</Text>
        </View>
        <ScrollView contentContainerStyle={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }} ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} onScroll={(e) => scrollY.current = e.nativeEvent.contentOffset.x}>
          {week.map((day, index) => {
            return (
              <TouchableOpacity onPress={() => {
                setactiveDay(day.dayName);
                setActiveDateKey(day.dateKey);
              }} key={index} style={[styles.weekDays, { width: width * 0.11, height: height * 0.12, marginRight: width * 0.02, marginTop: height * 0.03, padding: width * 0.02, gap: height * 0.01 }]}>
                <Text allowFontScaling={false} style={{ color: activeDay == day.dayName ? "#2D3436" : "lightgrey", fontWeight: "bold", fontSize: width * 0.04 }}>{day.dayName.substring(0, 1)}</Text>
                <Text allowFontScaling={false} style={{ fontFamily: "SpaceMono_400Regular", fontWeight: "bold", color: activeDay == day.dayName ? "#2D3436" : "lightgrey", fontSize: width * 0.04 }}>{day.monthDay < 10 ? `0${day.monthDay}` : day.monthDay}</Text>
                {activeDay == day.dayName && <View style={{ position: "absolute", width: width * 0.02, aspectRatio: 1, backgroundColor: "#50956c", borderRadius: "50%", top: "90%" }}></View>}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    )
  }
  function Medecin() {
    let today = new Date();
    let today_name = today.toLocaleDateString("en-US", { weekday: "short" });
    let long_Active_name = days_of_Week.filter((day) => day.substring(0, 3) == activeDay);
    return (
      <>
        {today_name === activeDay &&
          <Text style={{ fontWeight: "bold", fontSize: width * 0.05, textAlign: language === "ar" ? "right" : "left" }}>{language === "ar" ? "جدول اليوم" : "Today's Schedule"}</Text>
        }
        {
          today_name !== activeDay &&
          <Text style={{ fontWeight: "bold", fontSize: width * 0.05, textAlign: language === "ar" ? "right" : "left" }}>{language === "ar" ? `جدول ${days_of_Week_arabic[days_of_Week.indexOf(long_Active_name[0])]}` : `${long_Active_name[0]}'s Schedule`} </Text>
        }
        <View style={[styles.morning_pills]}>
          <View style={{ display: "flex", gap: 30, justifyContent: "center", alignItems: "center", width: "90%" }}>
            {sorted_pills.map(pill => {
              return <View style={{ display: "flex", width: "100%", alignSelf: "center", flexDirection: "row", justifyContent: "space-between" }} key={pill.id}>
                <View style={{ alignItems: "flex-start", justifyContent: "center", width: width * 0.15 }}>
                  <Text style={{ fontFamily: "SpaceMono_400Regular", textAlign: "start", fontSize: width * 0.04 }}>{pill.time_to_take.getHours() < 10 ? `0${pill.time_to_take.getHours()}` : pill.time_to_take.getHours() % 12}:{pill.time_to_take.getMinutes() < 10 ? `0${pill.time_to_take.getMinutes()}` : pill.time_to_take.getMinutes()} {pill.time_to_take.getHours() < 12 ? "AM" : "PM"}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("update_schedule", { pill: pill })} style={{ justifyContent: "center", width: width * 0.3 }}>
                  <Text style={{ fontFamily: "ZillaSlab_700Bold", fontSize: width * 0.07, marginBottom: 10 }}>{pill.pillName}</Text>
                  <Text style={{ fontFamily: "SpaceMono_400Regular", fontSize: width * 0.03 }}>{pill.more_info.length > 0 ? pill.more_info : "No additional info"}</Text>
                </TouchableOpacity>
                {takenPills.has(pill.id) ? <Ionicons onPress={() => handleTaken(pill.id)} style={{ alignSelf: "center" }} name="checkmark-circle" size={width * 0.06} color="#50956c" /> : <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => handleTaken(pill.id)} ><View style={{ alignSelf: "center", width: width * 0.06, height: width * 0.06, borderRadius: width * 0.03, backgroundColor: "white", borderWidth: 1, borderColor: "grey" }}  ></View></TouchableOpacity>}
              </View>
            })
            }
          </View>
          <View style={{ position: "absolute", height: "100%", width: 1, backgroundColor: "black", left: width * 0.15 }}></View>
        </View>


      </>
    )
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, width: "90%", alignSelf: "center", paddingTop: height * 0.05, paddingBottom: height * 0.1, display: "flex", gap: height * 0.03 }}>
        <Profile />
        <Week />
        <TouchableOpacity onPress={() => navigation.navigate("add_schedule")} style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#2D3436", padding: 15, alignSelf: "center", borderRadius: 15 }}>
          <Text style={{ fontFamily: language === "ar" ? undefined : "SpaceMono_400Regular", color: "white" }}>{language === "ar" ? "موعد جديد" : "Schedule Pill"}</Text>
        </TouchableOpacity>
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
    flexGrow: 0,
  },
  weekDays: {
    justifyContent: "center",
    alignItems: "center",
  },
  morning_pills: {
    display: "flex",
  }
})