import axios from 'axios';

const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

interface LocationData {
  id: string;
  name: string;
}

export async function getProvinces(): Promise<LocationData[]> {
  const response = await axios.get(`${BASE_URL}/provinces.json`);
  return response.data;
}

export async function getCities(provinceId: string): Promise<LocationData[]> {
  const response = await axios.get(`${BASE_URL}/regencies/${provinceId}.json`);
  return response.data;
}

export async function getDistricts(cityId: string): Promise<LocationData[]> {
  const response = await axios.get(`${BASE_URL}/districts/${cityId}.json`);
  return response.data;
}

export async function getVillages(districtId: string): Promise<LocationData[]> {
  const response = await axios.get(`${BASE_URL}/villages/${districtId}.json`);
  return response.data;
}
