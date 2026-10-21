import { AuditLog, NotificationItem, Role } from '../../types';
import { storageCore, STORAGE_KEYS } from './storageCore';
import { generateAuditLogs, generateNotifications } from '../../data/seedData';

export class AuditNotificationStorage {
  public getAuditLogs(): AuditLog[] {
    return storageCore.safeParse<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, generateAuditLogs());
  }

  public addAuditLog(log: AuditLog): AuditLog {
    const list = [...this.getAuditLogs()];
    list.unshift(log);
    storageCore.safeWrite(STORAGE_KEYS.AUDIT_LOGS, list.slice(0, 100));
    return log;
  }

  public getNotifications(role?: Role): NotificationItem[] {
    const list = storageCore.safeParse<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, generateNotifications());
    return role ? list.filter(n => n.roleScope.includes(role)) : list;
  }

  public markNotificationRead(id: string): void {
    const list = [...this.getNotifications()];
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      storageCore.safeWrite(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  }
}

export const auditNotificationStorage = new AuditNotificationStorage();
