
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},

  webpack(config) {
    config.module.rules = config.module.rules.map((rule) => {
      if (rule?.test?.test?.('.svg')) {
        return { ...rule, exclude: /\.svg$/i };
      }
      return rule;
    });

    config.module.rules.push({
      test: /\.svg$/i,
      oneOf: [
        {
          resourceQuery: /url/,
          type: 'asset/resource',
        },
        {
          issuer: /\.[jt]sx?$/,
          resourceQuery: { not: /url/ },
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                svgo: true,
                svgoConfig: {
                  plugins: [
                    {
                      name: 'removeViewBox',
                      active: false,
                    },
                  ],
                },
                titleProp: true,
                ref: true,
              },
            },
          ],
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
