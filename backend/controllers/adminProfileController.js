const AdminProfile = require('../models/AdminProfileModel'); // Path to your AdminProfile model
const fs = require('fs'); // Required for file system operations if needed
const path = require('path'); // Required for file path operations


// Controller to update admin profile
exports.updateAdminProfile = async (req, res) => {
  const { adminId } = req.params; // Get the admin profile ID from the URL parameters
  const { name, role, email, phone } = req.body; // Extract form fields from the request body

  try {
    // Find the admin profile by ID
    const adminProfile = await AdminProfile.findById(adminId);

    if (!adminProfile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    // Update admin profile details
    adminProfile.name = name || adminProfile.name;
    adminProfile.role = role || adminProfile.role;
    adminProfile.contactInfo.email = email || adminProfile.contactInfo.email;
    adminProfile.contactInfo.phone = phone || adminProfile.contactInfo.phone;

    // Check if a new profile image is uploaded
    if (req.file) {
      // If there's an existing profile image, delete it from the file system (optional)
      if (adminProfile.profileImage) {
        const oldImagePath = path.join(__dirname, '../uploads/', adminProfile.profileImage); // Assuming the image is stored in 'uploads/' folder
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      }

      // Save the new profile image path
      adminProfile.profileImage = req.file.filename; // Assuming you're using something like multer for file uploads
    }

    // Save the updated profile
    await adminProfile.save();

    res.status(200).json({ message: 'Admin profile updated successfully', adminProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update admin profile', error: error.message });
  }
};
;

// Get all admin profiles
exports.getAdminProfiles = async (req, res) => {
  try {
    const profiles = await AdminProfile.find();
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching admin profiles:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Select an admin profile after login
exports.selectAdminProfile = async (req, res) => {
  const { profileId } = req.body;
  try {
    const selectedProfile = await AdminProfile.findById(profileId);

    if (!selectedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Update last logged in time
    selectedProfile.lastLoggedIn = Date.now();
    await selectedProfile.save();

    // Store the selected profile in session
    req.session.adminProfile = {
      id: selectedProfile._id,
      name: selectedProfile.name,
      role: selectedProfile.role,
      accessLevel: selectedProfile.accessLevel, // Store access level
    };

    res.status(200).json({ message: 'Profile selected successfully', profile: req.session.adminProfile });
  } catch (error) {
    console.error('Error selecting admin profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single admin profile by ID
exports.getSingleAdminProfile = async (req, res) => {
    const { profileId } = req.params; // Assume the profile ID is passed in the URL
   
    try {
      const profile = await AdminProfile.findById(profileId);
   
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      res.status(200).json(profile);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };  

// Fetch the logged-in admin's profile
exports.getLoggedInAdminProfile = async (req, res) => {
    try {
        const adminId = req.session.adminProfile.id; // Ensure this correctly points to the admin ID
        const profile = await AdminProfile.findById(adminId);

        if (!profile) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ message: 'Error fetching admin profile' });
    }
};
