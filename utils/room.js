import { api } from "../config/axios";

/**
 *
 * @param {string} username
 * @returns String
 */
export const createRoom = async (username) => {
  const res = await api.post("/room?userName=" + username);
  const roomData = res.data;
  return roomData;
};


export const getRoom = async (roomId) => {
  console.log(roomId)
  const res = await api.get("/room/" + roomId);
  const roomData = res.data;
  return roomData;
}

export const joinRoom = async (roomId, username) => {
  const res = await api.post(`/room/${roomId}/join?userName=${username}`);
  const roomData = res.data;
  return roomData;
}