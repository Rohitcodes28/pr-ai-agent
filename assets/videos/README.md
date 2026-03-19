# Video Assets Setup

## 📹 Required Videos

You need to download and place 2 videos in this folder for the event section:

### Video 1: event-video-1.mp4
- **Source**: `Photos-3-001 (7)/Img 1358.mp4`
- **Action**: Download and rename to `event-video-1.mp4`
- **Place in**: `assets/videos/event-video-1.mp4`

### Video 2: event-video-2.mp4
- **Source**: `Photos-3-001 (7)/Img 6545.mp4`
- **Action**: Download and rename to `event-video-2.mp4`
- **Place in**: `assets/videos/event-video-2.mp4`

## 🎬 How Videos Work

The videos will automatically:
- Switch between the two videos every 10 seconds
- Loop continuously
- Fade smoothly between transitions
- Play in mobile-friendly format (9:16 aspect ratio)

## 📝 Alternative Videos

If you want to use different videos, you can also use:
- `Photos-3-001 (7)/Video.mp4`
- `Photos-3-001 (7)/Sponsors Sample_1.mp4`
- `Photos-3-001 (7)/Sponsors Sample_2.mp4`

Just rename them to `event-video-1.mp4` and `event-video-2.mp4`

## ⚙️ Configuration

To change video switching behavior, edit `assets/js/main.js`:

```javascript
// Line ~140 in main.js
const switchInterval = 10000; // Change this value (in milliseconds)
```

## 🔧 Troubleshooting

If videos don't play:
1. Check file names match exactly: `event-video-1.mp4` and `event-video-2.mp4`
2. Ensure videos are in MP4 format
3. Check browser console for errors
4. Try different video codecs if needed

## 📱 Mobile Optimization

Videos are optimized for:
- Vertical/portrait format (9:16)
- Autoplay with mute
- Touch-friendly controls
- Responsive sizing