"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Mail, Phone, MessageCircle, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import api, { API_PATHS } from '@/lib/api-client';

interface BlockedUserComponentProps {
  onLogout?: () => void;
  showBackButton?: boolean;
}

export default function BlockedUserComponent({ onLogout, showBackButton = true }: BlockedUserComponentProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [blockDetails, setBlockDetails] = useState<{
    blockedAt?: string;
    blockReason?: string;
    blockedBy?: {
      name: string;
      email: string;
    };
  } | null>(null);
  
  const [chatMessage, setChatMessage] = useState('');
  const [isSubmittingChat, setIsSubmittingChat] = useState(false);
  const [chatSubmitted, setChatSubmitted] = useState(false);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (user && user.isBlocked) {
        try {
          const response = await api.get(API_PATHS.SUPPORT.BLOCK_DETAILS);
          setBlockDetails(response.data.data);
        } catch (error) {
          console.error('Failed to fetch block details:', error);
        }
      }
    };

    if (user) {
      fetchBlockDetails();
    }
  }, [user]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    try {
      setIsSubmittingChat(true);
      
      // Send chat message to support
      await api.post(API_PATHS.SUPPORT.CONTACT, {
        message: chatMessage,
        type: 'account_blocked',
        userEmail: user?.email,
        userName: user?.name
      });
      
      setChatSubmitted(true);
      setChatMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmittingChat(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      api.logout();
      router.push('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4"
            >
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-red-800 mb-4">
              Account Blocked
            </h1>
            <p className="text-lg text-red-600 mb-2">
              Your account has been blocked by the administration
            </p>
            <p className="text-gray-600">
              Please contact our support team for assistance
            </p>
          </div>

          {/* Block Details Card */}
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Block Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {blockDetails?.blockReason && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Reason for Blocking:</h4>
                  <p className="text-gray-700 bg-white p-3 rounded-lg border">
                    {blockDetails.blockReason}
                  </p>
                </div>
              )}
              
              {blockDetails?.blockedAt && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Blocked On:</h4>
                  <p className="text-gray-700">
                    {new Date(blockDetails.blockedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {blockDetails?.blockedBy && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Blocked By:</h4>
                  <p className="text-gray-700">
                    {blockDetails.blockedBy.name} ({blockDetails.blockedBy.email})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Support via Chat */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Contact Support Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chatSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-4">
                    Your message has been sent to our support team. We'll get back to you within 24 hours.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setChatSubmitted(false)}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleChatSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What happened to your account?
                    </label>
                    <Textarea
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Please describe your situation and any questions you have about your blocked account..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      disabled={isSubmittingChat || !chatMessage.trim()}
                      className="flex-1"
                    >
                      {isSubmittingChat ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Send us an email with your concerns and we'll get back to you within 24 hours.
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => window.open('mailto:support@comfinserv.com?subject=Account Blocked - Assistance Required')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Call our support team for immediate assistance during business hours.
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => window.open('tel:+91-9876543210')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                What happens next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Contact Support</h4>
                    <p className="text-gray-600">Reach out to our support team using the contact methods above.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Review Process</h4>
                    <p className="text-gray-600">Our team will review your case and the reason for blocking.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Resolution</h4>
                    <p className="text-gray-600">We'll work with you to resolve the issue and restore access if appropriate.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logout Button */}
          {showBackButton && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
