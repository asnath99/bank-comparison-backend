import axios from 'axios';
import type { ComparisonRequest, ComparisonResponse, Bank } from './types';

const API_URL = import.meta.env.VITE_API_URL as string;

export async function fetchBanks(): Promise<Bank[]> {
  const { data } = await axios.get(`${API_URL}/banks`);
  return data?.data ?? [];
}

export async function postComparison(payload: ComparisonRequest): Promise<ComparisonResponse> {
  const { data } = await axios.post(`${API_URL}/comparison`, payload);
  return data;
}
