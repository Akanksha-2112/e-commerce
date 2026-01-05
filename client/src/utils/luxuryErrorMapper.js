/**
 * Maps technical error codes to professional, luxury-aligned messaging.
 * @param {string} errorCode - The error code or message from the backend.
 * @returns {string} - A sophisticated, user-friendly error message.
 */
export const mapLuxuryError = (errorCode) => {
    if (!errorCode) return 'An unexpected interruption occurred. Please reach out to your private concierge.';

    // Normalize input
    const code = errorCode.toLowerCase();

    const errorMap = {
        // Auth / User
        'auth/user-not-found': "This identity is not yet part of our private collection. Would you like to Join the Atelier?",
        'auth/wrong-password': "The details provided do not match our records.",
        'auth/invalid-email': "Please ensure your email address is entered in its complete form.",
        'auth/email-already-in-use': "This email is already associated with a private profile. Please sign in instead.",
        'auth/weak-password': "For your protection, please choose a more substantial password.",

        // Network / Server
        'network-error': "A brief interruption in our connection. Please try again.",
        'auth/too-many-requests': "Access has been temporarily paused for your security. Please try again shortly.",
        'internal-server-error': "An unexpected interruption occurred. Please reach out to your private concierge.",

        // HTTP Status Codes (as strings)
        '404': "We do not recognize this profile. Would you like to create your private account?",
        '500': "An unexpected interruption occurred. Please reach out to your private concierge.",

        // Legacy/Fallback matches
        'email not found': "This identity is not yet part of our private collection. Would you like to Join the Atelier?",
        'invalid credentials': "The details provided do not match our records.",
        'email already registered': "This email is already associated with a private profile. Please sign in instead.",
        'unable to process request. please contact your private concierge.': "An unexpected interruption occurred. Please reach out to your private concierge."
    };

    // Return mapped message or default luxury fallback
    return errorMap[code] || 'An unexpected interruption occurred. Please reach out to your private concierge.';
};
