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
  // Permanent redirects: old other-registration URLs → registration (SEO-safe, backward compatible)
  async redirects() {
    return [
      { source: "/other-registration", destination: "/registration", permanent: true },
      { source: "/other-registration/:path*", destination: "/registration/:path*", permanent: true },
      { source: "/dashboard/other-registration", destination: "/dashboard/registration", permanent: true },
      { source: "/dashboard/other-registration/:path*", destination: "/dashboard/registration/:path*", permanent: true },
    ];
  },
}

export default nextConfig
