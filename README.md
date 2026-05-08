<div align="center">
  <img src="docs/assets/readme-hero.png" alt="Whivote Hero" width="100%">
  
  <p><em>Private DAO voting via MagicBlock. Encrypted votes. Dramatic reveal ceremony.</em></p>
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://magicblock.vercel.app)
  [![Pitch Video](https://img.shields.io/badge/Pitch-Video-red.svg)](https://youtube.com/your-video)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-black.svg)](https://github.com/edycutjong/frontier-magicblock)
</div>

---

## 📸 See it in Action
*(Demo GIF and UI screenshots can be found in the `docs/assets` directory)*

<div align="center">
  <img src="docs/assets/og-image.png" alt="App Demo" width="800">
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
We built the frontend using **Next.js 16** and **Tailwind CSS v4**.


```mermaid
graph TD
    A[User Wallet] -->|Input| B(Next.js App Router)
    B -->|Execute| C{SDK Integration}
    C -->|Return Result| D[Core Logic]
    D -->|Process| E{Validation & Settlement}
    E -->|Final State| F[Dashboard UI]
```

See the [Architecture Document](docs/ARCHITECTURE.md) and [Product Requirements Document](docs/PRD.md) for full system specifications.

## 🏆 Sponsor Tracks Targeted
* Check `docs/SPONSOR_DEFENSE.md` for our full sponsor integration strategy.

## 🚀 Run it Locally (For Judges)

1. **Clone the repo:**
   ```bash
   git clone https://github.com/edycutjong/frontier-magicblock.git
   cd frontier-magicblock
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:** 
   Rename `.env.example` to `.env.local` and add your keys.
4. **Run the app:**
   ```bash
   npm run dev
   ```

> **Note for Judges:** 
> Detailed submission materials, demo scripts, and sponsor defenses are located in the `docs/` directory.
> Read `docs/SUBMISSION.md` for the complete pitch and `docs/SPONSOR_DEFENSE.md` for technical implementation details.
