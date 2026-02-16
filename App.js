import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Modal, RefreshControl, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const MOCK_PRICES = { gold: 2890.50, silver: 32.45, platinum: 980.25, palladium: 1050.00, copper: 4.15 };
const METALS = [
  { key: 'gold', symbol: 'XAU', name: 'Gold', color: '#FFD700', gradient: ['#FFD700', '#B8860B'] },
  { key: 'silver', symbol: 'XAG', name: 'Silver', color: '#E8E8E8', gradient: ['#E8E8E8', '#A8A8A8'] },
  { key: 'platinum', symbol: 'XPT', name: 'Platinum', color: '#E5E4E2', gradient: ['#E5E4E2', '#C0C0C0'] },
  { key: 'palladium', symbol: 'XPD', name: 'Palladium', color: '#CED0CE', gradient: ['#CED0CE', '#A0A0A0'] },
  { key: 'copper', symbol: 'XCP', name: 'Copper', color: '#B87333', gradient: ['#B87333', '#8B4513'] },
];

const GlassCard = ({ children, style, glow }) => (
  <View style={[styles.glassCard, glow && { shadowColor: '#FFD700', shadowOpacity: 0.3, shadowRadius: 20 }, style]}>
    <View style={styles.glassCardInner}>{children}</View>
  </View>
);

function HomeScreen() {
  const [portfolio, setPortfolio] = React.useState({ gold: 0.5, silver: 2, platinum: 0, palladium: 0, copper: 0 });
  const [refreshing, setRefreshing] = React.useState(false);
  const totalValue = Object.keys(portfolio).reduce((sum, metal) => sum + (portfolio[metal] * MOCK_PRICES[metal]), 0);
  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500); };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />}>
      <View style={styles.heroSection}>
        <View style={styles.heroGlow} />
        <Text style={styles.heroLabel}>TOTAL BALANCE</Text>
        <Text style={styles.heroValue}>${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
        <View style={styles.heroChange}><Text style={styles.heroChangeText}>+2.4%</Text><Text style={styles.heroChangeLabel}> today</Text></View>
      </View>
      <View style={styles.quickActions}>
        {[{ icon: 'arrow-down', label: 'Deposit' }, { icon: 'arrow-up', label: 'Withdraw' }, { icon: 'swap-horizontal', label: 'Swap' }].map((action, i) => (
          <TouchableOpacity key={i} style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 215, 0, 0.2)' }]}><Ionicons name={action.icon} size={20} color="#FFD700" /></View>
            <Text style={styles.actionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Live Market</Text>
        <View style={styles.metalsGrid}>
          {METALS.map((metal) => (
            <TouchableOpacity key={metal.key} style={styles.metalCard}>
              <View style={[styles.metalGlow, { backgroundColor: metal.color }]} />
              <View style={styles.metalCardContent}><Text style={[styles.metalSymbol, { color: metal.color }]}>{metal.symbol}</Text><Text style={styles.metalPrice}>${MOCK_PRICES[metal.key].toLocaleString()}</Text><Text style={styles.metalChange}>+1.2%</Text></View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Assets</Text>
        {METALS.map((metal) => (
          <GlassCard key={metal.key} style={styles.assetCard} glow={portfolio[metal.key] > 0}>
            <View style={styles.assetLeft}>
              <View style={[styles.assetIcon, { backgroundColor: metal.color }]}><Text style={styles.assetIconText}>{metal.name[0]}</Text></View>
              <View><Text style={styles.assetName}>{metal.name}</Text><Text style={styles.assetAmount}>{portfolio[metal.key].toFixed(4)} oz</Text></View>
            </View>
            <View style={styles.assetRight}><Text style={styles.assetValue}>${(portfolio[metal.key] * MOCK_PRICES[metal.key]).toFixed(2)}</Text><Text style={styles.assetPercent}>{(portfolio[metal.key] * MOCK_PRICES[metal.key] / totalValue * 100).toFixed(1)}%</Text></View>
          </GlassCard>
        ))}
      </View>
    </ScrollView>
  );
}

function BuyScreen() {
  const [selectedMetal, setSelectedMetal] = React.useState('gold');
  const [amount, setAmount] = React.useState('');
  const currentPrice = MOCK_PRICES[selectedMetal];
  const cost = (parseFloat(amount) || 0) * currentPrice;
  const metal = METALS.find(m => m.key === selectedMetal);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <View style={[styles.heroGlow, { backgroundColor: metal.color }]} />
        <Text style={[styles.heroLabel, { color: metal.color }]}>{metal.name.toUpperCase()}</Text>
        <Text style={styles.heroValue}>${currentPrice.toLocaleString()}</Text>
        <Text style={styles.heroUnit}>per troy ounce</Text>
      </View>
      <View style={styles.section}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selector}>
          {METALS.map((m) => (
            <TouchableOpacity key={m.key} style={[styles.selectorItem, selectedMetal === m.key && { borderColor: m.color, backgroundColor: `${m.color}20` }]} onPress={() => setSelectedMetal(m.key)}>
              <Text style={[styles.selectorText, selectedMetal === m.key && { color: m.color }]}>{m.symbol}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <GlassCard>
          <Text style={styles.inputLabel}>Amount (oz)</Text>
          <View style={styles.inputRow}>
            <TextInput style={styles.bigInput} placeholder="0.00" placeholderTextColor="#666" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
            <Text style={styles.inputUnit}>oz</Text>
          </View>
          <View style={styles.sliderContainer}>
            {[0.1, 0.5, 1, 5, 10].map((val) => (<TouchableOpacity key={val} style={styles.sliderDot} onPress={() => setAmount(val.toString())}><Text style={styles.sliderDotText}>{val}</Text></TouchableOpacity>))}
          </View>
        </GlassCard>
      </View>
      <View style={styles.section}>
        <GlassCard>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Price per oz</Text><Text style={styles.summaryValue}>${currentPrice.toFixed(2)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Quantity</Text><Text style={styles.summaryValue}>{parseFloat(amount) || 0} oz</Text></View>
          <View style={[styles.summaryRow, styles.summaryTotal]}><Text style={styles.summaryTotalLabel}>Total</Text><Text style={[styles.summaryTotalValue, { color: metal.color }]}>${cost.toFixed(2)}</Text></View>
        </GlassCard>
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.buyButton}><Text style={styles.buyButtonText}>Purchase {metal.name}</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function RoundUpsScreen() {
  const [enabled, setEnabled] = React.useState(true);
  const [multiplier, setMultiplier] = React.useState(1);
  const [targetMetal, setTargetMetal] = React.useState('gold');
  const [totalSaved] = React.useState(12.50);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <View style={[styles.heroGlow, { backgroundColor: '#FFD700' }]} />
        <Text style={styles.heroLabel}>ROUND UPS</Text>
        <Text style={styles.heroValue}>${totalSaved.toFixed(2)}</Text>
        <Text style={styles.heroUnit}>saved so far</Text>
      </View>
      <View style={styles.section}>
        <GlassCard>
          <View style={styles.toggleRow}>
            <View><Text style={styles.toggleTitle}>Enable Round Ups</Text><Text style={styles.toggleSubtitle}>Round up purchases to save</Text></View>
            <Switch value={enabled} onValueChange={setEnabled} trackColor={{ false: '#333', true: 'rgba(255, 215, 0, 0.5)' }} thumbColor={enabled ? '#FFD700' : '#666'} />
          </View>
        </GlassCard>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Multiplier</Text>
        <View style={styles.multiplierGrid}>
          {[{ val: 1, label: '1x' }, { val: 2, label: '2x' }, { val: 5, label: '5x' }, { val: 10, label: '10x' }].map((item) => (
            <TouchableOpacity key={item.val} style={[styles.multiplierCard, multiplier === item.val && styles.multiplierActive]} onPress={() => setMultiplier(item.val)}>
              <Text style={[styles.multiplierLabel, multiplier === item.val && styles.multiplierLabelActive]}>{item.label}</Text>
              <Text style={styles.multiplierDesc}>Save ${item.val * 0.5}/purchase</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invest In</Text>
        <View style={styles.metalGrid}>
          {METALS.map((m) => (
            <TouchableOpacity key={m.key} style={[styles.metalChip, targetMetal === m.key && { borderColor: m.color, backgroundColor: `${m.color}20` }]} onPress={() => setTargetMetal(m.key)}>
              <View style={[styles.metalChipDot, { backgroundColor: m.color }]} />
              <Text style={[styles.metalChipText, targetMetal === m.key && { color: m.color }]}>{m.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <GlassCard>
          <Text style={styles.howTitle}>How It Works</Text>
          {['Connect your bank account', 'Every purchase gets rounded up', 'Spare change buys gold', 'Watch your savings grow'].map((text, i) => (
            <View key={i} style={styles.howStep}><View style={styles.howNumber}><Text style={styles.howNumberText}>{i + 1}</Text></View><Text style={styles.howText}>{text}</Text></View>
          ))}
        </GlassCard>
      </View>
    </ScrollView>
  );
}

function AlertsScreen() {
  const [alerts, setAlerts] = React.useState([{ id: 1, metal: 'gold', type: 'above', price: 3000 }, { id: 2, metal: 'silver', type: 'below', price: 30 }]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newAlert, setNewAlert] = React.useState({ metal: 'gold', type: 'above', price: '' });
  const addAlert = () => { if (!newAlert.price) return; setAlerts([...alerts, { ...newAlert, id: Date.now() }]); setNewAlert({ metal: 'gold', type: 'above', price: '' }); setModalVisible(false); };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <View style={[styles.heroGlow, { backgroundColor: '#FF6B6B' }]} />
        <Text style={styles.heroLabel}>PRICE ALERTS</Text>
        <Text style={styles.heroValue}>{alerts.length}</Text>
        <Text style={styles.heroUnit}>active alerts</Text>
      </View>
      <View style={styles.section}>
        {alerts.map((alert) => { const metal = METALS.find(m => m.key === alert.metal); return (
          <GlassCard key={alert.id} style={styles.alertCard}>
            <View style={styles.alertLeft}><View style={[styles.alertIcon, { backgroundColor: metal.color }]}><Text style={styles.alertIconText}>{metal.name[0]}</Text></View><View><Text style={styles.alertMetal}>{metal.name}</Text><Text style={styles.alertType}>{alert.type === 'above' ? 'Above' : 'Below'} ${alert.price}</Text></View></View>
            <TouchableOpacity onPress={() => setAlerts(alerts.filter(a => a.id !== alert.id))}><Ionicons name="trash-outline" size={20} color="#666" /></TouchableOpacity>
          </GlassCard>
        );})}
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.addAlertButton} onPress={() => setModalVisible(true)}><Ionicons name="add" size={24} color="#000" /><Text style={styles.addAlertText}>Create New Alert</Text></TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Alert</Text>
            <Text style={styles.modalLabel}>Metal</Text>
            <View style={styles.metalGrid}>
              {METALS.map((m) => (<TouchableOpacity key={m.key} style={[styles.metalChip, newAlert.metal === m.key && { borderColor: m.color, backgroundColor: `${m.color}20` }]} onPress={() => setNewAlert({ ...newAlert, metal: m.key })}><Text style={[styles.metalChipText, newAlert.metal === m.key && { color: m.color }]}>{m.symbol}</Text></TouchableOpacity>))}
            </View>
            <Text style={styles.modalLabel}>Condition</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity style={[styles.toggleOption, newAlert.type === 'above' && styles.toggleOptionActive]} onPress={() => setNewAlert({ ...newAlert, type: 'above' })}><Text style={[styles.toggleOptionText, newAlert.type === 'above' && styles.toggleOptionTextActive]}>↑ Above</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.toggleOption, newAlert.type === 'below' && styles.toggleOptionActive]} onPress={() => setNewAlert({ ...newAlert, type: 'below' })}><Text style={[styles.toggleOptionText, newAlert.type === 'below' && styles.toggleOptionTextActive]}>↓ Below</Text></TouchableOpacity>
            </View>
            <Text style={styles.modalLabel}>Price ($)</Text>
            <TextInput style={styles.modalInput} placeholder="0.00" placeholderTextColor="#666" keyboardType="decimal-pad" value={newAlert.price} onChangeText={(text) => setNewAlert({ ...newAlert, price: text })} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={addAlert}><Text style={styles.modalConfirmText}>Create</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName = route.name === 'Home' ? (focused ? 'wallet' : 'wallet-outline') : route.name === 'Buy' ? (focused ? 'cart' : 'cart-outline') : route.name === 'Round Ups' ? (focused ? 'layers' : 'layers-outline') : (focused ? 'notifications' : 'notifications-outline');
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#FFD700', tabBarInactiveTintColor: '#555', tabBarStyle: { backgroundColor: '#0A0A12', borderTopWidth: 0, height: 80, paddingBottom: 20, paddingTop: 10 },
        headerStyle: { backgroundColor: '#0A0A12', borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }, headerTintColor: '#FFF', headerTitleStyle: { fontWeight: '600', fontSize: 18 },
      })}>
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Portfolio' }} />
        <Tab.Screen name="Buy" component={BuyScreen} options={{ title: 'Buy' }} />
        <Tab.Screen name="Round Ups" component={RoundUpsScreen} options={{ title: 'Round Ups' }} />
        <Tab.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Alerts' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A12' },
  heroSection: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20, position: 'relative', overflow: 'hidden' },
  heroGlow: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255, 215, 0, 0.15)', top: -50 },
  heroLabel: { fontSize: 12, color: '#666', letterSpacing: 2, marginBottom: 8 },
  heroValue: { fontSize: 48, fontWeight: '700', color: '#FFF', letterSpacing: -1 },
  heroUnit: { fontSize: 14, color: '#666', marginTop: 4 },
  heroChange: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  heroChangeText: { color: '#4CAF50', fontWeight: '600', fontSize: 14 },
  heroChangeLabel: { color: '#666', fontSize: 14 },
  quickActions: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20, marginBottom: 20, gap: 20 },
  actionButton: { alignItems: 'center' },
  actionIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { color: '#888', fontSize: 12 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#FFF', marginBottom: 16 },
  metalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  metalCard: { width: '31%', backgroundColor: '#12121A', borderRadius: 16, padding: 16, position: 'relative', overflow: 'hidden' },
  metalGlow: { position: 'absolute', width: 60, height: 60, borderRadius: 30, opacity: 0.2, top: -20, right: -20 },
  metalCardContent: { zIndex: 1 },
  metalSymbol: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  metalPrice: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  metalChange: { fontSize: 12, color: '#4CAF50', marginTop: 4 },
  glassCard: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' },
  glassCardInner: { padding: 20 },
  assetCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: 16 },
  assetLeft: { flexDirection: 'row', alignItems: 'center' },
  assetIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  assetIconText: { fontSize: 18, fontWeight: '700', color: '#000' },
  assetName: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  assetAmount: { fontSize: 13, color: '#666', marginTop: 2 },
  assetRight: { alignItems: 'flex-end' },
  assetValue: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  assetPercent: { fontSize: 12, color: '#666', marginTop: 2 },
  selector: { marginBottom: 10 },
  selectorItem: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#333', marginRight: 10 },
  selectorText: { color: '#666', fontWeight: '600' },
  inputLabel: { fontSize: 14, color: '#666', marginBottom: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  bigInput: { flex: 1, fontSize: 36, fontWeight: '300', color: '#FFF' },
  inputUnit: { fontSize: 20, color: '#666' },
  sliderContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  sliderDot: { backgroundColor: '#1A1A24', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  sliderDotText: { color: '#666', fontSize: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { color: '#666', fontSize: 14 },
  summaryValue: { color: '#FFF', fontSize: 14 },
  summaryTotal: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 12, marginBottom: 0 },
  summaryTotalLabel: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  summaryTotalValue: { fontSize: 24, fontWeight: '700' },
  buyButton: { backgroundColor: '#FFD700', paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
  buyButtonText: { color: '#000', fontSize: 16, fontWeight: '700' },
  multiplierGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  multiplierCard: { width: '47%', backgroundColor: '#12121A', borderRadius: 16, padding: 16 },
  multiplierActive: { borderWidth: 1, borderColor: '#FFD700', backgroundColor: 'rgba(255, 215, 0, 0.1)' },
  multiplierLabel: { fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  multiplierDesc: { fontSize: 12, color: '#666' },
  multiplierLabelActive: { color: '#FFD700' },
  metalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metalChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#12121A', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: 'transparent' },
  metalChipDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  metalChipText: { color: '#666', fontWeight: '500' },
  howTitle: { fontSize: 16, fontWeight: '600', color: '#FFF', marginBottom: 16 },
  howStep: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  howNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255, 215, 0, 0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  howNumberText: { color: '#FFD700', fontSize: 12, fontWeight: '700' },
  howText: { color: '#888', fontSize: 14 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleTitle: { fontSize: 16, fontWeight: '600', color: '#FFF', marginBottom: 4 },
  toggleSubtitle: { fontSize: 13, color: '#666' },
  alertCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  alertLeft: { flexDirection: 'row', alignItems: 'center' },
  alertIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  alertIconText: { fontSize: 16, fontWeight: '700', color: '#000' },
  alertMetal: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  alertType: { fontSize: 13, color: '#666', marginTop: 2 },
  addAlertButton: { backgroundColor: '#FFD700', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16 },
  addAlertText: { color: '#000', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#12121A', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 24, fontWeight: '700', color: '#FFF', textAlign: 'center', marginBottom: 24 },
  modalLabel: { fontSize: 14, color: '#666', marginBottom: 12, marginTop: 16 },
  modalInput: { backgroundColor: '#1A1A24', borderRadius: 16, padding: 16, color: '#FFF', fontSize: 24, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', marginTop: 24, gap: 12 },
  modalCancel: { flex: 1, backgroundColor: '#1A1A24', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  modalCancelText: { color: '#FFF', fontWeight: '600' },
  modalConfirm: { flex: 1, backgroundColor: '#FFD700', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  modalConfirmText: { color: '#000', fontWeight: '700' },
  toggleOption: { flex: 1, backgroundColor: '#1A1A24', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  toggleOptionActive: { backgroundColor: 'rgba(255, 215, 0, 0.2)', borderWidth: 1, borderColor: '#FFD700' },
  toggleOptionText: { color: '#666', fontWeight: '600' },
  toggleOptionTextActive: { color: '#FFD700' },
});
