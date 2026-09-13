import { useReducer } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { backgrounds, customers, ingredientImages, playerAvatars, sushiImages } from '../assets/registry';
import { gameReducer, ingredientIds, randomOrder } from '../game/game';
import { recipes } from '../game/recipes';

export function GameScreen() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => ({
    order: randomOrder(recipes), selected: [], feedback: null,
  }));

  return (
    <ImageBackground source={backgrounds[0]} style={styles.background} resizeMode="cover">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heading}>
            <Text style={styles.eyebrow}>WELCOME TO YOUR SHIFT</Text>
            <Text style={styles.title}>Sushi after hours</Text>
          </View>
          <View style={styles.scene}>
            <View style={styles.portrait}>
              <Image source={playerAvatars[0]} style={styles.character} resizeMode="contain" accessibilityLabel="Your sushi chef" />
              <Text style={styles.caption}>Chef</Text>
            </View>
            <View style={styles.portrait}>
              <Image source={customers.customer_01} style={styles.character} resizeMode="contain" accessibilityLabel="Current customer" />
              <Text style={styles.caption}>Your customer</Text>
            </View>
          </View>
          <View style={styles.panel}>
            <View style={styles.order}>
              <Image source={sushiImages[state.order.id as keyof typeof sushiImages]} style={styles.sushi} resizeMode="contain" />
              <View style={styles.orderText}>
                <Text style={styles.label}>ONE ORDER OF</Text>
                <Text style={styles.orderName}>{state.order.name}</Text>
              </View>
            </View>
            <Text style={styles.instructions}>Tap ingredients to add or remove them, then serve your order.</Text>
            <View style={styles.grid}>
              {ingredientIds.map(id => {
                const selected = state.selected.includes(id);
                const source = ingredientImages[id];
                const label = id.replace(/_/g, ' ');
                return (
                  <Pressable key={id} accessibilityRole="button" accessibilityLabel={label}
                    accessibilityState={{ selected }}
                    onPress={() => dispatch({ type: 'toggle', ingredient: id })}
                    style={({ pressed }) => [styles.ingredient, selected && styles.selected, pressed && styles.pressed]}>
                    {source ? <Image source={source} style={styles.icon} resizeMode="contain" />
                      : <View style={styles.placeholder}><Text style={styles.placeholderText}>{id === 'rice' ? 'R' : 'N'}</Text></View>}
                    <Text style={styles.ingredientLabel}>{selected ? '✓ ' : ''}{label}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.selection}>{state.selected.length} ingredients selected</Text>
            {state.feedback && <Text accessibilityLiveRegion="polite" style={styles.feedback}>{state.feedback}</Text>}
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" onPress={() => dispatch({ type: 'clear' })}
                style={({ pressed }) => [styles.clear, pressed && styles.pressed]}>
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityState={{ disabled: state.selected.length === 0 }}
                disabled={state.selected.length === 0}
                onPress={() => dispatch({ type: 'submit', nextOrder: randomOrder(recipes) })}
                style={({ pressed }) => [styles.submit, !state.selected.length && styles.disabled, pressed && styles.pressed]}>
                <Text style={styles.submitText}>Submit Order</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#241c20' },
  safe: { flex: 1, backgroundColor: 'rgba(20, 14, 18, 0.3)' },
  content: { width: '100%', maxWidth: 520, alignSelf: 'center', padding: 16, paddingBottom: 28 },
  heading: { paddingVertical: 12 },
  eyebrow: { color: '#ffe0af', fontSize: 11, letterSpacing: 2, fontWeight: '700' },
  title: { color: '#fff8eb', fontSize: 30, fontWeight: '800', marginTop: 4 },
  scene: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 14 },
  portrait: { alignItems: 'center', width: '43%' },
  character: { width: '100%', height: 132 },
  caption: { color: '#fff8eb', backgroundColor: '#34292b', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12 },
  panel: { backgroundColor: '#fff8eb', borderRadius: 24, padding: 16 },
  order: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sushi: { width: 78, height: 78 },
  orderText: { flex: 1 },
  label: { color: '#796357', fontSize: 11, letterSpacing: 1.5, fontWeight: '700' },
  orderName: { color: '#302622', fontSize: 23, fontWeight: '800', marginTop: 4 },
  instructions: { color: '#66554c', fontSize: 14, lineHeight: 20, marginVertical: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  ingredient: { width: '31%', minHeight: 96, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#eadfcd', borderRadius: 14, backgroundColor: '#fffdf7', padding: 5 },
  selected: { borderColor: '#35745c', backgroundColor: '#dfefdf' },
  icon: { width: 52, height: 52 },
  placeholder: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#e8dcc7', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  placeholderText: { fontSize: 23, color: '#564c3d', fontWeight: '700' },
  ingredientLabel: { color: '#3e342b', textTransform: 'capitalize', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  selection: { color: '#66554c', marginTop: 14, fontSize: 12 },
  feedback: { color: '#324e3d', fontSize: 14, lineHeight: 20, marginTop: 10 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  clear: { minHeight: 50, paddingHorizontal: 22, justifyContent: 'center', borderRadius: 14, backgroundColor: '#ece2d2' },
  clearText: { color: '#493d32', fontWeight: '700' },
  submit: { flex: 1, minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#9b3c32' },
  submitText: { color: '#fff8eb', fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.7 },
});
