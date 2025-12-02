'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import CVUploader from "@/components/forms/CVUploader";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    age: "",
    gender: "",
    linkedin: "",
    portfolio: "",
    experience: "",
    education: "",
    cv_url: "", // Added CV URL field
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleCVUploaded = (url: string) => {
    setForm({ ...form, cv_url: url });
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!form.full_name.trim()) errors.push("Full name is required");
    if (!form.email.trim()) errors.push("Email is required");
    if (!form.password) errors.push("Password is required");
    if (form.password.length < 6) errors.push("Password must be at least 6 characters");
    if (form.password !== form.confirm_password) errors.push("Passwords do not match");
    if (!/\S+@\S+\.\S+/.test(form.email)) errors.push("Email is invalid");

    return errors;
  };

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  const errors = validateForm();
  if (errors.length > 0) {
    return setError(errors[0]);
  }

  setLoading(true);

  try {
    // 1️⃣ Create auth user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) throw signUpError;

    const user = signUpData.user;
    if (!user) throw new Error("User creation failed.");

    // 2️⃣ Insert job seeker details
    const { error: insertError } = await supabase.from("job_seekers").insert({
      id: user.id,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      age: form.age ? Number(form.age) : null,
      gender: form.gender,
      linkedin: form.linkedin,
      portfolio: form.portfolio,
      experience: form.experience,
      education: form.education,
      cv_url: form.cv_url || null,
    });

    if (insertError) throw insertError;

    // 3️⃣ Navigate to user dashboard
    router.push("/dashboard/user");

  } catch (err: any) {
    setError(err.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Join Our Talent Network
        </h1>
        <p className="text-muted-foreground mt-2">
          Create your profile and start your journey to finding the perfect job
        </p>
      </div>

      {/* Card Container */}
      <Card>
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Fill in your details to create your professional profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={form.full_name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('full_name')}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">
                    Age
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="25"
                    min="18"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender
                  </Label>
                  <Select 
                    value={form.gender} 
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Professional Links Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Professional Profile</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">
                    LinkedIn Profile
                  </Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">
                    Portfolio / GitHub
                  </Label>
                  <Input
                    id="portfolio"
                    name="portfolio"
                    type="url"
                    value={form.portfolio}
                    onChange={handleChange}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>

              {/* CV Upload Section */}
              <div className="space-y-2">
                <Label>CV / Resume</Label>
                <CVUploader 
                   folder="temp_cv_uploads" onUploaded={handleCVUploaded} 
                />
                {form.cv_url && (
                  <p className="text-sm text-green-600">CV uploaded successfully!</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">
                  Professional Experience
                </Label>
                <Textarea
                  id="experience"
                  name="experience"
                  rows={4}
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Describe your work experience, skills, and achievements..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">
                  Education
                </Label>
                <Textarea
                  id="education"
                  name="education"
                  rows={3}
                  value={form.education}
                  onChange={handleChange}
                  placeholder="List your educational background, degrees, and certifications..."
                />
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Security</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    required
                    placeholder="At least 6 characters"
                  />
                  {touched.password && form.password.length < 6 && (
                    <p className="text-sm text-destructive mt-1">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('confirm_password')}
                    required
                    placeholder="Confirm your password"
                  />
                  {touched.confirm_password && form.password !== form.confirm_password && (
                    <p className="text-sm text-destructive mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Your Account...
                </>
              ) : (
                "Create My Account"
              )}
            </Button>

            {/* Additional Info */}
            <p className="text-center text-sm text-muted-foreground">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Privacy Policy
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}