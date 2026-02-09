
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},

  webpack(config) {
    // Make SVG imports work in both modes:
    // - `import iconUrl from './icon.svg?url'` => URL string
    // - `import Icon from './icon.svg'` => React component (SVGR)
    const excludeSvg = (rule) => {
      if (!rule) return;
      if (Array.isArray(rule.oneOf)) {
        rule.oneOf.forEach(excludeSvg);
        return;
      }
      if (rule?.test?.test?.('.svg')) {
        rule.exclude = /\.svg$/i;
      }
    };

    config.module.rules.forEach(excludeSvg);

    const svgUrlRule = {
      test: /\.svg$/i,
      resourceQuery: /url/,
      type: 'asset/resource',
    };

    const svgComponentRule = {
      test: /\.svg$/i,
      resourceQuery: { not: [/url/] },
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
    };

    // Next's webpack config is heavily `oneOf`-based; injecting into the first `oneOf`
    // ensures SVG rules win before fallbacks.
    const topLevelOneOf = config.module.rules.find((r) => Array.isArray(r?.oneOf));
    if (topLevelOneOf?.oneOf) {
      topLevelOneOf.oneOf.unshift(svgComponentRule);
      topLevelOneOf.oneOf.unshift(svgUrlRule);
    } else {
      config.module.rules.push(svgUrlRule, svgComponentRule);
    }

    return config;
  },
};

export default nextConfig;
