import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Truck, User, Calendar, MapPin, Globe, Award, Clock, 
  CalendarDays, Briefcase, FileText, Upload, CheckCircle,
  AlertCircle, ArrowLeft, Save, Phone, Mail,
  X, FileCheck, IdCard, FileWarning, FileSignature,
  File, ChevronRight, ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ===== DOCUMENT UPLOAD BOX COMPONENT =====
const DocumentUploadBox = ({ 
  label, 
  fileType, 
  uploadedFiles, 
  handleFileUpload, 
  removeFile, 
  icon,
  optional = false,
  required = false
}) => {
  const isUploaded = uploadedFiles[fileType] !== null;
  
  return (
    <motion.div 
      whileHover={{ scale: isUploaded ? 1 : 1.02 }}
      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 ${
        isUploaded 
          ? 'border-emerald-500 bg-emerald-50/80 shadow-sm' 
          : 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50'
      }`}
    >
      {isUploaded ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-gray-800 truncate max-w-full">
            {uploadedFiles[fileType]?.name || 'Uploaded'}
          </p>
          <button
            type="button"
            onClick={() => removeFile(fileType)}
            className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        </div>
      ) : (
        <>
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            {icon || <Upload className="w-5 h-5 text-emerald-600" />}
          </div>
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</p>
          {optional && <span className="text-xs text-gray-400 ml-1">(Optional)</span>}
          {required && <span className="text-xs text-red-500 ml-1">*</span>}
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, fileType)}
            className="hidden"
            id={fileType}
            required={required}
          />
          <label htmlFor={fileType} className="mt-2 inline-block text-xs text-emerald-600 cursor-pointer hover:text-emerald-800 transition-colors font-medium">
            Browse Files
          </label>
        </>
      )}
    </motion.div>
  );
};

const DriverProfileForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // ✅ 7 Documents
  const [uploadedFiles, setUploadedFiles] = useState({
    license: null,
    medical: null,
    cnic: null,
    drivingRecord: null,
    backgroundConsent: null,
    additional: null,
    resume: null,
  });

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    currentCity: "",
    stateRegion: "",
    phoneNumber: "",
    email: "",
    cdlClass: "",
    licenseNumber: "",
    licenseExpiry: "",
    endorsements: [],
    totalExperience: "",
    preferredRouteType: "",
    equipmentTypes: [],
    availableFrom: "",
    preferredSchedule: "",
    additionalInfo: "",
  });

  // Master Data - Pakistan Regions
  const regions = [
    "Punjab", "Sindh", "KPK", "Balochistan", 
    "Gilgit-Baltistan", "AJK", "Islamabad"
  ];

  // ✅ Trucking-Specific CDL Classes
  const cdlClasses = [
    { value: "htv", label: "HTV (Heavy Transport Vehicle)" },
    { value: "ltv", label: "LTV (Light Transport Vehicle)" },
    { value: "psv", label: "PSV (Public Service Vehicle)" },
  ];

  // ✅ Trucking-Specific Endorsements
  const endorsementOptions = [
    "Hazmat (Hazardous Materials)",
    "Tanker (Liquid/Gas Transport)",
    "Doubles / Triples (Multiple Trailers)",
    "Heavy Machinery Transport",
    "Oversized Loads",
    "Refrigerated Goods (Reefer)",
    "Cross-Border Transport",
    "Night Driving Permit",
  ];

  // ✅ Trucking-Specific Route Types
  const routeTypes = [
    "Local (Within City)",
    "Inter-City (Between Cities)",
    "Inter-Province (Between Provinces)",
    "Cross-Border (International)",
    "Regional (Multi-State)",
    "OTR (Over The Road - Long Haul)",
    "Dedicated (Fixed Route)",
  ];

  // ✅ Trucking-Specific Equipment
  const equipmentOptions = [
    "Dry Van (Standard Enclosed)",
    "Reefer (Refrigerated Trailer)",
    "Flatbed (Open Deck)",
    "Tanker (Liquid/Gas)",
    "Hopper (Bulk Materials)",
    "Lowboy (Heavy Equipment)",
    "Step Deck (Oversized Loads)",
    "Container Chassis (Intermodal)",
    "Dump Trailer (Aggregates)",
    "Curtainside (Tautliner)",
  ];

  // ✅ Trucking-Specific Schedules
  const schedules = [
    "Full-Time",
    "Part-Time",
    "Contract-Based",
    "Per-Trip",
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

  const getUploadedCount = () => {
    return Object.values(uploadedFiles).filter(f => f !== null).length;
  };

  const totalDocuments = Object.keys(uploadedFiles).length;

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
  
  const dob = new Date(formData.dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  if (age < 21) {
    alert("You must be at least 21 years old");
    return;
  }
  
  const expiry = new Date(formData.licenseExpiry);
  if (expiry <= today) {
    alert("License expiry date must be in the future");
    return;
  }
  
  const availableDate = new Date(formData.availableFrom);
  if (availableDate < today) {
    alert("Available to start date must be today or in the future");
    return;
  }
  
  const requiredDocs = ['license', 'medical', 'cnic'];
  const missingDocs = requiredDocs.filter(doc => !uploadedFiles[doc]);
  
  if (missingDocs.length > 0) {
    alert(`Please upload required documents: Driver License, Medical Card, and CNIC`);
    return;
  }
  
  setIsLoading(true);
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // ✅ ADD THIS LINE - Current date for tracking
    const currentDate = new Date().toISOString();
    
    const profileKey = `driverProfileSubmitted_${formData.email}`;
    localStorage.setItem(profileKey, 'true');
    
    localStorage.setItem('driverName', formData.fullName);
    localStorage.setItem('driverProfileSubmittedDate', currentDate);
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

    console.log("✅ Profile submitted successfully!");
    
    setSuccess(true);
    setTimeout(() => {
      navigate("/driver/status");
    }, 1500);
    
  } catch (error) {
    console.error("❌ Error submitting profile:", error);
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
    // ✅ MAIN CONTAINER with Blur Background Image
    <div className="min-h-screen relative overflow-hidden">
      
      {/* ===== BLUR BACKGROUND IMAGE ===== */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/95 via-white/90 to-teal-50/95" />
        
        {/* Blur Background Image - Path: public/images/truck-bg.png */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/images/truck-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(0px)',
            transform: 'scale(1.05)',
          }}
        />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232d6a4f' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-4xl mx-auto relative z-10 p-4 py-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Complete Your<span className="text-emerald-600"> Profile</span>
            </h1>
          </div>
          <p className="text-gray-500">Fill in your trucking details to get matched with the best opportunities</p>
        </motion.div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate("/auth")}
          className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors mb-6 text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </motion.button>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Profile submitted successfully! Redirecting to status page...</span>
          </motion.div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -translate-y-1/2" />
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      isActive || isCompleted
                        ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-white border-2 border-gray-200 text-gray-400 hover:border-emerald-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </button>
                  <span className={`text-xs mt-2 font-medium ${
                    isActive ? "text-emerald-600" : "text-gray-400"
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
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-white/50"
          >
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-600" />
                  </div>
                  Personal Information
                </h3>
                <p className="text-sm text-gray-400">All fields marked with <span className="text-red-500">*</span> are required</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Anas Khan"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="(+92) 300-1234567"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Current City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="currentCity"
                        placeholder="e.g. Lahore, Karachi"
                        value={formData.currentCity}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      State / Region <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        name="stateRegion"
                        value={formData.stateRegion}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none bg-white"
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

            {/* Step 2: License & CDL */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Award className="w-4 h-4 text-emerald-600" />
                  </div>
                  License & CDL Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      CDL Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="cdlClass"
                      value={formData.cdlClass}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none bg-white"
                      required
                    >
                      <option value="">Select CDL Class</option>
                      {cdlClasses.map(cls => (
                        <option key={cls.value} value={cls.value}>{cls.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      License Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      placeholder="DL12345678"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      License Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="licenseExpiry"
                        value={formData.licenseExpiry}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Endorsements - Trucking Specific */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Trucking Endorsements <span className="text-xs text-gray-400">(Select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                    {endorsementOptions.map(endo => (
                      <label key={endo} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50/80 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors cursor-pointer border border-transparent hover:border-emerald-200">
                        <input
                          type="checkbox"
                          name="endorsements"
                          value={endo}
                          checked={formData.endorsements.includes(endo)}
                          onChange={handleChange}
                          className="w-4 h-4 accent-emerald-600 rounded border-gray-300"
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
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                  </div>
                  Experience & Equipment
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Total Years of Experience <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        name="totalExperience"
                        placeholder="5"
                        min="0"
                        max="50"
                        value={formData.totalExperience}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Preferred Route Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="preferredRouteType"
                      value={formData.preferredRouteType}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none bg-white"
                      required
                    >
                      <option value="">Select Route Type</option>
                      {routeTypes.map(route => (
                        <option key={route} value={route}>{route}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Equipment Types - Trucking Specific */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Equipment Type You Can Drive <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {equipmentOptions.map(equip => (
                      <label key={equip} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50/80 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors cursor-pointer border border-transparent hover:border-emerald-200">
                        <input
                          type="checkbox"
                          name="equipmentTypes"
                          value={equip}
                          checked={formData.equipmentTypes.includes(equip)}
                          onChange={handleChange}
                          className="w-4 h-4 accent-emerald-600 rounded border-gray-300"
                        />
                        {equip}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Available to Start From <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="availableFrom"
                        value={formData.availableFrom}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Preferred Work Schedule
                    </label>
                    <select
                      name="preferredSchedule"
                      value={formData.preferredSchedule}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none bg-white"
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

            {/* Step 4: Documents & Submit */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  Documents & Additional Information
                </h3>

                {/* Document Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-700">Upload Documents</h4>
                      <p className="text-sm text-gray-400">Allowed formats: PDF, JPG, PNG (Max 5MB each)</p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                      {getUploadedCount()} / {totalDocuments} uploaded
                    </span>
                  </div>

                  {/* Required Documents */}
                  <div>
                    <p className="text-sm font-medium text-emerald-700 mb-2 flex items-center gap-2">
                      <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                      Required Documents
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <DocumentUploadBox
                        label="Driver License"
                        fileType="license"
                        uploadedFiles={uploadedFiles}
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        icon={<FileText className="w-5 h-5 text-emerald-600" />}
                        required={true}
                      />
                      <DocumentUploadBox
                        label="Medical Card"
                        fileType="medical"
                        uploadedFiles={uploadedFiles}
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        icon={<FileCheck className="w-5 h-5 text-emerald-600" />}
                        required={true}
                      />
                      <DocumentUploadBox
                        label="CNIC / ID Card"
                        fileType="cnic"
                        uploadedFiles={uploadedFiles}
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        icon={<IdCard className="w-5 h-5 text-emerald-600" />}
                        required={true}
                      />
                    </div>
                  </div>

                  {/* Important Documents */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                      <span className="w-1 h-4 bg-gray-400 rounded-full"></span>
                      Recommended Documents
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <DocumentUploadBox
                        label="Driving Record"
                        fileType="drivingRecord"
                        uploadedFiles={uploadedFiles}
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        icon={<FileWarning className="w-5 h-5 text-emerald-600" />}
                        optional={true}
                      />
                      <DocumentUploadBox
                        label="Background Consent"
                        fileType="backgroundConsent"
                        uploadedFiles={uploadedFiles}
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        icon={<FileSignature className="w-5 h-5 text-emerald-600" />}
                        optional={true}
                      />
                    </div>
                  </div>

                  {/* Optional Documents */}
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <span className="w-1 h-4 bg-gray-300 rounded-full"></span>
                      Optional Documents
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <DocumentUploadBox
                        label="Resume / CV"
                        fileType="resume"
                        uploadedFiles={uploadedFiles}
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        icon={<FileText className="w-5 h-5 text-emerald-600" />}
                        optional={true}
                      />
                      <DocumentUploadBox
                        label="Additional Documents"
                        fileType="additional"
                        uploadedFiles={uploadedFiles}
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        icon={<File className="w-5 h-5 text-emerald-600" />}
                        optional={true}
                      />
                    </div>
                  </div>

                  {/* Upload Progress */}
                  <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Upload Progress</span>
                      <span className="text-sm font-medium text-emerald-600">
                        {getUploadedCount()} / {totalDocuments} documents
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${(getUploadedCount() / totalDocuments) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Additional Information <span className="text-xs text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    name="additionalInfo"
                    rows="4"
                    placeholder="Any additional information for admin/recruiters..."
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                  />
                </div>

                {/* Form Status */}
                <div className="bg-gradient-to-r from-gray-50/80 to-emerald-50/80 rounded-xl p-4 border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Form Status</h4>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
                      <span className="text-gray-600">Pending Review</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-gray-600">Approved</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <span className="text-gray-600">Rejected</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-all font-medium flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
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