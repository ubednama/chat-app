import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const conversations = await Conversation.find({ participants: loggedInUserId });

		const userIds = conversations.flatMap(conversation => conversation.participants);
		const uniqueUserIds = Array.from(new Set(userIds));

		const filteredUsers = await User.find({ _id: { $in: uniqueUserIds, $ne: loggedInUserId } }).select("-password");      //not equal to loggedInUserId

		console.log("getUsers ",filteredUsers[0].fullName)

        res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};