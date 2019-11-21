const admin = require('firebase-admin');
const uuidv1 = require('uuid/v1');
const { Timestamp } = require('firebase-admin').firestore;


const db = admin.firestore();

const addShotToCurrentGameDatabase = async ({
  game_id: gameId,
  user_id: userId,
  activity_info: {
    name,
    distance,
    moving_time: movingTime,
    type,
    start_date: startDate,
    total_elevation_gain: elevationGain,
  },
}) => {
  try {
    const gameRef = await db.collection('current_games').doc(gameId);
    const gameData = await gameRef.get();
    const updatedShots = [...gameData.data().shots, {
      id: uuidv1().replace(/-/g, ''),
      name,
      distance,
      movingTime,
      type,
      user_id: userId,
      start_date: startDate,
      elevationGain,
      shot_added: Timestamp.fromDate(new Date()),
    }];
    const data = { shots: updatedShots };
    try {
      gameRef.update(data);
      return { status: 'success' };
    } catch (e) {
      return { error: e };
    }
  } catch (e) {
    return { error: e };
  }
};

module.exports = {
  addShotToCurrentGameDatabase,
};
