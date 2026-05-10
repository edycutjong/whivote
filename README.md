<div align="center">
  <h1>Whivote 🚀</h1>
  <p><em>Private DAO voting via MagicBlock. Encrypted votes. Dramatic reveal ceremony.</em></p>
  <img src="docs/readme-hero.png" alt="Whivote Hero" width="100%">
  
  <br/>
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://whivote.edycu.dev)
  [![Pitch Deck](https://img.shields.io/badge/Pitch-Deck-f59e0b.svg)](https://whivote.edycu.dev/pitch)
  [![Pitch Video](https://img.shields.io/badge/Pitch-Video-red.svg)](https://youtube.com/your-video)
  [![Superteam Earn](https://img.shields.io/badge/Superteam-Earn_Listing-blue.svg)](https://superteam.fun/earn/listing/privacy-track-colosseum-hackathon-powered-by-magicblock-st-my-and-sns)

  <br/>

  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
  ![MagicBlock](https://img.shields.io/badge/MagicBlock-000000?style=flat&logo=solana&logoColor=white)
  ![Vitest](https://img.shields.io/badge/Vitest-FCC72B?style=flat&logo=vitest&logoColor=white)
</div>

---

## 📸 See it in Action
*(Demo GIF and UI screenshots can be found in the `docs/assets` directory)*

[**▶️ Watch the Demo Video**](https://youtube.com/your-video)

<div align="center">
  <img src="public/og-image.png" alt="App Demo" width="100%">
</div>

## 💡 The Problem & Solution
Private DAO voting via MagicBlock. Encrypted votes. Dramatic reveal ceremony.

**Whivote** solves this by providing: 
Private DAO voting via MagicBlock. Encrypted votes. Dramatic reveal ceremony.

**Key Features:**
- ⚡ **High Performance:** Seamless integration and optimized workflows.
- 🔒 **Secure by Design:** Verifiable on-chain actions and robust data protection.
- 🎨 **Intuitive UX:** Beautiful, user-centric interface built for scale.

## 🏗️ Architecture & Tech Stack

### Tech Stack
| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | Next.js 16, React 19 | App Router, SSR, Server Components |
| **Styling** | Tailwind CSS v4 | High-performance responsive UI |
| **Language** | TypeScript | Strict type safety across the stack |
| **Integration**| MagicBlock API | Ephemeral rollups and state management |
| **Testing** | Vitest | Comprehensive unit and component testing |

For a detailed breakdown of our system architecture and data flow, please refer to the [Architecture Document](docs/ARCHITECTURE.md).

## 🧩 How We Use MagicBlock

**Whivote** fundamentally relies on MagicBlock to function:

1. **MagicBlock API:** We use MagicBlock for private DAO voting, processing encrypted votes, and enabling a dramatic reveal ceremony on-chain.

## 🏆 Sponsor Tracks Targeted
* **Sponsor Integration**: MagicBlock

## 🚀 Run it Locally (For Judges)

1. **Clone the repo:** `git clone https://github.com/edycutjong/whivote.git`
2. **Install dependencies:** `npm install`
3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   *Note: Set your `NEXT_PUBLIC_RPC_URL` and `MAGICBLOCK_API_KEY` in the `.env.local` file. The MagicBlock key is an authorization token for Private Ephemeral Rollups, obtained by requesting a challenge from `/v1/spl/challenge`, signing it with your wallet, and calling `/v1/spl/login`.*
4. **Run the app:** `npm run dev`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
