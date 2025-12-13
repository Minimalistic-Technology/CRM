"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Facebook,
  X as Twitter,
  Linkedin,
  Instagram,
  Edit2 as Edit,
  Save,
  X as Cancel,
  Trash2,
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

interface UserProfile {
  _id?: string;
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
              type="button"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
              type="button"
            >
              <Cancel className="w-4 h-4" />
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-800 dark:hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity"
            type="button"
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

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editProfile, setEditProfile] = useState({
    fullName: "",
    role: "",
    location: "",
    social: { facebook: "", twitter: "", linkedin: "", instagram: "" },
  });
  const [editPersonal, setEditPersonal] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [editAddress, setEditAddress] = useState({
    country: "",
    cityState: "",
    postalCode: "",
    taxId: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/crm/user-profiles",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const profiles = await response.json();

        if (!response.ok) {
          throw new Error(profiles.error || "Failed to fetch profiles");
        }

        const userProfile = profiles.find(
          (p: UserProfile) => p.personal.email === email
        );

        if (!userProfile) {
          throw new Error("Profile not found for this email");
        }

        const defaultSocial: SocialLinks = {
          facebook: userProfile.social?.facebook || "",
          twitter: userProfile.social?.twitter || "",
          linkedin: userProfile.social?.linkedin || "",
          instagram: userProfile.social?.instagram || "",
        };

        const defaultPersonal: PersonalInfo = {
          firstName: userProfile.personal?.firstName || "",
          lastName: userProfile.personal?.lastName || "",
          email: userProfile.personal?.email || "",
          phone: userProfile.personal?.phone || "",
          bio: userProfile.personal?.bio || "",
        };

        const defaultAddress: Address = {
          country: userProfile.address?.country || "",
          cityState: userProfile.address?.cityState || "",
          postalCode: userProfile.address?.postalCode || "",
          taxId: userProfile.address?.taxId || "",
        };

        setProfile({
          ...userProfile,
          social: defaultSocial,
          personal: defaultPersonal,
          address: defaultAddress,
        });
        setEditProfile({
          fullName: userProfile.fullName || "",
          role: userProfile.role || "",
          location: userProfile.location || "",
          social: defaultSocial,
        });
        setEditPersonal(defaultPersonal);
        setEditAddress(defaultAddress);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile");
        localStorage.removeItem("userEmail");
  router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleEditProfile = () => {
    setEditProfile({
      fullName: profile?.fullName || "",
      role: profile?.role || "",
      location: profile?.location || "",
      social: profile?.social || {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      },
    });
    setIsEditingProfile(true);
  };

  const handleEditPersonal = () => {
    setEditPersonal({
      firstName: profile?.personal.firstName || "",
      lastName: profile?.personal.lastName || "",
      email: profile?.personal.email || "",
      phone: profile?.personal.phone || "",
      bio: profile?.personal.bio || "",
    });
    setIsEditingPersonal(true);
  };

  const handleEditAddress = () => {
    setEditAddress({
      country: profile?.address.country || "",
      cityState: profile?.address.cityState || "",
      postalCode: profile?.address.postalCode || "",
      taxId: profile?.address.taxId || "",
    });
    setIsEditingAddress(true);
  };

  const handleSaveProfile = async () => {
    if (!profile?._id) {
      setError("Profile ID not found");
      return;
    }

    try {
      const fullNameParts = editProfile.fullName.trim().split(" ");
      const newFirstName = fullNameParts[0] || "";
      const newLastName = fullNameParts.slice(1).join(" ") || "";

      const updatedProfile: UserProfile = {
        ...profile,
        fullName: editProfile.fullName,
        role: editProfile.role,
        location: editProfile.location,
        social: { ...editProfile.social },
        personal: {
          ...profile.personal,
          firstName: newFirstName,
          lastName: newLastName,
        },
        address: { ...profile.address },
        avatarUrl: profile.avatarUrl,
      };

      const response = await fetch(
        `http://localhost:5000/api/crm/user-profiles/${profile._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      setProfile(updatedProfile);
      setEditPersonal({
        ...editPersonal,
        firstName: newFirstName,
        lastName: newLastName,
      });
      setIsEditingProfile(false);
      setError(null);
    } catch (err: any) {
      setError(`Failed to save profile: ${err.message}`);
      console.error(err);
    }
  };

  const handleSavePersonal = async () => {
    if (!profile?._id) {
      setError("Profile ID not found");
      return;
    }

    try {
      const updatedProfile: UserProfile = {
        ...profile,
        personal: { ...editPersonal },
        fullName: `${editPersonal.firstName} ${editPersonal.lastName}`.trim(),
        role: profile.role,
        location: profile.location,
        social: { ...profile.social },
        address: { ...profile.address },
        avatarUrl: profile.avatarUrl,
      };

      const response = await fetch(
        `http://localhost:5000/api/crm/user-profiles/${profile._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save personal information");
      }

      setProfile(updatedProfile);
      setEditProfile({
        ...editProfile,
        fullName: updatedProfile.fullName,
      });
      setIsEditingPersonal(false);
      setError(null);
    } catch (err: any) {
      setError(`Failed to save personal information: ${err.message}`);
      console.error(err);
    }
  };

  const handleSaveAddress = async () => {
    if (!profile?._id) {
      setError("Profile ID not found");
      return;
    }

    try {
      const updatedProfile: UserProfile = {
        ...profile,
        address: { ...editAddress },
        fullName: profile.fullName,
        role: profile.role,
        location: profile.location,
        social: { ...profile.social },
        personal: { ...profile.personal },
        avatarUrl: profile.avatarUrl,
      };

      const response = await fetch(
        `http://localhost:5000/api/crm/user-profiles/${profile._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      setProfile(updatedProfile);
      setIsEditingAddress(false);
      setError(null);
    } catch (err: any) {
      setError(`Failed to save address: ${err.message}`);
      console.error(err);
    }
  };

  

  const handleCancelProfile = () => {
    setEditProfile({
      fullName: profile?.fullName || "",
      role: profile?.role || "",
      location: profile?.location || "",
      social: profile?.social || {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      },
    });
    setIsEditingProfile(false);
  };

  const handleCancelPersonal = () => {
    setEditPersonal({
      firstName: profile?.personal.firstName || "",
      lastName: profile?.personal.lastName || "",
      email: profile?.personal.email || "",
      phone: profile?.personal.phone || "",
      bio: profile?.personal.bio || "",
    });
    setIsEditingPersonal(false);
  };

  const handleCancelAddress = () => {
    setEditAddress({
      country: profile?.address.country || "",
      cityState: profile?.address.cityState || "",
      postalCode: profile?.address.postalCode || "",
      taxId: profile?.address.taxId || "",
    });
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

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50 dark:bg-gray-900">
        <p className="text-lg text-red-700 dark:text-red-300">
          Profile not found
        </p>
      </div>
    );
  }

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
                src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
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
                src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full border border-blue-100 dark:border-gray-700"
              />
              <div>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-white">
                  {profile.fullName || "Not specified"}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {profile.role || "Not specified"} |{" "}
                  {profile.location || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href={profile.social.facebook || "#"} aria-label="Facebook">
                <Facebook
                  className={`w-5 h-5 ${
                    profile.social.facebook
                      ? "text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300"
                      : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                />
              </a>
              <a href={profile.social.twitter || "#"} aria-label="Twitter">
                <Twitter
                  className={`w-5 h-5 ${
                    profile.social.twitter
                      ? "text-slate-600 dark:text-slate-300 hover:text-blue-400 dark:hover:text-blue-300"
                      : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                />
              </a>
              <a href={profile.social.linkedin || "#"} aria-label="LinkedIn">
                <Linkedin
                  className={`w-5 h-5 ${
                    profile.social.linkedin
                      ? "text-slate-600 dark:text-slate-300 hover:text-blue-800 dark:hover:text-blue-300"
                      : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                />
              </a>
              <a href={profile.social.instagram || "#"} aria-label="Instagram">
                <Instagram
                  className={`w-5 h-5 ${
                    profile.social.instagram
                      ? "text-slate-600 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-300"
                      : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                />
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
                {profile.personal.firstName || "Not specified"}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Last Name
              </p>
              <p className="text-gray-900 dark:text-white">
                {profile.personal.lastName || "Not specified"}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Email address
              </p>
              <p className="text-gray-900 dark:text-white">
                {profile.personal.email || "Not specified"}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Phone
              </p>
              <p className="text-gray-900 dark:text-white">
                {profile.personal.phone || "Not specified"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Bio
              </p>
              <p className="text-gray-900 dark:text-white">
                {profile.personal.bio || "Not specified"}
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
                {profile.address.country || "Not specified"}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                City/State
              </p>
              <p className="text-gray-900 dark:text-white">
                {profile.address.cityState || "Not specified"}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                Postal Code
              </p>
              <p className="text-gray-900 dark:text-white">
                {profile.address.postalCode || "Not specified"}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                TAX ID
              </p>
              <p className="text-gray-900 dark:text-white">
                {profile.address.taxId || "Not specified"}
              </p>
            </div>
          </div>
        )}
      </Card>

      <div className="fixed bottom-6 right-6 flex gap-4">
     
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
          type="button"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;