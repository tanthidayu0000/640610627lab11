import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //get ids from url
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;

  const user = checkToken(req);
  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "You don't permission to access this api",
    });
  }

  const rooms = readChatRoomsDB();

  const roomIdx = rooms.findIndex((x) => x.roomId === roomId);
  if (roomIdx === -1)
    return res.status(404).json({ ok: false, message: "Invalid room id" });

  const messageIdx = rooms[roomIdx].messages.findIndex(
    (x) => x.messageId === messageId
  );
  if (messageIdx === -1)
    return res.status(404).json({ ok: false, message: "Invalid message id" });

  if (
    user.isAdmin === true ||
    rooms[roomIdx].messages[messageIdx].username === user.username
  ) {
    rooms[roomIdx].messages.splice(messageIdx, 1);
  } else {
    return res
      .status(403)
      .json({
        ok: false,
        message: "You do not have permission to access this data",
      });
  }

  writeChatRoomsDB(rooms);

  return res.json({ ok: true });
}
