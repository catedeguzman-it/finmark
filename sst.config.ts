/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(_) {
    return {
      name: "finmark",
      removal: "remove",
      home: "aws",
    };
  },
  async run() {
    const web = new sst.aws.Nextjs("MyWeb", {
      dev: {
        command: "bun run dev",
      },
      domain: {
        dns: sst.cloudflare.dns(),
        name: "finmark.redentor.dev",
      }
    });

    return {
      web: web.url
    }
  },
});
