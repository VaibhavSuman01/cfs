import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, TextField, Typography, Paper, Alert } from '@mui/material';
import { apiRequest, httpClient } from '../utils/httpClient';
import { API_PATHS } from '../utils/apiConfig';
import { setAuth } from '../utils/auth';
import Link from 'next/link';

const VerifyEmailSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d{6}$/, 'OTP must be 6 digits')
});

const VerifyEmail = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Get email from query params if available
    if (router.query.email) {
      setEmail(router.query.email);
    }
  }, [router.query]);

  useEffect(() => {
    // Countdown timer for OTP resend
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSuccess('');
      
      const response = await apiRequest(
        () => httpClient.post(API_PATHS.AUTH.VERIFY_EMAIL, values),
        'Email verification failed'
      );

      if (response.data) {
        setSuccess('Email verified successfully!');
        
        // Store authentication data
        setAuth(response.data.token, response.data.user);
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      setIsResending(true);
      setError('');
      
      await apiRequest(
        () => httpClient.post(API_PATHS.AUTH.REQUEST_OTP, { email }),
        'Failed to resend OTP'
      );
      
      setSuccess('OTP has been resent to your email');
      setCountdown(60); // Start 60 second countdown
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Verify Your Email
          </Typography>
          <Typography variant="body1" paragraph align="center">
            Please enter the 6-digit OTP sent to your email address to verify your account.
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Formik
            initialValues={{ email: email || '', otp: '' }}
            validationSchema={VerifyEmailSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  fullWidth
                  margin="normal"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  disabled={!!email} // Disable if email is provided in URL
                />
                
                <Field
                  as={TextField}
                  name="otp"
                  label="OTP"
                  fullWidth
                  margin="normal"
                  error={touched.otp && Boolean(errors.otp)}
                  helperText={touched.otp && errors.otp}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ mt: 3, mb: 2 }}
                >
                  Verify Email
                </Button>
              </Form>
            )}
          </Formik>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="text"
              color="primary"
              onClick={handleResendOTP}
              disabled={isResending || countdown > 0}
            >
              {countdown > 0 ? `Resend OTP (${countdown}s)` : 'Resend OTP'}
            </Button>
            
            <Link href="/login" passHref>
              <Button variant="text" color="secondary">
                Back to Login
              </Button>
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmail;