const Users = require("../models/User");
<<<<<<< HEAD
const AppError = require('../utils/AppError');
const bcrypt = require("bcryptjs");

//get all users
const getAllUsers = async(req, res, next)=>{
    try {
        const users = await Users.find();

        if(!users){
            throw new AppError("No users found", 404)
        };

        res.status(200).json({
            status: "success",
            message: "all users fetched successfully",
            data: {
                users,
            }
        })
        
    } catch (error) {
        next(error)
=======
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const { dataUri } = require("../utils/multer");
const { uploader } = require("../utils/cloudinary");

//get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find();

    if (!users) {
      throw new AppError("No users found", 404);
>>>>>>> 2651075ae0b7b638e9abcb0cd63ebcc44cd1c246
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

//get user profile
const getUserProfile = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await Users.findById(userId);

<<<<<<< HEAD
        if(!user){
            throw new AppError(`User with id not found`, 404)
        }
        
        const fullname = user.getFullName();

        res.status(200).json({
            status: "success",
            message: "user retrieved successfully",
            data: {
                user,
                fullname
            }
        })
    } catch (error) {
        next(error)
=======
    if (!user) {
      throw new AppError(`Users with ${id} not found`, 404);
>>>>>>> 2651075ae0b7b638e9abcb0cd63ebcc44cd1c246
    }

    const fullname = user.getFullName();

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

//updateprofilepicture

const updateProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await Users.findById(userId);

    if (!user) {
      throw new AppError("User not found with id", 404);
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

<<<<<<< HEAD
//update userpassword
const updatePassword = async(req, res, next)=>{
    try {
        const userId = req.user._id;
=======

//updateProfile(firstname, lastname, bio)
const updateProfile = async (req, res, next)=>{
  try {
    const userId = req.user._id;
    const user =await Users.findById(userId);

    if(!user){
      throw new AppError("User not found", 404)
    };
>>>>>>> 2651075ae0b7b638e9abcb0cd63ebcc44cd1c246

    const allowedFields = ["firstname", "lastname", "bio"];

    const fieldsToUpdate = Object.keys(req.body);

<<<<<<< HEAD
        const {oldPassword, newPassword, confirmNewPassword} = req.body;

        if(!oldPassword || !newPassword || !confirmNewPassword){
            throw new AppError("Please provide old password, new password, and confirm new password", 400)
        };
=======
    fieldsToUpdate.forEach((field)=>{
      if(allowedFields.includes(field)){
        user[field] = req.body[field]
      }
      else{
        throw new AppError(`Field ${field} is not allowed to be updated`, 400)
      }
    });

    await user.save();
>>>>>>> 2651075ae0b7b638e9abcb0cd63ebcc44cd1c246

    res.status(200).json({
      status: "succesful",
      message: "profile updated successfully",
      data: {
        user
      }
    })


<<<<<<< HEAD
        if(oldPassword === newPassword){
            throw new AppError("New password cannot be same as old password", 400)
        };

        if(newPassword !== confirmNewPassword){
            throw new AppError("New password and confirm new password do not match", 400)
        };

        const salt = await bcrypt.genSalt(12);

        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            status: "success",
            message: "password updated successfully",
            data: {
                user: {
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                },
            }
        })

    } catch (error) {
        next(error)
    }
};

//update profile (firstname, lastname, bio)
const updateProfile = async(req, res, next)=>{
    try {
        const userId = req.user._id;
        const { firstname, lastname, bio } = req.body;

        const user = await Users.findByIdAndUpdate(
            userId,
            { firstname, lastname, bio },
            { new: true, runValidators: true }
        );

        if(!user){
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            status: "success",
            message: "Profile updated successfully",
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
};
=======
    
  } catch (error) {
    next(error)
  }
}
>>>>>>> 2651075ae0b7b638e9abcb0cd63ebcc44cd1c246

//update userpassword

const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await Users.findById(userId).select("+password");

    if (!user) {
      throw new AppError("User not found with id", 404);
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new AppError("Please provide old password and new password", 400);
    }

    const ispasswordValid = await user.comparePassword(
      oldPassword,
      user.password,
    );

    if (!ispasswordValid) {
      throw new AppError("Old password is incorrect", 400);
    }

    if (oldPassword === newPassword) {
      throw new AppError("New password cannot be same as old password", 400);
    }

    if (newPassword !== confirmPassword) {
      throw new AppError(
        "New password and confirm password does not match",
        400,
      );
    }

    const salt = await bcrypt.genSalt(12);

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "password updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
<<<<<<< HEAD
    getAllUsers, 
    getUserProfile,
    updatePassword,
    updateProfile
}
=======
  getAllUsers,
  getUserProfile,
  updateProfilePicture,
  updateProfile,
  updatePassword,
};
>>>>>>> 2651075ae0b7b638e9abcb0cd63ebcc44cd1c246
