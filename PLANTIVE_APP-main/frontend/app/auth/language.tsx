import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Platform 
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { useLanguage } from '../../contexts/LanguageContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LanguageScreen() {
  const { setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<'english' | 'hindi'>('english');

  const handleLanguageSelect = (lang: 'english' | 'hindi') => {
    setSelectedLang(lang);
    setLanguage(lang);
  };

  const handleContinue = () => {
    router.push('/auth/role');
  };

  const playAudio = (lang: 'english' | 'hindi') => {
    // This would play audio in a real app
    console.log(`Playing audio for ${lang}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('choose_language')}</Text>
          <Text style={styles.subtitle}>भाषा चुनें</Text>
        </View>

        <View style={styles.languageContainer}>
          {/* English Card */}
          <TouchableOpacity
            style={[
              styles.languageCard,
              selectedLang === 'english' && styles.selectedCard,
            ]}
            onPress={() => handleLanguageSelect('english')}
            activeOpacity={0.7}
          >
            <View style={styles.languageContent}>
              <View>
                <Text style={styles.languageText}>{t('english')}</Text>
                <Text style={styles.languageSubtext}>English</Text>
              </View>
              <TouchableOpacity 
                style={styles.audioButton}
                onPress={() => playAudio('english')}
                onPressIn={(e) => e.stopPropagation()}
              >
                <Ionicons name="volume-medium-outline" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            {selectedLang === 'english' && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              </View>
            )}
          </TouchableOpacity>

          {/* Hindi Card */}
          <TouchableOpacity
            style={[
              styles.languageCard,
              selectedLang === 'hindi' && styles.selectedCard,
            ]}
            onPress={() => handleLanguageSelect('hindi')}
            activeOpacity={0.7}
          >
            <View style={styles.languageContent}>
              <View>
                <Text style={styles.languageText}>{t('hindi')}</Text>
                <Text style={styles.languageSubtext}>Hindi</Text>
              </View>
              <TouchableOpacity 
                style={styles.audioButton}
                onPress={() => playAudio('hindi')}
                onPressIn={(e) => e.stopPropagation()}
              >
                <Ionicons name="volume-medium-outline" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            {selectedLang === 'hindi' && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>{t('continue')}</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.gray,
    textAlign: 'center',
  },
  languageContainer: {
    gap: 20,
    marginBottom: 40,
  },
  languageCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.tertiary}20`,
  },
  languageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 4,
  },
  languageSubtext: {
    fontSize: 16,
    color: COLORS.gray,
  },
  audioButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${COLORS.secondary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      },
    }),
  },
  continueText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});