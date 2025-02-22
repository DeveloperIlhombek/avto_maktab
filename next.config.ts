import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				hostname: 'images.unsplash.com',
			},
			{
				hostname: '9284dgg8-5000.euw.devtunnels.ms',
			},
		],
	},
}

export default nextConfig
