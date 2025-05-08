import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useUserData from "../../../Hooks/useUserData";
import SectionTitle from "../../../components/SectionTitle2";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { FiPackage, FiAlertCircle, FiCreditCard, FiSave } from "react-icons/fi";
import firebaseDb from "../../../utils/firebaseDb";
import PageTitle from "../../../components/PageTitle";

/**
 * Edit Asset page for HR to update existing assets
 */
const EditAsset = () => {
  const { userData, isLoading: userLoading } = useUserData();
  const navigate = useNavigate();
  const { id } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    product_name: "",
    product_type: "",
    product_quantity: ""
  });
  const [errors, setErrors] = useState({});

  // Fetch asset data
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        const asset = await firebaseDb.get(`assets/${id}`);

        if (asset) {
          setFormData({
            product_name: asset.product_name || "",
            product_type: asset.product_type || "",
            product_quantity: asset.product_quantity?.toString() || ""
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Asset Not Found",
            text: "The requested asset could not be found."
          });
          navigate("/dashboard/assetList");
        }
      } catch (error) {
        console.error("Error fetching asset:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load asset data."
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAsset();
    }
  }, [id, navigate]);

  // Set page title
  useEffect(() => {
    document.title = "Edit Asset | Trinet";
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

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.product_name.trim()) {
      newErrors.product_name = "Product name is required";
    }

    if (!formData.product_type) {
      newErrors.product_type = "Product type is required";
    }

    if (!formData.product_quantity) {
      newErrors.product_quantity = "Product quantity is required";
    } else if (parseInt(formData.product_quantity) < 0) {
      newErrors.product_quantity = "Quantity cannot be negative";
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
      updated_date: new Date().toISOString(),
    };

    try {
      console.log("Updating asset data in Firebase:", assetData);

      // Update in Firebase Realtime Database
      await firebaseDb.update(`assets/${id}`, assetData);

      console.log("Asset updated successfully");

      Swal.fire({
        icon: "success",
        title: "Asset Updated Successfully!",
        text: "The asset has been updated in your inventory.",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/dashboard/assetList");
    } catch (error) {
      console.error("Error updating asset:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Update Asset",
        text: error.message || "An error occurred while updating the asset.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageTitle title={"Edit Asset"} />

      {/* Page header */}
      <div className="mb-8">
        <SectionTitle
          title="Edit Asset"
          subtitle="Update an existing asset in your inventory"
          align="left"
          accentColor="primary"
        />
      </div>

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
                Product Type
              </label>
              <div className="mt-1">
                <select
                  id="product_type"
                  name="product_type"
                  value={formData.product_type}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    errors.product_type ? "border-error-300" : ""
                  }`}
                  required
                >
                  <option value="">Select product type</option>
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
                min="0"
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
                icon={<FiSave />}
                iconPosition="left"
              >
                {submitting ? "Updating Asset..." : "Update Asset"}
              </Button>
            </div>
          </form>
        </Card>
    </div>
  );
};

export default EditAsset;
