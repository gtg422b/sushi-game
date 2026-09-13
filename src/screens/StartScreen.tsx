import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { backgrounds, playerAvatars } from '../assets/registry';
import type { AvatarId, GameMode, SessionOptions } from '../game/game';

type Props = {
  setup: SessionOptions;
  onSelectAvatar: (avatar: AvatarId) => void;
  onSelectMode: (mode: GameMode) => void;
  onStart: () => void;
};

export function StartScreen({ setup, onSelectAvatar, onSelectMode, onStart }: Props) {
  return (
    <View style={styles.root}>
      <Image source={backgrounds[0]} style={styles.background} resizeMode="cover" />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.eyebrow}>WELCOME TO YOUR SHIFT</Text>
          <Text accessibilityRole="header" style={styles.title}>Sushi after hours</Text>
          <Text style={styles.intro}>Serve sushi. Keep your cool. Try to survive the night.</Text>
          <View style={styles.panel}>
            <Text accessibilityRole="header" style={styles.heading}>Choose your chef</Text>
            <View style={styles.row}>
              {(['female', 'male'] as const).map(avatar => {
                const selected = setup.selected_avatar === avatar;
                return (
                  <Pressable key={avatar} accessibilityRole="radio" accessibilityLabel={`${avatar === 'female' ? 'Female' : 'Male'} chef`}
                    accessibilityState={{ checked: selected }} onPress={() => onSelectAvatar(avatar)}
                    style={({ pressed }) => [styles.choice, selected && styles.selected, pressed && styles.pressed]}>
                    <Image source={playerAvatars[avatar][0]} style={styles.chef} resizeMode="contain" />
                    <Text style={styles.choiceText}>{selected ? '✓ ' : ''}{avatar === 'female' ? 'Female' : 'Male'}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text accessibilityRole="header" style={styles.heading}>Choose your mode</Text>
            <View style={styles.row}>
              {(['easy', 'hard'] as const).map(mode => {
                const selected = setup.game_mode === mode;
                return (
                  <Pressable key={mode} accessibilityRole="radio" accessibilityLabel={`${mode === 'easy' ? 'Easy' : 'Hard'} mode`}
                    accessibilityState={{ checked: selected }} onPress={() => onSelectMode(mode)}
                    style={({ pressed }) => [styles.choice, selected && styles.selected, pressed && styles.pressed]}>
                    <Text style={styles.choiceText}>{selected ? '✓ ' : ''}{mode === 'easy' ? 'Easy' : 'Hard'}</Text>
                    <Text style={styles.description}>{mode === 'easy' ? 'English sushi names' : 'Japanese sushi names'}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.note}>Both modes use the same ingredients. Your chef and mode stay fixed for the shift.</Text>
            <Pressable accessibilityRole="button" onPress={onStart}
              style={({ pressed }) => [styles.start, pressed && styles.pressed]}>
              <Text style={styles.startText}>Start Game</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#241c20' },
  background: { position: 'absolute', width: '100%', height: '100%' },
  safe: { flex: 1, backgroundColor: 'rgba(20, 14, 18, 0.5)' },
  content: { flexGrow: 1, justifyContent: 'center', width: '100%', maxWidth: 520, alignSelf: 'center', padding: 20, paddingBottom: 32 },
  eyebrow: { color: '#ffe0af', fontSize: 11, letterSpacing: 2, fontWeight: '700' },
  title: { color: '#fff8eb', fontSize: 32, fontWeight: '800', marginTop: 6 },
  intro: { color: '#fff8eb', fontSize: 16, lineHeight: 23, marginVertical: 14 },
  panel: { backgroundColor: '#fff8eb', borderRadius: 24, padding: 16 },
  heading: { color: '#302622', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  choice: { flex: 1, minHeight: 60, borderWidth: 2, borderColor: '#eadfcd', borderRadius: 14, padding: 10, backgroundColor: '#fffdf7', alignItems: 'center', justifyContent: 'center' },
  selected: { borderColor: '#35745c', backgroundColor: '#dfefdf' },
  chef: { width: '100%', height: 144 },
  choiceText: { color: '#302622', fontSize: 17, fontWeight: '700', textAlign: 'center' },
  description: { color: '#66554c', fontSize: 13, textAlign: 'center', marginTop: 6 },
  note: { color: '#66554c', fontSize: 14, lineHeight: 20, marginBottom: 16 },
  start: { minHeight: 52, backgroundColor: '#9b3c32', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  startText: { color: '#fff8eb', fontSize: 17, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
