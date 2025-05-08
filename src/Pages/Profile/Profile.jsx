
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Providers/AuthProvider";
import { useContext, useEffect, useState, useRef } from "react";
import useUserData from "../../Hooks/useUserData";
import { updateData } from "../../firebase/firebaseDB";
import Swal from "sweetalert2";
import Avatar from "react-avatar";
import { imageUpload } from "../../api/utils";
import PageTitle from "../../components/PageTitle";
import SectionTitle from "../../components/SectionTitle2";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FiCamera, FiMail, FiUser, FiPhone, FiMapPin, FiBriefcase, FiCalendar } from "react-icons/fi";

const Profile = () => {
  const { user, setUser, updateUserProfile } = useContext(AuthContext);
  const { userData, isLoading, refetch } = useUserData();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setValue("displayName", user.displayName || "");
      setValue("email", user.email || "");

      // Set additional fields from userData if available
      if (userData) {
        setValue("phone", userData.phone || "");
        setValue("location", userData.location || "");
        setValue("company", userData.company_name || "");
        setValue("position", userData.position || "");
        setValue("dob", userData.dob || "");
      }
    }
  }, [user, userData, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      let photoURL = user?.photoURL;

      // Upload image if a new one was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        try {
          const uploadResult = await imageUpload(formData);
          photoURL = uploadResult.data.display_url;
        } catch (error) {
          console.error("Error uploading image:", error);
          Swal.fire({
            icon: "error",
            title: "Image Upload Failed",
            text: "Failed to upload profile image. Please try again.",
          });
          setLoading(false);
          return;
        }
      }

      // Update Firebase Auth profile
      await updateUserProfile(data.displayName, photoURL);

      // Update user context
      setUser((prevUser) => ({
        ...prevUser,
        displayName: data.displayName,
        photoURL: photoURL
      }));

      // Update additional user data in database
      if (userData?.id) {
        await updateData('users', userData.id, {
          name: data.displayName,
          phone: data.phone,
          location: data.location,
          position: data.position,
          dob: data.dob
        });

        // Refresh user data
        refetch();
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Profile updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Clear image file state
      setImageFile(null);

    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const displayNameValue = watch("displayName");
  const isSubmitDisabled = !imageFile && user?.displayName === displayNameValue;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle title="Profile" />
      <SectionTitle sectionTitle="My Profile" />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar
                  className="w-32 h-32 rounded-full"
                  src={
                    imagePreview ||
                    user?.photoURL ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/2048px-Missing_avatar.svg.png"
                  }
                  alt="Profile"
                  round={true}
                  size="128"
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FiCamera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">{user?.displayName}</h3>
                <p className="text-sm text-gray-500">{userData?.role || "User"}</p>
              </div>
            </div>

            {/* Profile Form Section */}
            <div className="flex-1">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiUser className="inline mr-2" /> Full Name
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      {...register("displayName", { required: "Name is required" })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.displayName && (
                      <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiMail className="inline mr-2" /> Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                      disabled
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiPhone className="inline mr-2" /> Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiMapPin className="inline mr-2" /> Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      {...register("location")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiBriefcase className="inline mr-2" /> Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      {...register("company")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                      disabled
                    />
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiBriefcase className="inline mr-2" /> Position
                    </label>
                    <input
                      id="position"
                      type="text"
                      {...register("position")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                      <FiCalendar className="inline mr-2" /> Date of Birth
                    </label>
                    <input
                      id="dob"
                      type="date"
                      {...register("dob")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className={`py-2 px-4 rounded-md text-white font-medium ${
                      isSubmitDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700"
                    }`}
                    disabled={isSubmitDisabled || loading}
                  >
                    {loading ? <LoadingSpinner size="sm" color="white" /> : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
