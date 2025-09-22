export enum UploadFolder {
  STAFFS = 'staffs',
  ROOMS = 'rooms',
  SERVICES = 'services',
  CUSTOMERS = 'customers',
  EQUIPMENTS = 'equipments',
  INVENTORY = 'inventory',
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
