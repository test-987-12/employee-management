
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useUserData from "../../../Hooks/useUserData";
import SectionTitle from "../../../components/SectionTitle2";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { FiPackage, FiAlertCircle, FiCreditCard, FiPlus } from "react-icons/fi";
import firebaseDb from "../../../utils/firebaseDb";

/**
 * Add Asset page for HR to add new assets to the system
 */
const AddAsset = () => {
  const { userData, isLoading } = useUserData();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    product_type: "",
    product_quantity: ""
  });
  const [errors, setErrors] = useState({});

  // Set page title
  useEffect(() => {
    document.title = "Add Asset | Trinet";
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.product_name.trim()) {
      newErrors.product_name = "Product name is required";
    }

    if (!formData.product_type) {
      newErrors.product_type = "Please select a product type";
    }

    if (!formData.product_quantity) {
      newErrors.product_quantity = "Product quantity is required";
    } else if (isNaN(formData.product_quantity) || Number(formData.product_quantity) <= 0) {
      newErrors.product_quantity = "Quantity must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const assetData = {
      product_name: formData.product_name,
      product_type: formData.product_type,
      product_quantity: Number(formData.product_quantity),
      creator_name: userData?.name || 'Unknown',
      creator_email: userData?.email || 'unknown@example.com',
      company_name: userData?.company_name || 'Unknown Company',
      created_date: new Date().toISOString(),
    };

    try {
      console.log("Saving asset data to Firebase:", assetData);

      // Save to Firebase Realtime Database
      const assetId = await firebaseDb.create('assets', assetData);

      console.log("Asset saved successfully with ID:", assetId);

      Swal.fire({
        icon: "success",
        title: "Asset Added Successfully!",
        text: "The new asset has been added to your inventory.",
        showConfirmButton: false,
        timer: 2000,
      });

      // Clear form
      setFormData({
        product_name: "",
        product_type: "",
        product_quantity: ""
      });

      navigate("/dashboard/assetList");
    } catch (error) {
      console.error("Error adding asset:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Add Asset",
        text: error.message || "An error occurred while adding the asset.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <SectionTitle
          title="Add New Asset"
          subtitle="Add a new asset to your company's inventory"
          align="left"
          accentColor="primary"
        />
      </div>

      {/* Payment status check */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <Input
                id="product_name"
                name="product_name"
                type="text"
                label="Product Name"
                placeholder="Enter product name"
                value={formData.product_name}
                onChange={handleChange}
                error={errors.product_name}
                icon={<FiPackage className="h-5 w-5 text-gray-400" />}
                required
              />
            </div>

            {/* Product Type */}
            <div>
              <label htmlFor="product_type" className="block text-sm font-medium text-gray-700 mb-1">
                Product Type <span className="text-error-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="product_type"
                  name="product_type"
                  value={formData.product_type}
                  onChange={handleChange}
                  className={`block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 ${
                    errors.product_type ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''
                  }`}
                  required
                >
                  <option value="" disabled>Select product type</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Headset">Headset</option>
                  <option value="Phone">Phone</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Printer">Printer</option>
                  <option value="Scanner">Scanner</option>
                  <option value="Projector">Projector</option>
                  <option value="Camera">Camera</option>
                  <option value="Office Chair">Office Chair</option>
                  <option value="Desk">Desk</option>
                  <option value="Software License">Software License</option>
                  <option value="Server Equipment">Server Equipment</option>
                </select>
                {errors.product_type && (
                  <p className="mt-1 text-sm text-error-500">{errors.product_type}</p>
                )}
              </div>
            </div>

            {/* Product Quantity */}
            <div>
              <Input
                id="product_quantity"
                name="product_quantity"
                type="number"
                label="Product Quantity"
                placeholder="Enter quantity"
                value={formData.product_quantity}
                onChange={handleChange}
                error={errors.product_quantity}
                required
                min="1"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={submitting}
                icon={<FiPlus />}
                iconPosition="left"
              >
                {submitting ? "Adding Asset..." : "Add Asset"}
              </Button>
            </div>
          </form>
        </Card>
    </div>
  );
};

export default AddAsset;