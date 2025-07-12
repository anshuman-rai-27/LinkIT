"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const AVAILABILITY_OPTIONS = ["weekdays", "weekends", "evenings", "mornings"];

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

  // Fetch profile on mount
  useEffect(() => {
    setLoading(true);
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
          setOfferedSkills(Array.isArray(data.offeredSkills) ? data.offeredSkills.map((s: any) => s.name) : []);
          setWantedSkills(Array.isArray(data.wantedSkills) ? data.wantedSkills.map((s: any) => s.name) : []);
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
    if (type === "offered" && !offeredSkills.includes(skill)) {
      setOfferedSkills([...offeredSkills, skill]);
    }
    if (type === "wanted" && !wantedSkills.includes(skill)) {
      setWantedSkills([...wantedSkills, skill]);
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
    setOfferedSkills(Array.isArray(profile.offeredSkills) ? profile.offeredSkills.map((s: any) => s.name) : []);
    setWantedSkills(Array.isArray(profile.wantedSkills) ? profile.wantedSkills.map((s: any) => s.name) : []);
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-8">
      <div className="w-full max-w-2xl bg-[#18181b] rounded-2xl shadow-2xl p-8 relative border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{profile ? "User profile" : "Create Profile"}</h2>
          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saving} className="text-green-400 font-bold hover:underline">Save</button>
            <button onClick={handleDiscard} className="text-red-400 font-bold hover:underline">Discard</button>
            <button className="ml-6 underline">Swap request</button>
            <button className="ml-2 underline" onClick={() => router.push("/")}>Home</button>
            <div className="ml-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white">
              {profilePhoto || photoPreview ? (
                <img src={photoPreview || profilePhoto!} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-2xl">?</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-4">
              <label className="block font-semibold mb-1">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded bg-black border border-white/20 text-white" disabled={!edit} />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 rounded bg-black border border-white/20 text-white" disabled={!edit} />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Skills Offered</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {offeredSkills.map(skill => (
                  <span key={skill} className="bg-gray-800 px-3 py-1 rounded-full flex items-center gap-2">
                    {skill}
                    {edit && <button onClick={() => removeSkill(skill, "offered")} className="ml-1 text-red-400">×</button>}
                  </span>
                ))}
              </div>
              {edit && (
                <SkillInput onAdd={skill => addSkill(skill, "offered")}/>
              )}
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Availability</label>
              <select value={availability} onChange={e => setAvailability(e.target.value)} className="w-full px-3 py-2 rounded bg-black border border-white/20 text-white" disabled={!edit}>
                <option value="">Select...</option>
                {AVAILABILITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Profile</label>
              <select value={isPublic ? "public" : "private"} onChange={e => setIsPublic(e.target.value === "public")} className="w-full px-3 py-2 rounded bg-black border border-white/20 text-white" disabled={!edit}>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="mb-4 w-40 h-40 rounded-full border-4 border-white flex items-center justify-center overflow-hidden relative">
              {photoPreview || profilePhoto ? (
                <img src={photoPreview || profilePhoto!} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-5xl">?</div>
              )}
              {edit && (
                <>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 left-2 bg-white/80 text-black px-2 py-1 rounded text-xs">Add/Edit</button>
                  {(photoPreview || profilePhoto) && <button onClick={handleRemovePhoto} className="absolute bottom-2 right-2 text-red-500 text-xs underline">Remove</button>}
                </>
              )}
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Skills wanted</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {wantedSkills.map(skill => (
                  <span key={skill} className="bg-gray-800 px-3 py-1 rounded-full flex items-center gap-2">
                    {skill}
                    {edit && <button onClick={() => removeSkill(skill, "wanted")} className="ml-1 text-red-400">×</button>}
                  </span>
                ))}
              </div>
              {edit && (
                <SkillInput onAdd={skill => addSkill(skill, "wanted")}/>
              )}
            </div>
          </div>
        </div>
        {!edit && (
          <div className="mt-8 text-center">
            <button onClick={() => setEdit(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold">
              {profile ? "Edit Profile" : "Create Profile"}
            </button>
          </div>
        )}
        {edit && (
          <div className="mt-8 text-center">
            <button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold mr-4">
              {profile ? "Save" : "Create Profile"}
            </button>
            {profile && (
              <button onClick={handleDiscard} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold">Discard</button>
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
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (value.trim()) {
          onAdd(value.trim());
          setValue("");
        }
      }}
      className="flex gap-2"
    >
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        className="px-2 py-1 rounded bg-black border border-white/20 text-white"
        placeholder="Add skill..."
      />
      <button type="submit" className="bg-indigo-500 text-white px-3 py-1 rounded">Add</button>
    </form>
  );
} 