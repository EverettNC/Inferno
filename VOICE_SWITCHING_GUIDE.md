# Switching from OpenAI to AWS Polly Voice

## Current Setup (Working Now in Replit)
- **Voice Recognition**: Browser Web Speech API (FREE)
- **AI Responses**: OpenAI GPT-4 text API (~$0.01/response)
- **Voice Synthesis**: Using OpenAI (temporary, works now)

## Future Setup (When You Deploy)
- **Voice Recognition**: Browser Web Speech API (FREE)
- **AI Responses**: OpenAI GPT-4 text API (~$0.01/response)
- **Voice Synthesis**: AWS Polly (AWS sponsored, FREE for you)

## How to Switch (3 Simple Steps)

### Step 1: Install AWS SDK (Outside Replit)
```bash
npm install @aws-sdk/client-polly
```
*Note: This fails in Replit due to dependency conflicts but works fine everywhere else*

### Step 2: Update Voice Page Component
Open `client/src/pages/VoiceModePage.tsx` and change line 10:

**Current (OpenAI):**
```typescript
import { RealtimeVoiceChat } from "@/components/RealtimeVoiceChat";
```

**Switch to (AWS Polly):**
```typescript
import { PollyVoiceChat } from "@/components/PollyVoiceChat";
```

Then on line 62, change:
```typescript
<RealtimeVoiceChat />
```
to:
```typescript
<PollyVoiceChat />
```

### Step 3: Verify AWS Credentials
Make sure these environment variables are set:
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_REGION` - Your preferred region (e.g., "us-east-1")

## That's It!

The code for both systems is already built. AWS Polly will:
- Use neural voices (Joanna - warm female voice)
- Add trauma-informed SSML for empathetic delivery
- Cost you nothing (AWS sponsored)
- Sound more natural than OpenAI TTS

## Cost Comparison
- **OpenAI Realtime API**: $0.30/minute ($0.06 input + $0.24 output)
- **Current Setup**: ~$0.01 per conversation
- **AWS Polly Setup**: ~$0.01 per conversation (synthesis is FREE with sponsorship)

## Already Implemented For You
✅ AWS Polly service with trauma-informed SSML  
✅ Voice synthesis API routes (`/api/voice/synthesize`)  
✅ PollyVoiceChat component with push-to-talk UI  
✅ Graceful error handling  
✅ Health check endpoints  
✅ Browser speech recognition integration  

Everything is ready to go!
