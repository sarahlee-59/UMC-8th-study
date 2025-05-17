import axios from 'axios';

export const fetchLps = async (order: 'oldest' | 'latest') => {
  const res = await axios.get(`/v1/lps?order=${order}`);
  return res.data;
};

export const fetchLpDetail = async (id: number) => {
  const res = await axios.get(`/v1/lps/${id}`);
  return res.data;
};
