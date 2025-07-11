//api integrated code : almost done 
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Facebook,
  X as Twitter,
  Linkedin,
  Instagram,
  Edit2 as Edit,
  Save,
  X as Cancel,
} from "lucide-react";

interface SocialLinks {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

interface Address {
  country: string;
  cityState: string;
  postalCode: string;
  taxId: string;
}

interface User {
  id?: string;
  avatarUrl: string;
  fullName: string;
  role: string;
  location: string;
  social: SocialLinks;
  personal: PersonalInfo;
  address: Address;
}

interface CardProps {
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  onEdit,
  isEditing,
  onSave,
  onCancel,
}) => (
  <div className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-xl p-6 space-y-4 shadow-sm relative group">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-blue-900 dark:text-white">
        {title}
      </h2>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              onClick={onSave}
              className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
            >
              <Cancel className="w-4 h-4" />
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-800 dark:hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>
    </div>
    {children}
  </div>
);

const UserProfile: React.FC<{ userId?: string }> = ({ userId = "1" }) => {
  const [user, setUser] = useState<User>({
    avatarUrl:
      "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg",
    fullName: "Vyom Mehta",
    role: "Team Manager",
    location: "Maharashtra, India",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
      instagram: "#",
    },
    personal: {
      firstName: "Vyom",
      lastName: "Mehta",
      email: "randomuser@pimjo.com",
      phone: "+09 363 398 46",
      bio: "Team Manager",
    },
    address: {
      country: "India",
      cityState: "Maharashtra, India",
      postalCode: "ERT 2489",
      taxId: "AS4568384",
    },
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editProfile, setEditProfile] = useState({
    fullName: user.fullName,
    role: user.role,
    location: user.location,
    social: { ...user.social },
  });
  const [editPersonal, setEditPersonal] = useState({ ...user.personal });
  const [editAddress, setEditAddress] = useState({ ...user.address });
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // First try to fetch by specific ID
        let response = await fetch(
          `http://localhost:5000/api/user-profiles/${userId}`
        );
        let data;
        if (!response.ok) {
          // If specific ID fails, fetch all profiles and use the first one
          const allResponse = await fetch(
            "http://localhost:5000/api/user-profiles"
          );
          if (!allResponse.ok) throw new Error(await allResponse.text());
          const allProfiles = await allResponse.json();
          if (allProfiles.length === 0) throw new Error("No profiles found");
          data = allProfiles[0];
        } else {
          data = await response.json();
        }
        setUser(data);
        setEditProfile({
          fullName: data.fullName,
          role: data.role,
          location: data.location,
          social: { ...data.social },
        });
        setEditPersonal({ ...data.personal });
        setEditAddress({ ...data.address });
      } catch (err) {
        setError(`Failed to fetch user profile: ${err.message}`);
        console.error(err);
      }
    };
    fetchUserProfile();
  }, [userId]);

  const handleEditProfile = () => {
    setEditProfile({
      fullName: user.fullName,
      role: user.role,
      location: user.location,
      social: { ...user.social },
    });
    setIsEditingProfile(true);
  };

  const handleEditPersonal = () => {
    setEditPersonal({ ...user.personal });
    setIsEditingPersonal(true);
  };

  const handleEditAddress = () => {
    setEditAddress({ ...user.address });
    setIsEditingAddress(true);
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = {
        ...user,
        fullName: editProfile.fullName,
        role: editProfile.role,
        location: editProfile.location,
        social: { ...editProfile.social },
        id: user.id, // Ensure ID is included
      };
      const response = await fetch(
        `http://localhost:5000/api/user-profiles/${user.id || userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );
      if (!response.ok) throw new Error(await response.text());
      setUser(updatedUser);
      setIsEditingProfile(false);
      setError(null);
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
      console.error(err);
    }
  };

  const handleSavePersonal = async () => {
    try {
      const updatedUser = {
        ...user,
        personal: { ...editPersonal },
        id: user.id,
      }; // Ensure ID is included
      const response = await fetch(
        `http://localhost:5000/api/user-profiles/${user.id || userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );
      if (!response.ok) throw new Error(await response.text());
      setUser(updatedUser);
      setIsEditingPersonal(false);
      setError(null);
    } catch (err) {
      setError(`Failed to update personal information: ${err.message}`);
      console.error(err);
    }
  };

  const handleSaveAddress = async () => {
    try {
      const updatedUser = { ...user, address: { ...editAddress }, id: user.id }; // Ensure ID is included
      const response = await fetch(
        `http://localhost:5000/api/user-profiles/${user.id || userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );
      if (!response.ok) throw new Error(await response.text());
      setUser(updatedUser);
      setIsEditingAddress(false);
      setError(null);
    } catch (err) {
      setError(`Failed to update address: ${err.message}`);
      console.error(err);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/user-profiles/${user.id || userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error(await response.text());
      setUser({
        avatarUrl:
          "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg",
        fullName: "",
        role: "",
        location: "",
        social: {
          facebook: "#",
          twitter: "#",
          linkedin: "#",
          instagram: "#",
        },
        personal: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          bio: "",
        },
        address: {
          country: "",
          cityState: "",
          postalCode: "",
          taxId: "",
        },
      });
      setError(null);
    } catch (err) {
      setError(`Failed to delete profile: ${err.message}`);
      console.error(err);
    }
  };

  const handleCancelProfile = () => {
    setIsEditingProfile(false);
  };

  const handleCancelPersonal = () => {
    setIsEditingPersonal(false);
  };

  const handleCancelAddress = () => {
    setIsEditingAddress(false);
  };

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof editProfile | keyof typeof editProfile.social
  ) => {
    if (field in editProfile.social) {
      setEditProfile((prev) => ({
        ...prev,
        social: { ...prev.social, [field]: e.target.value },
      }));
    } else {
      setEditProfile((prev) => ({ ...prev, [field]: e.target.value }));
    }
  };

  const handlePersonalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeof editPersonal
  ) => {
    setEditPersonal((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof editAddress
  ) => {
    setEditAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="p-6 space-y-6 bg-emerald-50 dark:bg-gray-900 min-h-screen">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl">{error}</div>
      )}
      <Card
        title="Profile"
        onEdit={handleEditProfile}
        isEditing={isEditingProfile}
        onSave={handleSaveProfile}
        onCancel={handleCancelProfile}
      >
        {isEditingProfile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={user.avatarUrl}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full border border-blue-100 dark:border-gray-700"
              />
              <div className="space-y-2">
                <input
                  type="text"
                  value={editProfile.fullName}
                  onChange={(e) => handleProfileChange(e, "fullName")}
                  className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                  required
                />
                <input
                  type="text"
                  value={editProfile.role}
                  onChange={(e) => handleProfileChange(e, "role")}
                  className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                  required
                />
                <input
                  type="text"
                  value={editProfile.location}
                  onChange={(e) => handleProfileChange(e, "location")}
                  className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={editProfile.social.facebook}
                onChange={(e) => handleProfileChange(e, "facebook")}
                placeholder="Facebook URL"
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              />
              <input
                type="text"
                value={editProfile.social.twitter}
                onChange={(e) => handleProfileChange(e, "twitter")}
                placeholder="Twitter URL"
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              />
              <input
                type="text"
                value={editProfile.social.linkedin}
                onChange={(e) => handleProfileChange(e, "linkedin")}
                placeholder="LinkedIn URL"
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              />
              <input
                type="text"
                value={editProfile.social.instagram}
                onChange={(e) => handleProfileChange(e, "instagram")}
                placeholder="Instagram URL"
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={user.avatarUrl}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full border border-blue-100 dark:border-gray-700"
              />
              <div>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-white">
                  {user.fullName}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {user.role}  |  {user.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href={user.social.facebook} aria-label="Facebook">
                <Facebook className="w-5 h-5 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300" />
              </a>
              <a href={user.social.twitter} aria-label="Twitter">
                <Twitter className="w-5 h-5 text-slate-600 dark:text-slate-300 hover:text-blue-400 dark:hover:text-blue-300" />
              </a>
              <a href={user.social.linkedin} aria-label="LinkedIn">
                <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-300 hover:text-blue-800 dark:hover:text-blue-300" />
              </a>
              <a href={user.social.instagram} aria-label="Instagram">
                <Instagram className="w-5 h-5 text-slate-600 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-300" />
              </a>
            </div>
          </div>
        )}
      </Card>

      <Card
        title="Personal Information"
        onEdit={handleEditPersonal}
        isEditing={isEditingPersonal}
        onSave={handleSavePersonal}
        onCancel={handleCancelPersonal}
      >
        {isEditingPersonal ? (
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                First Name
              </p>
              <input
                type="text"
                value={editPersonal.firstName}
                onChange={(e) => handlePersonalChange(e, "firstName")}
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              />
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Last Name
              </p>
              <input
                type="text"
                value={editPersonal.lastName}
                onChange={(e) => handlePersonalChange(e, "lastName")}
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              />
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Email address
              </p>
              <input
                type="email"
                value={editPersonal.email}
                disabled
                className="w-full text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 cursor-not-allowed"
              />
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Phone
              </p>
              <input
                type="text"
                value={editPersonal.phone}
                onChange={(e) => handlePersonalChange(e, "phone")}
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              />
            </div>
            <div className="col-span-2">
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Bio
              </p>
              <textarea
                value={editPersonal.bio}
                onChange={(e) => handlePersonalChange(e, "bio")}
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                rows={3}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                First Name
              </p>
              <p className="text-gray-900 dark:text-white">
                {user.personal.firstName}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Last Name
              </p>
              <p className="text-gray-900 dark:text-white">
                {user.personal.lastName}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Email address
              </p>
              <p className="text-gray-900 dark:text-white">
                {user.personal.email}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Phone
              </p>
              <p className="text-gray-900 dark:text-white">
                {user.personal.phone}
              </p>
            </div>
            <div className="col-span-2">
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Bio
              </p>
              <p className="text-gray-900 dark:text-white">
                {user.personal.bio}
              </p>
            </div>
          </div>
        )}
      </Card>

      <Card
        title="Address"
        onEdit={handleEditAddress}
        isEditing={isEditingAddress}
        onSave={handleSaveAddress}
        onCancel={handleCancelAddress}
      >
        {isEditingAddress ? (
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Country
              </p>
              <input
                type="text"
                value={editAddress.country}
                onChange={(e) => handleAddressChange(e, "country")}
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              />
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                City/State
              </p>
              <input
                type="text"
                value={editAddress.cityState}
                onChange={(e) => handleAddressChange(e, "cityState")}
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              />
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Postal Code
              </p>
              <input
                type="text"
                value={editAddress.postalCode}
                onChange={(e) => handleAddressChange(e, "postalCode")}
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              />
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                TAX ID
              </p>
              <input
                type="text"
                value={editAddress.taxId}
                onChange={(e) => handleAddressChange(e, "taxId")}
                className="w-full text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Country
              </p>
              <p className="text-gray-900 dark:text-white">
                {user.address.country}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                City/State
              </p>
              <p className="text-gray-900 dark:text-white">
                {user.address.cityState}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Postal Code
              </p>
              <p className="text-gray-900 dark:text-white">
                {user.address.postalCode}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                TAX ID
              </p>
              <p className="text-gray-900 dark:text-white">
                {user.address.taxId}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* <div className="flex justify-end">
         <button
          onClick={handleDeleteProfile}
          className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
        >
          Delete Profile
        </button> 
      </div> */}
    </div>
  );
};

export default UserProfile;








