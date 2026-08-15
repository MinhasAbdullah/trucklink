import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Truck, User, Calendar, MapPin, Globe, Award, Clock, 
  CalendarDays, Briefcase, FileText, Upload, CheckCircle,
  AlertCircle, ArrowLeft, Save, Phone, Mail,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DriverProfileForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    license: null,
    medical: null,
    additional: null
  });

  // Form State
  const [formData, setFormData] = useState({
    // Section 1: Personal Information
    fullName: "",
    dateOfBirth: "",
    currentCity: "",
    stateRegion: "",
    phoneNumber: "",
    email: "",
    
    // Section 2: License & CDL
    cdlClass: "",
    licenseNumber: "",
    licenseExpiry: "",
    
    // Section 3: Endorsements
    endorsements: [],
    
    // Section 4: Experience
    totalExperience: "",
    preferredRouteType: "",
    
    // Section 5: Equipment
    equipmentTypes: [],
    
    // Section 6: Availability
    availableFrom: "",
    preferredSchedule: "",
    
    // Section 7: Documents (handled separately)
    
    // Section 8: Additional
    additionalInfo: "",
  });

  // Master Data - Pakistan + General
  const regions = [
    "Punjab", "Sindh", "KPK", "Balochistan", 
    "Gilgit-Baltistan", "AJK", "Islamabad"
  ];

  const cdlClasses = [
    { value: "htv", label: "HTV (Heavy Transport Vehicle)" },
    { value: "ltv", label: "LTV (Light Transport Vehicle)" },
    { value: "psv", label: "PSV (Public Service Vehicle)" },
  ];

  const endorsementOptions = [
    "Hazmat", "Tanker", "Doubles/Triples", "Passenger",
    "School Bus", "Heavy Machinery", "Oversized Loads",
    "Refrigerated Goods", "Cross-Border", "Night Driving Permit"
  ];

  const routeTypes = [
    "Local", "Inter-City", "Inter-Province", "Cross-Border",
    "Regional", "OTR (Over The Road)", "Dedicated"
  ];

  const equipmentOptions = [
    "10-Wheeler", "6-Wheeler", "Dumper", "Tanker", 
    "Flatbed", "Container", "Dry Van", "Reefer", 
    "Auto-Carrier", "Lowboy"
  ];

  const schedules = [
    "Full-Time", "Part-Time", "Contract-Based", "Per-Trip"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          [name]: [...prev[name], value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload PDF, JPG, or PNG files only");
        return;
      }
      
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
      console.log(`Uploaded ${fileType}:`, file.name);
    }
  };

  const removeFile = (fileType) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: null
    }));
  };

  // ✅ FIXED: Complete handleSubmit with localStorage
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = [
      'fullName', 'dateOfBirth', 'currentCity', 'stateRegion', 
      'phoneNumber', 'email', 'cdlClass', 'licenseNumber', 
      'licenseExpiry', 'totalExperience', 'preferredRouteType',
      'equipmentTypes', 'availableFrom'
    ];
    
    const missingFields = requiredFields.filter(field => {
      if (Array.isArray(formData[field])) {
        return formData[field].length === 0;
      }
      return !formData[field];
    });
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Validate date of birth (age >= 21)
    const dob = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 21) {
      alert("You must be at least 21 years old");
      return;
    }
    
    // Validate license expiry (must be future date)
    const expiry = new Date(formData.licenseExpiry);
    if (expiry <= today) {
      alert("License expiry date must be in the future");
      return;
    }
    
    // Validate available from (today or future)
    const availableDate = new Date(formData.availableFrom);
    if (availableDate < today) {
      alert("Available to start date must be today or in the future");
      return;
    }
    
    // Validate documents
    if (!uploadedFiles.license || !uploadedFiles.medical) {
      alert("Please upload both Driver License and Medical Card");
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // ✅ Save profile data to localStorage
      localStorage.setItem('driverProfileSubmitted', 'true');
      localStorage.setItem('driverName', formData.fullName);
      localStorage.setItem('driverEmail', formData.email);
      localStorage.setItem('driverPhone', formData.phoneNumber);
      localStorage.setItem('driverCity', formData.currentCity);
      localStorage.setItem('driverRegion', formData.stateRegion);
      localStorage.setItem('driverCDL', formData.cdlClass);
      localStorage.setItem('driverLicenseNumber', formData.licenseNumber);
      localStorage.setItem('driverLicenseExpiry', formData.licenseExpiry);
      localStorage.setItem('driverEndorsements', formData.endorsements.join(', '));
      localStorage.setItem('driverExperience', formData.totalExperience);
      localStorage.setItem('driverRoute', formData.preferredRouteType);
      localStorage.setItem('driverEquipment', formData.equipmentTypes.join(', '));
      localStorage.setItem('driverAvailableFrom', formData.availableFrom);
      localStorage.setItem('driverSchedule', formData.preferredSchedule || 'Not Specified');
      
      console.log("Profile submitted:", { ...formData, documents: uploadedFiles });
      
      // Show success message
      setSuccess(true);
      
      // Redirect to status tracking page after 1.5 seconds
      setTimeout(() => {
        navigate("/driver/status");
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("Failed to submit profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, label: "Personal Info", icon: User },
    { id: 2, label: "License & CDL", icon: Award },
    { id: 3, label: "Experience & Equipment", icon: Briefcase },
    { id: 4, label: "Documents & Submit", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7f4] via-[#e8f5ee] to-[#d4ede3] p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2d6a4f] to-[#409f7a] rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1a2a3a] to-[#2d6a4f] bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
          </div>
          <p className="text-[#4a6a5a]">Fill in your details to get matched with the best opportunities</p>
        </motion.div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate("/auth")}
          className="flex items-center gap-2 text-[#4a6a5a] hover:text-[#2d6a4f] transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </motion.button>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Profile submitted successfully! Redirecting to status page...</span>
          </motion.div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#dce8e2] -translate-y-1/2" />
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive || isCompleted
                        ? "bg-[#2d6a4f] text-white shadow-lg"
                        : "bg-white border-2 border-[#dce8e2] text-[#8aa89a]"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </button>
                  <span className={`text-xs mt-2 font-medium ${
                    isActive ? "text-[#2d6a4f]" : "text-[#8aa89a]"
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-white/50"
          >
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-[#1a2a3a] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#2d6a4f]" />
                  Personal Information
                </h3>
                <p className="text-sm text-[#8aa89a]">All fields marked with * are required</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Anas Khan"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa89a]" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 pl-10 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa89a]" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="(+92) 300-1234567"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 pl-10 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa89a]" />
                      <input
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 pl-10 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      Current City *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa89a]" />
                      <input
                        type="text"
                        name="currentCity"
                        placeholder="e.g. Lahore, Karachi"
                        value={formData.currentCity}
                        onChange={handleChange}
                        className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 pl-10 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      State/Region *
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa89a]" />
                      <select
                        name="stateRegion"
                        value={formData.stateRegion}
                        onChange={handleChange}
                        className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 pl-10 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all appearance-none bg-white"
                        required
                      >
                        <option value="">Select Region</option>
                        {regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: License & CDL + Endorsements */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-[#1a2a3a] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#2d6a4f]" />
                  License & CDL Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      CDL Class *
                    </label>
                    <select
                      name="cdlClass"
                      value={formData.cdlClass}
                      onChange={handleChange}
                      className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all appearance-none bg-white"
                      required
                    >
                      <option value="">Select CDL Class</option>
                      {cdlClasses.map(cls => (
                        <option key={cls.value} value={cls.value}>{cls.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      License Number *
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      placeholder="DL12345678"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      License Expiry Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa89a]" />
                      <input
                        type="date"
                        name="licenseExpiry"
                        value={formData.licenseExpiry}
                        onChange={handleChange}
                        className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 pl-10 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Endorsements */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#4a6a5a] mb-2">
                    Endorsements <span className="text-xs text-[#8aa89a]">(Select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {endorsementOptions.map(endo => (
                      <label key={endo} className="flex items-center gap-2 text-sm text-[#4a6a5a] bg-[#f8fbf9] p-2 rounded-lg hover:bg-[#e8f5ee] transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          name="endorsements"
                          value={endo}
                          checked={formData.endorsements.includes(endo)}
                          onChange={handleChange}
                          className="w-4 h-4 accent-[#2d6a4f] rounded border-[#c8dcd2]"
                        />
                        {endo}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Experience & Equipment */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-[#1a2a3a] flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#2d6a4f]" />
                  Experience & Equipment
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      Total Years of Experience *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa89a]" />
                      <input
                        type="number"
                        name="totalExperience"
                        placeholder="5"
                        min="0"
                        max="50"
                        value={formData.totalExperience}
                        onChange={handleChange}
                        className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 pl-10 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      Preferred Route Type *
                    </label>
                    <select
                      name="preferredRouteType"
                      value={formData.preferredRouteType}
                      onChange={handleChange}
                      className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all appearance-none bg-white"
                      required
                    >
                      <option value="">Select Route Type</option>
                      {routeTypes.map(route => (
                        <option key={route} value={route}>{route}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Equipment Types */}
                <div>
                  <label className="block text-sm font-medium text-[#4a6a5a] mb-2">
                    Equipment Type You Can Drive *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {equipmentOptions.map(equip => (
                      <label key={equip} className="flex items-center gap-2 text-sm text-[#4a6a5a] bg-[#f8fbf9] p-2 rounded-lg hover:bg-[#e8f5ee] transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          name="equipmentTypes"
                          value={equip}
                          checked={formData.equipmentTypes.includes(equip)}
                          onChange={handleChange}
                          className="w-4 h-4 accent-[#2d6a4f] rounded border-[#c8dcd2]"
                        />
                        {equip}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      Available to Start From *
                    </label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa89a]" />
                      <input
                        type="date"
                        name="availableFrom"
                        value={formData.availableFrom}
                        onChange={handleChange}
                        className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 pl-10 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                      Preferred Work Schedule
                    </label>
                    <select
                      name="preferredSchedule"
                      value={formData.preferredSchedule}
                      onChange={handleChange}
                      className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select Schedule</option>
                      {schedules.map(schedule => (
                        <option key={schedule} value={schedule}>{schedule}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents & Additional Info */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-[#1a2a3a] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#2d6a4f]" />
                  Documents & Additional Information
                </h3>
                
                {/* Document Upload */}
                <div className="space-y-4">
                  <h4 className="font-medium text-[#1a2a3a]">Upload Documents</h4>
                  <p className="text-sm text-[#8aa89a]">Allowed formats: PDF, JPG, PNG (Max 5MB each)</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Driver License */}
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                      uploadedFiles.license ? 'border-[#2d6a4f] bg-[#e8f5ee]' : 'border-[#dce8e2] hover:border-[#2d6a4f]'
                    }`}>
                      {uploadedFiles.license ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle className="w-8 h-8 text-[#2d6a4f] mb-2" />
                          <p className="text-sm font-medium text-[#1a2a3a] truncate max-w-full">
                            {uploadedFiles.license.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeFile('license')}
                            className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-[#8aa89a] mx-auto mb-2" />
                          <p className="text-sm font-medium text-[#4a6a5a]">Driver License *</p>
                          <p className="text-xs text-[#8aa89a] mt-1">PDF, JPG, PNG</p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'license')}
                            className="hidden"
                            id="license"
                            required
                          />
                          <label htmlFor="license" className="mt-2 inline-block text-xs text-[#2d6a4f] cursor-pointer hover:underline">
                            Browse Files
                          </label>
                        </>
                      )}
                    </div>

                    {/* Medical Card */}
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                      uploadedFiles.medical ? 'border-[#2d6a4f] bg-[#e8f5ee]' : 'border-[#dce8e2] hover:border-[#2d6a4f]'
                    }`}>
                      {uploadedFiles.medical ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle className="w-8 h-8 text-[#2d6a4f] mb-2" />
                          <p className="text-sm font-medium text-[#1a2a3a] truncate max-w-full">
                            {uploadedFiles.medical.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeFile('medical')}
                            className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-[#8aa89a] mx-auto mb-2" />
                          <p className="text-sm font-medium text-[#4a6a5a]">Medical Card *</p>
                          <p className="text-xs text-[#8aa89a] mt-1">PDF, JPG, PNG</p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'medical')}
                            className="hidden"
                            id="medical"
                            required
                          />
                          <label htmlFor="medical" className="mt-2 inline-block text-xs text-[#2d6a4f] cursor-pointer hover:underline">
                            Browse Files
                          </label>
                        </>
                      )}
                    </div>

                    {/* Additional Documents */}
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                      uploadedFiles.additional ? 'border-[#2d6a4f] bg-[#e8f5ee]' : 'border-[#dce8e2] hover:border-[#2d6a4f]'
                    }`}>
                      {uploadedFiles.additional ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle className="w-8 h-8 text-[#2d6a4f] mb-2" />
                          <p className="text-sm font-medium text-[#1a2a3a] truncate max-w-full">
                            {uploadedFiles.additional.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeFile('additional')}
                            className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-[#8aa89a] mx-auto mb-2" />
                          <p className="text-sm font-medium text-[#4a6a5a]">Additional Docs</p>
                          <p className="text-xs text-[#8aa89a] mt-1">PDF, JPG, PNG (Optional)</p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'additional')}
                            className="hidden"
                            id="additional"
                          />
                          <label htmlFor="additional" className="mt-2 inline-block text-xs text-[#2d6a4f] cursor-pointer hover:underline">
                            Browse Files
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <label className="block text-sm font-medium text-[#4a6a5a] mb-1.5">
                    Additional Information <span className="text-xs text-[#8aa89a]">(Optional)</span>
                  </label>
                  <textarea
                    name="additionalInfo"
                    rows="4"
                    placeholder="Any additional information for admin/recruiters..."
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="w-full border-2 border-[#dce8e2] rounded-xl px-4 py-2.5 focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 outline-none transition-all resize-none"
                  />
                </div>

                {/* Form Status Preview */}
                <div className="bg-[#f8fbf9] rounded-xl p-4 border border-[#e8f5ee]">
                  <h4 className="text-sm font-medium text-[#1a2a3a] mb-2">Form Status</h4>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-[#4a6a5a]">Pending Review</span>
                    </div>
                    <span className="text-[#dce8e2]">|</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-[#4a6a5a]">Approved</span>
                    </div>
                    <span className="text-[#dce8e2]">|</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-[#4a6a5a]">Rejected</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[#e8f5ee]">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className="px-6 py-2.5 rounded-xl border-2 border-[#dce8e2] text-[#4a6a5a] hover:border-[#2d6a4f] hover:text-[#2d6a4f] transition-all font-medium"
              >
                Previous
              </button>
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2d6a4f] to-[#409f7a] text-white font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#2d6a4f] to-[#409f7a] text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Submit for Moderation
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DriverProfileForm;