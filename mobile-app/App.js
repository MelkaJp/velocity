import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';

const API_BASE = 'http://10.0.2.2:8000/api';

const Stack = createNativeStackNavigator();

const COLORS = {
  primary: '#0D1B2A',
  secondary: '#1B263B',
  accent: '#2EC4B6',
  blue: '#3A86FF',
  success: '#06D6A0',
  warning: '#FF6B35',
  danger: '#EF476F',
  text: '#FFFFFF',
  textMuted: '#8D99AE',
};

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>⛽ VeloCity</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Dashboard</Text>
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('Vehicles')}>
              <Text style={styles.statIcon}>🚗</Text>
              <Text style={styles.statValue}>Vehicles</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('Wallet')}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={styles.statValue}>Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('Stations')}>
              <Text style={styles.statIcon}>⛽</Text>
              <Text style={styles.statValue}>Stations</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('Vehicles')}>
          <Text style={styles.menuIcon}>🚗</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>My Vehicles</Text>
            <Text style={styles.menuSub}>Register and manage vehicles</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('QRScanner')}>
          <Text style={styles.menuIcon}>📱</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Scan QR</Text>
            <Text style={styles.menuSub}>Scan vehicle QR for fuel</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('Stations')}>
          <Text style={styles.menuIcon}>🗺️</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Live Map</Text>
            <Text style={styles.menuSub}>Find stations near you</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('History')}>
          <Text style={styles.menuIcon}>📜</Text>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Transactions</Text>
            <Text style={styles.menuSub}>View fuel history</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function VehiclesScreen({ navigation }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'bajaj', plate: '', tank_capacity: 35, owner_name: '', phone: '' });

  useEffect(() => {
    fetch(API_BASE + '/vehicles').then(r => r.json()).then(d => { setVehicles(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const register = async () => {
    if (!form.plate || !form.owner_name || !form.phone) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const res = await fetch(API_BASE + '/vehicles/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      setVehicles([...vehicles, data.vehicle]);
      setShowForm(false);
      Alert.alert('Success', 'Vehicle registered!');
    } else {
      Alert.alert('Error', data.detail || 'Failed');
    }
  };

  const getTypeColor = (type) => type === 'bajaj' ? COLORS.accent : type === 'automobile' ? COLORS.blue : '#212529';

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color={COLORS.accent} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backBtn}>← Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>My Vehicles</Text>
      </View>
      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.btn} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.btnText}>+ Register Vehicle</Text>
        </TouchableOpacity>

        {showForm && (
          <View style={styles.form}>
            <Text style={styles.formLabel}>Vehicle Type</Text>
            <View style={styles.typeSelector}>
              {['bajaj', 'automobile', 'truck'].map(t => (
                <TouchableOpacity key={t} style={[styles.typeBtn, form.type === t && { background: getTypeColor(t) }]} onPress={() => { setForm({ ...form, type: t, tank_capacity: t === 'bajaj' ? 35 : t === 'automobile' ? 60 : 300 }); }}>
                  <Text style={[styles.typeBtnText, form.type === t && { color: COLORS.primary }]}>{t.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.input} placeholder="Plate Number" placeholderTextColor={COLORS.textMuted} value={form.plate} onChangeText={v => setForm({ ...form, plate: v })} />
            <TextInput style={styles.input} placeholder="Tank Capacity (L)" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" value={String(form.tank_capacity)} onChangeText={v => setForm({ ...form, tank_capacity: parseInt(v) || 0 })} />
            <TextInput style={styles.input} placeholder="Owner Name" placeholderTextColor={COLORS.textMuted} value={form.owner_name} onChangeText={v => setForm({ ...form, owner_name: v })} />
            <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor={COLORS.textMuted} keyboardType="phone-pad" value={form.phone} onChangeText={v => setForm({ ...form, phone: v })} />
            <TouchableOpacity style={styles.btn} onPress={register}><Text style={styles.btnText}>Register</Text></TouchableOpacity>
          </View>
        )}

        {vehicles.map(v => (
          <View key={v.id} style={[styles.vehicleCard, { borderLeftColor: getTypeColor(v.type) }]}>
            <Text style={styles.vehiclePlate}>{v.plate}</Text>
            <Text style={styles.vehicleType}>{v.type.toUpperCase()} - {v.tank_capacity}L</Text>
            <Text style={styles.vehicleQR}>QR: {v.qr_code}</Text>
          </View>
        ))}
        {vehicles.length === 0 && <Text style={styles.empty}>No vehicles yet</Text>}
      </ScrollView>
    </View>
  );
}

function WalletScreen() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_BASE + '/vehicles').then(r => r.json()).then(async d => {
      const withWallets = await Promise.all(d.map(async v => {
        const w = await fetch(API_BASE + '/wallet/' + v.id).then(r => r.json()).catch(() => ({ balance: 0 }));
        return { ...v, wallet: w };
      }));
      setVehicles(withWallets);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const total = vehicles.reduce((s, v) => s + (v.wallet?.balance || 0), 0);

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color={COLORS.accent} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>💰 Fuel Wallet</Text></View>
      <View style={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>${total.toFixed(2)}</Text>
        </View>
        {vehicles.map(v => (
          <View key={v.id} style={styles.walletRow}>
            <Text style={styles.walletPlate}>{v.plate}</Text>
            <Text style={styles.walletBalance}>${(v.wallet?.balance || 0).toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function StationsScreen() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_BASE + '/stations').then(r => r.json()).then(d => { setStations(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const getColor = (inv) => inv > 10000 ? COLORS.success : inv > 5000 ? COLORS.warning : COLORS.danger;

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color={COLORS.accent} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>⛽ Stations</Text></View>
      <ScrollView style={styles.content}>
        {stations.map(s => (
          <View key={s.id} style={styles.stationCard}>
            <Text style={styles.stationName}>{s.name}</Text>
            <Text style={styles.stationLocation}>📍 {s.location}</Text>
            <View style={styles.inventoryRow}>
              <View style={styles.inventoryBar}><View style={[styles.inventoryFill, { width: (s.inventory / 20000) * 100 + '%', background: getColor(s.inventory) }]} /></View>
              <Text style={styles.inventoryText}>{s.inventory}L</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function QRScannerScreen({ navigation }) {
  const [code, setCode] = useState('');
  const [liters, setLiters] = useState('');
  const [loading, setLoading] = useState(false);

  const simulateScan = () => {
    fetch(API_BASE + '/vehicles').then(r => r.json()).then(d => {
      if (d.length > 0) setCode(d[0].qr_code);
    });
  };

  const verify = async () => {
    if (!code || !liters) {
      Alert.alert('Error', 'Enter QR code and liters');
      return;
    }
    setLoading(true);
    const v = await fetch(API_BASE + '/vehicles/qr/' + code).then(r => r.json()).catch(() => null);
    if (!v) {
      Alert.alert('Error', 'Vehicle not found');
      setLoading(false);
      return;
    }
    const res = await fetch(API_BASE + '/transactions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicle_id: v.id, station_id: 'ST001', liters: parseFloat(liters) })
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      Alert.alert('Success', `Transaction: ${data.transaction.liters}L - $${data.transaction.amount}`);
      setCode('');
      setLiters('');
    } else {
      Alert.alert('Error', data.detail || 'Transaction failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backBtn}>← Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>📱 Scan QR</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.scannerBox}>
          <Text style={styles.scannerPlaceholder}>📷</Text>
          <Text style={styles.scannerText}>Camera Preview</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={simulateScan}><Text style={styles.btnText}>Simulate Scan</Text></TouchableOpacity>
        {code && <Text style={styles.scannedCode}>Scanned: {code}</Text>}
        <TextInput style={styles.input} placeholder="Enter Liters" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" value={liters} onChangeText={setLiters} />
        <TouchableOpacity style={styles.btn} onPress={verify} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Processing...' : 'Verify & Complete'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HistoryScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_BASE + '/transactions').then(r => r.json()).then(d => { setTransactions(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color={COLORS.accent} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>📜 History</Text></View>
      <ScrollView style={styles.content}>
        {transactions.map(tx => (
          <View key={tx.id} style={styles.txCard}>
            <View style={styles.txRow}>
              <Text style={styles.txPlate}>{tx.vehicle_plate}</Text>
              <Text style={styles.txAmount}>{tx.liters}L - ${tx.amount}</Text>
            </View>
            <Text style={styles.txStation}>{tx.station_name}</Text>
            <Text style={styles.txTime}>{new Date(tx.timestamp).toLocaleDateString()}</Text>
          </View>
        ))}
        {transactions.length === 0 && <Text style={styles.empty}>No transactions</Text>}
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Vehicles" component={VehiclesScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="Stations" component={StationsScreen} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  header: { padding: 16, backgroundColor: COLORS.secondary, flexDirection: 'row', alignItems: 'center' },
  logo: { fontSize: 1.5, fontWeight: 'bold', color: COLORS.accent },
  headerTitle: { fontSize: 1.25, fontWeight: '600', color: COLORS.text },
  backBtn: { color: COLORS.accent, marginRight: 16 },
  content: { flex: 1, padding: 16 },
  statsCard: { backgroundColor: COLORS.secondary, borderRadius: 12, padding: 16, marginBottom: 16 },
  statsTitle: { fontSize: 1, color: COLORS.textMuted, marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statIcon: { fontSize: 2 },
  statValue: { color: COLORS.textMuted, marginTop: 4 },
  menuCard: { backgroundColor: COLORS.secondary, borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  menuIcon: { fontSize: 2, marginRight: 16 },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 1.1, fontWeight: '600', color: COLORS.text },
  menuSub: { fontSize: 0.8, color: COLORS.textMuted },
  btn: { backgroundColor: COLORS.accent, borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 16 },
  btnText: { color: COLORS.primary, fontWeight: '600', fontSize: 1 },
  form: { backgroundColor: COLORS.secondary, borderRadius: 12, padding: 16, marginBottom: 16 },
  formLabel: { color: COLORS.textMuted, marginBottom: 8 },
  typeSelector: { flexDirection: 'row', marginBottom: 12 },
  typeBtn: { flex: 1, padding: 10, backgroundColor: COLORS.primary, borderRadius: 8, marginRight: 8, alignItems: 'center' },
  typeBtnText: { color: COLORS.textMuted, fontWeight: '600' },
  input: { backgroundColor: COLORS.primary, borderRadius: 8, padding: 12, color: COLORS.text, marginBottom: 12 },
  vehicleCard: { backgroundColor: COLORS.secondary, borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4 },
  vehiclePlate: { fontSize: 1.25, fontWeight: 'bold', color: COLORS.text },
  vehicleType: { color: COLORS.textMuted, marginTop: 4 },
  vehicleQR: { fontSize: 0.75, color: COLORS.textMuted, marginTop: 8 },
  empty: { textAlign: 'center', color: COLORS.textMuted, padding: 40 },
  balanceCard: { backgroundColor: COLORS.secondary, borderRadius: 12, padding: 24, alignItems: 'center', marginBottom: 16 },
  balanceLabel: { color: COLORS.textMuted },
  balanceValue: { fontSize: 2.5, fontWeight: 'bold', color: COLORS.success, marginTop: 8 },
  walletRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.secondary, borderRadius: 8, padding: 16, marginBottom: 8 },
  walletPlate: { fontWeight: '600', color: COLORS.text },
  walletBalance: { fontWeight: 'bold', color: COLORS.success },
  stationCard: { backgroundColor: COLORS.secondary, borderRadius: 12, padding: 16, marginBottom: 12 },
  stationName: { fontSize: 1.1, fontWeight: '600', color: COLORS.text },
  stationLocation: { color: COLORS.textMuted, marginTop: 4 },
  inventoryRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  inventoryBar: { flex: 1, height: 8, backgroundColor: COLORS.primary, borderRadius: 4, marginRight: 12 },
  inventoryFill: { height: '100%', borderRadius: 4 },
  inventoryText: { color: COLORS.textMuted, width: 60 },
  scannerBox: { backgroundColor: COLORS.secondary, borderRadius: 12, padding: 40, alignItems: 'center', marginBottom: 16 },
  scannerPlaceholder: { fontSize: 3 },
  scannerText: { color: COLORS.textMuted, marginTop: 8 },
  scannedCode: { textAlign: 'center', color: COLORS.success, marginBottom: 16, fontFamily: 'monospace' },
  txCard: { backgroundColor: COLORS.secondary, borderRadius: 8, padding: 16, marginBottom: 8 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between' },
  txPlate: { fontWeight: '600', color: COLORS.text },
  txAmount: { fontWeight: 'bold', color: COLORS.accent },
  txStation: { color: COLORS.textMuted, marginTop: 4 },
  txTime: { color: COLORS.textMuted, fontSize: 0.8, marginTop: 4 },
});