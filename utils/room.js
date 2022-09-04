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
  console.log(roomId);
  const res = await api.get("/room/" + roomId);
  const roomData = res.data;
  return roomData;
};

export const joinRoom = async (roomId, username) => {
  const res = await api.post(`/room/${roomId}/join?userName=${username}`);
  const roomData = res.data;
  return roomData;
};

export const startGame = async (roomId, roundsPerStage) => {
  const res = await api.post(
    `/game/start?channelID=${roomId}&roundsPerStage=${roundsPerStage}`
  );
  return res.data;
};

export const nextPlayer = async (roomId) => {
  const res = await api.get(`/game/next-player?channelID=${roomId}`);
  return res.data;
}

export const submitAnswer = async (roomId, answer) => {
  const res = await api.post(`/game/answer?channelID=${roomId}&word=${answer}`);
  return res.data;
}
