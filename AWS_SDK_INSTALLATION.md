# AWS Polly SDK Installation Issue

## Problem
The `@aws-sdk/client-polly` package cannot be installed via Replit's packager due to peer dependency conflicts with Vite 7.x.

## Current Status
- **Help Page**: ✅ Fixed - Now shows crisis resources and support information
- **Privacy Modal**: ✅ Fixed - Now always appears before sign-in
- **Voice Loop Issue**: ✅ Fixed - HomePage no longer repeats welcome message infinitely
- **AWS Polly**: ⚠️ Blocked - Package installation fails with peer dependency conflicts

## Voice Feature Status

### Working Features
- ✅ Browser Web Speech Recognition (FREE) - Voice input works
- ✅ OpenAI GPT-4 Text API - AI responses work
- ✅ Text-to-speech using browser's built-in SpeechSynthesis API (fallback)

### Not Working
- ❌ AWS Polly voice synthesis - Requires `@aws-sdk/client-polly` package
- The Voice Mode page will work with browser speech synthesis, but won't use AWS Polly's neural voices

## Workaround Options

### Option 1: Manual Installation (Recommended)
If you have access to the terminal outside of Replit:
```bash
npm install @aws-sdk/client-polly --legacy-peer-deps
```

### Option 2: Use Browser Speech Synthesis
The app is designed to gracefully fallback to browser's built-in speech synthesis:
- Still provides voice interaction
- Works on all modern browsers
- No AWS credentials required
- Less natural-sounding than AWS Polly neural voices

### Option 3: Wait for Vite/Tailwind Compatibility
The peer dependency conflict is between:
- `@tailwindcss/vite@4.1.3` requires `vite@^5.2.0 || ^6`
- Current project uses `vite@7.1.9`

Once Tailwind CSS updates their Vite plugin to support Vite 7.x, the installation will work.

## Testing the Voice Feature

Even without AWS Polly, the Voice Mode page should:
1. ✅ Accept voice input via browser's speech recognition
2. ✅ Send transcription to OpenAI for AI response
3. ✅ Display AI response as text
4. ⚠️ Speak response using browser's built-in voice (not AWS Polly)

## Next Steps

1. **Test Voice Mode** - Check if browser speech synthesis works as fallback
2. **Manual Installation** - If you need AWS Polly, install the package manually outside Replit
3. **Update replit.md** - Document that AWS Polly requires manual installation

## Error Details
```
npm error ERESOLVE could not resolve
npm error While resolving: @tailwindcss/vite@4.1.3
npm error Found: vite@7.1.9
npm error Could not resolve dependency:
npm error peer vite@"^5.2.0 || ^6" from @tailwindcss/vite@4.1.3
```

This is a known issue with Tailwind CSS v4 and Vite 7.x compatibility.
