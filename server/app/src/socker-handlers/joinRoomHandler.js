const { checkRoomParticipantLimit } = require("../middleware/subscriptionLimits")
const { checkXSS } = require("../utils/xss")
const { roomExists, getRoom } = require("../utils/room")

/**
 * Enhanced join room handler with subscription limits
 * Add this to your existing socket 'join' event handler
 */
async function handleJoinWithLimits(socket, dataObject, callback) {
  const data = checkXSS(dataObject)
  const { room_id } = data

  // Your existing validation code here...
  if (!roomExists(socket)) {
    return callback({
      error: "Room does not exist",
    })
  }

  // Get current room and participant count
  const room = getRoom(socket)
  const currentParticipants = room.getPeersCount()

  // Check subscription limits before allowing join
  const limitCheck = await checkRoomParticipantLimit(room_id, currentParticipants + 1)

  if (!limitCheck.allowed) {
    console.log("Join denied - participant limit exceeded:", {
      roomId: room_id,
      currentParticipants: currentParticipants,
      limit: limitCheck.limit,
      message: limitCheck.message,
    })

    return callback({
      error: "limitExceeded",
      message: limitCheck.message,
      limit: limitCheck.limit,
      currentParticipants: currentParticipants,
    })
  }

  // Continue with existing join logic...
  console.log("Join allowed:", {
    roomId: room_id,
    currentParticipants: currentParticipants,
    limit: limitCheck.limit,
  })

  // Your existing join logic continues here...
}

module.exports = { handleJoinWithLimits }
