import React, { useEffect, useState, useRef } from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image, Dimensions, StyleSheet, Animated,} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Feather } from '@expo/vector-icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Cookies from 'js-cookie';
import {dashboardStyles} from '../../styles/dashboardStyles'
import { Colors } from '../../constants/Colors';
import sharedStyles from '../../styles/sharedStyles';


export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                })
            ])
        ).start();

    }, []);

    useEffect(() => {
        const token = Cookies.get('userToken');
        if (!token) {
            setTimeout(() => {
                router.replace('/authentication/Login');
            }, 0);
            return;
        }

        setLoading(false); // או פשוט לא צריך את זה אם אין לך מצב טעינה
    }, []);

    if (loading) {
        return <Text>טעינה...</Text>; // או קומפוננטת טעינה אם יש לך כזו
    }

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (e) {
            console.log('Logout error:', e);
        }
        Cookies.remove('userToken');
        router.replace('/authentication/Login');
    };

    const goTo = (route) => () => {
        router.push(route);
    };

    return (
        <ProtectedRoute requireAuth={true}>
            <View contentContainerStyle={dashboardStyles.scrollContainer}>
                <View style={dashboardStyles.header}>
                    {/* לוגו מצד שמאל */}
                    <Text style={dashboardStyles.logo}>
                        <Text style={dashboardStyles.mathColor}>Mama</Text>
                        <Text style={dashboardStyles.JourneyColor}>Track</Text>
                    </Text>

                    {/* כפתור התנתקות מצד ימין */}
                    <TouchableOpacity onPress={handleLogout} style={dashboardStyles.logoutIconButton}>
                        <Feather name="log-out" size={18} color={Colors.primary} />
                        <Text style={dashboardStyles.logoutLabel}>התנתקות</Text>
                    </TouchableOpacity>
                </View>


                <LinearGradient
                    colors={[Colors.primary, Colors.accent]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    style={dashboardStyles.gradientTitleWrapper}
                >
                    <Text style={dashboardStyles.gradientTitle}>ברוכים הבאים ל MamaTrack!</Text>
                </LinearGradient>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {[
                        { label: 'הפרופיל שלי', route: 'MyProfile' },
                        { label: 'תצוגה כללית', route: 'overview' },
                        { label: 'עדכונים שבועיים', route: 'weeklyUpdates' },
                        { label: 'בדיקות צפויות', route: 'upcomingTests' },
                        { label: 'שאלות נפוצות', route: 'faq' },
                        { label: 'רשימות קניות', route: 'shoppingList' },
                        { label: 'ציוד לחדר לידה', route: 'hospitalBag' },
                        { label: 'טיימר צירים', route: 'contractionTimer' },
                    ].map(({ label, route }) => (
                        <TouchableOpacity
                            key={route}
                            style={[sharedStyles.primaryButton, { width: 250, marginBottom: 12 }]}
                            onPress={goTo(route)}
                        >
                            <Text style={sharedStyles.primaryButtonText}>{label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ProtectedRoute>
    );
}


