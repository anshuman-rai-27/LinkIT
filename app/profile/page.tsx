"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const AVAILABILITY_OPTIONS = ["weekdays", "weekends", "evenings", "mornings"];

function UserIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function XMarkIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable fields
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [offeredSkills, setOfferedSkills] = useState<string[]>([]);
  const [wantedSkills, setWantedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [existingSkills, setExistingSkills] = useState<string[]>([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    setLoading(true);
    // Fetch existing skills
    fetch("/api/skills")
      .then(res => res.json())
      .then(data => {
        setExistingSkills(data.map((skill: any) => skill.name));
      })
      .catch(() => {
        setExistingSkills([]);
      });

    const token = getTokenFromCookie();
    fetch("/api/profile", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async res => {
        if (res.status === 404) {
          // Profile not found - show creation form
          setProfile(null);
          setEdit(true); // Start in edit mode for new profiles
          setLoading(false);
          return null;
        }
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then(data => {
        if (data) {
          setProfile(data);
          setName(data.name || "");
          setLocation(data.location || "");
          setOfferedSkills(Array.isArray(data.offeredSkills) ? data.offeredSkills.map((s: any) => s.skill.name) : []);
          setWantedSkills(Array.isArray(data.wantedSkills) ? data.wantedSkills.map((s: any) => s.skill.name) : []);
          setAvailability(data.availability || "");
          setIsPublic(data.isPublic ?? true);
          setProfilePhoto(data.profilePhoto || null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile. Please make sure you are logged in.");
        setLoading(false);
      });
  }, []);

  // Helper function to get token from cookie
  function getTokenFromCookie() {
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    return match ? match[2] : null;
  }

  // Handle photo selection
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  // Upload photo to Cloudinary
  async function uploadPhoto(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/profile/photo", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  }

  // Add skill (as tag)
  function addSkill(skill: string, type: "offered" | "wanted") {
    if (!skill.trim()) return;
    const trimmedSkill = skill.trim();
    
    // Check if skill already exists in the current list
    if (type === "offered" && !offeredSkills.includes(skill)) {
      setOfferedSkills([...offeredSkills, trimmedSkill]);
    }
    if (type === "wanted" && !wantedSkills.includes(skill)) {
      setWantedSkills([...wantedSkills, trimmedSkill]);
    }
  }

  // Remove skill
  function removeSkill(skill: string, type: "offered" | "wanted") {
    if (type === "offered") setOfferedSkills(offeredSkills.filter(s => s !== skill));
    if (type === "wanted") setWantedSkills(wantedSkills.filter(s => s !== skill));
  }

  // Save profile
  async function handleSave() {
    setSaving(true);
    setError("");
    let photoUrl = profilePhoto;
    if (photoFile) {
      photoUrl = await uploadPhoto(photoFile);
      if (!photoUrl) {
        setError("Photo upload failed");
        setSaving(false);
        return;
      }
    }
    const token = getTokenFromCookie();
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        name,
        location,
        offeredSkills,
        wantedSkills,
        availability,
        isPublic,
        profilePhoto: photoUrl,
      }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      setError(errorData.message || "Failed to save profile");
      setSaving(false);
      return;
    }
    const data = await res.json();
    setProfile(data);
    setProfilePhoto(data.profilePhoto || null);
    setEdit(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setSaving(false);
  }

  // Discard changes
  function handleDiscard() {
    if (!profile) return;
    setName(profile.name || "");
    setLocation(profile.location || "");
    setOfferedSkills(Array.isArray(profile.offeredSkills) ? profile.offeredSkills.map((s: any) => s.skill.name) : []);
    setWantedSkills(Array.isArray(profile.wantedSkills) ? profile.wantedSkills.map((s: any) => s.skill.name) : []);
    setAvailability(profile.availability || "");
    setIsPublic(profile.isPublic ?? true);
    setProfilePhoto(profile.profilePhoto || null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setEdit(false);
  }

  // Remove photo
  function handleRemovePhoto() {
    setProfilePhoto(null);
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 relative border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{profile ? "User Profile" : "Create Profile"}</h2>
          <div className="flex items-center gap-4">
            <div className="ml-4 w-12 h-12 rounded-full overflow-hidden border border-gray-300">
              {profilePhoto || photoPreview ? (
                <img src={photoPreview || profilePhoto!} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xl text-gray-400">?</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                disabled={!edit} 
              />
            </div>
            
            {/* Location Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
              <input 
                type="text" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                disabled={!edit} 
              />
            </div>
            
            {/* Skills Offered */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Skills You Offer</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {offeredSkills.map((skill, index) => (
                  <span 
                    key={`offered-${skill}-${index}`} 
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-gray-200"
                  >
                    {skill}
                    {edit && (
                      <button 
                        onClick={() => removeSkill(skill, "offered")} 
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {edit && <SkillInput onAdd={skill => addSkill(skill, "offered")}/>} 
            </div>
            
            {/* Availability */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Availability</label>
              <select 
                value={availability} 
                onChange={e => setAvailability(e.target.value)} 
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                disabled={!edit}
              >
                <option value="">Select your availability...</option>
                {AVAILABILITY_OPTIONS.map(opt => 
                  <option key={opt} value={opt}>{opt}</option>
                )}
              </select>
            </div>
            
            {/* Profile Visibility */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Profile Visibility</label>
              <select 
                value={isPublic ? "public" : "private"} 
                onChange={e => setIsPublic(e.target.value === "public")} 
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                disabled={!edit}
              >
                <option value="public">Public - Anyone can see your profile</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center">
            {/* Profile Photo */}
            <div className="mb-4 w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative bg-gray-50">
              {photoPreview || profilePhoto ? (
                <img src={photoPreview || profilePhoto!} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <UserIcon className="w-12 h-12" />
                  <span className="text-xs mt-2">Add Photo</span>
                </div>
              )}
              {edit && (
                <>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 bg-black bg-opacity-20 text-white text-sm transition-opacity"
                  >
                    Change
                  </button>
                  {(photoPreview || profilePhoto) && (
                    <button 
                      onClick={handleRemovePhoto} 
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm text-gray-500 hover:text-red-500"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
            
            {/* Skills Wanted */}
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium mb-1 text-gray-700">Skills You Want to Learn</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {wantedSkills.map((skill, index) => (
                  <span 
                    key={`wanted-${skill}-${index}`} 
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-gray-200"
                  >
                    {skill}
                    {edit && (
                      <button 
                        onClick={() => removeSkill(skill, "wanted")} 
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {edit && <SkillInput onAdd={skill => addSkill(skill, "wanted")}/>} 
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        {!edit ? (
          <div className="mt-8 text-center">
            {profile && (
              <button 
                onClick={() => setEdit(true)} 
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        ) : (
          <div className="mt-8 text-center space-x-4">
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {profile && (
              <button 
                onClick={handleDiscard} 
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Discard
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Skill input component for adding tags
function SkillInput({ onAdd }: { onAdd: (skill: string) => void }) {
  const [value, setValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const [existingSkills, setExistingSkills] = useState<string[]>([]);

  // Fetch existing skills on mount
  useEffect(() => {
    fetch("/api/skills")
      .then(res => res.json())
      .then(data => {
        setExistingSkills(data.map((skill: any) => skill.name));
      })
      .catch(() => {
        setExistingSkills([]);
      });
  }, []);

  // Filter skills based on input
  useEffect(() => {
    if (value.trim()) {
      const filtered = existingSkills.filter(skill => 
        skill.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSkills(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [value, existingSkills]);

  const handleSkillSelect = (skill: string) => {
    onAdd(skill);
    setValue("");
    setShowDropdown(false);
  };

  const handleCreateNew = () => {
    if (value.trim() && !existingSkills.includes(value.trim())) {
      onAdd(value.trim());
      setValue("");
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className="px-2 py-1 rounded bg-black border border-white/20 text-white flex-1"
          placeholder="Type to search or create skill..."
        />
        <button 
          onClick={handleCreateNew}
          disabled={!value.trim() || existingSkills.includes(value.trim())}
          className="bg-indigo-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Add
        </button>
      </div>
      
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
          {filteredSkills.map((skill, index) => (
            <button
              key={index}
              onClick={() => handleSkillSelect(skill)}
              className="w-full text-left px-3 py-2 hover:bg-gray-700 text-white text-sm"
            >
              {skill}
            </button>
          ))}
          {value.trim() && !existingSkills.includes(value.trim()) && (
            <button
              onClick={handleCreateNew}
              className="w-full text-left px-3 py-2 hover:bg-gray-700 text-green-400 text-sm border-t border-gray-600"
            >
              Create "{value.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
} 