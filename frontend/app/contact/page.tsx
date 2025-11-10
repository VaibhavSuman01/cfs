"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedFooter } from "@/components/enhanced-footer"
import { FadeInSection } from "@/components/fade-in-section"
import { AnimatedBackground } from "@/components/animated-background"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api-client"

// Service -> Sub-services mapping (extend as needed)
const SERVICE_OPTIONS: Record<string, string[]> = {
  "Company Information": [
    "Private Limited Company",
    "One Person Company",
    "Public Limited Company",
    "Section 8 Company",
    "Nidhi Company",
    "LLP Registration",
    "Partnership Firm Registration",
    "Other",
  ],
  "Taxation": [
    "GST Filing",
    "Income Tax Filing",
    "TDS Returns",
    "EPFO Filing",
    "ESIC Filing",
    "PT Tax Filing",
    "Other",
  ],
  "ROC Returns": [
    "ROC Annual Filing",
    "Director Changes",
    "Other",
  ],
  "Other Registration": [
    "GST Registration",
    "MSME Udyam Registration",
    "IEC Registration",
    "FSSAI Food License",
    "Gumusta Shop Registration",
    "Digital Signature",
    "Industry License",
    "PAN Apply",
    "TAN Apply",
    "Startup India Registration",
    "PT Tax",
    "Other",
  ],
  "Advisory": [
    "Digital Transformation",
    "Business Strategy Consulting",
    "Financial Planning & Analysis",
    "HR & Organizational Development",
    "Legal & Compliance Advisory",
    "Assistance for Fund Raising",
    "Startup Mentoring",
    "Tax Plan Analysis",
    "Other Finance Related Services",
    "Other",
  ],
  "Reports": [
    "CMA Reports",
    "Project Reports",
    "DSCR Reports",
    "Bank Reconciliation",
    "Other",
  ],
  "Trademark & ISO": [
    "ISO 14001 Certification",
    "Copyright Registration",
    "Other",
  ],
  "Other": [
    "Other",
  ],
}

export default function ContactPage() {
  const searchParams = useSearchParams()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState('')
  const [subService, setSubService] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    const subServiceParam = searchParams.get('subService');
    
    if (serviceParam) {
      // If service is "Advisory", set it directly
      if (serviceParam === 'Advisory') {
        setService('Advisory')
        if (subServiceParam) {
          setSubService(subServiceParam)
        }
      } else {
        // Try to find which service category this belongs to
        const entries = Object.entries(SERVICE_OPTIONS)
        let matchedParent: string | null = null
        for (const [parent, subs] of entries) {
          if (subs.includes(serviceParam)) {
            matchedParent = parent
            break
          }
        }
        if (matchedParent) {
          setService(matchedParent)
          setSubService(serviceParam)
        } else {
          // Check if it's a direct service category name
          if (Object.keys(SERVICE_OPTIONS).includes(serviceParam)) {
            setService(serviceParam)
            if (subServiceParam) {
              setSubService(subServiceParam)
            }
          } else {
            // If not found in predefined list, set as service and subService
            setService('Other')
            setSubService(serviceParam)
          }
        }
      }
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    // Validate form
    if (!firstName || !lastName || !email || !phone || !service || !subService || !message) {
      toast.error('Please fill in all required fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    setIsSubmitting(true)

    try {
      const composedService = `${service}${subService ? ' - ' + subService : ''}`
      await api.post('/api/forms/contact', {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        service: composedService,
        message
      })

      toast.success('Your message has been sent successfully!')
      setIsSuccess(true)
      
      // Reset form
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setService('')
      setSubService('')
      setMessage('')
    } catch (error) {
      console.error('Error submitting contact form:', error)
      toast.error('Failed to send message. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <EnhancedHeader />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20">
        <AnimatedBackground />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <FadeInSection className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                Contact
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                Our Experts
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Get in touch with our business experts for personalized guidance and support. We're here to help you
              succeed.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Contact Form & Contact Details */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form - Left Side */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-4">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and our team will get back to you within 24 hours.
                  </p>
                </div>

                {isSuccess ? (
                  <Card className="border-2 border-blue-100 shadow-xl bg-blue-50">
                    <CardContent className="p-8 text-center">
                      <div className="space-y-6">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-blue-700">Message Sent Successfully!</h3>
                        <p className="text-blue-600">Thank you for contacting us. Our team will get back to you within 24 hours.</p>
                        <Button 
                          onClick={() => setIsSuccess(false)} 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Send Another Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-2 border-blue-100 shadow-xl">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="firstName" className="text-gray-700 font-medium">
                            First Name*
                          </Label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-700 font-medium">
                            Last Name*
                          </Label>
                          <Input
                            id="lastName"
                            placeholder="Enter your last name"
                            className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="email" className="text-gray-700 font-medium">
                            Email*
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-700 font-medium">
                            Phone*
                          </Label>
                          <Input
                            id="phone"
                            placeholder="Enter your phone number"
                            className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                          <Label htmlFor="service">Service*</Label>
                          <Select value={service} onValueChange={(v) => { setService(v); setSubService('') }}>
                            <SelectTrigger id="service" className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(SERVICE_OPTIONS).map((svc) => (
                                <SelectItem key={svc} value={svc}>{svc}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="subService">Sub-service*</Label>
                          <Select value={subService} onValueChange={setSubService} disabled={!service}>
                            <SelectTrigger id="subService" className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                              <SelectValue placeholder={service ? 'Select a sub-service' : 'Select service first'} />
                            </SelectTrigger>
                            <SelectContent>
                              {(SERVICE_OPTIONS[service] || ["Other"]).map((ss) => (
                                <SelectItem key={ss} value={ss}>{ss}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-gray-700 font-medium">
                          Message*
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your requirements..."
                          className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </div>

                      <Button 
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="mr-2">Sending...</span>
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                )}
              </div>

              {/* Contact Details - Right Side */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-4">
                    Contact Details
                  </h2>
                  <p className="text-gray-600">
                    Get in touch with us through any of these channels.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Call Us */}
                  <Card className="border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                          <p className="text-lg text-blue-600 font-medium mb-1">0612-4535604</p>
                          <p className="text-gray-600 text-sm">Mon-Sat 10AM-7PM</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Email Us */}
                  <Card className="border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                          <p className="text-lg text-blue-600 font-medium mb-1">info@comfinserv.co</p>
                          <p className="text-gray-600 text-sm">We'll respond promptly</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Office Address */}
                  <Card className="border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">Head Office</h3>
                          <p className="text-gray-600">
                            211, NP EXHIBITION ROAD
                            <br />
                            PATNA, BIHAR-800001
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Office Hours */}
                  <Card className="border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
                          <p className="text-gray-600">
                            Monday - Saturday: 10:00 AM - 7:00 PM
                            <br />
                            Sunday: Closed
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <EnhancedFooter />
    </div>
  )
}
