import axios from "axios";

const api = axios.create({
  baseURL: "https://cabbooking-backend-urvi-eacgeufxeedydjey.centralindia-01.azurewebsites.net",
  withCredentials: true, // IMPORTANT: backend uses HttpSession
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  role: string;
  customerId: number | null;
  username: string;
}

export interface CustomerRegistrationDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password: string;
}

export interface CustomerResponseDto {
  customerId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
}

export interface DashboardDto {
  totalCustomers: number;
  totalDrivers: number;
  totalCabs: number;
  availableCabs: number;
  totalBookings: number;
  activeBookings: number;
}

export interface TripBookingResponseDto {
  tripBookingId: number;
  customerId: number;
  cabId: number;
  cabNumber: string;
  driverId: number;
  driverName: string;
  fromLocation: string;
  toLocation: string;
  fromDateTime: string;
  toDateTime: string;
  status: boolean;
  distanceInKm: number;
  bill: number;
}

export interface BookingDto {
  customerId: number;
  cabId: number;
  fromLocation: string;
  toLocation: string;
}

export interface CabDto {
  cabNumber: string;
  carModel: string;
  cabType: string;
  capacity: number;
  available: boolean;
}

export interface CabResponseDto {
  cabId: number;
  cabNumber: string;
  carModel: string;
  cabType: string;
  capacity: number;
  available: boolean;
}

export interface DriverDto {
  driverName: string;
  licenceNo: string;
  mobileNumber: string;
  email: string;
}

export interface DriverResponseDto {
  driverId: number;
  driverName: string;
  licenceNo: string;
  mobileNumber: string;
  email: string;
  rating: number;
  cabId: number | null;
  cabNumber: string | null;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", data),
  logout: () =>
    api.post<string>("/auth/logout"),
};

// ─── Customers ────────────────────────────────────────────────────────────────

export const customerApi = {
  register: (data: CustomerRegistrationDto) =>
    api.post<CustomerResponseDto>("/customers/register", data),
  getAll: () =>
    api.get<CustomerResponseDto[]>("/customers"),
  getById: (id: number) =>
    api.get<CustomerResponseDto>(`/customers/${id}`),
  delete: (id: number) =>
    api.delete<string>(`/customers/${id}`),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () =>
    api.get<DashboardDto>("/dashboard"),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingApi = {
  book: (data: BookingDto) =>
    api.post<TripBookingResponseDto>("/bookings", data),
  cancel: (bookingId: number) =>
    api.put<TripBookingResponseDto>(`/bookings/cancel/${bookingId}`),
  getHistory: (customerId: number) =>
    api.get<TripBookingResponseDto[]>(`/bookings/history/${customerId}`),
  getStatus: (bookingId: number) =>
    api.get<TripBookingResponseDto>(`/bookings/status/${bookingId}`),
  getAll: () =>
    api.get<TripBookingResponseDto[]>("/bookings/all"),
};

// ─── Cabs ─────────────────────────────────────────────────────────────────────

export const cabApi = {
  getAll: () =>
    api.get<CabResponseDto[]>("/cabs"),
  getAvailable: () =>
    api.get<CabResponseDto[]>("/cabs/available"),
  add: (data: CabDto) =>
    api.post<CabResponseDto>("/cabs", data),
  update: (cabId: number, data: CabDto) =>
    api.put<CabResponseDto>(`/cabs/${cabId}`, data),
  delete: (cabId: number) =>
    api.delete<void>(`/cabs/${cabId}`),
};

// ─── Drivers ──────────────────────────────────────────────────────────────────

export const driverApi = {
  getAll: () =>
    api.get<DriverResponseDto[]>("/drivers"),
  add: (data: DriverDto) =>
    api.post<DriverResponseDto>("/drivers", data),
  update: (driverId: number, data: DriverDto) =>
    api.put<DriverResponseDto>(`/drivers/${driverId}`, data),
  assignToCab: (driverId: number, cabId: number) =>
    api.put<DriverResponseDto>(`/drivers/${driverId}/assign/${cabId}`),
};