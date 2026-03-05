export enum AccountRole {
  ADMIN = 'admin',
  RECEPTIONIST = 'receptionist',
  MAINTENANCE = 'maintenance',
  SECURITY = 'security',
}

export enum Position {
  ADMIN = 'admin',
  RECEPTIONIST = 'receptionist',
  MAINTENANCE = 'maintenance',
  SECURITY = 'security',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
}

export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum RoomStatus {
  ALL = 'all',
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
}

export enum EquipmentStatus {
  ALL = 'all',
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  BROKEN = 'broken',
  MAINTENANCE = 'maintenance',
}

export enum Unit {
  PIECE = 'piece',
  KILOGRAM = 'kilogram',
  LITER = 'liter',
  METER = 'meter',
}

export enum Shift {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  FULL = 'full',
}

export enum AttendanceStatus {
  PRESENT = 'present',
  LATE = 'late',
  ABSENT = 'absent',
}

export enum DiscountPercent {
  PERCENT_5 = 5,
  PERCENT_10 = 10,
}

export const tax = 5;

export const ZERO = 0;
