// EmailJS configuration for admin authentication
// Only these two emails can access the admin panel

const ADMIN_EMAILS = [
  'anshraj8701@gmail.com',
  'routsantosh650@gmail.com',
];

// EmailJS credentials (replace with your actual credentials)
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

export const sendAdminCode = async (email: string, code: string): Promise<boolean> => {
  if (!isAdminEmail(email)) {
    return false;
  }

  try {
    // EmailJS integration
    // Uncomment and configure with your EmailJS credentials
    /*
    const emailjs = await import('@emailjs/browser');
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: email,
      admin_code: code,
      message: `Your VOIDMC admin access code is: ${code}`,
    });
    */
    
    // For now, log the code (replace with actual EmailJS implementation)
    console.log(`Admin code for ${email}: ${code}`);
    return true;
  } catch (error) {
    console.error('Failed to send admin code:', error);
    return false;
  }
};

export const generateAdminCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
