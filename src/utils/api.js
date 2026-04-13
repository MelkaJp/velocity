const API_BASE = 'http://localhost:8000/api';

export const api = {
  async healthCheck() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async registerVehicle(vehicle) {
    const res = await fetch(`${API_BASE}/vehicles/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    return res.json();
  },

  async getVehicles(phone = null) {
    const url = phone ? `${API_BASE}/vehicles?phone=${phone}` : `${API_BASE}/vehicles`;
    const res = await fetch(url);
    return res.json();
  },

  async getVehicle(id) {
    const res = await fetch(`${API_BASE}/vehicles/${id}`);
    return res.json();
  },

  async getVehicleByQR(qrCode) {
    const res = await fetch(`${API_BASE}/vehicles/qr/${qrCode}`);
    return res.json();
  },

  async createTransaction(transaction) {
    const res = await fetch(`${API_BASE}/transactions/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    return res.json();
  },

  async getTransactions(vehicleId = null, stationId = null) {
    let url = `${API_BASE}/transactions`;
    const params = [];
    if (vehicleId) params.push(`vehicle_id=${vehicleId}`);
    if (stationId) params.push(`station_id=${stationId}`);
    if (params.length > 0) url += '?' + params.join('&');
    const res = await fetch(url);
    return res.json();
  },

  async getStations() {
    const res = await fetch(`${API_BASE}/stations`);
    return res.json();
  },

  async getStation(id) {
    const res = await fetch(`${API_BASE}/stations/${id}`);
    return res.json();
  },

  async createBooking(booking) {
    const res = await fetch(`${API_BASE}/bookings/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    return res.json();
  },

  async getBookings(vehicleId = null) {
    const url = vehicleId ? `${API_BASE}/bookings?vehicle_id=${vehicleId}` : `${API_BASE}/bookings`;
    const res = await fetch(url);
    return res.json();
  },

  async topupWallet(vehicleId, amount) {
    const res = await fetch(`${API_BASE}/wallet/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicle_id: vehicleId, amount }),
    });
    return res.json();
  },

  async getWallet(vehicleId) {
    const res = await fetch(`${API_BASE}/wallet/${vehicleId}`);
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  async getRevenueSplit() {
    const res = await fetch(`${API_BASE}/revenue/split`);
    return res.json();
  },

  async getAnomalies() {
    const res = await fetch(`${API_BASE}/audit/anomalies`);
    return res.json();
  },

  async seedData() {
    const res = await fetch(`${API_BASE}/admin/seed`, {
      method: 'POST',
    });
    return res.json();
  },
};

export default api;