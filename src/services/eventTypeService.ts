import { STORAGE_KEYS } from '../constants/storageKeys';
import { EventType } from '../types/models';
import { readJson, writeJson } from '../utils/storage';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getAllEventTypes = (): EventType[] =>
  readJson<EventType[]>(STORAGE_KEYS.eventTypes, []);

const saveEventTypes = (eventTypes: EventType[]): void => {
  writeJson(STORAGE_KEYS.eventTypes, eventTypes);
};

export const eventTypeService = {
  async getEventTypes(): Promise<EventType[]> {
    console.log('[eventTypeService] getEventTypes');
    await delay(300);
    return getAllEventTypes();
  },

  async getEventTypeById(id: string): Promise<EventType> {
    console.log('[eventTypeService] getEventTypeById', id);
    await delay(300);
    const all = getAllEventTypes();
    const found = all.find((e) => e.id === id);
    if (!found) {
      throw { message: 'Event type not found' };
    }
    return found;
  },

  async updateEventType(
    id: string,
    data: Partial<Omit<EventType, 'id'>>
  ): Promise<EventType> {
    console.log('[eventTypeService] updateEventType', id, data);
    await delay(350);
    const all = getAllEventTypes();
    const index = all.findIndex((e) => e.id === id);
    if (index === -1) {
      throw { message: 'Event type not found' };
    }
    const updated: EventType = { ...all[index], ...data };
    all[index] = updated;
    saveEventTypes(all);
    return updated;
  }
};

