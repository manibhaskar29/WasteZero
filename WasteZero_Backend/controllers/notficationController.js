import Notification from "../models/Notification.js";
import User from "../models/user.js";

// Create a single notification
export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Get notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.sub;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "firstName lastName email role")
      // ❌ removed .populate("relatedEvent")
      .populate("relatedApplication", "_id status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Notification.countDocuments({ recipient: userId });
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasMore: skip + notifications.length < totalCount,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.sub;

    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification)
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });

    notification.isRead = true;
    await notification.save();

    res
      .status(200)
      .json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.sub;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.sub;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification)
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });

    res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};

//////////////////////////
// Role-Specific Notifications
//////////////////////////

// Application received (NGO)
export const createApplicationReceivedNotification = async (
  applicationData
) => {
  try {
    const {
      ngoId,
      volunteerId,
      volunteerName,
      eventTitle,
      applicationId,
    } = applicationData;

    await createNotification({
      recipient: ngoId,
      sender: volunteerId,
      type: "application_received",
      title: "New Application Received",
      message: `${volunteerName} applied for "${eventTitle}"`,
      relatedApplication: applicationId,
      actionUrl: `/ngo-dashboard?tab=applications`,
    });
  } catch (error) {
    console.error("Error creating application received notification:", error);
  }
};

// Application status update (User)
export const createApplicationStatusNotification = async (statusData) => {
  try {
    const {
      volunteerId,
      ngoId,
      applicationId,
      status,
      eventTitle,
      ngoName,
    } = statusData;

    const statusMessages = {
      accepted: `🎉 Your application for "${eventTitle}" was accepted by ${ngoName}`,
      rejected: `❌ Your application for "${eventTitle}" was rejected.`,
    };

    await createNotification({
      recipient: volunteerId,
      sender: ngoId,
      type:
        status === "accepted"
          ? "application_approved"
          : "application_rejected",
      title:
        status === "accepted" ? "Application Approved!" : "Application Update",
      message: statusMessages[status],
      relatedApplication: applicationId,
      actionUrl: `/volunteer-dashboard?tab=applications`,
    });
  } catch (error) {
    console.error("Error creating application status notification:", error);
  }
};

// New opportunity notification for all users
export const createNewEventNotification = async (eventData) => {
  try {
    const { eventTitle, ngoName, ngoId } = eventData;

    const volunteers = await User.find({ role: "user" }).select("_id");

    const notifications = volunteers.map((vol) =>
      createNotification({
        recipient: vol._id,
        sender: ngoId,
        type: "new_opportunity",
        title: "New Opportunity",
        message: `${ngoName} posted a new opportunity: "${eventTitle}"`,
        actionUrl: `/volunteer-dashboard?tab=opportunities`,
      })
    );

    await Promise.all(notifications);

    console.log(`Created ${volunteers.length} opportunity notifications`);
  } catch (error) {
    console.error("Error creating opportunity notifications:", error);
  }
};
