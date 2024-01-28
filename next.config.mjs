const nextConfig = {
    env: {
        GIPHY_API_KEY: "GlVGYHkr3WSBnllca54iNt0yFbjz7L65"
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*'
                    }
                ]
            }
        ]
    },
};

export default nextConfig;
