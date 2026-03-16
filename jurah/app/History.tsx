import { View, Text, TouchableOpacity, ScrollView, Alert, useWindowDimensions, Platform, Linking } from 'react-native';
import { useContext, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { FileContext } from './FileContext';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from './LanguageContext';

const HISTORY_DIR = FileSystem.documentDirectory + 'history/';

export function History() {
    const { Filestate, FileDispatch } = useContext(FileContext);
    const { width, height } = useWindowDimensions();

    const { language } = useContext(LanguageContext);

    // Ensure the history directory exists
    const ensureDir = async () => {
        const dirInfo = await FileSystem.getInfoAsync(HISTORY_DIR);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(HISTORY_DIR, { intermediates: true });
        }
    };

    // ==================== CREATE ====================
    const handleAddFile = async (category: 'medical_record' | 'radiation_report' | 'laboratory_report') => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const pickedFile = result.assets[0];
            const fileId = uuidv4();
            const fileExtension = pickedFile.name.split('.').pop();
            const newFileName = `${fileId}.${fileExtension}`;

            await ensureDir();
            const destPath = HISTORY_DIR + newFileName;

            await FileSystem.copyAsync({
                from: pickedFile.uri,
                to: destPath,
            });

            const payload = {
                id: fileId,
                fileName: pickedFile.name,
                category: category,
                localPath: destPath,
                dateAdded: new Date().toISOString(),
            };

            FileDispatch({ type: 'add_file', payload });
        } catch (err) {
            console.log('File pick error:', err);
        }
    };

    // ==================== READ ====================
    const handleReadFile = async (file: any) => {
        const fileInfo = await FileSystem.getInfoAsync(file.localPath);
        if (fileInfo.exists) {
            try {
                if (Platform.OS === 'android') {
                    // Android: Use IntentLauncher
                    let mimeType = '*/*';
                    const fileExtension = file.fileName.split('.').pop()?.toLowerCase();
                    if (fileExtension === 'pdf') mimeType = 'application/pdf';
                    else if (['jpg', 'jpeg', 'png'].includes(fileExtension || '')) mimeType = `image/${fileExtension}`;
                    
                    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                        data: fileInfo.uri,
                        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
                        type: mimeType,
                    });
                } else {
                    // iOS: Use Linking to open natively
                    Linking.openURL(file.localPath);
                }
            } catch (err) {
                Alert.alert('Error', 'Could not open file.');
            }
        } else {
            Alert.alert('Error', 'File not found on device.');
        }
    };

    // ==================== DELETE ====================
    const handleDeleteFile = (file: any) => {
        Alert.alert(language === "ar" ? "حذف الملف" : 'Delete File', language === "ar" ? `هل أنت متأكد من حذف "${file.fileName}"?` : `Are you sure you want to delete "${file.fileName}"?`, [
            { text: language === "ar" ? "إلغاء" : 'Cancel', style: 'cancel' },
            {
                text: language === "ar" ? "حذف" : 'Delete', style: 'destructive', onPress: () => {
                    FileDispatch({ type: 'remove_file', payload: { id: file.id } });
                }
            }
        ]);
    };

    // ==================== CATEGORY PICKER ====================
    const showCategoryPicker = () => {
        Alert.alert(language === "ar" ? "اختر الفئة" : 'Select Category', language === "ar" ? "ما نوع الملف؟" : 'What type of file is this?', [
            { text: language === "ar" ? "السجل الطبي" : 'Medical Record', onPress: () => handleAddFile('medical_record') },
            { text: language === "ar" ? "تقرير الأشعة" : 'Radiation Report', onPress: () => handleAddFile('radiation_report') },
            { text: language === "ar" ? "تقرير المختبر" : 'Laboratory Report', onPress: () => handleAddFile('laboratory_report') },
            { text: language === "ar" ? "إلغاء" : 'Cancel', style: 'cancel' },
        ]);
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#F9F9F9' }} contentContainerStyle={{ padding: 20, paddingTop: 50, gap: 20, paddingBottom: 50 }}>
            <Text allowFontScaling={false} style={{ fontFamily: 'ZillaSlab_700Bold', fontSize: width * 0.1, textAlign: 'center' }}>{language === "ar" ? "تاريخ المريض" : "Patient History"}</Text>

            {/* Add File Button */}
            <TouchableOpacity
                onPress={showCategoryPicker}
                style={{
                    backgroundColor: '#2D3436', padding: 15, borderRadius: 12,
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
                    alignSelf: 'center', width: '70%',
                }}
            >
                <Ionicons name="add-circle" size={22} color="white" />
                <Text allowFontScaling={false} style={{ color: 'white', fontFamily: language === "ar" ? undefined : 'SpaceMono_400Regular', fontSize: width * 0.04 }}>{language === "ar" ? "إضافة ملف" : "Add File"}</Text>
            </TouchableOpacity>

            {/* File List */}
            <Text allowFontScaling={false} style={{ fontFamily: 'ZillaSlab_700Bold', fontSize: width * 0.07, textAlign: language === "ar" ? "right" : 'left', marginTop: 30 }}>{language === "ar" ? "السجلات الطبية" : "Medical Records"}</Text>
            {Filestate.filter((file: any) => file.category === "medical_record").length === 0 ? (
                <Text allowFontScaling={false} style={{ fontSize: width * 0.04, textAlign: 'center', color: 'grey', marginTop: 20, fontFamily: language === "ar" ? undefined : 'SpaceMono_400Regular' }}>
                    {language === "ar" ? "لا توجد ملفات مضافة" : "No files added yet"}.
                </Text>
            ) : (
                Filestate.map((file: any) => (
                    file.category === "medical_record" ?
                        <View key={file.id} style={{
                            backgroundColor: 'white', borderRadius: 12, padding: 15,
                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                            shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
                        }}>
                            <TouchableOpacity onPress={() => handleReadFile(file)} style={{ flex: 1, gap: 4 }}>
                                <Text allowFontScaling={false} style={{ fontFamily: 'ZillaSlab_400Regular', fontSize: width * 0.045 }} numberOfLines={1}>{file.fileName}</Text>
                                <Text allowFontScaling={false} style={{ fontFamily: 'SpaceMono_400Regular', fontSize: width * 0.03, color: 'grey' }}>
                                    {file.category === 'medical_record' ? '📋 Medical Record' : '🩻 Radiation Report'}
                                </Text>
                                <Text allowFontScaling={false} style={{ fontFamily: 'SpaceMono_400Regular', fontSize: width * 0.025, color: 'lightgrey' }}>
                                    {new Date(file.dateAdded).toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleDeleteFile(file)} style={{ padding: 10 }}>
                                <Ionicons name="trash-outline" size={22} color="red" />
                            </TouchableOpacity>
                        </View> : ""
                ))
            )}

            <Text allowFontScaling={false} style={{ fontFamily: 'ZillaSlab_700Bold', fontSize: width * 0.07, textAlign: language === "ar" ? "right" : 'left', marginTop: 30 }}>{language === "ar" ? "تقارير الأشعة" : "Radiation Reports"}</Text>
            {Filestate.filter(file => file.category === "radiation_report").length === 0 ? (
                <Text allowFontScaling={false} style={{ fontSize: width * 0.04, textAlign: 'center', color: 'grey', marginTop: 20, fontFamily: language === "ar" ? undefined : 'SpaceMono_400Regular' }}>
                    {language === "ar" ? "لا توجد ملفات مضافة" : "No files added yet"}.
                </Text>
            ) : (
                Filestate.map((file: any) => (
                    file.category === "radiation_report" ?
                        <View key={file.id} style={{
                            backgroundColor: 'white', borderRadius: 12, padding: 15,
                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                            shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
                        }}>
                            <TouchableOpacity onPress={() => handleReadFile(file)} style={{ flex: 1, gap: 4 }}>
                                <Text allowFontScaling={false} style={{ fontFamily: 'ZillaSlab_400Regular', fontSize: width * 0.045 }} numberOfLines={1}>{file.fileName}</Text>
                                <Text allowFontScaling={false} style={{ fontFamily: 'SpaceMono_400Regular', fontSize: width * 0.03, color: 'grey' }}>
                                    {file.category === 'medical_record' ? '📋 Medical Record' : '🩻 Radiation Report'}
                                </Text>
                                <Text allowFontScaling={false} style={{ fontFamily: 'SpaceMono_400Regular', fontSize: width * 0.025, color: 'lightgrey' }}>
                                    {new Date(file.dateAdded).toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleDeleteFile(file)} style={{ padding: 10 }}>
                                <Ionicons name="trash-outline" size={22} color="red" />
                            </TouchableOpacity>
                        </View> : ""
                ))
            )}

            <Text allowFontScaling={false} style={{ fontFamily: 'ZillaSlab_700Bold', fontSize: width * 0.07, textAlign: language === "ar" ? "right" : 'left', marginTop: 30 }}>{language === "ar" ? "تقارير المختبر" : "Laboratory Reports"}</Text>
            {Filestate.filter(file => file.category === "laboratory_report").length === 0 ? (
                <Text allowFontScaling={false} style={{ fontSize: width * 0.04, textAlign: 'center', color: 'grey', marginTop: 20, fontFamily: language === "ar" ? undefined : 'SpaceMono_400Regular' }}>
                    {language === "ar" ? "لا توجد ملفات مضافة" : "No files added yet"}.
                </Text>
            ) : (
                Filestate.map((file: any) => (
                    file.category === "laboratory_report" ?
                        <View key={file.id} style={{
                            backgroundColor: 'white', borderRadius: 12, padding: 15,
                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                            shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
                        }}>
                            <TouchableOpacity onPress={() => handleReadFile(file)} style={{ flex: 1, gap: 4 }}>
                                <Text allowFontScaling={false} style={{ fontFamily: 'ZillaSlab_400Regular', fontSize: width * 0.045 }} numberOfLines={1}>{file.fileName}</Text>
                                <Text allowFontScaling={false} style={{ fontFamily: 'SpaceMono_400Regular', fontSize: width * 0.03, color: 'grey' }}>
                                    {"laboratory report"}
                                </Text>
                                <Text allowFontScaling={false} style={{ fontFamily: 'SpaceMono_400Regular', fontSize: width * 0.025, color: 'lightgrey' }}>
                                    {new Date(file.dateAdded).toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleDeleteFile(file)} style={{ padding: 10 }}>
                                <Ionicons name="trash-outline" size={22} color="red" />
                            </TouchableOpacity>
                        </View> : ""
                ))
            )}
        </ScrollView>
    );
}