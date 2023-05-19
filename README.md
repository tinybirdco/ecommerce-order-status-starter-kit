<p>
  <a href="https://www.tinybird.co/join-our-slack-community"><img alt="Slack Status" src="https://img.shields.io/badge/slack-chat-1FCC83?style=flat&logo=slack"></a>
</p>

# Kelp integration with Tinybird Starter Kit

Example application showcasing how Kelp can be used to build a real-time dashboard on top of Tinybird.

## Setup

1. Setup your Tinybird account

Click this button to deploy the data project to Tinybird 👇

[![Deploy to Tinybird](https://cdn.tinybird.co/button)](https://ui.tinybird.co/workspaces/new?name=kelp_tinybird_demo)

Follow the guided process, and your Tinybird workspace is now ready to start receiving events.

1. Setup this repository locally

```bash
git clone https://github.com/tinybirdco/kelp-tinybird-demo.git
cd kelp-tinybird-demo
```

2. Create an Upstash or  Account

Go to [console.upstash.com](https://console.upstash.com/login) and create an account. You'll need it for the next step.

3. Install dependencies

This script will automatically install and configure the `tinybird-cli` for this project.

```bash
npm install
```

Choose your region: 1 for `us-east`, 2 for `eu`. A new `.tinyb` file will be created.

Go to [https://ui.tinybird.co/tokens](https://ui.tinybird.co/tokens) and copy the token with admin rights.

⚠️Warning! The Admin token, the one you copied following this guide, is your admin token. Don't share it or publish it in your application. You can manage your tokens via API or using the Auth Tokens section in the UI. More detailed info at [Auth Tokens management](https://www.tinybird.co/docs/api-reference/token-api.html)

Once you have successfully authenticated with Tinybird, you can run the following to upload the pipes to your Tinybird workspace.

```bash
tb push --no-check
```

1. Start sending data to Tinybird with Mockingbird. Check the [Mockingbird CLI documentation](https://mockingbird.tinybird.co/docs) for other installation, options and troubleshooting. Note, that you will need to paste in your Tinybird token.

```bash
mockingbird-cli tinybird --datasource=transactions --token=[PASTE_YOUR_TOKEN_FROM_TINYBIRD] --endpoint=eu_gcp --schema='schema.json' --eps 100
```

6. Go to your [Tinybird workspace](https://ui.tinybird.co) and check the data is flowing.

## Authors

- [Joe Karlsson](https://github.com/joekarlsson)

---

Need help?: [Community Slack](https://www.tinybird.co/join-our-slack-community) &bull; [Tinybird Docs](https://docs.tinybird.co/) &bull;
