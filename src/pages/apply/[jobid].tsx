import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function ApplyPage() {
  const router = useRouter()
  const { jobId } = router.query

  const [formData, setFormData] = useState({
    coverLetter: '',
    cvUrl: '',
    email: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Fix: Wait for router to be ready and jobId to be available
  useEffect(() => {
    if (router.isReady) {
      setIsReady(true)
    }
  }, [router.isReady])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Fix: Check if jobId is available
    if (!jobId) {
      newErrors.submit = 'Job ID is missing. Please go back and try again.'
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required'
    } else if (formData.coverLetter.length < 50) {
      newErrors.coverLetter = 'Cover letter should be at least 50 characters'
    }

    if (!formData.cvUrl.trim() && !resumeFile) {
      newErrors.cvUrl = 'Please provide a CV URL or upload a file'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          resumeFile: 'Please upload a PDF or Word document',
        }))
        return
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          resumeFile: 'File size must be less than 5MB',
        }))
        return
      }

      setResumeFile(file)
      setErrors((prev) => ({ ...prev, resumeFile: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // If file is uploaded, you might want to upload it to Supabase Storage first
      let finalCvUrl = formData.cvUrl

      if (resumeFile) {
        // Here you would implement file upload to Supabase Storage
        // const { data, error } = await supabase.storage...
        // finalCvUrl = data?.path || formData.cvUrl
      }

      // Fix: Use the correct API endpoint and ensure jobId is included
      const res = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId, // This should now be available
          cover_letter: formData.coverLetter,
          cv_url: finalCvUrl,
          email: formData.email,
          phone: formData.phone,
        }),
      })

      const data = await res.json()

      if (data.success) {
        // Show success message and redirect
        router.push(`/jobs/${jobId}?application=success`)
      } else {
        setErrors({ submit: data.error || 'Failed to submit application' })
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const wordCount = formData.coverLetter.length
  const isCoverLetterGood = wordCount >= 50 && wordCount <= 1000

  // Fix: Show loading while waiting for router to be ready
  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading application form...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Job
          </button>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Apply for Position
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your application below
          </p>
        </div>

        {/* Application Form */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                      errors.email
                        ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Resume/CV Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Resume & Documents
              </h3>

              {/* File Upload Option */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upload Resume
                </label>
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, DOC, DOCX (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
                {resumeFile && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    ✓ {resumeFile.name}
                  </p>
                )}
                {errors.resumeFile && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.resumeFile}
                  </p>
                )}
              </div>

              {/* Or CV URL Option */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    Or
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="cvUrl"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  CV/Resume URL
                </label>
                <input
                  id="cvUrl"
                  type="url"
                  value={formData.cvUrl}
                  onChange={(e) => handleInputChange('cvUrl', e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                    errors.cvUrl
                      ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'
                  }`}
                  placeholder="https://drive.google.com/your-resume-link"
                />
                {errors.cvUrl && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.cvUrl}
                  </p>
                )}
              </div>
            </div>

            {/* Cover Letter Section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cover Letter *
                </h3>
                <div
                  className={`text-sm ${isCoverLetterGood ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                  {wordCount}/1000 characters
                </div>
              </div>
              <textarea
                value={formData.coverLetter}
                onChange={(e) =>
                  handleInputChange('coverLetter', e.target.value)
                }
                className={`w-full resize-none rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                  errors.coverLetter
                    ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'
                }`}
                rows={8}
                placeholder="Write a compelling cover letter explaining why you're the perfect candidate for this position..."
                maxLength={1000}
              />
              {errors.coverLetter && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.coverLetter}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Tip: Customize your cover letter for this specific role. Mention
                relevant experience and why you're interested in the company.
              </p>
            </div>

            {/* Submit Section */}
            <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
              {errors.submit && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-red-700 dark:text-red-400">
                    {errors.submit}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center rounded-lg bg-blue-600 px-8 py-3 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg
                        className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
