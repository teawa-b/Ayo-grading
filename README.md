# Ayo-grading

Color grading transfer demo built with Next.js App Router. Upload a reference look and a target shot, then send both to Replicate's `google/nano-banana-pro` model to match lighting and color.

## Local setup

1. Install dependencies:
	```bash
	npm install
	```
2. Create a `.env.local` file and add your Replicate token (keep this secret!):
	```bash
	REPLICATE_API_TOKEN=your_token_here
	```
3. Start the dev server:
	```bash
	npm run dev
	```

The UI is available at `http://localhost:3000`. Upload both images, then click **Transfer Color Grading**. The server-side API (`/api/grade`) converts base64 uploads into files, calls Replicate with the fixed prompt `Transfer the color grading and lighting from image IMAGE 1 (Image on the left) to image 2 (image on the right)`, and returns the generated PNG URL.