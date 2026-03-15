/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/admin/forms/other-registration", destination: "/admin/forms/registration", permanent: true },
      { source: "/admin/forms/other-registration/:path*", destination: "/admin/forms/registration/:path*", permanent: true },
    ];
  },
}

export default nextConfig
