const Users = require("../models/User");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const { dataUri } = require("../utils/multer");
const { uploader } = require("../utils/cloudinary");

// 1. Get All Users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find();

    if (!users || users.length === 0) {
      throw new AppError("No users found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "all users fetched successfully",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get User Profile
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await Users.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const fullname = user.getFullName ? user.getFullName() : `${user.firstname} ${user.lastname}`;

    res.status(200).json({
      status: "success",
      message: "user retrieved successfully",
      data: {
        user,
        fullname,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 3. Update Profile (firstname, lastname, bio)
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { firstname, lastname, bio } = req.body;

    const user = await Users.findByIdAndUpdate(
      userId,
      { firstname, lastname, bio },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 4. Update Profile Picture
const updateProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await Users.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!req.file) {
      throw new AppError("Please upload an image file", 400);
    }

    const parsedImage = dataUri(req);
    if (!parsedImage?.content) {
      throw new AppError("Unable to process uploaded image", 400);
    }

    const imageData = parsedImage.content;
    const result = await uploader.upload(imageData, {
      folder: "Augustbackend/profile_image",
    });

    user.profile_image = result.secure_url;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile picture updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 5. Update Password
const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await Users.findById(userId).select("+password");
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new AppError("Please provide old password, new password, and confirm password", 400);
    }

    const isPasswordValid = await user.comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError("Old password is incorrect", 400);
    }

    if (oldPassword === newPassword) {
      throw new AppError("New password cannot be the same as the old password", 400);
    }

    if (newPassword !== confirmPassword) {
      throw new AppError("New password and confirm password do not match", 400);
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
      data: {
        user: {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateProfile,
  updateProfilePicture,
  updatePassword,
};