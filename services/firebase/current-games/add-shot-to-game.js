const admin = require('firebase-admin');
const uuidv1 = require('uuid/v1');
const { Timestamp } = require('firebase-admin').firestore;


const db = admin.firestore();

const getPlayerInfoFromGame = async (gameId) => {
  const currentGameRef = await db.collection('current_games').doc(gameId);
  const currentGame = await currentGameRef.get();
  const { players } = currentGame.data();
  return players;
};

const getOpponentId = (userId, players) => {
  const objectKeys = Object.keys(players);
  let opponent;
  objectKeys.forEach((key) => {
    if (players[key].id !== userId) opponent = players[key].id;
  });
  return opponent;
};

const addShotToCurrentGameDatabase = async ({
  game_id: gameId,
  user_id: userId,
  match_id: matchId,
  activity_info: {
    distance,
    moving_time: movingTime,
    type: activityType,
    start_date: startDate,
    total_elevation_gain: elevationGain,
    map,
  },
  shot_type: shotType,
  shot_rules: shotRules,
}) => {
  try {
    const currentGameRef = await db.collection('current_games').doc(gameId);
    const currentGameData = await currentGameRef.get();
    const matchShotInfo = currentGameData.data().shots[matchId];
    const matchedShotId = uuidv1().replace(/-/g, '');
    const players = await getPlayerInfoFromGame(gameId);
    const data = {
      current_shot_maker: shotType === 'SET' ? getOpponentId(userId, players) : userId,
      latest_shot: {
        player_id: userId,
        shot_id: matchedShotId,
        time: Timestamp.fromDate(new Date()),
        type: shotType,
      },
      shots: {
        ...currentGameData.data().shots,
        [matchedShotId]: {
          distance,
          moving_time: movingTime,
          activity_type: activityType,
          player_id: userId,
          start_date: Timestamp.fromDate(new Date(startDate)),
          total_elevation_gain: elevationGain,
          shot_added: Timestamp.fromDate(new Date()),
          map,
          type: shotType,
          rules: shotRules,
        },
      },
    };

    if (shotType !== 'SET') {
      data.shots[matchId] = {
        ...matchShotInfo,
        matched_shot: matchedShotId,
      };
      data.shots[matchedShotId].match_shot = matchId;
    }

    try {
      currentGameRef.update(data);
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
