# Community Media

Images, video files, and video thumbnails for `/community/media`.

Full guide: [docs/CONTENT.md](../../../../docs/CONTENT.md)

1. Drop files here (e.g. `my-shot.png`)
2. Register them in `src/data/community.ts` → `communityMedia`

For local videos, put the video file here and set `kind: 'video'` in `src/data/community.ts`:

```ts
videoUrl: communityImagePath('media', 'my-video.mp4')
```

You can also use a YouTube embed URL:

```text
https://www.youtube.com/embed/YOUR_VIDEO_ID
```
