# StayDog Rentals Asset Upload Guide

The StayDog site is built to remain premium even while final assets are still being added. Logo and property photography can be swapped in place. No mascot model, dog image set, or 3D dog upload is required.

## 1. Logo

Place the primary StayDog logo in:

```txt
/src/assets/logo/
```

Supported filenames:

```txt
staydog-logo.svg
staydog-logo.png
staydog-logo.jpg
staydog-logo.jpeg
```

Current status: `staydog-logo.jpg` has been added.

## 2. Property Photos

Place optimized property photography in:

```txt
/src/assets/portfolio/
```

Current portfolio filenames:

```txt
property-01.jpg
property-02.jpg
property-03.jpg
property-04.jpg
property-05.jpg
```

Use wide, high-resolution images when possible. These files can be replaced directly with final optimized versions, or additional images can be added by updating `propertyImages` in `src/data/content.js`.

## 3. Mascot / Dog Assets

Dog or mascot assets are no longer part of the active website direction.

No `.glb`, `.fbx`, character rig, Blender file, Mixamo asset, Meshy asset, dog photo set, or custom 3D dog pipeline is needed for the current build. The brand now leads with the StayDog Rentals logo, property photography, proof points, and animated operating-system visuals.

## 4. Optional Video Loops / Premium Background Assets

Place optional cinematic loops in:

```txt
/src/assets/video/
```

Recommended filenames:

```txt
hero-loop.webm
homes-transition.webm
signature-atmosphere.webm
```

The current build already uses property photography, cinematic galleries, animated operations visuals, gradients, and motion layers, so videos are optional.

## 5. Google Sheets / Email Integration

The partner funnel and Property Potential Score are integration-ready. Set these environment variables when a Google Apps Script, Make/Zapier webhook, or backend endpoint is available:

```txt
VITE_STAYDOG_LEAD_ENDPOINT=https://your-secure-lead-endpoint.example.com
VITE_STAYDOG_SCORE_ENDPOINT=/api/property-potential
STAYDOG_LEAD_ENDPOINT=https://your-secure-lead-endpoint.example.com
```

The lead endpoint should:

1. append the submitted lead to Google Sheets
2. send an email notification to `superfaststays@gmail.com`
3. return a successful HTTP response

The `/api/property-potential` serverless route attempts to fetch publicly available listing metadata/text, creates a careful Property Potential Snapshot, and forwards the submitted URL/details, result, name, email, and phone to `STAYDOG_LEAD_ENDPOINT` when connected.

Until endpoints are connected, the frontend safely stores the latest partner lead or score submission locally and labels it as staged.
