import cloudinary from "../lib/cloudinary.js";
import { sender } from "../lib/resend.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json({ filterredUsers });
  } catch (error) {
    console.log("error in getAllContacts: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesbyUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userTochatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userTochatId },
        { senderId: userTochatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("error in get messages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    // todo: send message in real-time if user is online -socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendmessage controller: ", error.message);
    res.status(500).json({ error: "Internal Sever error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    
    //find all the messages where the logged-in user is either
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    
    const ChatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];
    
    const chatPartners = await User.find({
      _id: { $in: ChatPartnerIds },
    }).select("-password");
    
    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("error in getchat partners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
