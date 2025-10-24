/*
© 2025 The Christman AI Project. All rights reserved.

This code is released as part of a trauma-informed, dignity-first AI ecosystem
designed to protect, empower, and elevate vulnerable populations.

By using, modifying, or distributing this software, you agree to uphold the following:
1. Truth — No deception, no manipulation.
2. Dignity — Respect the autonomy and humanity of all users.
3. Protection — Never use this to exploit or harm vulnerable individuals.
4. Transparency — Disclose all modifications and contributions clearly.
5. No Erasure — Preserve the mission and ethical origin of this work.

This is not just code. This is redemption in code.
Contact: lumacognify@thechristmanaiproject.com
https://thechristmanaiproject.com
*/


export default function VoiceFeedback() {
  return (
    <div className="fixed bottom-24 left-0 right-0 flex justify-center pointer-events-none z-50">
      <div className="bg-primary-900 bg-opacity-90 text-white rounded-full px-4 py-2 flex items-center shadow-lg">
        <i className="fas fa-microphone text-primary-200 mr-2"></i>
        <span className="text-sm font-medium">Listening...</span>
      </div>
    </div>
  );
}
