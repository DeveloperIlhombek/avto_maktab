import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		remotePatterns: [
			{
				hostname: 'images.unsplash.com',
			},
		],
	},
}

export default nextConfig
