const User = require("../../api/models/User")

/**
 * Check if user has active subscription and get participant limits
 * @param {string} userId - User ID to check subscription for
 * @returns {Promise<{hasSubscription: boolean, type: string, limit: number}>}
 */
async function checkUserSubscriptionLimits(userId) {
  try {
    const user = await User.findById(userId).populate("subscriptions.service")

    if (!user) {
      return { hasSubscription: false, type: "none", limit: 2 }
    }

    // Check for active subscriptions
    const now = new Date()
    const activeSubscription = user.subscriptions.find(
      (sub) => sub.isActive && sub.expirationDate > now && sub.service, // Make sure service exists
    )

    if (!activeSubscription) {
      return { hasSubscription: false, type: "none", limit: 2 }
    }

    // Get subscription type and set limits
    const subscriptionType = activeSubscription.service.type.toLowerCase()
    let limit = 2 // default

    switch (subscriptionType) {
      case "pro":
        limit =10
        break
      case "business":
        limit = 200
        break
      default:
        limit = 2
    }

    return {
      hasSubscription: true,
      type: subscriptionType,
      limit: limit,
    }
  } catch (error) {
    console.error("Error checking subscription limits:", error)
    return { hasSubscription: false, type: "none", limit: 2 }
  }
}

/**
 * Find room host by checking who created/owns the room
 * @param {string} roomId - Room ID to find host for
 * @returns {Promise<string|null>} - Host user ID or null
 */
async function findRoomHost(roomId) {
  try {
    // Find users who have this room in their meetings
    const usersInRoom = await User.find({ "meetings.roomId": roomId })

    if (usersInRoom.length === 0) {
      return null
    }

    // The first user to join is typically the host
    // You can modify this logic based on your room creation system
    const hostUser = usersInRoom.reduce((earliest, current) => {
      const earliestJoinTime = earliest.meetings.find((m) => m.roomId === roomId)?.joinedAt
      const currentJoinTime = current.meetings.find((m) => m.roomId === roomId)?.joinedAt

      return earliestJoinTime < currentJoinTime ? earliest : current
    })

    return hostUser._id.toString()
  } catch (error) {
    console.error("Error finding room host:", error)
    return null
  }
}

/**
 * Check if room can accept new participant based on host's subscription
 * @param {string} roomId - Room ID
 * @param {number} currentParticipants - Current number of participants
 * @returns {Promise<{allowed: boolean, message: string, limit: number}>}
 */
async function checkRoomParticipantLimit(roomId, currentParticipants) {
  try {
    const hostId = await findRoomHost(roomId)

    if (!hostId) {
      return {
        allowed: false,
        message: "Room host not found",
        limit: 2,
      }
    }

    const subscriptionInfo = await checkUserSubscriptionLimits(hostId)
    const { limit, type } = subscriptionInfo

    if (currentParticipants >= limit) {
      let message = `Room is full. `

      if (type === "none") {
        message += `Maximum ${limit} participants allowed. Host needs a subscription for more participants.`
      } else {
        message += `Maximum ${limit} participants allowed with ${type.toUpperCase()} subscription.`
      }

      return {
        allowed: false,
        message: message,
        limit: limit,
      }
    }

    return {
      allowed: true,
      message: `Room can accept more participants (${currentParticipants}/${limit})`,
      limit: limit,
    }
  } catch (error) {
    console.error("Error checking room participant limit:", error)
    return {
      allowed: false,
      message: "Error checking room limits",
      limit: 2,
    }
  }
}

module.exports = {
  checkUserSubscriptionLimits,
  findRoomHost,
  checkRoomParticipantLimit,
}
