import { MediaType } from '@/prisma/generated/enums';
import axiosdb from '../axios';

export interface Media {
    id: string;
    name: string;
    url: string;
    type: MediaType;
    mimeType: string | null;
    clientId: string | null;
    appointmentId: string | null;
    workerId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface MediaData {
  file : File
  clientId : string | null
  appointmentId : string | null
  workerId : string | null
}

export const mediasApi = {
  // Get all
  getMedias: async (params?: { active?: boolean }): Promise<Media[]> => {
    const { data } = await axiosdb.get('/media', { params });
    return data;
  },

  // Get single media
  getMedia: async (id: string): Promise<Media> => {
    const { data } = await axiosdb.get(`/media/${id}`);
    return data;
  },

  // Create media
  createMedia: async (mediaData: MediaData): Promise<Media> => {
    const { data } = await axiosdb.post('/media/upload', mediaData);
    return data;
  },
};
