
// next.config.js
module.exports = {
   reactStrictMode: false,
   webpack: (config, { dev, isServer }) => {
     // Optimize webpack for better module resolution
     if (!dev && !isServer) {
       config.resolve.alias = {
         ...config.resolve.alias,
         'react/jsx-runtime.js': 'react/jsx-runtime',
         'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
       };
     }
     
     // Handle dynamic imports better
     config.resolve.fallback = {
       ...config.resolve.fallback,
       fs: false,
       net: false,
       tls: false,
     };

     // Optimize chunks to prevent undefined module errors
     config.optimization = {
       ...config.optimization,
       splitChunks: {
         ...config.optimization.splitChunks,
         cacheGroups: {
           ...config.optimization.splitChunks?.cacheGroups,
           vendor: {
             test: /[\\/]node_modules[\\/]/,
             name: 'vendors',
             chunks: 'all',
           },
         },
       },
     };
     
     return config;
   },
   // Experimental features for better performance
   experimental: {
     optimizeCss: true,
     optimizePackageImports: ['@mui/material', '@mui/icons-material'],
   },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://jza447wx6usznr32vnfhy7q2ii0bnoms.lambda-url.ap-south-1.on.aws/api/:path*' // Proxy to external API
      },
      {
        source: '/List_api_tables/:path*', //To fetch datas
        destination: 'https://s1jota6yr2.execute-api.ap-south-1.amazonaws.com/default/List_api_tables/:path*' // Proxy to external API
      },
      {
        source: '/sendgrid/:path*', // Define your desired source path
        destination: 'https://od71gzxpvb.execute-api.ap-south-1.amazonaws.com/default/sendgrid/:path*' // Proxy to your otp send endpoint
      },
      {
        source: '/news-view-count/:path*', // News View Count
        destination: 'https://od71gzxpvb.execute-api.ap-south-1.amazonaws.com/default/News_View_Count/:path*' // Proxy to your News_View_Count endpoint
      }, 
      {
        source: '/likes/:path*', // to add like count
        destination: 'https://od71gzxpvb.execute-api.ap-south-1.amazonaws.com/default/Likes/:path*' 
      }, 
      {
        source: '/Quotes/:path*', // to add Quotes
        destination: 'https://od71gzxpvb.execute-api.ap-south-1.amazonaws.com/default/Quotes/:path*' 
      },
      {
        source: '/Saved_list/:path*', // to list saved news based on language
        destination: 'https://od71gzxpvb.execute-api.ap-south-1.amazonaws.com/default/Saved_list/:path*' 
      }, 
      {
        source: '/Popularnews/:path*', // to list popular news
        destination: 'https://od71gzxpvb.execute-api.ap-south-1.amazonaws.com/default/Popularnews/:path*' 
      }, 
      {
        source: '/ogimage/:path*', // Meta tag
        destination: 'https://od71gzxpvb.execute-api.ap-south-1.amazonaws.com/default/ogimage/:path*' 
      },    
      {
        source: '/signup/:path*', // Define your desired source path
        destination: 'https://if57072e1b.execute-api.ap-south-1.amazonaws.com/default/cognito/:path*', // Proxy to your signup endpoint
      },
      {
        source: '/cognito/:path*', // Define your desired source path
        destination: 'https://if57072e1b.execute-api.ap-south-1.amazonaws.com/default/cognito/:path*', // Proxy to your otp verify endpoint
      },
      {
        source: '/signin/:path*', // Define your desired source path
        destination: 'https://if57072e1b.execute-api.ap-south-1.amazonaws.com/default/cognito/:path*', // Proxy to your signin endpoint
      },
      {
        source: '/upload/:path*',
        destination: 'https://wzow2wvq3ow47ezk6kwfva6w3i0ccabi.lambda-url.ap-south-1.on.aws/upload/:path*' // Upload images
      },
      {
        source: '/text-to-speech',
        destination: 'https://od71gzxpvb.execute-api.ap-south-1.amazonaws.com/default/text-to-speech' // Proxy to external API
      },
      {
        source: '/totalcount_api/:path*',
        destination: 'https://od71gzxpvb.execute-api.ap-south-1.amazonaws.com/default/totalcount_api/:path*',
      },
      {
        source: '/default/totalcount',
        destination: 'https://od71gzxpvb.execute-api.ap-south-1.amazonaws.com/default/totalcount_api',
      },
      {
        source: '/News/:path*',
        destination: 'https://s1jota6yr2.execute-api.ap-south-1.amazonaws.com/default/News/:path*', // Fetching news in desc
      },
      {
        source: '/searchCount/:path*',
        destination: 'https://s1jota6yr2.execute-api.ap-south-1.amazonaws.com/default/searchCount/:path*', // Search counts
      },
      
      {
        source: '/',
        destination: '/',
        has: [
          {
            type: 'host',
            value: 'tamil.localhost:3000',
          },
        ],
        destination: '/?lang=1',
      },
      {
        source: '/',
        destination: '/',
        has: [
          {
            type: 'host',
            value: 'hindi.localhost:3000',
          },
        ],
        destination: '/?lang=2',
      },
      {
        source: '/',
        destination: '/',
        has: [
          {
            type: 'host',
            value: 'localhost:3000',
          },
        ],
        destination: '/?lang=0',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'peoplepluspress.s3.amazonaws.com',
        port: '',
        pathname: '/image/**',  // Adjust this if necessary
      },
      {
        protocol: 'https',
        hostname: 'peoplepluspress.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',  // Matches any path
      },
    ],
    domains: ['lh3.googleusercontent.com'], 
  },
}