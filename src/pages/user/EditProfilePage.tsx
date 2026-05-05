import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useI18n } from '../../i18n/i18n';
import { Card } from '../../components/common/Card';

export const EditProfilePage = () => {
  const { user, updateUserContext } = useAuth();
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePictureUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Email verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        profilePictureUrl: user.profilePictureUrl || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setErrorMessage('');
      const { url } = await userService.uploadProfilePicture(user.id, file);
      setFormData((prev) => ({ ...prev, profilePictureUrl: url }));
      
      // Update context immediately so header updates
      updateUserContext({ ...user, profilePictureUrl: url });
      setSuccessMessage(t('Profile picture updated!'));
    } catch (error) {
      console.error(error);
      setErrorMessage(t('Failed to upload profile picture.'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      const updatedUser = await userService.updateUser(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        profilePictureUrl: formData.profilePictureUrl
      });
      
      updateUserContext(updatedUser);
      setSuccessMessage(t('Profile updated successfully!'));
      
      // If email changed, we might need to re-verify
      if (updatedUser.email !== user.email) {
        setShowVerificationInput(false);
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      setErrorMessage(t('Failed to update profile. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendVerification = async () => {
    if (!user) return;
    try {
      setIsVerifying(true);
      setVerificationMessage('');
      const res = await userService.sendVerificationEmail(user.id);
      setShowVerificationInput(true);
      // We show the mock code here for demo purposes, in production this wouldn't be shown
      setVerificationMessage(`${t('Verification code sent to your email.')} (Mock code: ${res.mockCode})`);
    } catch (error: any) {
      setVerificationMessage(error.response?.data?.message || t('Failed to send verification email.'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!user) return;
    try {
      setIsVerifying(true);
      setVerificationMessage('');
      await userService.verifyEmail(user.id, verificationCode);
      updateUserContext({ ...user, isEmailVerified: true });
      setShowVerificationInput(false);
      setVerificationMessage(t('Email verified successfully!'));
    } catch (error: any) {
      setVerificationMessage(error.response?.data?.message || t('Invalid verification code.'));
    } finally {
      setIsVerifying(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">{t('Edit Profile')}</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">{t('Profile Picture')}</h2>
        <div className="flex items-center space-x-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {formData.profilePictureUrl ? (
              <img 
                src={formData.profilePictureUrl} 
                alt="Profile" 
                className="h-24 w-24 rounded-full object-cover border-2 border-slate-700 group-hover:border-brand-400 transition-colors" 
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-700 text-3xl font-bold text-slate-200 group-hover:bg-slate-600 transition-colors">
                {formData.firstName?.charAt(0) || formData.email?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-semibold text-white">{t('Change')}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-2">
              {t('Upload a new profile picture. Recommended size: 256x256px.')}
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              {t('Upload Image')}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-900/50 border border-red-500/50 text-red-200 text-sm">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded-lg bg-green-900/50 border border-green-500/50 text-green-200 text-sm">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('First Name')}</label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t('First Name')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('Last Name')}</label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t('Last Name')}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('Email')}</label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('Email Address')}
                  required
                />
                {user.isEmailVerified && formData.email === user.email && (
                  <span className="absolute right-3 top-2.5 text-green-400 text-xs font-semibold bg-green-900/30 px-2 py-0.5 rounded">
                    {t('Verified')}
                  </span>
                )}
              </div>
            </div>
            
            {!user.isEmailVerified && formData.email === user.email && (
              <div className="mt-3 p-4 border border-slate-700 rounded-xl bg-slate-900/50">
                <p className="text-sm text-slate-300 mb-3">
                  {t('Your email address is not verified yet.')}
                </p>
                
                {!showVerificationInput ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSendVerification}
                    disabled={isVerifying}
                  >
                    {isVerifying ? t('Sending...') : t('Send Verification Code')}
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder={t('6-digit code')} 
                      value={verificationCode} 
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="max-w-[150px]"
                    />
                    <Button 
                      type="button" 
                      variant="primary" 
                      size="sm" 
                      onClick={handleVerifyEmail}
                      disabled={isVerifying || verificationCode.length < 5}
                    >
                      {isVerifying ? t('Verifying...') : t('Verify')}
                    </Button>
                  </div>
                )}
                {verificationMessage && (
                  <p className="mt-2 text-xs text-brand-400">{verificationMessage}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('Phone Number')}</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t('Phone Number')}
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? t('Saving...') : t('Save Changes')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
