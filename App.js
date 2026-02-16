import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Modal, RefreshControl } from 'react-native';

// Mock prices (in production, fetch from Metals.dev API)
const MOCK_PRICES = {
  gold: 2890.50,
  silver: 32.45,
  platinum: 980.25,
  palladium: 1050.00,
  copper: 4.15,
};

const METALS = [
  { key: 'gold', symbol: 'XAU', name: 'Gold', color: '#FFD700' },
  { key: 'silver', symbol: 'XAG', name: 'Silver', color: '#C0C0C0' },
  { key: 'platinum', symbol: 'XPT', name: 'Platinum', color: '#E5E4E2' },
  { key: 'palladium', symbol: 'XPD', name: 'Palladium', color: '#CED0CE' },
  { key: 'copper', symbol: 'XCP', name: 'Copper', color: '#B87333' },
];

// ==================== HOME SCREEN ====================
function HomeScreen() {
  const [portfolio, setPortfolio] = React.useState({ gold: 0, silver: 0, platinum: 0, palladium: 0, copper: 0 });
  const [refreshing, setRefreshing] = React.useState(false);

  const totalValue = Object.keys(portfolio).reduce((sum, metal) => 
    sum + (portfolio[metal] * MOCK_PRICES[metal]), 0
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />
    }>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Portfolio</Text>
        <Text style={styles.totalValue}>${totalValue.toFixed(2)}</Text>
        <Text style={styles.totalLabel}>Total Value (USD)</Text>
      </View>

      <View style={styles.pricesSection}>
        <Text style={styles.sectionTitle}>Live Prices</Text>
        <View style={styles.pricesRow}>
          {METALS.map((metal) => (
            <View key={metal.key} style={styles.priceCard}>
              <Text style={[styles.priceName, { color: metal.color }]}>{metal.name}</Text>
              <Text style={styles.priceValue}>${MOCK_PRICES[metal.key]?.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.portfolioSection}>
        <Text style={styles.sectionTitle}>Your Holdings</Text>
        {METALS.map((metal) => (
          <View key={metal.key} style={[styles.metalCard, { borderLeftColor: metal.color }]}>
            <View style={styles.metalHeader}>
              <View style={[styles.metalIcon, { backgroundColor: metal.color }]}>
                <Text style={styles.metalIconText}>{metal.name[0]}</Text>
              </View>
              <View>
                <Text style={styles.metalName}>{metal.name}</Text>
                <Text style={styles.metalSymbol}>{metal.symbol}</Text>
              </View>
            </View>
            <View style={styles.metalStats}>
              <Text style={styles.metalAmount}>{portfolio[metal.key].toFixed(4)} oz</Text>
              <Text style={styles.metalValue}>
                ${(portfolio[metal.key] * MOCK_PRICES[metal.key]).toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ==================== BUY SCREEN ====================
function BuyScreen() {
  const [selectedMetal, setSelectedMetal] = React.useState('gold');
  const [amount, setAmount] = React.useState('');
  const [portfolio, setPortfolio] = React.useState({ gold: 0, silver: 0, platinum: 0, palladium: 0, copper: 0 });

  const currentPrice = MOCK_PRICES[selectedMetal];
  const cost = (parseFloat(amount) || 0) * currentPrice;

  const handleBuy = () => {
    const oz = parseFloat(amount);
    if (!oz || oz <= 0) return;
    setPortfolio(prev => ({ ...prev, [selectedMetal]: prev[selectedMetal] + oz }));
    setAmount('');
    alert(`Bought ${oz} oz of ${selectedMetal} for $${cost.toFixed(2)}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buy Metals</Text>
        <Text style={styles.headerSubtitle}>Invest in precious metals</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Metal</Text>
        <View style={styles.metalGrid}>
          {METALS.map((metal) => (
            <TouchableOpacity
              key={metal.key}
              style={[
                styles.metalOption,
                selectedMetal === metal.key && { borderColor: metal.color, borderWidth: 2 }
              ]}
              onPress={() => setSelectedMetal(metal.key)}
            >
              <View style={[styles.metalIconSmall, { backgroundColor: metal.color }]}>
                <Text style={styles.metalIconTextSmall}>{metal.name[0]}</Text>
              </View>
              <Text style={styles.metalNameSmall}>{metal.name}</Text>
              <Text style={styles.metalPriceSmall}>${MOCK_PRICES[metal.key]?.toFixed(0)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amount (oz)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#666"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <Text style={styles.inputUnit}>oz</Text>
        </View>

        <View style={styles.quickAmounts}>
          {[0.1, 0.5, 1, 5, 10].map((val) => (
            <TouchableOpacity key={val} style={styles.quickButton} onPress={() => setAmount(val.toString())}>
              <Text style={styles.quickButtonText}>{val}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.costCard}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Price per oz</Text>
            <Text style={styles.costValue}>${currentPrice.toFixed(2)}</Text>
          </View>
          <View style={[styles.costRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${cost.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ==================== ROUND UPS SCREEN ====================
function RoundUpsScreen() {
  const [enabled, setEnabled] = React.useState(false);
  const [multiplier, setMultiplier] = React.useState(1);
  const [targetMetal, setTargetMetal] = React.useState('gold');
  const [totalSaved, setTotalSaved] = React.useState(0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Round Ups</Text>
        <Text style={styles.headerSubtitle}>Save spare change in gold</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Enable Round Ups</Text>
            <Text style={styles.toggleDescription}>
              Automatically round up to save in {targetMetal}
            </Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: '#333', true: '#FFD700' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Multiplier</Text>
        <View style={styles.multiplierRow}>
          {[1, 2, 5, 10].map((val) => (
            <TouchableOpacity
              key={val}
              style={[styles.multiplierOption, multiplier === val && styles.multiplierActive]}
              onPress={() => setMultiplier(val)}
            >
              <Text style={[styles.multiplierText, multiplier === val && styles.multiplierTextActive]}>
                {val}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Save In</Text>
        <View style={styles.metalGrid}>
          {METALS.map((metal) => (
            <TouchableOpacity
              key={metal.key}
              style={[styles.metalOption, targetMetal === metal.key && styles.metalOptionActive]}
              onPress={() => setTargetMetal(metal.key)}
            >
              <Text style={[styles.metalOptionText, targetMetal === metal.key && styles.metalOptionTextActive]}>
                {metal.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Total Saved</Text>
        <Text style={styles.statsValue}>{totalSaved.toFixed(4)} oz {targetMetal}</Text>
      </View>
    </ScrollView>
  );
}

// ==================== ALERTS SCREEN ====================
function AlertsScreen() {
  const [alerts, setAlerts] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newAlert, setNewAlert] = React.useState({ metal: 'gold', type: 'above', price: '' });

  const handleAddAlert = () => {
    if (!newAlert.price) return;
    setAlerts([...alerts, { ...newAlert, id: Date.now() }]);
    setNewAlert({ metal: 'gold', type: 'above', price: '' });
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Price Alerts</Text>
        <Text style={styles.headerSubtitle}>Get notified when prices hit your target</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Alerts ({alerts.length})</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No alerts set</Text>
          </View>
        ) : (
          alerts.map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              <View>
                <Text style={styles.alertMetal}>{alert.metal.toUpperCase()}</Text>
                <Text style={styles.alertPrice}>
                  {alert.type === 'above' ? '↑ Above' : '↓ Below'} ${alert.price}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setAlerts(alerts.filter(a => a.id !== alert.id))}>
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Alert</Text>
            
            <Text style={styles.modalLabel}>Metal</Text>
            <View style={styles.metalSelector}>
              {METALS.map((metal) => (
                <TouchableOpacity
                  key={metal.key}
                  style={[styles.metalOption, newAlert.metal === metal.key && styles.metalOptionActive]}
                  onPress={() => setNewAlert({ ...newAlert, metal: metal.key })}
                >
                  <Text style={[styles.metalOptionText, newAlert.metal === metal.key && styles.metalOptionTextActive]}>
                    {metal.name[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeOption, newAlert.type === 'above' && styles.typeOptionActive]}
                onPress={() => setNewAlert({ ...newAlert, type: 'above' })}
              >
                <Text style={styles.typeOptionText}>↑ Above</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeOption, newAlert.type === 'below' && styles.typeOptionActive]}
                onPress={() => setNewAlert({ ...newAlert, type: 'below' })}
              >
                <Text style={styles.typeOptionText}>↓ Below</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Target Price ($)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="0.00"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
              value={newAlert.price}
              onChangeText={(text) => setNewAlert({ ...newAlert, price: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleAddAlert}>
                <Text style={styles.confirmButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ==================== NAVIGATION ====================
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Buy') iconName = focused ? 'cart' : 'cart-outline';
            else if (route.name === 'Round Ups') iconName = focused ? 'cash' : 'cash-outline';
            else if (route.name === 'Alerts') iconName = focused ? 'notifications' : 'notifications-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#16213e', height: 60, paddingBottom: 5 },
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Portfolio' }} />
        <Tab.Screen name="Buy" component={BuyScreen} options={{ title: 'Buy Metals' }} />
        <Tab.Screen name="Round Ups" component={RoundUpsScreen} options={{ title: 'Round Ups' }} />
        <Tab.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Alerts' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1a1a2e', paddingTop: 50 },
  headerTitle: { fontSize: 16, color: '#888', marginBottom: 10 },
  totalValue: { fontSize: 42, fontWeight: 'bold', color: '#FFD700' },
  totalLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  headerSubtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  pricesSection: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#1a1a2e' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  pricesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priceCard: { width: '18%', backgroundColor: '#1a1a2e', borderRadius: 10, padding: 10, alignItems: 'center' },
  priceName: { fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  priceValue: { fontSize: 11, color: '#fff', fontWeight: '600' },
  portfolioSection: { padding: 20 },
  metalCard: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 15, marginBottom: 12, borderLeftWidth: 4 },
  metalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  metalIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  metalIconText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  metalName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  metalSymbol: { fontSize: 12, color: '#666' },
  metalStats: { flexDirection: 'row', justifyContent: 'space-between' },
  metalAmount: { fontSize: 14, color: '#888' },
  metalValue: { fontSize: 18, fontWeight: 'bold', color: '#FFD700' },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#1a1a2e' },
  metalGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metalOption: { width: '18%', backgroundColor: '#1a1a2e', borderRadius: 10, padding: 10, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: 'transparent' },
  metalIconSmall: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  metalIconTextSmall: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  metalNameSmall: { fontSize: 10, color: '#fff', textAlign: 'center' },
  metalPriceSmall: { fontSize: 9, color: '#FFD700', marginTop: 2 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a2e', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15 },
  input: { flex: 1, fontSize: 24, color: '#fff', paddingVertical: 15 },
  inputUnit: { fontSize: 18, color: '#888' },
  quickAmounts: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  quickButton: { backgroundColor: '#1a1a2e', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  quickButtonText: { color: '#888', fontSize: 12 },
  costCard: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 15, marginBottom: 20 },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  costLabel: { color: '#888', fontSize: 14 },
  costValue: { color: '#fff', fontSize: 14 },
  totalRow: { borderTopWidth: 1, borderTopColor: '#333', paddingTop: 10, marginBottom: 0 },
  totalLabel: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  totalValue: { color: '#FFD700', fontSize: 20, fontWeight: 'bold' },
  buyButton: { backgroundColor: '#FFD700', paddingVertical: 15, borderRadius: 25, alignItems: 'center' },
  buyButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleLabel: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  toggleDescription: { fontSize: 12, color: '#888', maxWidth: '70%' },
  multiplierRow: { flexDirection: 'row', justifyContent: 'space-between' },
  multiplierOption: { flex: 1, marginHorizontal: 5, backgroundColor: '#1a1a2e', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  multiplierActive: { backgroundColor: '#FFD700' },
  multiplierText: { color: '#888', fontWeight: 'bold' },
  multiplierTextActive: { color: '#000' },
  statsCard: { margin: 20, backgroundColor: '#1a1a2e', borderRadius: 12, padding: 20, alignItems: 'center' },
  statsTitle: { fontSize: 14, color: '#888' },
  statsValue: { fontSize: 24, fontWeight: 'bold', color: '#FFD700', marginVertical: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  addButton: { backgroundColor: '#FFD700', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  addButtonText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#666' },
  alertCard: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  alertMetal: { fontSize: 16, fontWeight: 'bold', color: '#FFD700' },
  alertPrice: { fontSize: 14, color: '#fff', marginTop: 3 },
  deleteText: { color: '#666', fontSize: 24 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1a1a2e', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  modalLabel: { fontSize: 14, color: '#888', marginBottom: 10, marginTop: 10 },
  metalSelector: { flexDirection: 'row', justifyContent: 'space-between' },
  metalOptionActive: { backgroundColor: '#FFD700' },
  metalOptionText: { color: '#888', fontWeight: 'bold' },
  metalOptionTextActive: { color: '#000' },
  typeSelector: { flexDirection: 'row' },
  typeOption: { flex: 1, marginHorizontal: 5, paddingVertical: 12, backgroundColor: '#0f0f1a', borderRadius: 8, alignItems: 'center' },
  typeOptionActive: { backgroundColor: '#333' },
  typeOptionText: { color: '#888' },
  modalInput: { backgroundColor: '#0f0f1a', borderRadius: 12, padding: 15, color: '#fff', fontSize: 24, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', marginTop: 20 },
  cancelButton: { flex: 1, paddingVertical: 15, marginRight: 10, backgroundColor: '#333', borderRadius: 12, alignItems: 'center' },
  cancelButtonText: { color: '#fff', fontWeight: 'bold' },
  confirmButton: { flex: 1, paddingVertical: 15, marginLeft: 10, backgroundColor: '#FFD700', borderRadius: 12, alignItems: 'center' },
  confirmButtonText: { color: '#000', fontWeight: 'bold' },
});
