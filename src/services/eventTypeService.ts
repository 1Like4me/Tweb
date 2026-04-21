import { EventType } from '../types/models';
import api from './apiClient';

interface EventTypeApiDto {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  maxCapacity: number;
}

const mapEventType = (dto: EventTypeApiDto): EventType => ({
  id: String(dto.id),
  name: dto.name,
  description: dto.description,
  basePrice: dto.basePrice,
  maxCapacity: dto.maxCapacity
});

export const eventTypeService = {
  async getEventTypes(): Promise<EventType[]> {
    const response = await api.get<EventTypeApiDto[]>('/api/eventtypes');
    return response.data.map(mapEventType);
  },

  async getEventTypeById(id: string): Promise<EventType> {
    const response = await api.get<EventTypeApiDto>(`/api/eventtypes/${id}`);
    return mapEventType(response.data);
  },

  async updateEventType(
    id: string,
    data: Partial<Omit<EventType, 'id'>>
  ): Promise<EventType> {
    const existing = await this.getEventTypeById(id);
    const payload = {
      name: data.name ?? existing.name,
      description: data.description ?? existing.description,
      basePrice: data.basePrice ?? existing.basePrice,
      maxCapacity: data.maxCapacity ?? existing.maxCapacity
    };

    await api.put(`/api/eventtypes/${id}`, payload);
    return this.getEventTypeById(id);
  }
};

